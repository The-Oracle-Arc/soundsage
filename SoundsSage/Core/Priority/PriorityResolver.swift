import Foundation

struct ConflictResolution {
    var selected: [Split]
    var suppressed: [(split: Split, reason: String)]
    var actions: [(splitId: String, kind: ActionKind)]
}

enum PriorityResolver {
    static let exclusive: Set<ActionKind> = [
        .exclusivePlayback, .mixWithOthers, .duckOthers, .interruptSpokenAndMix
    ]

    static func resolve(_ candidates: [Split]) -> ConflictResolution {
        let sorted = candidates.sorted {
            if $0.priority.rank != $1.priority.rank { return $0.priority.rank > $1.priority.rank }
            return $0.createdAt < $1.createdAt
        }
        var selected: [Split] = []
        var suppressed: [(Split, String)] = []
        var taken = Set<ActionKind>()
        var actions: [(String, ActionKind)] = []

        for split in sorted {
            let policy = split.actions.filter { exclusive.contains($0.kind) }
            let conflict = policy.first { action in
                !taken.isEmpty && !taken.contains(action.kind)
            }
            if let conflict, !taken.isEmpty {
                suppressed.append((split, "Mix policy already claimed. \(conflict.kind) skipped."))
                let rest = split.actions.filter { !exclusive.contains($0.kind) }
                if rest.isEmpty { continue }
                var copy = split
                copy.actions = rest
                selected.append(copy)
                rest.forEach { actions.append((split.id, $0.kind)) }
                continue
            }
            selected.append(split)
            policy.forEach { taken.insert($0.kind) }
            split.actions.forEach { actions.append((split.id, $0.kind)) }
        }
        return ConflictResolution(selected: selected, suppressed: suppressed, actions: actions)
    }
}
