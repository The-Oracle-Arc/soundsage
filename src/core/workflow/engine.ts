import {
  isTwoSided,
  type AudioObservation,
  type CapabilityResult,
  type SessionSnapshot,
  type Split,
  type SplitAction,
  type SplitCondition,
  type WorkflowInstance,
  type WorkflowLifecycle,
} from "../models.ts";
import {
  canExecute,
  evaluateAction,
  lookupCapability,
  TRIGGER_CAPABILITY,
} from "../capability/registry.ts";
import { policyFromActions } from "../mixer/mixer.ts";
import { resolveConflicts } from "../priority/resolver.ts";
import { deriveActions, evaluateTwoSidedIntent } from "../split-intent.ts";
import type { AudioAdapter } from "../../audio/adapter.ts";

export interface EngineEvent {
  at: string;
  splitId?: string;
  lifecycle?: WorkflowLifecycle;
  message: string;
}

function matchesCondition(condition: SplitCondition, obs: AudioObservation, profileId: string) {
  switch (condition.kind) {
    case "always":
      return true;
    case "other_audio_playing":
      return obs.otherAudioPlaying;
    case "other_audio_not_playing":
      return !obs.otherAudioPlaying;
    case "own_audio_playing":
      return obs.ownPlaying;
    case "route_is":
      return obs.currentRoute === condition.routePort;
    case "profile_is":
      return profileId === condition.profileId;
    default:
      return false;
  }
}

export function conditionsPass(split: Split, obs: AudioObservation, profileId: string) {
  if (split.conditions.length === 0) return true;
  return split.conditions.every((c) => matchesCondition(c, obs, profileId));
}

export function triggerMatches(
  split: Split,
  kind: Split["trigger"]["kind"],
  extras?: { profileId?: string; routePort?: string },
) {
  if (split.trigger.kind !== kind) return false;
  if (split.trigger.profileId && extras?.profileId && split.trigger.profileId !== extras.profileId) {
    return false;
  }
  if (split.trigger.routePort && extras?.routePort && split.trigger.routePort !== extras.routePort) {
    return false;
  }
  return true;
}

export function evaluateCapabilities(actions: SplitAction[]): CapabilityResult[] {
  return actions.map((action) => {
    const cap = evaluateAction(action);
    const executable = canExecute(cap.status);
    return {
      capabilityId: cap.id,
      status: cap.status,
      explanation: cap.explanation,
      fallback: cap.fallback,
      executed: false,
      usedFallback: cap.status === "PARTIALLY_SUPPORTED" && executable,
    };
  });
}

export function evaluateSplit(split: Split): CapabilityResult[] {
  const intent = evaluateTwoSidedIntent(split);
  const actions = split.actions.length ? split.actions : deriveActions(split);
  const actionResults = evaluateCapabilities(actions);
  const triggerCapId = TRIGGER_CAPABILITY[split.trigger.kind];
  const extra: CapabilityResult[] = [];
  if (triggerCapId) {
    const cap = lookupCapability(triggerCapId);
    extra.push({
      capabilityId: cap.id,
      status: cap.status,
      explanation: cap.explanation,
      fallback: cap.fallback,
      executed: false,
      usedFallback: false,
    });
  }
  const merged = [...intent, ...extra, ...actionResults];
  const seen = new Set<string>();
  return merged.filter((r) => {
    if (seen.has(r.capabilityId)) return false;
    seen.add(r.capabilityId);
    return true;
  });
}

export function splitIsSavable(results: CapabilityResult[], split?: Split) {
  if (split && isTwoSided(split)) {
    return Boolean(split.name.trim() && split.musicSource && split.foregroundSource);
  }
  return !results.some((r) => r.status === "UNSUPPORTED");
}

export function snapshotFrom(obs: AudioObservation): SessionSnapshot {
  return {
    mixPolicy: obs.mixPolicy,
    ownGain: obs.ownGain,
    speakerOverride: obs.speakerOverride,
    playing: obs.ownPlaying,
    capturedAt: new Date().toISOString(),
  };
}

export class WorkflowEngine {
  instances = new Map<string, WorkflowInstance>();
  events: EngineEvent[] = [];
  private adapter: AudioAdapter;

  constructor(adapter: AudioAdapter) {
    this.adapter = adapter;
  }

  private log(message: string, splitId?: string, lifecycle?: WorkflowLifecycle) {
    this.events.unshift({
      at: new Date().toISOString(),
      splitId,
      lifecycle,
      message,
    });
    this.events = this.events.slice(0, 80);
  }

  getInstance(splitId: string) {
    return this.instances.get(splitId);
  }

  async handleTrigger(
    splits: Split[],
    kind: Split["trigger"]["kind"],
    profileId: string,
    extras?: { profileId?: string; routePort?: string },
  ) {
    const obs = this.adapter.observe();
    const matched = splits.filter(
      (s) => s.enabled && triggerMatches(s, kind, extras) && conditionsPass(s, obs, profileId),
    );
    if (matched.length === 0) return [];

    const resolution = resolveConflicts(matched);
    for (const item of resolution.suppressed) {
      this.log(item.reason, item.split.id, "evaluating");
    }

    const ran: WorkflowInstance[] = [];
    for (const split of resolution.selected) {
      ran.push(await this.execute(split, obs));
    }
    return ran;
  }

  async execute(split: Split, obs?: AudioObservation): Promise<WorkflowInstance> {
    const observation = obs ?? this.adapter.observe();
    const instance: WorkflowInstance = {
      splitId: split.id,
      lifecycle: "triggered",
      snapshot: null,
      results: [],
      startedAt: new Date().toISOString(),
    };
    this.instances.set(split.id, instance);

    instance.lifecycle = "evaluating";
    if (!conditionsPass(split, observation, split.profileId ?? "custom")) {
      instance.lifecycle = "complete";
      instance.completedAt = new Date().toISOString();
      this.log("Conditions not met.", split.id, "complete");
      return instance;
    }

    instance.lifecycle = "capability_check";
    instance.results = evaluateSplit(split);
    split.capabilityResults = instance.results;

    const blocked = instance.results.filter((r) => r.status === "UNSUPPORTED");
    const twoSided = isTwoSided(split);
    if (blocked.length > 0 && !twoSided) {
      instance.lifecycle = "unsupported";
      instance.error = blocked.map((b) => b.explanation).join(" ");
      this.log(
        `Split “${split.name}” was not executed. ${blocked.length} unsupported action${blocked.length === 1 ? "" : "s"}.`,
        split.id,
        "unsupported",
      );
      return instance;
    }

    instance.snapshot = snapshotFrom(observation);
    instance.lifecycle = "executing";

    try {
      const actions = split.actions.length ? split.actions : deriveActions(split);
      const executable = actions.filter((action) => {
        const cap = evaluateAction(action);
        return canExecute(cap.status);
      });
      const command = policyFromActions(executable);
      await this.adapter.applyMixPolicy(command.policy, {
        duckTemporary: command.duckTemporary,
      });
      if (command.ownGain !== undefined) {
        await this.adapter.setOwnGain(command.ownGain, command.fadeMs ?? 0);
      }
      if (executable.some((a) => a.kind === "override_speaker")) {
        await this.adapter.overrideOutput("speaker");
      }
      if (executable.some((a) => a.kind === "clear_speaker_override")) {
        await this.adapter.overrideOutput("none");
      }
      if (executable.some((a) => a.kind === "show_route_picker")) {
        this.adapter.requestRoutePicker();
      }
      if (executable.some((a) => a.kind === "show_system_volume_ui")) {
        this.adapter.requestVolumeUi();
      }
      if (executable.some((a) => a.kind === "deactivate_session")) {
        await this.adapter.deactivateSession(
          executable.some((a) => a.kind === "notify_others_on_deactivation"),
        );
      }

      instance.results = instance.results.map((r) => ({
        ...r,
        executed: r.status === "SUPPORTED" || r.status === "PARTIALLY_SUPPORTED",
        usedFallback: r.status === "PARTIALLY_SUPPORTED",
      }));
      if (blocked.length > 0) {
        this.log(
          `Split “${split.name}” is active for supported session policy only. ${blocked.length} native intent${blocked.length === 1 ? "" : "s"} not applied.`,
          split.id,
          "active",
        );
      } else {
        this.log(`Split “${split.name}” is active.`, split.id, "active");
      }
      instance.lifecycle = "active";
    } catch (error) {
      instance.lifecycle = "error";
      instance.error = error instanceof Error ? error.message : "Audio adapter failed.";
      this.log(instance.error, split.id, "error");
    }
    return instance;
  }

  async exit(split: Split) {
    const instance = this.instances.get(split.id);
    if (!instance || (instance.lifecycle !== "active" && instance.lifecycle !== "executing")) {
      return instance;
    }
    instance.lifecycle = "exiting";
    if (split.restorePolicy === "none") {
      instance.lifecycle = "complete";
      instance.completedAt = new Date().toISOString();
      this.log(`Split “${split.name}” ended without restore.`, split.id, "complete");
      return instance;
    }
    instance.lifecycle = "restoring";
    try {
      if (instance.snapshot) {
        await this.adapter.restore(instance.snapshot, {
          notifyOthers: split.restorePolicy === "notify_others_on_deactivation",
        });
      }
      instance.lifecycle = "complete";
      instance.completedAt = new Date().toISOString();
      this.log(
        `Restored Sounds Sage session state. Third-party private volume is not stored or restored.`,
        split.id,
        "complete",
      );
    } catch (error) {
      instance.lifecycle = "error";
      instance.error = error instanceof Error ? error.message : "Restore failed.";
    }
    return instance;
  }
}
