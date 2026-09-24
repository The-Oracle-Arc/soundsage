# Sounds Sage — Native iOS

iPhone-first audio-behavior companion. Public Apple APIs only.

This folder is the product. The web app in `/src` is a prototype of the same models for design and unit tests. It is not AVAudioSession and must not be shipped as an iOS audio engine.

## What this milestone contains

- Swift modules: models, capability registry, workflow engine, router, mixer, priority, restoration
- `AudioAdapter` protocol and `IOSAudioAdapter` using AVFAudio
- SwiftUI screens: Home, Splits, Add Split, Profiles, Settings
- App Intents
- Safari Web Extension skeleton (webpage mute/pause only)
- XCTest cases for engine, capability, priority, restore

## What this environment cannot do

This Linux builder cannot compile Xcode projects, sign, or talk to iPhone hardware.

Required next: Mac, Xcode (iOS 26 SDK), Apple Developer Program, physical iPhones, AirPods/Bluetooth/wired/AirPlay, and real apps (Music, Spotify, TikTok, YouTube).

## Create the Xcode app (on a Mac)

1. File → New → Project → iOS App, name `SoundsSage`, SwiftUI, Swift.
2. Replace generated sources with the folders in this directory (keep the target membership).
3. Signing & Capabilities → Background Modes → Audio, AirPlay, and Picture in Picture.
4. Info → add `NSAppleMusicUsageDescription` only if you enable MusicKit later. Do not add microphone usage.
5. Embed the Safari Web Extension target only in Phase 11.
6. Run on a physical iPhone. Simulator does not prove routes or interruptions.

## Honesty rules

Never claim independent Spotify/TikTok/Instagram/YouTube volume.  
Never claim Spotify→Bluetooth and TikTok→Speaker.  
`duckOthers` is temporary and not per-app.  
Restore Sounds Sage session state only — not another app’s private volume.

## Privacy

No microphone. No audio upload. No interception of other apps’ streams. No account. On-device Splits only.
