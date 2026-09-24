import Foundation

struct MixerCommand {
    var policy: MixPolicy
    var ownGain: Double?
    var fadeMs: Double?
    var duckTemporary: Bool
}

enum Mixer {
    static func command(from actions: [SplitAction]) -> MixerCommand {
        let kinds = Set(actions.map(\.kind))
        var policy: MixPolicy = .exclusive
        var duck = false
        if kinds.contains(.duckOthers) {
            policy = .duck
            duck = true
        } else if kinds.contains(.interruptSpokenAndMix) {
            policy = .interruptSpokenAndMix
        } else if kinds.contains(.mixWithOthers) {
            policy = .mix
        } else if kinds.contains(.exclusivePlayback) {
            policy = .exclusive
        }
        return MixerCommand(
            policy: policy,
            ownGain: actions.first(where: { $0.kind == .setOwnGain })?.ownGain,
            fadeMs: actions.first(where: { $0.kind == .fadeOwnAudio })?.fadeMs,
            duckTemporary: duck
        )
    }
}
