import Foundation

@MainActor
protocol AudioAdapter: AnyObject {
    func configureSession(policy: MixPolicy) async throws
    func activateSession() async throws
    func deactivateSession(notifyOthers: Bool) async throws
    func applyMixPolicy(_ policy: MixPolicy, duckTemporary: Bool) async throws
    func overrideOutput(speaker: Bool) async throws
    func setOwnGain(_ gain: Double, fadeMs: Double) async throws
    func playOwn() async throws
    func stopOwn() async throws
    func observe() -> AudioObservation
    func requestRoutePicker()
    func requestVolumeUI()
    func restore(_ snapshot: SessionSnapshot, notifyOthers: Bool) async throws
}
