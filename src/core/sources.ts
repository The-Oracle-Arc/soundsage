import type { AudioSource, OutputIntent, SourceCategory } from "./models.ts";

export const MUSIC_CATALOG: AudioSource[] = [
  { appId: "spotify", name: "Spotify", category: "music", role: "music" },
  { appId: "apple_music", name: "Apple Music", category: "music", role: "music" },
  { appId: "youtube_music", name: "YouTube Music", category: "music", role: "music" },
  { appId: "sounds_sage", name: "Sounds Sage", category: "music", role: "music" },
  { appId: "other_music", name: "Other music source", category: "music", role: "music" },
];

export const SOCIAL_CATALOG: AudioSource[] = [
  { appId: "tiktok", name: "TikTok", category: "social", role: "foreground" },
  { appId: "instagram", name: "Instagram", category: "social", role: "foreground" },
  { appId: "youtube", name: "YouTube", category: "social", role: "foreground" },
  { appId: "facebook", name: "Facebook", category: "social", role: "foreground" },
  { appId: "x", name: "X", category: "social", role: "foreground" },
  { appId: "other_social", name: "Other social / video source", category: "social", role: "foreground" },
];

export const OUTPUT_INTENTS: OutputIntent[] = [
  "bluetooth",
  "airpods",
  "headphones",
  "airplay",
  "speaker",
];

export function sourceById(id: string, category: SourceCategory): AudioSource {
  const list = category === "music" ? MUSIC_CATALOG : SOCIAL_CATALOG;
  return list.find((s) => s.appId === id) ?? list[list.length - 1];
}
