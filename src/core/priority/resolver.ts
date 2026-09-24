import {
  PRIORITY_RANK,
  type ActionKind,
  type PriorityLevel,
  type Split,
} from "../models.ts";

const EXCLUSIVE_GROUP: ActionKind[] = [
  "exclusive_playback",
  "mix_with_others",
  "duck_others",
  "interrupt_spoken_and_mix",
];

export interface Resolution {
  selected: Split[];
  suppressed: { split: Split; reason: string }[];
  actions: { splitId: string; kind: ActionKind }[];
}

export function comparePriority(a: PriorityLevel, b: PriorityLevel) {
  return PRIORITY_RANK[b] - PRIORITY_RANK[a];
}

export function resolveConflicts(candidates: Split[]): Resolution {
  const sorted = [...candidates].sort((a, b) => {
    const p = comparePriority(a.priority, b.priority);
    if (p !== 0) return p;
    return a.createdAt.localeCompare(b.createdAt);
  });

  const selected: Split[] = [];
  const suppressed: Resolution["suppressed"] = [];
  const takenExclusive = new Set<ActionKind>();
  const actions: Resolution["actions"] = [];

  for (const split of sorted) {
    const exclusiveActions = split.actions.filter((a) =>
      EXCLUSIVE_GROUP.includes(a.kind),
    );
    const conflict = exclusiveActions.find((a) => {
      if (takenExclusive.size === 0) return false;
      if (takenExclusive.has(a.kind) && a.kind === "duck_others") return false;
      return [...takenExclusive].some((taken) => taken !== a.kind);
    });

    if (conflict && takenExclusive.size > 0) {
      suppressed.push({
        split,
        reason: `Mix policy already claimed by a higher-priority Split. ${conflict.kind} was not applied.`,
      });
      const nonPolicy = split.actions.filter(
        (a) => !EXCLUSIVE_GROUP.includes(a.kind),
      );
      if (nonPolicy.length === 0) continue;
      selected.push({ ...split, actions: nonPolicy });
      for (const action of nonPolicy) {
        actions.push({ splitId: split.id, kind: action.kind });
      }
      continue;
    }

    selected.push(split);
    for (const action of exclusiveActions) takenExclusive.add(action.kind);
    for (const action of split.actions) {
      actions.push({ splitId: split.id, kind: action.kind });
    }
  }

  return { selected, suppressed, actions };
}
