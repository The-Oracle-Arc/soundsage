import AVFAudio
import AVKit
import Foundation
import MediaPlayer

/// The only type allowed to talk to AVAudioSession.
@MainActor
final class IOSAudioAdapter: NSObject, AudioAdapter {
    private let session = AVAudioSession.sharedInstance()
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private var policy: MixPolicy = .mix
    private var speakerOverride = false
    private var ownGain: Double = 0.7
    private var playing = false
    private var interruptionActive = false
    var wantsRoutePicker = false
    var wantsVolumeUI = false

    override init() {
        super.init()
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: nil)
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleInterruption),
            name: AVAudioSession.interruptionNotification,
            object: session
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleRouteChange),
            name: AVAudioSession.routeChangeNotification,
            object: session
        )
    }

    func configureSession(policy: MixPolicy) async throws {
        self.policy = policy
        var options: AVAudioSession.CategoryOptions = []
        switch policy {
        case .mix:
            options.insert(.mixWithOthers)
        case .duck:
            options.insert(.duckOthers)
        case .interruptSpokenAndMix:
            options.insert(.interruptSpokenAudioAndMixWithOthers)
            options.insert(.duckOthers)
        case .exclusive:
            break
        }
        try session.setCategory(.playback, mode: .default, options: options)
    }

    func activateSession() async throws {
        try session.setActive(true)
    }

    func deactivateSession(notifyOthers: Bool) async throws {
        var options: AVAudioSession.SetActiveOptions = []
        if notifyOthers { options.insert(.notifyOthersOnDeactivation) }
        try session.setActive(false, options: options)
        playing = false
    }

    func applyMixPolicy(_ policy: MixPolicy, duckTemporary: Bool) async throws {
        try await configureSession(policy: policy)
        try await activateSession()
        if policy == .duck && duckTemporary {
            // Apple: duck only for a few seconds. The workflow engine must exit.
        }
    }

    func overrideOutput(speaker: Bool) async throws {
        try session.overrideOutputAudioPort(speaker ? .speaker : .none)
        speakerOverride = speaker
    }

    func setOwnGain(_ gain: Double, fadeMs: Double) async throws {
        ownGain = min(1, max(0, gain))
        engine.mainMixerNode.outputVolume = Float(ownGain)
        _ = fadeMs
    }

    func playOwn() async throws {
        if !engine.isRunning { try engine.start() }
        playing = true
    }

    func stopOwn() async throws {
        player.stop()
        playing = false
    }

    func observe() -> AudioObservation {
        AudioObservation(
            otherAudioPlaying: session.isOtherAudioPlaying,
            secondaryAudioShouldBeSilenced: session.secondaryAudioShouldBeSilencedHint,
            currentRoute: mapRoute(session.currentRoute),
            availableRoutes: [mapRoute(session.currentRoute)],
            ownPlaying: playing,
            ownGain: ownGain,
            mixPolicy: policy,
            speakerOverride: speakerOverride,
            interruptionActive: interruptionActive
        )
    }

    func requestRoutePicker() { wantsRoutePicker = true }
    func requestVolumeUI() { wantsVolumeUI = true }

    func restore(_ snapshot: SessionSnapshot, notifyOthers: Bool) async throws {
        try await applyMixPolicy(snapshot.mixPolicy, duckTemporary: false)
        try await setOwnGain(snapshot.ownGain, fadeMs: 180)
        try await overrideOutput(speaker: snapshot.speakerOverride)
        if snapshot.playing {
            try await playOwn()
        } else {
            try await deactivateSession(notifyOthers: notifyOthers)
        }
    }

    private func mapRoute(_ route: AVAudioSessionRouteDescription) -> RoutePort {
        guard let output = route.outputs.first else { return .unknown }
        switch output.portType {
        case .builtInSpeaker: return .speaker
        case .builtInReceiver: return .receiver
        case .headphones: return .headphones
        case .bluetoothA2DP: return .bluetoothA2DP
        case .bluetoothHFP: return .bluetoothHFP
        case .airPlay: return .airPlay
        case .usbAudio: return .usb
        case .HDMI: return .hdmi
        case .carAudio: return .carAudio
        default: return .unknown
        }
    }

    @objc private func handleInterruption(_ notification: Notification) {
        let type = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt
        interruptionActive = type == AVAudioSession.InterruptionType.began.rawValue
    }

    @objc private func handleRouteChange(_ notification: Notification) {
        _ = notification
    }
}
