import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACTION_LABELS,
  createId,
  type AudioObservation,
  type MixPolicy,
  type SessionSnapshot,
  type Split,
  type SplitAction,
} from "../models.ts";
import { evaluateSplit, splitIsSavable, triggerMatches, WorkflowEngine } from "./engine.ts";
import { resolveConflicts } from "../priority/resolver.ts";
import { policyFromActions } from "../mixer/mixer.ts";
import { profileById } from "../profiles.ts";
import { CAPABILITY_REGISTRY, evaluateAction } from "../capability/registry.ts";
import { reconcileRoute } from "../router/router.ts";
import { sourceById } from "../sources.ts";
import { deriveActions, intentCheckSummary, simulateLevels } from "../split-intent.ts";
import type { AudioAdapter } from "../../audio/adapter.ts";

function split(partial: Partial<Split> & { actions: SplitAction[]; name: string }): Split {
  return {
    id: createId("split"),
    enabled: true,
    trigger: { kind: "manual", label: "I start this Split" },
    conditions: [{ kind: "always" }],
    exitCondition: { kind: "manual", label: "I start this Split" },
    restorePolicy: "restore_sounds_sage_session",
    priority: "normal",
    capabilityResults: [],
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

function twoSided(partial: Partial<Split> = {}): Split {
  const base = split({
    name: "Spotify + TikTok",
    actions: [],
    musicSource: sourceById("spotify", "music"),
    foregroundSource: sourceById("tiktok", "social"),
    musicOutputIntent: "bluetooth",
    foregroundOutputIntent: "speaker",
    musicPolicy: "duck",
    foregroundPolicy: "normal_when_foreground",
    musicReduceLevel: 0.4,
    ...partial,
  });
  base.actions = deriveActions(base);
  return base;
}

class MockAdapter implements AudioAdapter {
  policy: MixPolicy = "exclusive";
  gain = 1;
  playing = false;
  speaker = false;
  notify = false;
  restored: SessionSnapshot | null = null;
  picker = false;
  volume = false;

  observe(): AudioObservation {
    return {
      otherAudioPlaying: false,
      secondaryAudioShouldBeSilenced: false,
      currentRoute: "speaker",
      availableRoutes: ["speaker"],
      ownPlaying: this.playing,
      ownGain: this.gain,
      mixPolicy: this.policy,
      speakerOverride: this.speaker,
      interruptionActive: false,
      platform: "web_prototype",
    };
  }
  async configureSession(policy: MixPolicy) {
    this.policy = policy;
  }
  async activateSession() {
    this.playing = true;
  }
  async deactivateSession(notifyOthers: boolean) {
    this.notify = notifyOthers;
    this.playing = false;
  }
  async applyMixPolicy(policy: MixPolicy) {
    this.policy = policy;
  }
  async overrideOutput(port: "speaker" | "none") {
    this.speaker = port === "speaker";
  }
  async setOwnGain(gain: number) {
    this.gain = gain;
  }
  async playOwn() {
    this.playing = true;
  }
  async stopOwn() {
    this.playing = false;
  }
  requestRoutePicker() {
    this.picker = true;
  }
  requestVolumeUi() {
    this.volume = true;
  }
  async restore(snapshot: SessionSnapshot) {
    this.restored = snapshot;
    this.policy = snapshot.mixPolicy;
    this.gain = snapshot.ownGain;
    this.playing = snapshot.playing;
  }
}

describe("capability registry", () => {
  it("marks independent app volume unsupported", () => {
    const cap = evaluateAction({ kind: "set_third_party_volume" });
    assert.equal(cap.status, "UNSUPPORTED");
    assert.match(cap.explanation, /does not provide a public API/i);
  });

  it("marks duck others as partially supported", () => {
    const cap = evaluateAction({ kind: "duck_others" });
    assert.equal(cap.status, "PARTIALLY_SUPPORTED");
    assert.ok(cap.fallback);
  });

  it("contains mix with others as supported", () => {
    assert.equal(CAPABILITY_REGISTRY.mix_with_others.status, "SUPPORTED");
  });

  it("marks independent routing and capture as unsupported", () => {
    assert.equal(CAPABILITY_REGISTRY.route_app_independently.status, "UNSUPPORTED");
    assert.equal(CAPABILITY_REGISTRY.mix_third_party_streams.status, "UNSUPPORTED");
    assert.equal(CAPABILITY_REGISTRY.restore_third_party_volume.status, "UNSUPPORTED");
    assert.equal(CAPABILITY_REGISTRY.capture_other_app_audio.status, "UNSUPPORTED");
  });
});

describe("split validation", () => {
  it("blocks save when a session-only split has an unsupported action", () => {
    const rule = split({
      name: "Fake TikTok fader",
      actions: [{ kind: "set_third_party_volume" }],
    });
    const results = evaluateSplit(rule);
    assert.equal(splitIsSavable(results, rule), false);
  });

  it("allows mix with others", () => {
    const rule = split({
      name: "Mix",
      actions: [{ kind: "mix_with_others" }],
    });
    const results = evaluateSplit(rule);
    assert.equal(splitIsSavable(results, rule), true);
  });

  it("blocks app opened trigger as unsupported native capability", () => {
    const rule = split({
      name: "When TikTok opens",
      trigger: { kind: "app_opened", label: ACTION_LABELS.set_third_party_volume },
      actions: [{ kind: "mix_with_others" }],
    });
    const results = evaluateSplit(rule);
    assert.equal(
      results.some((r) => r.capabilityId === "app_opened" && r.status === "UNSUPPORTED"),
      true,
    );
    assert.equal(splitIsSavable(results, rule), false);
  });

  it("saves a two-sided intent even when independent routing is unsupported", () => {
    const rule = twoSided();
    const results = evaluateSplit(rule);
    assert.equal(
      results.some((r) => r.capabilityId === "route_app_independently" && r.status === "UNSUPPORTED"),
      true,
    );
    assert.equal(
      results.some((r) => r.capabilityId === "set_third_party_volume" && r.status === "UNSUPPORTED"),
      true,
    );
    assert.equal(splitIsSavable(results, rule), true);
    assert.equal(
      results.some((r) => r.capabilityId === "capture_other_app_audio" && r.status === "UNSUPPORTED"),
      true,
    );
    const summary = intentCheckSummary(rule);
    assert.equal(
      summary.some((row) => row.label === "Third-party app audio separation" && row.status === "UNSUPPORTED"),
      true,
    );
    assert.equal(
      summary.some((row) => row.label.startsWith("Spotify →") && row.status === "PARTIALLY_SUPPORTED"),
      true,
    );
    assert.equal(
      summary.some((row) => row.label === "Audio session ducking" && row.status === "PARTIALLY_SUPPORTED"),
      true,
    );
  });
});

describe("priority resolver", () => {
  it("keeps exclusive policy from the higher priority split", () => {
    const high = split({
      name: "Focus",
      priority: "high",
      actions: [{ kind: "exclusive_playback" }],
    });
    const low = split({
      name: "Mix",
      priority: "low",
      actions: [{ kind: "mix_with_others" }],
    });
    const resolution = resolveConflicts([low, high]);
    assert.equal(
      resolution.actions.some((a) => a.kind === "exclusive_playback"),
      true,
    );
    assert.equal(
      resolution.suppressed.some((s) => s.split.name === "Mix"),
      true,
    );
  });
});

describe("mixer", () => {
  it("treats duck as a temporary mix policy", () => {
    const command = policyFromActions([{ kind: "duck_others" }]);
    assert.equal(command.policy, "duck");
    assert.equal(command.duckTemporary, true);
  });
});

describe("router honesty", () => {
  it("does not pretend a missing route was applied", () => {
    const state = reconcileRoute("bluetooth_a2dp", "speaker");
    assert.equal(state.applied, false);
    assert.match(state.reason, /will not pretend/i);
  });
});

describe("workflow engine", () => {
  it("refuses unsupported session-only splits instead of faking success", async () => {
    const adapter = new MockAdapter();
    const engine = new WorkflowEngine(adapter);
    const instance = await engine.execute(
      split({
        name: "Spotify volume",
        actions: [{ kind: "set_third_party_volume" }],
      }),
    );
    assert.equal(instance.lifecycle, "unsupported");
    assert.equal(adapter.policy, "exclusive");
  });

  it("applies mix policy and restores Sounds Sage snapshot", async () => {
    const adapter = new MockAdapter();
    adapter.policy = "exclusive";
    adapter.gain = 0.8;
    const engine = new WorkflowEngine(adapter);
    const rule = split({
      name: "Mix",
      actions: [{ kind: "mix_with_others" }, { kind: "set_own_gain", ownGain: 0.4 }],
    });
    const instance = await engine.execute(rule);
    assert.equal(instance.lifecycle, "active");
    assert.equal(adapter.policy, "mix");
    assert.equal(adapter.gain, 0.4);
    assert.ok(instance.snapshot);
    await engine.exit(rule);
    assert.equal(engine.getInstance(rule.id)?.lifecycle, "complete");
    assert.equal(adapter.restored?.ownGain, 0.8);
  });

  it("does not match the wrong trigger", () => {
    const rule = split({
      name: "On play",
      trigger: { kind: "sounds_sage_playback_started", label: "play" },
      actions: [{ kind: "mix_with_others" }],
    });
    assert.equal(triggerMatches(rule, "other_audio_started"), false);
    assert.equal(triggerMatches(rule, "sounds_sage_playback_started"), true);
  });

  it("activates a two-sided split without applying third-party volume", async () => {
    const adapter = new MockAdapter();
    const engine = new WorkflowEngine(adapter);
    const rule = twoSided();
    const instance = await engine.execute(rule);
    assert.equal(instance.lifecycle, "active");
    assert.equal(adapter.gain, 1);
    assert.equal(
      instance.results.some((r) => r.capabilityId === "set_third_party_volume" && !r.executed),
      true,
    );
  });
});

describe("two-sided simulation", () => {
  it("ducks music in watch mode and restores it in music mode", () => {
    const rule = twoSided();
    const watch = simulateLevels(rule, "watch");
    const music = simulateLevels(rule, "music");
    const scrolling = simulateLevels(rule, "scrolling");
    assert.equal(watch.music, 0.4);
    assert.equal(watch.foreground, 1);
    assert.equal(music.music, 1);
    assert.equal(music.foreground, 0);
    assert.equal(scrolling.music, 1);
    assert.ok(scrolling.foreground < 0.2);
  });
});

describe("profiles", () => {
  it("builds Smart, Music Focus, and Mix from the workflow model", () => {
    assert.ok(profileById("smart").splits().length >= 1);
    assert.equal(profileById("music_focus").splits()[0].musicPolicy, "duck");
    assert.equal(profileById("mix").splits()[0].musicPolicy, "keep_normal");
    assert.equal(profileById("smart").splits()[0].musicPolicy, "duck");
    assert.equal(profileById("smart").splits()[0].foregroundSource?.name, "TikTok");
  });
});
