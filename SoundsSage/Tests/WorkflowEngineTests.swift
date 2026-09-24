import XCTest

@MainActor
final class MockAdapter: AudioAdapter {
    var policy: MixPolicy = .exclusive
    var gain: Double = 1
    var playing = false
    var restored: SessionSnapshot?

    func configureSession(policy: MixPolicy) async throws { self.policy = policy }
    func activateSession() async throws { playing = true }
    func deactivateSession(notifyOthers: Bool) async throws { playing = false }
    func applyMixPolicy(_ policy: MixPolicy, duckTemporary: Bool) async throws { self.policy = policy }
    func overrideOutput(speaker: Bool) async throws {}
    func setOwnGain(_ gain: Double, fadeMs: Double) async throws { self.gain = gain }
    func playOwn() async throws { playing = true }
    func stopOwn() async throws { playing = false }
    func observe() -> AudioObservation {
        AudioObservation(
            otherAudioPlaying: false,
            secondaryAudioShouldBeSilenced: false,
            currentRoute: .speaker,
            availableRoutes: [.speaker],
            ownPlaying: playing,
            ownGain: gain,
            mixPolicy: policy,
            speakerOverride: false,
            interruptionActive: false
        )
    }
    func requestRoutePicker() {}
    func requestVolumeUI() {}
    func restore(_ snapshot: SessionSnapshot, notifyOthers: Bool) async throws {
        restored = snapshot
        policy = snapshot.mixPolicy
        gain = snapshot.ownGain
        playing = snapshot.playing
    }
}

@MainActor
final class WorkflowEngineTests: XCTestCase {
    func testUnsupportedIsRefused() async {
        let adapter = MockAdapter()
        let engine = WorkflowEngine(adapter: adapter)
        let split = Split(
            id: "1",
            name: "Spotify volume",
            enabled: true,
            trigger: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            conditions: [.init(kind: .always, routePort: nil, profileId: nil)],
            actions: [.init(kind: .setThirdPartyVolume, ownGain: nil, fadeMs: nil)],
            exitCondition: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            restorePolicy: .restoreSoundsSageSession,
            priority: .normal,
            capabilityResults: [],
            profileId: nil,
            createdAt: Date()
        )
        let instance = await engine.execute(split: split, profile: .custom)
        XCTAssertEqual(instance.lifecycle, .unsupported)
        XCTAssertEqual(adapter.policy, .exclusive)
    }

    func testRestoreOwnSnapshot() async {
        let adapter = MockAdapter()
        adapter.gain = 0.8
        let engine = WorkflowEngine(adapter: adapter)
        let split = Split(
            id: "2",
            name: "Mix",
            enabled: true,
            trigger: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            conditions: [.init(kind: .always, routePort: nil, profileId: nil)],
            actions: [
                .init(kind: .mixWithOthers, ownGain: nil, fadeMs: nil),
                .init(kind: .setOwnGain, ownGain: 0.4, fadeMs: nil)
            ],
            exitCondition: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            restorePolicy: .restoreSoundsSageSession,
            priority: .normal,
            capabilityResults: [],
            profileId: nil,
            createdAt: Date()
        )
        let instance = await engine.execute(split: split, profile: .custom)
        XCTAssertEqual(instance.lifecycle, .active)
        XCTAssertEqual(adapter.policy, .mix)
        _ = await engine.exit(split: split)
        XCTAssertEqual(adapter.restored?.ownGain, 0.8)
    }

    func testPriorityKeepsExclusive() {
        let high = Split(
            id: "h", name: "Focus", enabled: true,
            trigger: .init(kind: .manual, label: "", routePort: nil, profileId: nil),
            conditions: [],
            actions: [.init(kind: .exclusivePlayback, ownGain: nil, fadeMs: nil)],
            exitCondition: .init(kind: .manual, label: "", routePort: nil, profileId: nil),
            restorePolicy: .none, priority: .high, capabilityResults: [], profileId: nil, createdAt: Date()
        )
        let low = Split(
            id: "l", name: "Mix", enabled: true,
            trigger: .init(kind: .manual, label: "", routePort: nil, profileId: nil),
            conditions: [],
            actions: [.init(kind: .mixWithOthers, ownGain: nil, fadeMs: nil)],
            exitCondition: .init(kind: .manual, label: "", routePort: nil, profileId: nil),
            restorePolicy: .none, priority: .low, capabilityResults: [], profileId: nil, createdAt: Date().addingTimeInterval(1)
        )
        let resolution = PriorityResolver.resolve([low, high])
        XCTAssertTrue(resolution.actions.contains(where: { $0.kind == .exclusivePlayback }))
        XCTAssertTrue(resolution.suppressed.contains(where: { $0.split.name == "Mix" }))
    }

    func testSaveBlockedForUnsupported() {
        let split = Split(
            id: "3",
            name: "TikTok fader",
            enabled: true,
            trigger: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            conditions: [.init(kind: .always, routePort: nil, profileId: nil)],
            actions: [.init(kind: .setThirdPartyVolume, ownGain: nil, fadeMs: nil)],
            exitCondition: .init(kind: .manual, label: "manual", routePort: nil, profileId: nil),
            restorePolicy: .none,
            priority: .normal,
            capabilityResults: [],
            profileId: .custom,
            createdAt: Date()
        )
        XCTAssertFalse(CapabilityRegistry.isSavable(CapabilityRegistry.evaluate(split: split)))
    }

    func testProfilesUseSameModel() {
        XCTAssertFalse(ProfileCatalog.splits(for: .smart).isEmpty)
        XCTAssertEqual(ProfileCatalog.splits(for: .musicFocus).first?.actions.first?.kind, .exclusivePlayback)
        XCTAssertEqual(ProfileCatalog.splits(for: .mix).first?.actions.first?.kind, .mixWithOthers)
        XCTAssertTrue(ProfileCatalog.splits(for: .custom).isEmpty)
        XCTAssertEqual(ProfileCatalog.splits(for: .smart).first?.musicPolicy, .duck)
        XCTAssertEqual(ProfileCatalog.splits(for: .smart).first?.foregroundSource?.name, "TikTok")
    }

    func testTwoSidedSplitIsSavable() {
        let split = ProfileCatalog.splits(for: .smart)[0]
        let results = CapabilityRegistry.evaluate(split: split)
        XCTAssertTrue(split.isTwoSided)
        XCTAssertTrue(results.contains(where: { $0.capabilityId == "setThirdPartyVolume" && $0.status == .unsupported }))
        XCTAssertTrue(results.contains(where: { $0.capabilityId == "captureOtherAppAudio" && $0.status == .unsupported }))
        XCTAssertTrue(CapabilityRegistry.isSavable(results, split: split))
    }
}
