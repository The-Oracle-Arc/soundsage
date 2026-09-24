import Foundation

@MainActor
final class WorkflowEngine {
    private let adapter: AudioAdapter
    private(set) var instances: [String: WorkflowInstance] = [:]

    init(adapter: AudioAdapter) {
        self.adapter = adapter
    }

    func getInstance(_ splitId: String) -> WorkflowInstance? {
        instances[splitId]
    }

    func evaluateConditions(_ split: Split, observation: AudioObservation, profile: ProfileID) -> Bool {
        if split.conditions.isEmpty { return true }
        return split.conditions.allSatisfy { condition in
            switch condition.kind {
            case .always: return true
            case .otherAudioPlaying: return observation.otherAudioPlaying
            case .otherAudioNotPlaying: return !observation.otherAudioPlaying
            case .ownAudioPlaying: return observation.ownPlaying
            case .routeIs: return observation.currentRoute == condition.routePort
            case .profileIs: return profile == condition.profileId
            }
        }
    }

    func handleTrigger(splits: [Split], kind: TriggerKind, profile: ProfileID) async -> [WorkflowInstance] {
        let observation = adapter.observe()
        let matched = splits.filter { split in
            split.enabled
                && split.trigger.kind == kind
                && evaluateConditions(split, observation: observation, profile: profile)
        }
        guard !matched.isEmpty else { return [] }
        let resolution = PriorityResolver.resolve(matched)
        var ran: [WorkflowInstance] = []
        for split in resolution.selected {
            ran.append(await execute(split: split, profile: profile))
        }
        return ran
    }

    func execute(split: Split, profile: ProfileID) async -> WorkflowInstance {
        var instance = WorkflowInstance(
            splitId: split.id,
            lifecycle: .triggered,
            snapshot: nil,
            results: [],
            error: nil,
            startedAt: Date(),
            completedAt: nil
        )
        let observation = adapter.observe()
        instance.lifecycle = .evaluating
        guard evaluateConditions(split, observation: observation, profile: profile) else {
            instance.lifecycle = .complete
            instance.completedAt = Date()
            instances[split.id] = instance
            return instance
        }
        instance.lifecycle = .capabilityCheck
        instance.results = CapabilityRegistry.evaluate(split: split)
        if instance.results.contains(where: { $0.status == .unsupported }) && !split.isTwoSided {
            instance.lifecycle = .unsupported
            instance.error = "Unsupported action refused. Nothing was faked."
            instances[split.id] = instance
            return instance
        }
        instance.snapshot = SessionSnapshot(
            mixPolicy: observation.mixPolicy,
            ownGain: observation.ownGain,
            speakerOverride: observation.speakerOverride,
            playing: observation.ownPlaying,
            capturedAt: Date()
        )
        instance.lifecycle = .executing
        do {
            let executable = split.actions.filter {
                CapabilityRegistry.canExecute(CapabilityRegistry.evaluate(action: $0).status)
            }
            let command = Mixer.command(from: executable)
            try await adapter.applyMixPolicy(command.policy, duckTemporary: command.duckTemporary)
            if let gain = command.ownGain {
                try await adapter.setOwnGain(gain, fadeMs: command.fadeMs ?? 0)
            }
            if executable.contains(where: { $0.kind == .overrideSpeaker }) {
                try await adapter.overrideOutput(speaker: true)
            }
            if executable.contains(where: { $0.kind == .clearSpeakerOverride }) {
                try await adapter.overrideOutput(speaker: false)
            }
            if executable.contains(where: { $0.kind == .showRoutePicker }) {
                adapter.requestRoutePicker()
            }
            if executable.contains(where: { $0.kind == .showSystemVolumeUI }) {
                adapter.requestVolumeUI()
            }
            if executable.contains(where: { $0.kind == .deactivateSession }) {
                try await adapter.deactivateSession(
                    notifyOthers: executable.contains(where: { $0.kind == .notifyOthersOnDeactivation })
                )
            }
            instance.results = instance.results.map {
                var copy = $0
                copy.executed = CapabilityRegistry.canExecute($0.status)
                copy.usedFallback = $0.status == .partiallySupported
                return copy
            }
            instance.lifecycle = .active
        } catch {
            instance.lifecycle = .error
            instance.error = error.localizedDescription
        }
        instances[split.id] = instance
        return instance
    }

    func exit(split: Split) async -> WorkflowInstance? {
        guard var instance = instances[split.id], instance.lifecycle == .active else { return instances[split.id] }
        instance.lifecycle = .exiting
        guard split.restorePolicy != .none, let snapshot = instance.snapshot else {
            instance.lifecycle = .complete
            instance.completedAt = Date()
            instances[split.id] = instance
            return instance
        }
        instance.lifecycle = .restoring
        do {
            try await adapter.restore(
                snapshot,
                notifyOthers: split.restorePolicy == .notifyOthersOnDeactivation
            )
            instance.lifecycle = .complete
            instance.completedAt = Date()
        } catch {
            instance.lifecycle = .error
            instance.error = error.localizedDescription
        }
        instances[split.id] = instance
        return instance
    }
}
