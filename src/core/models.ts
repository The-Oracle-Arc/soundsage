export type CapabilityStatus =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "UNVERIFIED";

export type TriggerKind =
  | "sounds_sage_playback_started"
  | "sounds_sage_playback_stopped"
  | "other_audio_started"
  | "other_audio_stopped"
  | "route_changed"
  | "interruption_began"
  | "interruption_ended"
  | "session_activated"
  | "session_deactivated"
  | "profile_activated"
  | "manual"
  | "app_opened";

export type ConditionKind =
  | "other_audio_playing"
  | "other_audio_not_playing"
  | "route_is"
  | "own_audio_playing"
  | "profile_is"
  | "always";

export type ActionKind =
  | "mix_with_others"
  | "duck_others"
  | "interrupt_spoken_and_mix"
  | "exclusive_playback"
  | "deactivate_session"
  | "notify_others_on_deactivation"
  | "set_own_gain"
  | "fade_own_audio"
  | "override_speaker"
  | "clear_speaker_override"
  | "show_route_picker"
  | "show_system_volume_ui"
  | "set_system_volume"
  | "set_third_party_volume"
  | "route_app_independently"
  | "identify_source_app"
  | "mix_third_party_streams";

export type RestorePolicy =
  | "restore_sounds_sage_session"
  | "notify_others_on_deactivation"
  | "none";

export type PriorityLevel = "low" | "normal" | "high" | "critical";

export type WorkflowLifecycle =
  | "idle"
  | "triggered"
  | "evaluating"
  | "capability_check"
  | "executing"
  | "active"
  | "exiting"
  | "restoring"
  | "complete"
  | "unsupported"
  | "error";

export type RoutePort =
  | "speaker"
  | "receiver"
  | "headphones"
  | "bluetooth_a2dp"
  | "bluetooth_hfp"
  | "airplay"
  | "usb"
  | "hdmi"
  | "car_audio"
  | "unknown";

export type MixPolicy =
  | "exclusive"
  | "mix"
  | "duck"
  | "interrupt_spoken_and_mix";

export type ProfileId = "smart" | "music_focus" | "mix" | "custom";

export type SourceCategory = "music" | "social";
export type SourceRole = "music" | "foreground";
export type OutputIntent = "bluetooth" | "airpods" | "headphones" | "airplay" | "speaker";
export type MusicPolicy = "keep_normal" | "reduce" | "duck" | "pause";
export type ForegroundPolicy = "suppressed" | "low" | "normal_when_foreground" | "always_normal";
export type SimMode = "idle" | "music" | "scrolling" | "watch";

export interface AudioSource {
  appId: string;
  name: string;
  category: SourceCategory;
  role: SourceRole;
}

export interface SplitTrigger {
  kind: TriggerKind;
  label: string;
  routePort?: RoutePort;
  profileId?: ProfileId;
  notes?: string;
}

export interface SplitCondition {
  kind: ConditionKind;
  routePort?: RoutePort;
  profileId?: ProfileId;
}

export interface SplitAction {
  kind: ActionKind;
  ownGain?: number;
  fadeMs?: number;
}

export interface CapabilityResult {
  capabilityId: string;
  status: CapabilityStatus;
  explanation: string;
  fallback?: string | null;
  executed: boolean;
  usedFallback: boolean;
}

export interface Split {
  id: string;
  name: string;
  enabled: boolean;
  trigger: SplitTrigger;
  conditions: SplitCondition[];
  actions: SplitAction[];
  exitCondition: SplitTrigger;
  restorePolicy: RestorePolicy;
  priority: PriorityLevel;
  capabilityResults: CapabilityResult[];
  profileId?: ProfileId;
  createdAt: string;
  musicSource?: AudioSource;
  foregroundSource?: AudioSource;
  musicOutputIntent?: OutputIntent;
  foregroundOutputIntent?: OutputIntent;
  musicPolicy?: MusicPolicy;
  foregroundPolicy?: ForegroundPolicy;
  musicReduceLevel?: number;
}

export interface SessionSnapshot {
  mixPolicy: MixPolicy;
  ownGain: number;
  speakerOverride: boolean;
  playing: boolean;
  capturedAt: string;
}

export interface AudioObservation {
  otherAudioPlaying: boolean;
  secondaryAudioShouldBeSilenced: boolean;
  currentRoute: RoutePort;
  availableRoutes: RoutePort[];
  ownPlaying: boolean;
  ownGain: number;
  mixPolicy: MixPolicy;
  speakerOverride: boolean;
  interruptionActive: boolean;
  platform: "ios" | "web_prototype";
}

export interface WorkflowInstance {
  splitId: string;
  lifecycle: WorkflowLifecycle;
  snapshot: SessionSnapshot | null;
  results: CapabilityResult[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export const PRIORITY_RANK: Record<PriorityLevel, number> = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
};

export const ACTION_LABELS: Record<ActionKind, string> = {
  mix_with_others: "Mix Sounds Sage with other audio",
  duck_others: "Duck other audio (temporary)",
  interrupt_spoken_and_mix: "Pause spoken audio, mix with music",
  exclusive_playback: "Sounds Sage takes exclusive focus",
  deactivate_session: "Deactivate Sounds Sage session",
  notify_others_on_deactivation: "Notify others to resume",
  set_own_gain: "Set Sounds Sage gain",
  fade_own_audio: "Fade Sounds Sage audio",
  override_speaker: "Override output to iPhone speaker",
  clear_speaker_override: "Clear speaker override",
  show_route_picker: "Show output picker",
  show_system_volume_ui: "Show system volume control",
  set_system_volume: "Set system volume programmatically",
  set_third_party_volume: "Set another app's volume",
  route_app_independently: "Route another app independently",
  identify_source_app: "Identify which app is playing",
  mix_third_party_streams: "Mix other apps through Sounds Sage",
};

export const TRIGGER_LABELS: Record<TriggerKind, string> = {
  sounds_sage_playback_started: "Sounds Sage playback starts",
  sounds_sage_playback_stopped: "Sounds Sage playback stops",
  other_audio_started: "Other audio starts (unidentified)",
  other_audio_stopped: "Other audio stops",
  route_changed: "Output route changes",
  interruption_began: "Audio interruption begins",
  interruption_ended: "Audio interruption ends",
  session_activated: "Sounds Sage session activates",
  session_deactivated: "Sounds Sage session deactivates",
  profile_activated: "A profile is activated",
  manual: "I start this Split",
  app_opened: "Another app opens",
};

export const MUSIC_POLICY_LABELS: Record<MusicPolicy, string> = {
  keep_normal: "Keep music normal",
  reduce: "Reduce music",
  duck: "Duck music",
  pause: "Pause music",
};

export const FOREGROUND_POLICY_LABELS: Record<ForegroundPolicy, string> = {
  suppressed: "Suppressed",
  low: "Low",
  normal_when_foreground: "Normal when foreground",
  always_normal: "Always normal",
};

export const OUTPUT_INTENT_LABELS: Record<OutputIntent, string> = {
  bluetooth: "Bluetooth",
  airpods: "AirPods",
  headphones: "Wired Headphones",
  airplay: "AirPlay",
  speaker: "iPhone Speaker",
};

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isTwoSided(split: Split) {
  return Boolean(split.musicSource && split.foregroundSource);
}

export function worstStatus(results: CapabilityResult[]): CapabilityStatus {
  if (results.some((r) => r.status === "UNSUPPORTED")) return "UNSUPPORTED";
  if (results.some((r) => r.status === "PARTIALLY_SUPPORTED")) return "PARTIALLY_SUPPORTED";
  if (results.some((r) => r.status === "UNVERIFIED")) return "UNVERIFIED";
  return "SUPPORTED";
}
