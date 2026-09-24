# Sounds Sage Safari Web Extension

Phase 11. Isolated from the native audio engine.

## Allowed

- Content scripts on granted Safari websites
- Mute or pause `<audio>` / `<video>` in that page
- Message the containing app through Apple’s supported extension APIs

## Forbidden

- Claiming control of Spotify, TikTok, YouTube app, Instagram, Netflix, or games
- Per-tab physical output routing
- Treating HTMLMediaElement.volume as reliable on iOS (often ignored)
- Using Safari as a fake native mixer

`manifest.json` is a skeleton. Build and sign the extension target in Xcode.
