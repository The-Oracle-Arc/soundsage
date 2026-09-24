# SOUNDS SAGE — COMPLETE PRODUCT, TECHNICAL, LEGAL, MARKET & NAMING RESEARCH

**Research date:** 29 August 2026  
**Platform baseline:** Stock iOS / iPadOS as currently shipping (iOS 26 family). iOS 27 is in developer beta (WWDC June 2026) and is cited only where a source exists.  
**Scope:** Public Apple APIs, App Store policy, naming, trademarks, competitors. No jailbreak. No private APIs. No implementation.

**Evidence labels used throughout**

- **FACT** — stated by Apple, an official registry, or a primary product source.
- **INFERENCE** — reasoned from facts; not independently measured on hardware in this research pass.
- **ASSUMPTION** — required to proceed; called out.
- **UNVERIFIED** — searched but not confirmed from an authoritative source.

This is technical and market research, not a legal opinion, trademark clearance, or App Review guarantee.

---

## 1. Executive Verdict

**Sounds Sage cannot become a desktop-style per-app audio mixer on stock iOS in 2026.**

The original AudioSplit idea — Spotify to Bluetooth while TikTok goes to the iPhone speaker, each with its own volume — is **UNSUPPORTED** by Apple’s public audio architecture. iOS has one media volume, one active output route for ordinary apps, and an audio-session model in which each app can only configure **its own** session. The system, not a third-party app, decides how sessions interrupt, mix, or duck.

That is not a “maybe with a clever workaround.” It is the platform contract.

| Original ambition | Classification |
|---|---|
| Independently change Spotify / TikTok / Instagram / YouTube / Netflix volume | **UNSUPPORTED** |
| Identify which app is producing audio | **UNSUPPORTED** |
| Route App A to Bluetooth and App B to speaker at the same time | **UNSUPPORTED** |
| Mix arbitrary third-party app streams inside Sounds Sage | **UNSUPPORTED** |
| Persistent ducking of other apps for more than a few seconds | **UNSUPPORTED** (Apple forbids this use of `duckOthers`) |
| Detect that *some* other audio is playing (boolean only) | **SUPPORTED** |
| Mix or duck *Sounds Sage’s own* audio with others | **SUPPORTED** (with strict limits) |
| Restore Sounds Sage after an interruption | **PARTIALLY_SUPPORTED** (system-mediated) |
| User-initiated output picker for Sounds Sage’s own audio | **SUPPORTED** |
| Shortcuts “Set Volume” when an app opens | **PARTIALLY_SUPPORTED** (global volume, not per-app) |
| Safari extension independently mixing native apps | **UNSUPPORTED** |

**What Sounds Sage can actually be:** an honest iPhone audio-behavior companion. It can manage how *its own* audio cooperates with the rest of the phone, observe system audio state, teach the real iOS rules, orchestrate Shortcuts for global volume on app-open, and never pretend that Spotify and TikTok have independent faders.

The 80–95% coverage target against the original split-routing dream is **not realistic**. Against a redesigned, honest product (“intelligent control of how *my* audio behaves while I use my phone”), a shippable 50–70% of *that* intent is realistic.

Do not ship “AudioSplit.” Ship the honest companion, or do not ship.

---

## 2. What Sounds Sage Actually Can Be

A native iPhone app that:

1. Plays or hosts **its own** audio (local files, user-owned files, and optionally Apple Music via MusicKit) under explicit session profiles: Mix, Music Focus, Spoken, Custom.
2. Observes **boolean** system hints (`isOtherAudioPlaying`, `secondaryAudioShouldBeSilencedHint`), interruption notifications, and route-change notifications.
3. Activates/deactivates **its own** `AVAudioSession` with public options (`mixWithOthers`, temporary `duckOthers`, `interruptSpokenAudioAndMixWithOthers`) so *Sounds Sage audio* cooperates with whatever else is playing.
4. Restores *its own* playback after interruptions when the system says it should.
5. Presents `AVRoutePickerView` / `MPVolumeView` so the user can pick a route and change **system** volume with a user-visible control.
6. Exposes App Intents so Shortcuts can start/stop profiles, and provides a **guided, honest** Shortcuts recipe that sets **global** media volume when chosen apps open.
7. Optionally ships a Safari Web Extension that can mute/pause **webpage** media in Safari tabs — not native apps — with iOS HTML volume limitations disclosed.
8. Contains a capability registry that returns SUPPORTED / PARTIALLY_SUPPORTED / UNSUPPORTED / UNVERIFIED and never silently fakes success.

It is **not** a system mixer. It is **not** SoundSource for iPhone. It is **not** a fake Bluetooth device, a microphone tap, or a screen-audio hijacker.

---

## 3. What Stock iOS Allows

**FACT.** `AVAudioSession` is the public contract between an app and the system. Apple: it “communicates to the system how you intend to use audio in your app” and the system “ensures that the operating system can best manage the user’s audio experience.” An app does not address hardware or other apps directly.

Allowed, with the limits in later sections:

- Configure **this app’s** category, mode, options, and route-sharing policy.
- Activate/deactivate **this app’s** session.
- Mix this app with others (`mixWithOthers`).
- Temporarily duck other sessions while **this app plays** (`duckOthers`).
- Interrupt spoken-audio-mode sessions while mixing with music (`interruptSpokenAudioAndMixWithOthers`).
- Read whether other audio is playing (boolean).
- Observe interruptions and route changes.
- Play in background with `UIBackgroundModes = audio` and a playback category.
- Present a system volume slider (`MPVolumeView`) and a route picker (`AVRoutePickerView`).
- Override output to the **built-in speaker** only (`overrideOutputAudioPort(.speaker)`), transiently, typically for `playAndRecord`.
- Prefer an **input** port (`setPreferredInput`).
- Use `multiRoute` to send **this app’s** distinct streams to certain simultaneous hardware outputs (USB + headphones, HDMI + headphones) — not other apps’ streams.
- Host AUv3 / (legacy) Inter-App Audio nodes that **opt in** (music-production apps). Spotify, TikTok, Instagram, YouTube, Netflix, Safari, and games do not opt in.
- Shortcuts: Set Volume (global), App Opened/Closed automations, App Intents from Sounds Sage.
- Safari Web Extension: content scripts may modify page DOM, including media elements, subject to iOS WebKit volume limitations.

---

## 4. What Stock iOS Does Not Allow

**FACT / INFERENCE from Apple’s session model and the absence of any public per-app mixer API.**

A third-party app **cannot**:

- Read another app’s audio stream.
- Identify which bundle ID is producing audio.
- Set another app’s volume, mute, or pan.
- Assign another app to a different output than the system route.
- Play App A on Bluetooth and App B on the speaker at the same time.
- Mix Spotify + TikTok through an in-app mixer and then choose Bluetooth or speaker.
- Persistently duck other apps “to keep music in the background while I scroll.” Apple: *“Set this option on a temporary basis only. Don’t use it to duck the audio of other apps for more than a few seconds.”*
- Change system volume with a hidden/programmatic API. Apple: *“There is no programmatic way to control the system volume in iOS.”* Shortcuts “Set Volume” is a user-configured automation, not a silent SDK call from Sounds Sage.
- Use `multiRoute` as desktop-style per-app routing.
- Capture other apps’ audio with ReplayKit except via user-initiated screen recording/broadcast, which is recording — not live mixing — and is the wrong product and a privacy/policy minefield.
- Use Core Audio HAL taps / ScreenCaptureKit-style system capture. Those are not iOS app-mixer APIs.
- Pretend a Safari extension controls the TikTok or YouTube **native apps**.

iOS 27’s new independent sliders (WWDC 2026 reporting) are for **ringtone / alarm / alerts**, not per-app media. **FACT** (Mashable, 9 June 2026; Android Authority cited therein). They do not create a Spotify-vs-TikTok mixer.

---

## 5. Capability Matrix

Legend: **own** = Sounds Sage’s audio. **other** = another app’s audio.

| Capability | Class | Why | API | Own? | Other? | FG | BG | User action | Shortcuts | AU/Engine | Hardware | iOS version | Closest legitimate fallback |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Play Sounds Sage audio mixed with Music/Spotify | SUPPORTED | `mixWithOthers` on playback/playAndRecord/multiRoute | `AVAudioSession` | Yes | Mixes with, does not control | Yes | Yes if background audio mode | Play in Sounds Sage | Can start profile | Not required | No | Long-standing | — |
| Duck all other sessions while Sounds Sage plays | PARTIALLY_SUPPORTED | System ducks others; temporary only; not per-app; Apple forbids long use | `duckOthers` | Yes (trigger) | All others, not a chosen app | Yes | While session active and playing | Must be producing audio | No | Not required | No | Long-standing | Use only for short prompts |
| Interrupt spoken apps, mix with music | PARTIALLY_SUPPORTED | Only sessions in `spokenAudio` mode; others mix/duck | `interruptSpokenAudioAndMixWithOthers` | Yes | Spoken-mode only | Yes | While active | Must play | No | No | No | Long-standing | Navigation-style prompts |
| Detect other audio playing | SUPPORTED | Boolean only | `isOtherAudioPlaying` | n/a | Boolean, no identity | Yes | Yes while app runs | No | No | No | No | Long-standing | Show “other audio: yes/no” |
| Identify source app | UNSUPPORTED | No public API | none | n/a | No | — | — | — | — | — | — | — | User picks the app in a rule |
| Independent Spotify volume | UNSUPPORTED | No per-app volume API | none | n/a | No | — | — | — | Set Volume is global | — | — | iOS 26/27 unchanged | Shortcuts global volume on app open |
| Independent TikTok / IG / YT / Netflix / games / Safari native volume | UNSUPPORTED | Same | none | n/a | No | — | — | — | Same | — | — | Same | Same |
| Mute another app | UNSUPPORTED | Same | none | n/a | No | — | — | — | Set Volume 0 is global mute | — | — | — | Global mute via Shortcuts |
| Route Spotify→BT and TikTok→speaker | UNSUPPORTED | One system output route | none | n/a | No | — | — | — | No | `multiRoute` is own streams | — | — | User picks one output in Control Center |
| Independent volumes on same Bluetooth | UNSUPPORTED | One media volume | none | n/a | No | — | — | — | No | No | A2DP is system-wide | — | None |
| Mix third-party streams in Sounds Sage | UNSUPPORTED | Cannot tap other apps | `AVAudioEngine` is own graph | Own only | No | — | — | — | No | Own graph only | — | — | AUv3 hosts for opt-in music apps only |
| Restore other app’s previous level | UNSUPPORTED | Never had that level | `notifyOthersOnDeactivation` resumes interrupted apps, does not restore a volume Sounds Sage set | Own session | System may resume other app | — | — | — | User can Set Volume again | — | — | — | Handle *own* interruption `shouldResume` |
| Automatic duck when user opens TikTok | UNSUPPORTED as Sounds Sage control | TikTok’s session decides interrupt vs duck vs mix | Other app’s session | No | Other app’s choice | — | — | Opening TikTok | App Opened → Set Volume (global) | — | — | — | Honest Shortcuts recipe |
| Choose Sounds Sage output (AirPlay/BT/speaker) | PARTIALLY_SUPPORTED | User picker; app cannot silently assign arbitrary outputs | `AVRoutePickerView`, category options `allowBluetoothA2DP`, `allowAirPlay` | Yes | No | Yes | Route is system-wide | Yes, user tap | Limited | No | Depends on attached devices | iOS 11+ picker | Show picker; do not claim per-app routing |
| Override to speaker | PARTIALLY_SUPPORTED | Speaker/none only; transient; typically playAndRecord | `overrideOutputAudioPort` | This session | Affects this session’s route | Yes | Until route change | Usually in-app control | No | No | Built-in speaker | Long-standing | Route picker |
| `multiRoute` split of *this* app to USB+headphones | PARTIALLY_SUPPORTED | Own streams; limited combos; route changes invalidate | `.multiRoute` | Yes | No | Yes | Fragile | May need accessories | No | Channel mapping in engine | USB/HDMI/headphones | Long-standing; iPhone limited | Disclose hardware needs |
| Programmatic system volume | UNSUPPORTED | Apple: no programmatic control | none | n/a | n/a | — | — | `MPVolumeView` requires UI | Shortcuts Set Volume | — | — | Current | Visible slider or Shortcuts |
| MPVolumeView | SUPPORTED | User-driven system volume + (legacy) route button | MediaPlayer | System | System | Yes | n/a | Yes | No | No | No | Route button deprecated iOS 13; use `AVRoutePickerView` | — |
| Now Playing / remote commands | SUPPORTED for own audio | Metadata + commands when this app is Now Playing | `MPNowPlayingInfoCenter`, `MPRemoteCommandCenter` | Yes | Cannot steal another app’s Now Playing except by becoming Now Playing | Yes | Yes | Play | No | No | No | Long-standing | — |
| Background audio | SUPPORTED for own playback | Must use intended purpose | `UIBackgroundModes` audio + playback category | Yes | No | n/a | Yes | Playing | No | No | No | Long-standing | Do not use audio mode as a silent daemon |
| Safari webpage volume | PARTIALLY_SUPPORTED / historically broken on iOS | Content scripts can touch DOM; iOS often ignores `HTMLMediaElement.volume` | WebKit, HTMLMediaElement, Web Audio | Web page in Safari | Not native apps | Safari FG | Limited | User enables extension | No | Web Audio GainNode UNVERIFIED | No | See §12 | Mute/pause page media; disclose volume failure |
| AUv3 mix of opt-in music apps | PARTIALLY_SUPPORTED | Only apps that ship AUv3/IAA | Audio Units, (legacy IAA) | Hosted nodes | Not Spotify/TikTok | Host FG | Host-dependent | User opens those apps | No | Yes | Audio interface optional | IAA deprecated | Out of scope; different product (AUM) |

---

## 6. Apple API Evidence

### 6.1 AVAudioSession — the wall between apps

**FACT.** [AVAudioSession](https://developer.apple.com/documentation/avfaudio/avaudiosession) is a singleton that tells iOS the *nature* of this app’s audio. The system then manages hardware and inter-app policy.

Default session (Apple): playback allowed, recording disallowed; playing silences other background audio; Ring/Silent silences the app; lock silences the app. Apps change this by setting category/mode/options and calling `setActive`.

**INFERENCE.** There is no API on this object to name another app, fetch another app’s player, or set another app’s gain.

### 6.2 Categories

**FACT** (Apple Category docs and Audio Session Programming Guide):

| Category | Role |
|---|---|
| `ambient` | Mixes; silenced by Ring/Silent and lock. Auto-sets `mixWithOthers`. |
| `soloAmbient` | Does not mix; silenced by Ring/Silent and lock. |
| `playback` | Central playback; ignores Ring/Silent; background with audio mode; can mix if option set. |
| `record` | Recording. |
| `playAndRecord` | Duplex; Bluetooth HFP relevant; speaker override relevant. |
| `multiRoute` | Distinct streams of **this app** to different outputs at once. |

### 6.3 Category options — exact Apple language

**`mixWithOthers`**  
**FACT.** “An option that indicates whether audio from this session mixes with audio from active sessions in other audio apps.” Only for playback / playAndRecord / multiRoute (ambient sets it automatically). “If you set this option, your app mixes its audio with audio playing in background apps, such as the Music app.” Clearing it and activating **interrupts** other sessions.

**`duckOthers`**  
**FACT.** “An option that reduces the volume of other audio sessions while audio from this session plays.” “While your app plays audio, the system reduces the volume of other audio sessions to make yours more prominent.” Only playback / playAndRecord / multiRoute. Implicitly sets `mixWithOthers`. “Ducking begins when you activate your app’s audio session and ends when you deactivate the session.”

**FACT — the product-killing sentence:**  
> “Set this option on a temporary basis only. Don’t use it to duck the audio of other apps for more than a few seconds.”  
Source: [duckOthers](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/duckothers) © 2026 Apple Inc.

So: ducking is **system-mediated**, **all-other-sessions**, **while this app plays**, **short-lived by policy**. It is not a per-app fader and not a “Music Focus” that lasts a TikTok session.

**`interruptSpokenAudioAndMixWithOthers`**  
**FACT.** Mixes with others but **pauses** sessions using `spokenAudio` mode. Resume after deactivation. Apple tells you to also set `duckOthers` unless you have a reason not to, and to deactivate with `notifyOthersOnDeactivation`. Intended for turn-by-turn / exercise prompts.

**`allowBluetooth`**  
**FACT.** Hands-free profile (HFP) input/output for `playAndRecord` / `record`. Not high-quality music A2DP.

**`allowBluetoothA2DP`**  
**FACT.** Stereo output-only A2DP. Automatic for ambient / soloAmbient / playback. Needed to expose A2DP on `playAndRecord`. **Cleared** for `multiRoute` and `record`. If both HFP and A2DP options are set, HFP wins when a device supports both — music quality drops.

**`allowAirPlay`**  
**FACT.** Allows streaming **this session** to AirPlay devices.

**`defaultToSpeaker`**  
**FACT.** For `playAndRecord`, prefer built-in speaker over receiver when no headset.

### 6.4 Activation and restoration

**FACT.** `setActive(_:options:)`. Deactivating with `notifyOthersOnDeactivation` tells interrupted sessions they may resume. Apple’s spoken-audio option documentation shows deactivating with that flag so other apps can resume.

**INFERENCE.** “Resume” means the other app may start playing again at **its** volume. Sounds Sage never held that volume, so it cannot “restore previous level” as a mixer would.

**FACT.** `interruptionNotification` reports began/ended. Ended interruptions may include a should-resume hint. Sounds Sage can resume **itself**. It cannot command Spotify to resume; Spotify’s own handler does that.

### 6.5 Observation — no identity

**FACT.** `isOtherAudioPlaying`: boolean, any other audio including ambient. Apple recommends `secondaryAudioShouldBeSilencedHint` for “primary” nonmixable audio. `silenceSecondaryAudioHintNotification` fires when primary audio starts/stops.

**FACT.** Neither property names the other app.

### 6.6 Players, engine, units — own graph only

**FACT.** `AVAudioPlayer`, `AVAudioPlayerNode`, `AVAudioMixerNode`, `AVAudioEngine`, Audio Units process nodes the app attaches. Apple: engine renders to a connected device or in manual mode driven by the app.

**INFERENCE.** `installTap` taps **this engine’s** buses, not the system mix of Spotify.

**FACT.** `AVPlayer.volume` “control[s] the player audio volume relative to the system volume.” And: **“There is no programmatic way to control the system volume in iOS”**; use `MPVolumeView` for a standard UI.  
Source: [AVPlayer.volume](https://developer.apple.com/documentation/avfoundation/avplayer/volume).

### 6.7 Now Playing

**FACT.** `MPNowPlayingInfoCenter` is “for setting the Now Playing information for media that **your app** plays.” Remote commands apply when this app is the Now Playing app.

### 6.8 Background

**FACT.** `UIBackgroundModes` `audio`: “The app plays audible content in the background.” Guideline 2.5.4: background services only for intended purposes. A silent “audio mixer daemon” that is not actually playing is a review risk.

### 6.9 MusicKit

**FACT.** `ApplicationMusicPlayer` plays Apple Music without disturbing the Music app’s queue; `SystemMusicPlayer` is the system Music app. Developer forums (2026): ApplicationMusicPlayer has no volume API; `AVRoutePickerView` / `MPVolumeView` reported not working with it (FB13934910, FB21042385). **UNVERIFIED** whether Apple fixed those in iOS 26/27 — treat as PARTIALLY_SUPPORTED / risky.

MusicKit cannot set Spotify’s volume. It can only play Apple Music inside Sounds Sage.

---

## 7. Bluetooth / AirPods / AirPlay

### 7.1 Route selection is not per-app routing

**FACT.** Category + options change **which routes are eligible**. The user and the system choose the active route. `currentRoute` is observable. `overrideOutputAudioPort` only offers `.speaker` and `.none`, and is transient.

**INFERENCE (strong).** Sounds Sage can make A2DP/AirPlay eligible for *its* session and show a picker. It cannot send Spotify to AirPods and TikTok to speaker. The route is system-wide.

### 7.2 Profiles

| Transport | What it is | Sounds Sage control of *other apps* |
|---|---|---|
| A2DP | Stereo music output | None. Eligible for this session if category allows. |
| HFP | Call-quality bidirectional | None. `allowBluetooth` for this session’s duplex. Combining with A2DP prefers HFP. |
| AirPods | A2DP and/or HFP depending on session | Same as above. Transparency/ANC are user/system. |
| Wired headphones | `Port.headphones` | Last-connected wired path wins if multiple analog/Lightning; Apple Support. |
| AirPlay | `allowAirPlay`; `AVRoutePickerView`; route sharing policy | User-initiated. AirPlay 2 multi-room is a **shared mix**, not per-app stems. |
| USB / HDMI | Ports exist; `multiRoute` examples | Own streams only. |
| CarAudio | Port exists | System/CarPlay policy. iOS 26 “Keep Audio in Headphones” is a **user setting**, not an app API. |

**FACT.** iOS 26 setting **Keep Audio in Headphones**: Settings → General → AirPlay & Continuity. Stops auto-switch to car/Bluetooth speakers when already on headphones. (MacRumors, 10 June 2025.) System setting, not Sounds Sage API.

### 7.3 Fake Bluetooth devices

Out of scope and policy-hostile. Do not spoof accessories to split routes.

---

## 8. MultiRoute

**FACT.** Apple: `multiRoute` is “the category for routing **distinct streams of audio data** to different output devices at the same time.” Example: “route audio to both a USB device and a set of headphones.” Requires detailed route knowledge. **Route changes can invalidate part or all of the configuration**; observe `routeChangeNotification`.

**FACT.** Audio Session Programming Guide: use all connected output ports instead of only last-in; combinations such as USB + headphones, HDMI + headphones, LineOut + headphones; **only a single input port**. `allowBluetoothA2DP` is implicitly cleared on `multiRoute`.

**INFERENCE.** “Distinct streams” are buses of **this app’s** graph (e.g. DJ cue vs master, or USB interface channels). They are not “Spotify bus” and “TikTok bus.” Those apps never give Sounds Sage a stream.

**iPhone vs interface:** Without a USB/HDMI audio interface, iPhone hardware does not give a useful Spotify/TikTok split. Built-in speaker + Bluetooth A2DP as two independent app destinations is **not** what Apple documents.

**Do not tell users `multiRoute` means desktop per-app routing.** That would be 2.3.1 misleading.

---

## 9. Ducking / Mixing

### 9.1 Two different capabilities

| | System ducking | Per-app volume |
|---|---|---|
| Who | iOS, when a session with `duckOthers` is active and playing | Does not exist for third-party apps |
| Target | Other audio sessions, as a group | Would be one app |
| Level | System-chosen reduction | Would be a fader |
| Duration | Activate → deactivate; Apple says a few seconds | Persistent |
| Restore | Ends when ducker deactivates | Would store/restore a number |

### 9.2 Desired story vs platform

Desired: Music playing → user opens video → video dominant → music ducks → video ends → music restores.

**What actually happens (FACT + INFERENCE):**

The **foreground app’s** session decides:

- Exclusive playback → music **interrupts** (stops). Restore depends on that app deactivating with `notifyOthersOnDeactivation` and the music app honoring should-resume.
- `duckOthers` → music **ducks** while that app plays. Social/video apps often **interrupt** instead of duck. Sounds Sage cannot change TikTok’s category.
- `mixWithOthers` → both play at full session volume; one system fader.

Sounds Sage can reproduce the desired story **only if Sounds Sage is the music**. Then TikTok/Instagram/YouTube behave as they already do toward any music app. Sounds Sage should implement interruption handlers well. That is table stakes, not a new mixer.

If Sounds Sage is **not** producing audio, `duckOthers` does not run. A silent controller cannot duck Spotify when TikTok opens.

### 9.3 Source differences

**INFERENCE.** Spoken-mode apps (Podcasts, some audiobooks) react to `interruptSpokenAudioAndMixWithOthers`. Music apps mix or interrupt depending on the newcomer. Games often use ambient and self-mute soundtrack via `secondaryAudioShouldBeSilencedHint`. None of this is selectable per third-party bundle ID by Sounds Sage.

### 9.4 Mixing architectures evaluated

**A. Spotify → Bluetooth, TikTok → Speaker, both usable**  
**UNSUPPORTED.** One system route.

**B. Spotify → Bluetooth, TikTok → same Bluetooth, independent volumes**  
**UNSUPPORTED.** One media volume.

**C. Spotify → Bluetooth, TikTok → Speaker, independent volumes**  
**UNSUPPORTED.** Combination of A and B.

**D. Spotify + TikTok → Sounds Sage mixer → Bluetooth/Speaker**  
**UNSUPPORTED.** Cannot ingest those streams. AUM-style mixing works only for AUv3/IAA/file players that opt in.

**Closest legitimate behaviors**

1. Sounds Sage is the music player with `mixWithOthers` so a cooperative foreground app can overlay.
2. Sounds Sage emits short ducking prompts (navigation-style) — not a listening mode.
3. Shortcuts sets **global** volume when TikTok opens, then another automation when Music/Spotify opens. Sequential, not simultaneous. Competitor **App Volume** already does this and **admits** iOS cannot mix two apps.

---

## 10. System Volume

**FACT.** Apple: no programmatic system volume; `MPVolumeView` is the standard **user** slider for system output volume. Route button on `MPVolumeView` is deprecated; use `AVRoutePickerView`.

**FACT.** Volume buttons and the slider change **one** media volume for the current route. iOS 27 beta adds separate ringtone/alarm/alert sliders, still not per-app media (Mashable, 9 June 2026).

**FACT.** Shortcuts action **Set Volume** “sets the system volume” (0…1). Personal Automation **App is Opened** can run it. This is global. If Spotify is still playing when TikTok opens, Spotify’s **audible** level also changes because it is the same fader.

**INFERENCE.** Programmatic dragging of a hidden `MPVolumeView` slider has been used historically and is review-risky / against “no programmatic way.” Do not do this.

**Closest fallback:** visible `MPVolumeView` plus optional user-installed Shortcuts automations, labeled as **device** volume, not “TikTok volume.”

---

## 11. Shortcuts / App Intents

### 11.1 What can be automatic vs user-configured

| Action | Sounds Sage App Intent | System Shortcuts | User must install automation? |
|---|---|---|---|
| Start Mix / Music Focus / Custom profile (own session) | Yes | Can call the intent | Once, if they want Siri/Action Button |
| Stop profile / deactivate session | Yes | Yes | Optional |
| Respond to route change inside the app | Native notification | No reliable trigger for all routes | n/a |
| Bluetooth connect/disconnect | Observe in-app; Shortcuts has Bluetooth triggers | Yes | Yes |
| Set system volume | No silent SDK | Set Volume | Yes |
| When TikTok opens, set volume | Cannot detect other app from sandbox | App Opened automation | Yes |
| When app closes, restore volume | Not reliable from Sounds Sage | App Closed if offered | Yes; restore is coarse |
| Per-app independent simultaneous volumes | No | No | — |

**FACT.** App Intents (iOS 16+) expose actions to Shortcuts, Siri, Spotlight, Action Button, Apple Intelligence. They cannot grant Sounds Sage extra audio privileges.

**FACT.** Guideline 4.2.3: app should work on its own without requiring another app. Sounds Sage **must** be useful without Shortcuts. Shortcuts is an enhancer. If the core is “install this automation,” review risk and a clone of **App Volume**.

### 11.2 Recommended intents (honest)

- `ActivateProfile` (Mix / Music Focus / Spoken / Off)
- `DeactivateAudioSession`
- `ShowRoutePicker` (opens the app)
- `ApplyGlobalVolumePreset` — **only** if implemented by telling the user to confirm a Shortcut, never a hidden volume write

Do not name an intent `SetTikTokVolume`. That is a lie.

---

## 12. Safari Web Extension

**FACT.** Safari Web Extensions on iOS use Manifest-style content scripts with the same privileges as page scripts, plus messaging to the extension. WWDC26 session 216: content scripts read/modify page content. Native messaging to the **iOS containing app** is limited vs macOS; Apple documents that you **cannot** send messages from a containing iOS app to the extension’s JavaScript the way macOS can.

**FACT.** Content scripts cannot see native TikTok/YouTube/Spotify apps.

**FACT / long-standing WebKit behavior.** `HTMLMediaElement.volume` is widely reported as **not settable** on iOS Safari (hardware volume is the only volume). MDN compatibility has been disputed; GitHub mdn/browser-compat-data#13554. **INFERENCE:** a Safari extension “volume slider” for YouTube.com will often do nothing on iPhone.

Possible page-level actions (PARTIALLY_SUPPORTED):

- Set `muted` / `pause()` on `<audio>`/`<video>` in that tab.
- Web Audio `GainNode` if the page’s graph is wrapable — **UNVERIFIED** on iOS 26/27 and likely broken on DRM/MSE players (YouTube, Netflix).
- Independent tabs: only pages the user granted the extension; not a system mixer.
- Physical output: **UNSUPPORTED**. Webpage audio uses the system route.

Web **Audio Session API** (`navigator.audioSession`, types playback/transient/ambient/…) lets a **page** describe how *its* audio should mix. Experimental, limited browser support (MDN, 2026). It does not control native apps. A Safari extension might set it on a page; **UNVERIFIED** on iOS Safari 26.

**Do not treat Safari as a workaround for native limitations.** At most, it is a companion for **Safari websites**, with mute/pause as the honest feature.

---

## 13. Native Architecture

Justified modules:

```
Sounds Sage
├── Profiles (Mix / Music Focus / Spoken / Custom)     — own AVAudioSession presets
├── Session Adapter                                    — AVAudioSession + interruption/route observers
├── Own Audio Engine (optional)                        — AVAudioEngine for files / MusicKit
├── Capability Registry                                — honest matrix in UI
├── Workflow Engine (constrained)                      — see §14
├── App Intents                                        — profiles on/off
├── Shortcuts Recipe Guide                             — global volume, labeled honestly
├── Route UI                                           — AVRoutePickerView + MPVolumeView
└── Safari Web Extension (phase 4, optional)           — mute/pause page media
```

**Not justified**

- Router that assigns third-party apps to outputs
- Mixer of third-party streams
- Priority engine that reorders other apps’ sessions
- Cloud processing / accounts / AI backend “because the name says Sage”
- Microphone pipeline
- Fake Bluetooth / private Core Audio taps
- ReplayKit as a mixer

**On-device only.** Profiles and logs stay on device. No audio upload.

A browser/AI web builder **cannot** compile this. It needs Xcode, a Mac, a physical iPhone, Apple Developer Program, and real-device audio hardware. Web prototype of the **UI and capability copy** is possible; the engine is native.

---

## 14. Workflow Architecture

Desired: TRIGGER → CONDITIONS → ACTIONS → EXIT → RESTORE

### Triggers that can exist

| Trigger | Real? | Notes |
|---|---|---|
| Sounds Sage profile started | Yes | In-app / App Intent |
| Sounds Sage started playing | Yes | Own player |
| Other audio started/stopped | Partial | Boolean hint, no app identity |
| Interruption began/ended | Yes | Own session |
| Route changed | Yes | Own observation of system route |
| App X opened | Only via user Shortcuts automation | Sounds Sage cannot subscribe to other apps |
| Bluetooth connect | In-app observer + Shortcuts Bluetooth automation | |
| Time / Focus / Alarm | Shortcuts | User-configured |
| Safari tab playing | Extension, Safari only | |

### Conditions that are observable

- Own session category/options/active
- `isOtherAudioPlaying` / secondary hint
- Current route ports (speaker, headphones, bluetoothA2DP, airPlay, …)
- Interruption type
- iOS version (for capability registry)
- Whether Shortcuts automation is installed — **UNVERIFIED** if detectable; usually not. Ask the user.

### Actions that are executable

- Set own category/options and activate/deactivate
- Start/stop/duck **own** player volume
- Show route picker / volume view
- Notify user of a limitation
- Invoke a Shortcut the user owns (if they run it)
- Mute/pause Safari page media (extension)

### Restoration that is reliable

- Own player position and own session after interruption ended + shouldResume: **reliable if implemented**
- Other app’s volume: **not held, not restorable**
- System volume after a Shortcut change: only by another Shortcut or the user; easy to get wrong (TikTok open sets 20%, user later wonders why Music is quiet)

**Minimum viable workflow**

1. **Profile** — user taps Mix / Music Focus / Off. Only own session changes.  
2. **Interruption policy** — on interruption, pause or lower **own** audio; on end, restore **own** audio if shouldResume.  
3. **Optional Shortcuts pack** — “When I open these apps, set device volume to X” with a warning: *this is the whole phone, not that app.*  
4. **Capability check** — if the user builds a rule that needs per-app volume or split routing, the UI marks it UNSUPPORTED and offers the fallback, and **does not run a fake success**.

---

## 15. UX Recommendation

The mock UX (Current Profile, Current Audio State, Current Output, Active Splits, WHEN/IF/THEN) is **directionally right** if and only if language is honest.

**Keep**

- Current profile
- Current output (from `currentRoute`)
- Other audio: Yes/No (not “TikTok is playing”)
- Add Rule, with a capability badge on every action
- Profiles: Mix, Music Focus, Spoken, Custom — defined as **Sounds Sage session behavior**, not system mixer modes

**Rename or remove**

- **Active Splits** — implies per-app split routing. Replace with **Active Profile** or **Active Rules**. “Split” is the original lie.
- **WHEN [source]** if source cannot be detected. Use “When Sounds Sage plays” / “When other audio is present (unidentified)” / “When I open an app (Shortcuts).”
- **THEN duck TikTok** — illegal in the UI. Offer “THEN duck other audio while Sounds Sage plays a short prompt (few seconds)” or “THEN run my volume Shortcut.”

**False-expectation UI (do not ship)**

- Per-app faders for Spotify, TikTok, Instagram
- Two output diagrams (BT vs speaker) with live independent meters
- “Split active” while two native apps play
- A mixer view that looks like SoundSource or AUM for non-opt-in apps

**Music Focus** (honest definition): Sounds Sage uses a non-mixing playback session so **its** music takes the route and interrupts others — standard music-app behavior. It does **not** force Spotify to beat TikTok.

**Mix** (honest): Sounds Sage sets `mixWithOthers` so its audio can sit under other apps that also mix.

**Smart**: auto-switch Mix vs Music Focus based on whether Sounds Sage is playing long-form music vs a short prompt; still only own session.

**App Volume competitor lesson:** they sold “per-app volume,” then had to write: *“iOS has a single shared media volume… no App Store app can change that.”* 3.5★ from few ratings. Sounds Sage should lead with the limitation, not apologize in a 1-star reply.

---

## 16. Product Name Research

### Sounds Sage

**Semantics:** “sage” = wise; also the herb; also a huge software brand (Sage Group). “Sounds Sage” reads as “wise about sound” or, misheard, **soundstage** (a core hi-fi term) or **SoundStage!** (a major review network, SoundStage!®, Schneider Publishing).

**Pronunciation / spelling:** two words, easy to misspell as SoundSage, Sound Sage, Soundsage, Soundstage. Voice search collides with Soundstage.

**Existing uses (FACT)**

- App Store: **Sage + Sound** (wellness scheduling, id6745403186); **Sage Space** (sound/music experiences).
- sage-sound.com — Sage + Sound LLC wellness.
- sageaudio.com — Sage Audio mastering.
- Instagram @soundsagemusic — FL Studio education.
- SoundCloud “Sound Sage [OFFICIAL]”.
- GitHub SoundSage — LLM audio processing.
- YouTube SoundSage.
- Puget Sound SAGE — Seattle nonprofit (different field).
- Sage Group PLC — global accounting software; multiple App Store apps (Sage Accounting, Sage 50 Mobile, Sage Field Operations) seller SAGE (UK) LTD / Sage Global Services Ltd.

**App Store search:** no verified exact “Sounds Sage” iPhone audio-mixer app found in this pass. **UNVERIFIED** exhaustiveness (store search pages did not return a clean SERP via crawl).

### Sage (alone)

Unusable as a primary brand. Sage Group is a public company with a global trademark estate and App Store presence. High confusion, high opposition risk, weak distinctiveness.

### AudioSplit

Describes a **false** capability (splitting app audio). Also collides with **stem splitting** (AudioSplit vocal remover on Google Play; AudioShake, Moises, Splitter.ai). Users will think “extract vocals,” not “route TikTok.” Clarity is high for the wrong product.

### Soundstage collision

**FACT.** SoundStage! Network is an established audio publication group using SoundStage!®. Monster SoundStage exists on the App Store. Phonetic overlap with “Sounds Sage” is a real marketplace problem in audio.

---

## 17. Trademark / App Store / Domain Risks

**This is not clearance. Hire counsel. Absence of a hit is not availability.**

| Mark | USPTO (Trademarkia crawl, Aug 2026) | Notes |
|---|---|---|
| SOUNDS SAGE exact | No exact live mark extracted; query exploded into 4,500+ **SAGE** hits | Tokenization; does **not** prove a compound mark is free |
| SOUND SAGE | SAGE N SOUND BOWLS, SN 90675068, live/registered 9 Mar 2026, Class 044 sound healing, owner Doris Igwe | Different class; still a marketplace cousin |
| SAGE | Dense thicket, including SAGE MUSIC (e.g. RN 5400631, Sage Music, LLC) and Sage Group filings | Class 9/42 software is hostile |
| AUDIOSPLIT | 0 Trademarkia hits | Still descriptive; Play Store product uses the name |

**EU / UK:** Sage Group is UK-based. **INFERENCE:** SAGE in software is well protected in UKIPO/EUIPO. A global app named Sage or Sounds Sage should expect citation/opposition risk. Not searched to exhaustion in eSearch (JS-heavy). **UNVERIFIED** full EU/UK hit list.

**Nigeria:** IPO Nigeria / NIPO exist; public search is not a complete real-time database (Hectagon Solicitors, May 2026). **UNVERIFIED.** Local agent search required. User is in Nigeria; file there if launching locally.

**App Store guideline 4.1(c):** cannot use another developer’s brand in the app name/icon without approval. “Sage” next to Sage Accounting is a confusion risk under 4.1 and 2.3.1.

**Domains (spot check, not WHOIS-complete — UNVERIFIED ownership records)**

- sageaudio.com — taken (mastering)
- sage-sound.com — taken (wellness)
- soundsage / soundssage / sounds-sage — treat as occupied-or-contested until WHOIS + registrar search
- audiosplit — used by vocal-remover products

**Recommendation:** Do **not** approve Sounds Sage merely because it was proposed. It is weak: Sage collision, Soundstage phonetic clash, “Sage” AI-wash, no audio-routing meaning. AudioSplit is worse (false claim + stem-split category). See §28 for a naming direction.

---

## 18. Competitor Research

### Has anyone solved independent native-app mixing on stock iOS?

**No.** Every serious source agrees. How-To Geek (Jan 2025) asked why iPhone has no volume mixer. Apple Discussions and Reddit remain unanswered except “Shortcuts changes the one fader.” The only App Store product that markets “per-app volume” in 2026 is a Shortcuts wrapper that **discloses** it cannot mix two simultaneous apps.

### iOS

| Product | Claim | Actual | Platform | Limit | Price / reception |
|---|---|---|---|---|---|
| **App Volume** (XupLabs, id6773184998) | “Per-app volume… Apple never built it so we did, on Shortcuts” | Sets **system** volume on App Opened. Honest limits in listing. | iOS 18.2+ | Cannot mix two playing apps; background audio keeps old level until you reopen | Free + $6.99 Pro; 3.5★ / 6 ratings |
| **AUM – Audio Mixer** (Kymatica) | Flexible mixer, AUv3/IAA hub | Mixes **opt-in** music plugins/files/hardware | iOS | Not Spotify/TikTok/YouTube | Paid (check store); pro-audio audience |
| **Audiobus** | App-to-app audio | IAA deprecated; AUv3 host; product declined after sale | iOS | Opt-in music apps only | Subscription backlash |
| **djay Split Output** | Cue vs master | DJ cable / interface; **own** app streams | iOS | Not third-party social apps | Algoriddim |
| Equalizer / “volume booster” apps | Louder music | Usually own player + EQ, or snake oil | iOS | Cannot boost other apps; review risk if misleading | Saturated, 4.2/2.3.1 risk |
| Sage + Sound / Sage Space | Wellness / sage-branded sound | Unrelated | iOS | Name clutter | — |

### Shortcuts-only

Free: App Opened → Set Volume. Same mechanism as App Volume. Sounds Sage adding a pretty wrapper without native session value is a 4.2 / 4.3 clone risk.

### Mac / Windows (the product people *think* they want)

| Product | What it actually does |
|---|---|
| **SoundSource** (Rogue Amoeba, Mac) | Real per-app volume, per-app output, per-app EQ. Uses macOS audio-tap architecture iOS does not give third parties. SoundSource 6 (2025 coverage): AirPlay + per-app EQ. |
| Audio Hijack / Loopback | Capture and route Mac app audio |
| Windows volume mixer | OS-level per-app sessions |

These prove demand. They are **not** porting paths.

### Android

Samsung **Sound Assistant** / Separate app sound: real per-app volume on that OEM stack. Reddit still asking for an iOS version in 2025–2026.

### Browser

Chrome tab mixers exist. iOS Safari is not Chrome: no true tab volume API; HTMLMediaElement.volume often ignored; extensions cannot touch native apps.

**Conclusion:** the honest iOS niche is (1) Shortcuts orchestration with brutal honesty, already occupied by App Volume, and (2) a **native session-profile + education + own-player** app, which is not occupied well. Competing with App Volume on Shortcuts alone is a weak business.

---

## 19. App Store Compliance

Relevant rules (App Store Review Guidelines, developer.apple.com, crawled 29 Aug 2026; updates include 6 Feb 2026 UGC clarification):

| Guideline | Risk if Sounds Sage is dishonest |
|---|---|
| **2.5.1** Public APIs only; APIs for intended purposes | Private Core Audio taps, hidden volume hacks, undocumented session flags |
| **2.5.2** Self-contained; may not execute code that changes other apps | “Controlling” Spotify/TikTok |
| **2.5.4** Background modes only for intended purpose | `audio` background without actually playing |
| **2.3.1** No misleading marketing | Screenshots of dual faders / dual outputs |
| **2.1** Must work as described | Reviewer opens TikTok + Spotify and nothing splits |
| **4.1** Copycats / others’ brands | Using Sage, Spotify, TikTok logos as if integrated |
| **4.2** Minimum functionality | Shortcuts-only wrapper, or a settings screen that does nothing native |
| **4.2.3** Must work without another app | Cannot require Shortcuts to launch |
| **5.1** Privacy, minimization, purpose strings | Mic, recording, listening history |
| **5.2** IP | Capturing other apps’ audio/content |

**Must avoid**

- Claiming per-app volume or split routing
- Capturing other apps’ audio (ReplayKit broadcast as a “mixer”)
- Microphone “to hear what other apps play”
- Hidden `MPVolumeView` automation
- Fake Bluetooth accessories
- Using Spotify/TikTok trademarks in the name
- Background audio entitlement as a silent always-on process
- Safari extension claimed as a system mixer

**Review notes should say, verbatim:** this app configures **its own** AVAudioSession, observes public notifications, and optionally guides users to Apple Shortcuts. It cannot control other apps’ volume or output.

---

## 20. Privacy

**Need**

- None for core session profiles, route display, capability UI.
- **Microphone:** do not request. Not required for ducking, mixing own audio, or Shortcuts.
- **Apple Music:** MusicKit authorization only if the app plays Apple Music.
- **Local network / Bluetooth always-on:** not required; system handles routes. Do not invent a Bluetooth always-scanning story.

**Do not collect:** listening history, other-app detection beyond booleans, audio samples, accounts (5.1.1(v): if no account features, don’t force login).

**On-device:** profiles, rules, UI state in UserDefaults/AppStorage/SwiftData.

Privacy Nutrition Label: essentially no data collected, unless analytics is added (prefer none for v1).

---

## 21. Recommended Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Language | Swift | Required for AVFAudio / App Intents |
| UI | SwiftUI | iPhone-first |
| Audio session | AVFAudio `AVAudioSession` | The entire product |
| Own playback | `AVAudioEngine` + `AVAudioPlayerNode` and/or MusicKit | Only if the app plays audio |
| Route UI | `AVRoutePickerView`, `MPVolumeView` | Public, user-driven |
| Automation | App Intents + Shortcuts documentation in-app | Enhancer |
| Extension | Safari Web Extension (later) | Safari-only companion |
| Persistence | SwiftData / on-device | No backend |
| AI/cloud | None | Name is not a reason |

**Cannot be built or tested without**

- A Mac
- Xcode (current for iOS 26/27 SDK)
- Apple Developer Program ($99/year)
- Physical iPhones (simulator does not prove A2DP, AirPods, interruptions, lock-screen, CarPlay)
- Real accessories: AirPods, Bluetooth speaker, wired Lightning/USB-C headphones, optional USB interface for multiRoute
- Test accounts: Apple Music, Spotify, TikTok, YouTube, Instagram, Netflix

A web builder can mock the **settings UI**. It cannot ship the audio engine.

Xcode Cloud is optional CI, not required for v1.

---

## 22. Development Roadmap

### Phase 0 — Research (this document)

**Objective:** kill false capabilities.  
**Exit:** stakeholder accepts the honest product definition. **Do not write mixer UI before this sign-off.**

### Phase 1 — Native feasibility prototype

**Build:** empty SwiftUI app; session profiles; log `isOtherAudioPlaying`, route, interruptions; play a local file with Mix vs exclusive playback; `duckOthers` for 3 seconds.  
**Test:** Music/Spotify in background; open prototype; observe mix vs interrupt vs duck; deactivate with `notifyOthersOnDeactivation`.  
**Blocker:** if ducking lasts and Apple still says “few seconds,” do not productize long duck.  
**Exit:** recorded traces on a physical iPhone proving each public option’s actual effect against Music, Spotify, Podcasts, TikTok.

### Phase 2 — Supported audio workflows

**Build:** Mix / Music Focus / Spoken / Off; interruption restore of **own** audio; route picker; volume view; capability registry in UI.  
**Test:** background, lock, route unplug, Siri, phone call.  
**Exit:** own-audio workflows reliable; every unsupported user action shows a blocking explanation.

### Phase 3 — Automation / Shortcuts

**Build:** App Intents for profiles; in-app guide to App Opened → Set Volume with **global** copy; optional Action Button.  
**Test:** automation permission, App Closed restore, Bluetooth Shortcut.  
**Blocker:** 4.2 if the app is empty without Shortcuts.  
**Exit:** app useful with zero Shortcuts; Shortcuts clearly additive.

### Phase 4 — Safari Web Extension

**Build:** mute/pause for `<video>`/`<audio>` in granted sites. Experiment with `.volume` and Web Audio; if iOS ignores volume, **remove the slider**.  
**Test:** youtube.com, news sites, Web Audio demos — not YouTube **app**.  
**Exit:** store copy says “Safari websites only.”

### Phase 5 — Device compatibility

**Build:** capability flags per route/hardware.  
**Test:** matrix in §23.  
**Exit:** no crash on route invalidation; multiRoute hidden unless a supported accessory exists.

### Phase 6 — App Store preparation

Privacy nutrition, review notes, screenshots that do **not** show fake faders, support URL, no Sage/Spotify trademark abuse.  
**Exit:** TestFlight on 3+ devices; reviewer demo script.

### Phase 7 — Production

Ship as audio-behavior companion. Iterate on copy and Shortcuts packs. Do not add “AI mixing” theater.

---

## 23. Device Test Matrix

Real hardware required for every row involving a physical transducer or another commercial app.

| Scenario | Speaker | Wired | BT speaker | AirPods | AirPlay | USB |
|---|---|---|---|---|---|---|
| Own file Mix + Music | R | R | R | R | R | R |
| Own file exclusive | R | R | R | R | R | R |
| 3-second duckOthers vs Music | R | R | R | R | R | — |
| duckOthers vs Podcasts (spoken) | R | — | — | R | — | — |
| Interrupt from Phone / FaceTime | R | — | — | R | — | — |
| Siri | R | — | — | R | — | — |
| TikTok open while Music | R | R | R | R | — | — |
| Spotify + TikTok simultaneous | R | R | R | R | — | — |
| Instagram / YouTube / Netflix / game | R | — | — | R | — | — |
| Safari youtube.com vs YouTube app | R | — | — | R | — | — |
| Background + lock + Control Center | R | R | R | R | R | — |
| Route unplug / AirPods in-ear | — | R | R | R | — | — |
| CarPlay / iOS 26 Keep Audio in Headphones | — | — | — | R | — | — |
| Shortcuts App Opened Set Volume | R | — | — | R | — | — |
| multiRoute USB+headphones | — | R | — | — | — | R |
| Call uses HFP vs A2DP quality | — | — | — | R | — | — |

Also: iPhone SE-class, current Pro, iPad if you claim iPad. iOS 26 shipping and iOS 27 beta if supporting autumn 2026.

Simulator: **insufficient** for the product.

---

## 24. 80–95% Feasibility Assessment

Score the **original** desired set, not a redefined one.

| Desired capability | Possible? | Public API? | Reliable? | Automatable? | Low friction? | Store-safe? | Score |
|---|---|---|---|---|---|---|---|
| Music continues in another app | Sometimes, other app’s choice | Indirect | Unreliable across apps | No | Medium | Yes if not overclaimed | 0.35 |
| Suppress/duck secondary | Only via own short duckOthers or other app | Yes for own | Against policy if long | No | High if lying | No if persistent | 0.20 |
| Foreground gets priority | System already does | Other app | Varies | No | n/a | n/a | 0.40 |
| Music reduces during foreground | Other app ducks/interrupts | Not Sounds Sage | Varies | Shortcuts global only | Medium | If honest | 0.25 |
| Music restores | Other app + notifyOthers | Partial | Partial | No | Medium | Yes | 0.40 |
| Flexible rules | Own session + Shortcuts only | Partial | Partial | User setup | Low | If honest | 0.30 |
| BT / AirPods / speaker / AirPlay | Route picker for own/system | Partial | Route is global | No per-app | Medium | Yes | 0.45 |
| Split Spotify BT / TikTok speaker | No | No | No | No | n/a | No | **0.00** |
| Independent volumes | No | No | No | No | n/a | No | **0.00** |
| Mixer of third-party apps | No | No | No | No | n/a | No | **0.00** |

**Conceptual coverage of original AudioSplit: ~15–25%**, and the missing 75% includes the features that *define* the product. **80–95% is not realistic.** Quoting 80–95% would itself be a 2.3.1 problem.

Redefined product (“control how *my* audio behaves”): Mix/Focus profiles, interruption restore, route UI, honest Shortcuts, capability system ≈ **55–70%** of that narrower intent, with user friction on Shortcuts.

---

## 25. What Must Be Removed

- Per-app volume for Spotify, TikTok, Instagram, YouTube, Netflix, games, Safari-the-app
- Dual-output architecture diagrams as a promised mode
- Persistent ducking of other apps
- Identifying the other app automatically
- In-app mixer of third-party streams
- Silent system-volume writes
- Microphone / recording / ReplayKit mixer
- Jailbreak, private API, fake accessories
- Cloud AI
- Mandatory accounts
- The name **AudioSplit** as a feature
- UI words **Split**, **Independent fader**, **Per-app route** unless marked UNSUPPORTED and disabled
- Any screenshot that looks like SoundSource

---

## 26. What Should Be Added

- Brutal onboarding: three screens of what iOS will not do
- Capability badge on every rule action
- Excellent **own** interruption handling (the bar music apps already owe users)
- Optional own player / Apple Music so Mix and Music Focus are real
- Shortcuts pack labeled **Device volume when app opens (not per-app)**
- Route and “other audio present” status
- Spoken prompt mode that uses duckOthers **for a few seconds** (legal use)
- Review-notes template and marketing linter (reject “mixer” in copy)
- Safari mute later, if still wanted, after native value exists

---

## 27. Final Sounds Sage Product Definition

**Sounds Sage is an iPhone app that helps you control how *this app’s* audio behaves next to everything else on your phone — and tells you the truth when iOS will not let anyone do more.**

v1 features:

1. Profiles for **Sounds Sage audio**: Mix, Music Focus, Spoken prompt, Off  
2. Live status: output route, other audio yes/no, interruption state  
3. Own playback (files; optional MusicKit) so profiles are audible  
4. User volume slider and route picker  
5. App Intents for profiles  
6. Optional Shortcuts recipes for **global** volume on app open  
7. Capability registry in the rule builder  
8. No mic, no account, no cloud  

v2 (optional): Safari mute/pause; Bluetooth connect recipes; Focus-mode pairing.

Still the same human job: *I want music and social video to coexist without blowing my eardrums.* The mechanism is **session cooperation + honest automation**, not a hidden mixer.

---

## 28. Final Recommendation

1. **Do not build AudioSplit.** The architecture is impossible on stock iOS with public APIs in 2026, including iOS 27 beta’s ringer/alarm split.

2. **Do not promise 80–95% of that dream.** Promise 100% of a smaller, true product.

3. **Build the companion** in Swift/SwiftUI/AVFAudio, on a Mac, tested on hardware, or do not enter the category. A web mock is not an iOS audio product.

4. **Reconsider the name.** Sounds Sage is not unavailable-by-search, but it is a weak audio brand: Sage Group, Sage + Sound, Sage Audio, Soundstage. AudioSplit is worse. Prefer a coined, audio-specific, non-Sage name after counsel clearance (examples for legal screening only: Routewise is descriptive; something like **Mixbound**, **Sessionist**, **Cuepath**, **Hushlane** — **UNVERIFIED**, screen them; do not adopt here). If the team insists on Sounds Sage, budget for Sage/Soundstage confusion and a trademark attorney in US, UK/EU, and Nigeria.

5. **Position against App Volume, not against SoundSource.** App Volume already took the Shortcuts lie-adjacent slot and had to walk it back. Win on native session profiles + honesty, or lose on 4.3 spam/clone.

6. **Phase 1 hardware prototype is the real go/no-go.** If Mix vs exclusive vs 3-second duck vs TikTok interrupt is not compelling on a phone in a week, there is no product.

**Strongest shippable sentence for the App Store:**

> Control how Sounds Sage plays alongside your other apps. Mix or take focus, handle interruptions, and see what iOS is actually doing. It cannot change Spotify or TikTok’s own volume — no iPhone app can — and it will not pretend otherwise.

That product is modest. It is also the only one that is true.

---

## 29. Sources

### Apple — audio APIs

- [AVAudioSession](https://developer.apple.com/documentation/avfaudio/avaudiosession)  
- [CategoryOptions](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct)  
- [mixWithOthers](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/mixwithothers)  
- [duckOthers](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/duckothers) (includes the “few seconds” Important note; © 2026 Apple)  
- [interruptSpokenAudioAndMixWithOthers](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/interruptspokenaudioandmixwithothers)  
- [allowBluetooth](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/allowbluetooth)  
- [allowBluetoothA2DP](https://developer.apple.com/documentation/avfaudio/avaudiosession/categoryoptions-swift.struct/allowbluetootha2dp)  
- [multiRoute](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/multiroute)  
- [overrideOutputAudioPort](https://developer.apple.com/documentation/avfaudio/avaudiosession/overrideoutputaudioport(_:))  
- [PortOverride](https://developer.apple.com/documentation/avfaudio/avaudiosession/portoverride)  
- [isOtherAudioPlaying](https://developer.apple.com/documentation/avfaudio/avaudiosession/isotheraudioplaying)  
- [secondaryAudioShouldBeSilencedHint](https://developer.apple.com/documentation/avfaudio/avaudiosession/secondaryaudioshouldbesilencedhint)  
- [setActive](https://developer.apple.com/documentation/avfaudio/avaudiosession/setactive(_:options:))  
- [notifyOthersOnDeactivation](https://developer.apple.com/documentation/avfaudio/avaudiosession/setactiveoptions/notifyothersondeactivation)  
- [RouteSharingPolicy](https://developer.apple.com/documentation/avfaudio/avaudiosession/routesharingpolicy-swift.enum)  
- [AVAudioSession.Port](https://developer.apple.com/documentation/avfaudio/avaudiosession/port)  
- [AVAudioEngine](https://developer.apple.com/documentation/avfaudio/avaudioengine)  
- [AVPlayer.volume](https://developer.apple.com/documentation/avfoundation/avplayer/volume) — “no programmatic way to control the system volume”  
- [MPVolumeView](https://developer.apple.com/documentation/mediaplayer/mpvolumeview)  
- [AVRoutePickerView](https://developer.apple.com/documentation/avkit/avroutepickerview)  
- [MPNowPlayingInfoCenter](https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter)  
- [MusicKit](https://developer.apple.com/documentation/musickit)  
- [App Intents](https://developer.apple.com/documentation/appintents)  
- [UIBackgroundModes / background execution](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes)  
- [ReplayKit](https://developer.apple.com/documentation/replaykit) — record **your** app/screen, not a mixer  
- [Safari Web Extensions](https://developer.apple.com/documentation/safariservices/safari-web-extensions)  
- [Messaging between app and JS in a Safari web extension](https://developer.apple.com/documentation/safariservices/messaging-between-the-app-and-javascript-in-a-safari-web-extension)  
- [WWDC26 216 — Create web extensions for Safari](https://developer.apple.com/videos/play/wwdc2026/216/)  
- Audio Session Programming Guide (archive): [Basics](https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/AudioSessionBasics/AudioSessionBasics.html), [Guidelines by app type](https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/AudioGuidelinesByAppType/AudioGuidelinesByAppType.html)  
- QA1754 [overrideOutputAudioPort vs defaultToSpeaker](https://developer.apple.com/library/archive/qa/qa1754/_index.html)

### Apple — policy

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (live 2026; 2.5.1, 2.5.2, 2.5.4, 2.3.1, 4.1, 4.2, 5.1, 5.2)  
- [Updated guidelines, 6 Feb 2026](https://developer.apple.com/news/)  
- [App Review](https://developer.apple.com/distribute/app-review/)

### Platform reporting (2025–2026)

- MacRumors, 10 Jun 2025: iOS 26 “Keep Audio in Headphones”  
- Mashable, 9 Jun 2026: iOS 27 independent ringtone/alarm/alert volume — not per-app media  
- How-To Geek, 8 Jan 2025: no iPhone volume mixer  
- Apple Developer Forums, MusicKit volume / route picker bugs FB13934910, FB21042385

### Web / Shortcuts

- MDN [Audio Session API](https://developer.mozilla.org/en-US/docs/Web/API/Audio_Session_API) (19 Aug 2026 crawl)  
- MDN [HTMLMediaElement.volume](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume); mdn/browser-compat-data#13554 (iOS volume not settable)  
- Apple Discussions / Matthew Cassinelli: Shortcuts Set Volume  
- simplesoftwaretutorials.com, 14 Feb 2025: lower volume when opening apps

### Competitors

- [App Volume on the App Store](https://apps.apple.com/us/app/app-volume-a-volume-per-app/id6773184998) — developer reply quoting single shared media volume  
- [AUM](http://kymatica.com/apps/aum.html)  
- [Audiobus future / IAA deprecation](https://audiob.us/futureofaudiobus)  
- [SoundSource](https://rogueamoeba.com/soundsource/)  
- Samsung Sound Assistant / Separate app sound  
- Algoriddim djay split output

### Naming / marks / domains (preliminary, not clearance)

- Trademarkia searches: SOUNDS SAGE, SOUND SAGE, AUDIOSPLIT (Aug 2026)  
- SAGE MUSIC RN 5400631 (Trademarkia)  
- [Sage + Sound App Store](https://apps.apple.com/us/app/sage-sound/id6745403186)  
- sage-sound.com, sageaudio.com, sage.com / Sage Group App Store listings  
- SoundStage! Network, SoundStage!®  
- IPO Nigeria https://iponigeria.fmiti.gov.ng/ ; NIPO https://nipo.gov.ng/  
- Hectagon Solicitors, 12 May 2026: Nigeria TM database limitations  
- WIPO Global Brand Database (interface only; full hit list UNVERIFIED)

### Other

- Apple Support [wired headphones](https://support.apple.com/en-us/108042)  
- Medium, Mehsamadi: “Understanding AVAudioSession Routes on iOS” (apps influence eligibility, do not pick arbitrary outputs)

---

**End of report.**  
Research pass complete. No implementation was started. No Oracle OS files were modified.
