import Foundation

struct CapabilityRecord: Equatable {
    var id: String
    var name: String
    var status: CapabilityStatus
    var explanation: String
    var requiredApi: String
    var limitations: String
    var fallback: String?
}

enum CapabilityRegistry {
    static let records: [String: CapabilityRecord] = [
        "mixWithOthers": .init(
            id: "mixWithOthers",
            name: "Mix with others",
            status: .supported,
            explanation: "Sounds Sage mixes its own audio using AVAudioSession mixWithOthers.",
            requiredApi: "AVAudioSession.CategoryOptions.mixWithOthers",
            limitations: "Own audio only. Other apps may still interrupt.",
            fallback: nil
        ),
        "duckOthers": .init(
            id: "duckOthers",
            name: "Duck other audio",
            status: .partiallySupported,
            explanation: "While Sounds Sage plays, iOS can duck other sessions. Apple: temporary, a few seconds, not per-app.",
            requiredApi: "AVAudioSession.CategoryOptions.duckOthers",
            limitations: "Must produce audio. Not a listening mode. Not a chosen app.",
            fallback: "Short spoken prompt, or Mix."
        ),
        "interruptSpokenAndMix": .init(
            id: "interruptSpokenAndMix",
            name: "Interrupt spoken audio and mix",
            status: .partiallySupported,
            explanation: "Pauses spokenAudio-mode sessions and mixes with music.",
            requiredApi: "AVAudioSession.CategoryOptions.interruptSpokenAudioAndMixWithOthers",
            limitations: "Spoken-mode only.",
            fallback: "Mix for music."
        ),
        "exclusivePlayback": .init(
            id: "exclusivePlayback",
            name: "Exclusive playback",
            status: .supported,
            explanation: "Non-mixing playback session for Sounds Sage. Cannot force Spotify over TikTok.",
            requiredApi: "AVAudioSession category playback",
            limitations: "Own session only.",
            fallback: nil
        ),
        "setOwnGain": .init(
            id: "setOwnGain",
            name: "Sounds Sage gain",
            status: .supported,
            explanation: "Mixer/player volume relative to system volume.",
            requiredApi: "AVAudioMixerNode.outputVolume",
            limitations: "Own audio only.",
            fallback: nil
        ),
        "showRoutePicker": .init(
            id: "showRoutePicker",
            name: "Output route picker",
            status: .supported,
            explanation: "AVRoutePickerView. Route is system-wide.",
            requiredApi: "AVRoutePickerView",
            limitations: "User-initiated. Not per-app routing.",
            fallback: nil
        ),
        "showSystemVolumeUI": .init(
            id: "showSystemVolumeUI",
            name: "System volume control",
            status: .supported,
            explanation: "MPVolumeView. Apple: no programmatic system volume.",
            requiredApi: "MPVolumeView",
            limitations: "Global media volume.",
            fallback: nil
        ),
        "overrideSpeaker": .init(
            id: "overrideSpeaker",
            name: "Override to speaker",
            status: .partiallySupported,
            explanation: "PortOverride.speaker is transient and speaker/none only.",
            requiredApi: "AVAudioSession.overrideOutputAudioPort",
            limitations: "Cannot split other apps across outputs.",
            fallback: "Route picker."
        ),
        "notifyOthersOnDeactivation": .init(
            id: "notifyOthersOnDeactivation",
            name: "Notify others on deactivation",
            status: .supported,
            explanation: "Interrupted sessions may resume. Not a stored third-party volume.",
            requiredApi: "notifyOthersOnDeactivation",
            limitations: "Cannot restore another app's private volume.",
            fallback: nil
        ),
        "setThirdPartyVolume": .init(
            id: "setThirdPartyVolume",
            name: "Independent app volume",
            status: .unsupported,
            explanation: "Stock iOS has no public API for Spotify/TikTok/Instagram/YouTube volume.",
            requiredApi: "None",
            limitations: "iOS 27 ringer/alarm split is not per-app media.",
            fallback: "Mix/Music Focus, or a global Shortcuts Set Volume recipe."
        ),
        "routeAppIndependently": .init(
            id: "routeAppIndependently",
            name: "Per-app output routing",
            status: .unsupported,
            explanation: "One system route. multiRoute is Sounds Sage streams, not Spotify vs TikTok.",
            requiredApi: "None",
            limitations: "Do not confuse multiRoute with desktop routing.",
            fallback: "AVRoutePickerView."
        ),
        "identifySourceApp": .init(
            id: "identifySourceApp",
            name: "Identify source app",
            status: .unsupported,
            explanation: "Only booleans for other audio.",
            requiredApi: "None",
            limitations: "No bundle ID.",
            fallback: "User names the situation, or Shortcuts App Opened."
        ),
        "mixThirdPartyStreams": .init(
            id: "mixThirdPartyStreams",
            name: "Mix other apps through Sounds Sage",
            status: .unsupported,
            explanation: "Cannot tap arbitrary app audio. AUv3 is opt-in music apps only.",
            requiredApi: "None",
            limitations: "ReplayKit is recording, not a mixer.",
            fallback: "Own engine only."
        ),
        "setSystemVolume": .init(
            id: "setSystemVolume",
            name: "Programmatic system volume",
            status: .unsupported,
            explanation: "No public programmatic system volume API.",
            requiredApi: "None",
            limitations: "Shortcuts Set Volume is global and user-configured.",
            fallback: "MPVolumeView."
        ),
        "appOpened": .init(
            id: "appOpened",
            name: "Another app opened",
            status: .unsupported,
            explanation: "No native subscription to other apps opening.",
            requiredApi: "Shortcuts App Opened",
            limitations: "User must install the automation.",
            fallback: "App Intents plus a Shortcuts recipe."
        ),
        "selectMusicApp": .init(
            id: "selectMusicApp",
            name: "Select music application",
            status: .partiallySupported,
            explanation: "User names the intended music app. Sounds Sage cannot observe which app is playing.",
            requiredApi: "None",
            limitations: "Listing an app does not grant control of its stream.",
            fallback: "Keep as intent. Mix/Music Focus for Sounds Sage audio."
        ),
        "selectForegroundApp": .init(
            id: "selectForegroundApp",
            name: "Select foreground application",
            status: .partiallySupported,
            explanation: "User names the intended social/video app. No public identity API.",
            requiredApi: "None",
            limitations: "No bundle ID.",
            fallback: "User names the situation."
        ),
        "outputIntentSystemRoute": .init(
            id: "outputIntentSystemRoute",
            name: "Prefer an audio route",
            status: .partiallySupported,
            explanation: "AVRoutePickerView is one system output. Not per-app.",
            requiredApi: "AVRoutePickerView",
            limitations: "Requested vs actual. Cannot split Spotify and TikTok.",
            fallback: "Show the route picker."
        ),
        "restoreThirdPartyVolume": .init(
            id: "restoreThirdPartyVolume",
            name: "Restore another app's private volume",
            status: .unsupported,
            explanation: "Sounds Sage never stored Spotify or TikTok volume.",
            requiredApi: "None",
            limitations: "notifyOthersOnDeactivation resumes at the other app's own level.",
            fallback: "Restore Sounds Sage session only."
        ),
        "captureOtherAppAudio": .init(
            id: "captureOtherAppAudio",
            name: "Capture another app's audio",
            status: .unsupported,
            explanation: "Public APIs cannot tap or intercept another app's private audio stream.",
            requiredApi: "None",
            limitations: "No jailbreak, no private taps, no microphone interception of other apps.",
            fallback: "User names intended apps. Native stays session-only."
        ),
        "detectOtherAudio": .init(
            id: "detectOtherAudio",
            name: "Detect other audio",
            status: .supported,
            explanation: "isOtherAudioPlaying is a boolean. It does not name the other app.",
            requiredApi: "AVAudioSession.isOtherAudioPlaying",
            limitations: "No bundle ID, volume, or stream tap.",
            fallback: "User names the situation."
        ),
        "bluetoothRoute": .init(
            id: "bluetoothRoute",
            name: "Bluetooth output",
            status: .partiallySupported,
            explanation: "Bluetooth is a system route the user can pick. Not per-app.",
            requiredApi: "AVRoutePickerView",
            limitations: "Hardware dependent. Not Spotify-only Bluetooth.",
            fallback: "User picks Bluetooth as the one system output."
        ),
        "airpodsRoute": .init(
            id: "airpodsRoute",
            name: "AirPods output",
            status: .partiallySupported,
            explanation: "AirPods are the system output, not a Sounds Sage-owned path.",
            requiredApi: "AVRoutePickerView",
            limitations: "Hardware dependent.",
            fallback: "User picks AirPods in the route picker."
        ),
        "airplayRoute": .init(
            id: "airplayRoute",
            name: "AirPlay output",
            status: .partiallySupported,
            explanation: "AirPlay is a system route. Cannot send only music to AirPlay.",
            requiredApi: "AVRoutePickerView",
            limitations: "Hardware dependent. System-wide.",
            fallback: "User picks AirPlay as the one system output."
        ),
        "multiRouteOwn": .init(
            id: "multiRouteOwn",
            name: "Multi-route own streams",
            status: .partiallySupported,
            explanation: "multiRoute is Sounds Sage streams, not Spotify vs TikTok.",
            requiredApi: "AVAudioSession.Category.multiRoute",
            limitations: "Own streams only. Hardware dependent.",
            fallback: "Single route picker."
        ),
        "safariPageVolume": .init(
            id: "safariPageVolume",
            name: "Safari webpage volume",
            status: .partiallySupported,
            explanation: "Safari Web Extension can mute granted tabs. Not native apps.",
            requiredApi: "Safari Web Extension",
            limitations: "Safari websites only.",
            fallback: "Mute or pause the page."
        )
    ]

    static func capabilityId(for action: ActionKind) -> String {
        switch action {
        case .mixWithOthers: return "mixWithOthers"
        case .duckOthers: return "duckOthers"
        case .interruptSpokenAndMix: return "interruptSpokenAndMix"
        case .exclusivePlayback: return "exclusivePlayback"
        case .deactivateSession: return "notifyOthersOnDeactivation"
        case .notifyOthersOnDeactivation: return "notifyOthersOnDeactivation"
        case .setOwnGain, .fadeOwnAudio: return "setOwnGain"
        case .overrideSpeaker, .clearSpeakerOverride: return "overrideSpeaker"
        case .showRoutePicker: return "showRoutePicker"
        case .showSystemVolumeUI: return "showSystemVolumeUI"
        case .setSystemVolume: return "setSystemVolume"
        case .setThirdPartyVolume: return "setThirdPartyVolume"
        case .routeAppIndependently: return "routeAppIndependently"
        case .identifySourceApp: return "identifySourceApp"
        case .mixThirdPartyStreams: return "mixThirdPartyStreams"
        }
    }

    static func lookup(_ id: String) -> CapabilityRecord {
        records[id] ?? CapabilityRecord(
            id: id,
            name: id,
            status: .unverified,
            explanation: "Not in registry.",
            requiredApi: "unknown",
            limitations: "Unknown",
            fallback: "Do not execute."
        )
    }

    static func evaluate(action: SplitAction) -> CapabilityRecord {
        lookup(capabilityId(for: action.kind))
    }

    static func canExecute(_ status: CapabilityStatus) -> Bool {
        status == .supported || status == .partiallySupported
    }

    static func evaluate(split: Split) -> [CapabilityResult] {
        var results = split.actions.map { action -> CapabilityResult in
            let cap = evaluate(action: action)
            return CapabilityResult(
                capabilityId: cap.id,
                status: cap.status,
                explanation: cap.explanation,
                fallback: cap.fallback,
                executed: false,
                usedFallback: cap.status == .partiallySupported
            )
        }
        if split.trigger.kind == .appOpened {
            let cap = lookup("appOpened")
            results.insert(
                CapabilityResult(
                    capabilityId: cap.id,
                    status: cap.status,
                    explanation: cap.explanation,
                    fallback: cap.fallback,
                    executed: false,
                    usedFallback: false
                ),
                at: 0
            )
        }
        if split.isTwoSided {
            for id in ["selectMusicApp", "selectForegroundApp", "detectOtherAudio", "outputIntentSystemRoute", "bluetoothRoute", "setThirdPartyVolume", "routeAppIndependently", "mixThirdPartyStreams", "captureOtherAppAudio", "restoreThirdPartyVolume"] {
                let cap = lookup(id)
                if !results.contains(where: { $0.capabilityId == cap.id }) {
                    results.append(
                        CapabilityResult(
                            capabilityId: cap.id,
                            status: cap.status,
                            explanation: cap.explanation,
                            fallback: cap.fallback,
                            executed: false,
                            usedFallback: false
                        )
                    )
                }
            }
        }
        return results
    }

    static func isSavable(_ results: [CapabilityResult], split: Split? = nil) -> Bool {
        if let split, split.isTwoSided { return !split.name.isEmpty }
        return !results.contains { $0.status == .unsupported }
    }
}
