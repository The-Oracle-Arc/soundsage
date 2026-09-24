import type { CapabilityStatus } from "@/core/models";

export interface AppIntentSpec {
  id: string;
  title: string;
  summary: string;
  swiftType: string;
  status: CapabilityStatus;
}

export const APP_INTENTS: AppIntentSpec[] = [
  {
    id: "start_split",
    title: "Start Split",
    summary: "Run a named Split through the workflow engine.",
    swiftType: "StartSplitIntent",
    status: "SUPPORTED",
  },
  {
    id: "stop_split",
    title: "Stop Split",
    summary: "Exit a Split and restore Sounds Sage session state.",
    swiftType: "StopSplitIntent",
    status: "SUPPORTED",
  },
  {
    id: "enable_split",
    title: "Enable Split",
    summary: "Mark a Split enabled without executing it.",
    swiftType: "EnableSplitIntent",
    status: "SUPPORTED",
  },
  {
    id: "disable_split",
    title: "Disable Split",
    summary: "Disable a Split so triggers skip it.",
    swiftType: "DisableSplitIntent",
    status: "SUPPORTED",
  },
  {
    id: "activate_profile",
    title: "Activate Profile",
    summary: "Activate Smart, Music Focus, Mix, or Custom.",
    swiftType: "ActivateProfileIntent",
    status: "SUPPORTED",
  },
  {
    id: "activate_music_focus",
    title: "Activate Music Focus",
    summary: "Exclusive Sounds Sage playback session.",
    swiftType: "ActivateMusicFocusIntent",
    status: "SUPPORTED",
  },
  {
    id: "activate_mix",
    title: "Activate Mix",
    summary: "mixWithOthers for Sounds Sage audio.",
    swiftType: "ActivateMixIntent",
    status: "SUPPORTED",
  },
  {
    id: "activate_smart",
    title: "Activate Smart",
    summary: "Profile that switches Mix and exclusive using the other-audio boolean.",
    swiftType: "ActivateSmartIntent",
    status: "SUPPORTED",
  },
  {
    id: "activate_custom",
    title: "Activate Custom",
    summary: "Use only user Splits.",
    swiftType: "ActivateCustomIntent",
    status: "SUPPORTED",
  },
];
