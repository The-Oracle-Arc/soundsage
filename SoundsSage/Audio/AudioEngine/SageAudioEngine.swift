import AVFAudio
import Foundation

/// Own-audio graph only. Never attach another application's stream.
final class SageAudioEngine {
    let engine = AVAudioEngine()
    let player = AVAudioPlayerNode()
    let mixer: AVAudioMixerNode

    init() {
        mixer = engine.mainMixerNode
        engine.attach(player)
        engine.connect(player, to: mixer, format: nil)
    }

    func start() throws {
        if !engine.isRunning { try engine.start() }
    }

    func stop() {
        player.stop()
        engine.stop()
    }

    func setGain(_ value: Float) {
        mixer.outputVolume = max(0, min(1, value))
    }
}
