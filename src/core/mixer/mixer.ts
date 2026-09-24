import type { MixPolicy, SplitAction } from "../models.ts";

export interface MixerCommand {
  policy: MixPolicy;
  ownGain?: number;
  fadeMs?: number;
  duckTemporary: boolean;
}

export function policyFromActions(actions: SplitAction[]): MixerCommand {
  const kinds = new Set(actions.map((a) => a.kind));
  let policy: MixPolicy = "exclusive";
  let duckTemporary = false;

  if (kinds.has("duck_others")) {
    policy = "duck";
    duckTemporary = true;
  } else if (kinds.has("interrupt_spoken_and_mix")) {
    policy = "interrupt_spoken_and_mix";
  } else if (kinds.has("mix_with_others")) {
    policy = "mix";
  } else if (kinds.has("exclusive_playback")) {
    policy = "exclusive";
  }

  const gainAction = actions.find((a) => a.kind === "set_own_gain");
  const fadeAction = actions.find((a) => a.kind === "fade_own_audio");

  return {
    policy,
    ownGain: gainAction?.ownGain,
    fadeMs: fadeAction?.fadeMs,
    duckTemporary,
  };
}

export function describePolicy(policy: MixPolicy) {
  switch (policy) {
    case "mix":
      return "Sounds Sage mixes with other apps. Other apps may still interrupt.";
    case "duck":
      return "Other audio is ducked while Sounds Sage plays — temporary, all sessions, not a chosen app.";
    case "interrupt_spoken_and_mix":
      return "Spoken-mode apps pause. Music may mix. Resume after Sounds Sage deactivates.";
    case "exclusive":
      return "Sounds Sage takes exclusive focus for its own audio.";
  }
}
