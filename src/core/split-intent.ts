import {
  isTwoSided,
  type CapabilityResult,
  type MusicPolicy,
  type OutputIntent,
  type SimMode,
  type Split,
  type SplitAction,
} from "./models.ts";
import { lookupCapability } from "./capability/registry.ts";

function result(id: string, extra?: Partial<CapabilityResult>): CapabilityResult {
  const cap = lookupCapability(id);
  return {
    capabilityId: cap.id,
    status: cap.status,
    explanation: cap.explanation,
    fallback: cap.fallback,
    executed: false,
    usedFallback: false,
    ...extra,
  };
}

export function deriveActions(split: Split): SplitAction[] {
  if (!isTwoSided(split)) return split.actions;
  const actions: SplitAction[] = [];
  const policy = split.musicPolicy ?? "keep_normal";
  if (policy === "keep_normal") actions.push({ kind: "mix_with_others" });
  if (policy === "duck" || policy === "reduce") actions.push({ kind: "duck_others" });
  if (policy === "pause") actions.push({ kind: "interrupt_spoken_and_mix" });
  if (split.profileId === "music_focus") actions.push({ kind: "exclusive_playback" });
  actions.push({ kind: "show_route_picker" });
  if (split.musicOutputIntent && split.foregroundOutputIntent && split.musicOutputIntent !== split.foregroundOutputIntent) {
    actions.push({ kind: "route_app_independently" });
  }
  const needsThirdPartyVolume =
    policy === "reduce" ||
    policy === "duck" ||
    policy === "pause" ||
    split.foregroundPolicy === "suppressed" ||
    split.foregroundPolicy === "low";
  if (needsThirdPartyVolume) actions.push({ kind: "set_third_party_volume" });
  if (split.musicSource?.appId !== "sounds_sage") actions.push({ kind: "identify_source_app" });
  if (split.restorePolicy === "restore_sounds_sage_session") {
    actions.push({ kind: "notify_others_on_deactivation" });
  }
  return actions;
}

export function evaluateTwoSidedIntent(split: Split): CapabilityResult[] {
  if (!isTwoSided(split)) return [];
  const results: CapabilityResult[] = [
    result("select_music_app"),
    result("select_foreground_app"),
    result("detect_other_audio"),
  ];

  const musicOut = split.musicOutputIntent;
  const fgOut = split.foregroundOutputIntent;
  results.push(result("output_intent_system_route"));
  if (musicOut === "bluetooth" || fgOut === "bluetooth") results.push(result("bluetooth_route"));
  if (musicOut === "airpods" || fgOut === "airpods") results.push(result("airpods_route"));
  if (musicOut === "airplay" || fgOut === "airplay") results.push(result("airplay_route"));
  if (musicOut && fgOut && musicOut !== fgOut) results.push(result("route_app_independently"));
  results.push(result("multi_route_own"));

  const policy = split.musicPolicy ?? "keep_normal";
  if (policy === "keep_normal") results.push(result("mix_with_others"));
  if (policy === "duck" || policy === "reduce") results.push(result("duck_others"));
  if (policy === "pause") results.push(result("interrupt_spoken_and_mix"));
  if (
    policy === "reduce" ||
    policy === "duck" ||
    policy === "pause" ||
    split.foregroundPolicy === "suppressed" ||
    split.foregroundPolicy === "low"
  ) {
    results.push(result("set_third_party_volume"));
  }
  results.push(result("mix_third_party_streams"));
  results.push(result("capture_other_app_audio"));
  results.push(result("restore_third_party_volume"));
  if (split.restorePolicy === "restore_sounds_sage_session") {
    results.push(result("notify_others_on_deactivation"));
  }
  results.push(result("identify_source_app"));
  return uniqueResults(results);
}

function uniqueResults(results: CapabilityResult[]) {
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.capabilityId)) return false;
    seen.add(r.capabilityId);
    return true;
  });
}

export function musicLevelFor(policy: MusicPolicy | undefined, mode: SimMode, reduce = 0.4) {
  const level = Math.min(0.9, Math.max(0.1, reduce));
  if (mode === "idle") return 0;
  if (mode === "music") return 1;
  if (mode === "scrolling") {
    if (policy === "pause") return 1;
    return 1;
  }
  if (policy === "keep_normal") return 1;
  if (policy === "pause") return 0;
  return level;
}

export function foregroundLevelFor(
  policy: Split["foregroundPolicy"],
  mode: SimMode,
) {
  if (mode === "idle" || mode === "music") return 0;
  if (mode === "scrolling") {
    if (policy === "always_normal") return 1;
    if (policy === "low") return 0.25;
    if (policy === "suppressed") return 0;
    return 0.12;
  }
  if (policy === "suppressed") return 0;
  if (policy === "low") return 0.4;
  return 1;
}

export function simulateLevels(split: Split, mode: SimMode) {
  const reduce = split.musicReduceLevel ?? 0.4;
  return {
    music: musicLevelFor(split.musicPolicy, mode, reduce),
    foreground: foregroundLevelFor(split.foregroundPolicy, mode),
  };
}

export function policySummary(split: Split) {
  const music = split.musicPolicy ?? "keep_normal";
  const labels: Record<MusicPolicy, string> = {
    keep_normal: "Keep music normal",
    reduce: "Reduce music",
    duck: "Duck music",
    pause: "Pause music",
  };
  return labels[music];
}

export function outputIntentLabel(intent?: OutputIntent) {
  switch (intent) {
    case "bluetooth":
      return "Bluetooth";
    case "airpods":
      return "AirPods";
    case "headphones":
      return "Wired Headphones";
    case "airplay":
      return "AirPlay";
    case "speaker":
      return "iPhone Speaker";
    default:
      return "System route";
  }
}

function routeCapability(intent?: OutputIntent) {
  if (intent === "bluetooth") return "bluetooth_route";
  if (intent === "airpods") return "airpods_route";
  if (intent === "airplay") return "airplay_route";
  if (intent === "speaker") return "output_intent_system_route";
  return "output_intent_system_route";
}

export function intentCheckSummary(split: Split) {
  const musicApp = split.musicSource?.name ?? "Music";
  const fgApp = split.foregroundSource?.name ?? "Social";
  const musicOut = outputIntentLabel(split.musicOutputIntent);
  const fgOut = outputIntentLabel(split.foregroundOutputIntent);
  return [
    { label: `${musicApp} → ${musicOut}`, ...result(routeCapability(split.musicOutputIntent)) },
    { label: `${fgApp} → ${fgOut}`, ...result(routeCapability(split.foregroundOutputIntent)) },
    { label: "Third-party app audio separation", ...result("mix_third_party_streams") },
    { label: `Independent ${fgApp} volume`, ...result("set_third_party_volume") },
    { label: "Capture another app's audio", ...result("capture_other_app_audio") },
    { label: "Mix Sounds Sage with other audio", ...result("mix_with_others") },
    { label: "Audio session ducking", ...result("duck_others") },
    { label: "Restore another app's private volume", ...result("restore_third_party_volume") },
  ];
}
