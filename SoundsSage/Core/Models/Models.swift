import Foundation

enum CapabilityStatus: String, Codable, Equatable {
    case supported = "SUPPORTED"
    case partiallySupported = "PARTIALLY_SUPPORTED"
    case unsupported = "UNSUPPORTED"
    case unverified = "UNVERIFIED"
}

enum TriggerKind: String, Codable, CaseIterable {
    case soundsSagePlaybackStarted
    case soundsSagePlaybackStopped
    case otherAudioStarted
    case otherAudioStopped
    case routeChanged
    case interruptionBegan
    case interruptionEnded
    case sessionActivated
    case sessionDeactivated
    case profileActivated
    case manual
    case appOpened
}

enum ConditionKind: String, Codable {
    case otherAudioPlaying
    case otherAudioNotPlaying
    case routeIs
    case ownAudioPlaying
    case profileIs
    case always
}

enum ActionKind: String, Codable, CaseIterable {
    case mixWithOthers
    case duckOthers
    case interruptSpokenAndMix
    case exclusivePlayback
    case deactivateSession
    case notifyOthersOnDeactivation
    case setOwnGain
    case fadeOwnAudio
    case overrideSpeaker
    case clearSpeakerOverride
    case showRoutePicker
    case showSystemVolumeUI
    case setSystemVolume
    case setThirdPartyVolume
    case routeAppIndependently
    case identifySourceApp
    case mixThirdPartyStreams
}

enum RestorePolicy: String, Codable {
    case restoreSoundsSageSession
    case notifyOthersOnDeactivation
    case none
}

enum PriorityLevel: String, Codable {
    case low, normal, high, critical

    var rank: Int {
        switch self {
        case .low: return 1
        case .normal: return 2
        case .high: return 3
        case .critical: return 4
        }
    }
}

enum WorkflowLifecycle: String, Codable {
    case idle, triggered, evaluating, capabilityCheck, executing, active
    case exiting, restoring, complete, unsupported, error
}

enum RoutePort: String, Codable {
    case speaker, receiver, headphones, bluetoothA2DP, bluetoothHFP
    case airPlay, usb, hdmi, carAudio, unknown
}

enum MixPolicy: String, Codable {
    case exclusive, mix, duck, interruptSpokenAndMix
}

enum ProfileID: String, Codable, CaseIterable {
    case smart, musicFocus, mix, custom
}

enum SourceCategory: String, Codable {
    case music, social
}

enum SourceRole: String, Codable {
    case music, foreground
}

enum OutputIntent: String, Codable, CaseIterable {
    case bluetooth, airpods, headphones, airplay, speaker

    var label: String {
        switch self {
        case .bluetooth: return "Bluetooth"
        case .airpods: return "AirPods"
        case .headphones: return "Wired Headphones"
        case .airplay: return "AirPlay"
        case .speaker: return "iPhone Speaker"
        }
    }
}

enum MusicPolicy: String, Codable, CaseIterable {
    case keepNormal, reduce, duck, pause

    var label: String {
        switch self {
        case .keepNormal: return "Keep music normal"
        case .reduce: return "Reduce music"
        case .duck: return "Duck music"
        case .pause: return "Pause music"
        }
    }
}

enum ForegroundPolicy: String, Codable, CaseIterable {
    case suppressed, low, normalWhenForeground, alwaysNormal

    var label: String {
        switch self {
        case .suppressed: return "Suppressed"
        case .low: return "Low"
        case .normalWhenForeground: return "Normal when foreground"
        case .alwaysNormal: return "Always normal"
        }
    }
}

struct AudioSource: Codable, Equatable {
    var appId: String
    var name: String
    var category: SourceCategory
    var role: SourceRole
}

struct SplitTrigger: Codable, Equatable {
    var kind: TriggerKind
    var label: String
    var routePort: RoutePort?
    var profileId: ProfileID?
}

struct SplitCondition: Codable, Equatable {
    var kind: ConditionKind
    var routePort: RoutePort?
    var profileId: ProfileID?
}

struct SplitAction: Codable, Equatable {
    var kind: ActionKind
    var ownGain: Double?
    var fadeMs: Double?
}

struct CapabilityResult: Codable, Equatable {
    var capabilityId: String
    var status: CapabilityStatus
    var explanation: String
    var fallback: String?
    var executed: Bool
    var usedFallback: Bool
}

struct Split: Codable, Identifiable, Equatable {
    var id: String
    var name: String
    var enabled: Bool
    var trigger: SplitTrigger
    var conditions: [SplitCondition]
    var actions: [SplitAction]
    var exitCondition: SplitTrigger
    var restorePolicy: RestorePolicy
    var priority: PriorityLevel
    var capabilityResults: [CapabilityResult]
    var profileId: ProfileID?
    var createdAt: Date
    var musicSource: AudioSource? = nil
    var foregroundSource: AudioSource? = nil
    var musicOutputIntent: OutputIntent? = nil
    var foregroundOutputIntent: OutputIntent? = nil
    var musicPolicy: MusicPolicy? = nil
    var foregroundPolicy: ForegroundPolicy? = nil
    var musicReduceLevel: Double = 0.4

    var isTwoSided: Bool { musicSource != nil && foregroundSource != nil }
}

struct SessionSnapshot: Codable, Equatable {
    var mixPolicy: MixPolicy
    var ownGain: Double
    var speakerOverride: Bool
    var playing: Bool
    var capturedAt: Date
}

struct AudioObservation: Equatable {
    var otherAudioPlaying: Bool
    var secondaryAudioShouldBeSilenced: Bool
    var currentRoute: RoutePort
    var availableRoutes: [RoutePort]
    var ownPlaying: Bool
    var ownGain: Double
    var mixPolicy: MixPolicy
    var speakerOverride: Bool
    var interruptionActive: Bool
}

struct WorkflowInstance: Equatable {
    var splitId: String
    var lifecycle: WorkflowLifecycle
    var snapshot: SessionSnapshot?
    var results: [CapabilityResult]
    var error: String?
    var startedAt: Date?
    var completedAt: Date?
}
