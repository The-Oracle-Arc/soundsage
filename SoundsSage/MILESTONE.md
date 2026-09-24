# Sounds Sage — milestone

## Already working (kept)

- Capability registry with honest SUPPORTED / PARTIALLY_SUPPORTED / UNSUPPORTED / UNVERIFIED
- Workflow engine (trigger → conditions → capability check → execute supported actions only → restore own snapshot)
- Mixer, router honesty (requested vs actual), priority resolver
- Profiles as Splits, same engine
- Native Swift modules: AVAudioSession adapter, App Intents types, Safari mute/pause skeleton
- On-device only: no account, no cloud, no microphone
- Two-sided Split model, Add Split wizard, Home meters, preview simulation

## Changed in this pass

- Home preview controls: Start Music, Start Foreground, Watch Mode, Restore
- Explicit Music Playing / Foreground Inactive status
- Capability check summary: requested outputs vs third-party separation vs ducking
- Capture another app's audio classified UNSUPPORTED (web + native)
- Native Smart profile actions match duck policy; two-sided save still allowed

## Simulated (web preview only)

- Independent music vs foreground volume
- Scrolling (music continues, social quiet)
- Watch mode duck (music 100% → 40%, social 0% → 100%)
- Restore of those simulated levels
- Requested Bluetooth vs speaker assignment

## What native iOS can actually execute

- mixWithOthers, temporary duckOthers, interruptSpokenAudioAndMixWithOthers — Sounds Sage session only
- Exclusive playback for Sounds Sage
- AVRoutePickerView / MPVolumeView (one system route / one system volume)
- isOtherAudioPlaying boolean (no app identity)
- Restore Sounds Sage session snapshot; notifyOthersOnDeactivation

## Still unsupported on stock iOS

- Independent Spotify / TikTok / Instagram / YouTube volume
- Independent per-app routing (music → Bluetooth and social → speaker at once)
- Capture / intercept another app’s audio
- Restore another app’s private volume
- Knowing which app is playing

## Still required

Mac, Xcode, signing, physical iPhone, AirPods/Bluetooth/AirPlay, live App Intent wiring.
