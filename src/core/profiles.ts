import { type ProfileId, type Split } from "./models.ts";
import { sourceById } from "./sources.ts";
import { deriveActions } from "./split-intent.ts";

export interface ProfileDefinition {
  id: ProfileId;
  name: string;
  tagline: string;
  explanation: string;
  splits: () => Split[];
}

function stamp(partial: Omit<Split, "createdAt" | "actions" | "capabilityResults"> & { actions?: Split["actions"] }): Split {
  const split: Split = {
    ...partial,
    actions: partial.actions ?? [],
    capabilityResults: [],
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  split.actions = deriveActions(split);
  return split;
}

export const PROFILE_DEFINITIONS: ProfileDefinition[] = [
  {
    id: "smart",
    name: "Smart",
    tagline: "Music stays on while you scroll. Watching ducks music and lets social audio through.",
    explanation:
      "Smart records Spotify + TikTok as intended sources. While scrolling, music stays normal and social audio stays low. Watching ducks music in the preview. Native iOS cannot independently mix those two apps. On iPhone, Sounds Sage can only mix or duck its own session.",
    splits: () => [
      stamp({
        id: "profile-smart-scroll",
        name: "Smart scroll",
        enabled: true,
        profileId: "smart",
        musicSource: sourceById("spotify", "music"),
        foregroundSource: sourceById("tiktok", "social"),
        musicOutputIntent: "bluetooth",
        foregroundOutputIntent: "speaker",
        musicPolicy: "duck",
        foregroundPolicy: "normal_when_foreground",
        musicReduceLevel: 0.4,
        trigger: {
          kind: "manual",
          label: "I start this Split",
        },
        conditions: [{ kind: "always" }],
        exitCondition: {
          kind: "manual",
          label: "I start this Split",
        },
        restorePolicy: "restore_sounds_sage_session",
        priority: "normal",
      }),
    ],
  },
  {
    id: "music_focus",
    name: "Music Focus",
    tagline: "Music holds the room. Foreground audio ducks it only when you watch.",
    explanation:
      "Intended pairing: music on Bluetooth, social on speaker, duck music when watching, then restore. Independent routing and third-party volume stay unsupported on stock iOS. Exclusive playback applies only if Sounds Sage itself is playing.",
    splits: () => [
      stamp({
        id: "profile-music-focus",
        name: "Music Focus",
        enabled: true,
        profileId: "music_focus",
        musicSource: sourceById("spotify", "music"),
        foregroundSource: sourceById("tiktok", "social"),
        musicOutputIntent: "bluetooth",
        foregroundOutputIntent: "speaker",
        musicPolicy: "duck",
        foregroundPolicy: "normal_when_foreground",
        musicReduceLevel: 0.4,
        trigger: { kind: "profile_activated", label: "A profile is activated", profileId: "music_focus" },
        conditions: [{ kind: "always" }],
        exitCondition: {
          kind: "profile_activated",
          label: "Another profile is activated",
        },
        restorePolicy: "restore_sounds_sage_session",
        priority: "high",
      }),
    ],
  },
  {
    id: "mix",
    name: "Mix",
    tagline: "Both sides stay audible. One system route on iPhone.",
    explanation:
      "Keep music normal and let foreground audio play. The preview mixes two tones. Native iOS still has one output route for ordinary apps; mixWithOthers applies to Sounds Sage’s session only.",
    splits: () => [
      stamp({
        id: "profile-mix",
        name: "Mix",
        enabled: true,
        profileId: "mix",
        musicSource: sourceById("spotify", "music"),
        foregroundSource: sourceById("tiktok", "social"),
        musicOutputIntent: "bluetooth",
        foregroundOutputIntent: "speaker",
        musicPolicy: "keep_normal",
        foregroundPolicy: "always_normal",
        musicReduceLevel: 0.4,
        trigger: { kind: "profile_activated", label: "A profile is activated", profileId: "mix" },
        conditions: [{ kind: "always" }],
        actions: [{ kind: "mix_with_others" }],
        exitCondition: {
          kind: "profile_activated",
          label: "Another profile is activated",
        },
        restorePolicy: "restore_sounds_sage_session",
        priority: "normal",
      }),
    ],
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "Your Splits, same engine.",
    explanation: "Custom is not a separate engine. It is whatever two-sided Splits you enable.",
    splits: () => [],
  },
];

export function profileById(id: ProfileId) {
  return PROFILE_DEFINITIONS.find((p) => p.id === id) ?? PROFILE_DEFINITIONS[3];
}
