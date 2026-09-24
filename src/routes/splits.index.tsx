import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { isTwoSided, worstStatus } from "@/core/models";
import { policySummary, outputIntentLabel } from "@/core/split-intent";
import { evaluateSplit } from "@/core/workflow/engine";
import { useSage } from "@/store/app-store";
import { CapabilityBadge } from "@/components/ui/badge";

export const Route = createFileRoute("/splits/")({ component: SplitsPage });

function SplitsPage() {
  const { splits, toggleSplit, removeSplit, setActiveSplit } = useSage();

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Pairings</p>
          <h1 className="mt-2 font-display text-4xl leading-none">Splits</h1>
        </div>
        <Link
          to="/splits/new"
          search={{ edit: undefined }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg"
        >
          <Plus className="size-4" />
          Add
        </Link>
      </header>

      {splits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6">
          <p className="text-sm text-muted">No Splits yet. Add a music + social pairing.</p>
          <Link
            to="/splits/new"
            search={{ edit: undefined }}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg"
          >
            Add Split
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {splits.map((split) => {
            const results = split.capabilityResults.length
              ? split.capabilityResults
              : evaluateSplit(split);
            const status = worstStatus(results);
            const twoSided = isTwoSided(split);
            return (
              <li key={split.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium">{split.name}</h2>
                    <p className="mt-1 text-sm text-muted">{policySummary(split)}</p>
                  </div>
                  <CapabilityBadge status={status} />
                </div>
                {twoSided ? (
                  <div className="mt-4">
                    <p className="text-sm">
                      {split.musicSource?.name} · {outputIntentLabel(split.musicOutputIntent)}
                    </p>
                    <p className="text-xs text-muted">+</p>
                    <p className="text-sm">
                      {split.foregroundSource?.name} · {outputIntentLabel(split.foregroundOutputIntent)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">Session policy only — no named apps.</p>
                )}
                <p className="mt-2 text-xs uppercase tracking-wide text-subtle">
                  {split.enabled ? "Enabled" : "Disabled"} · {split.priority} priority
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-border px-3 text-sm"
                    onClick={() => toggleSplit(split.id)}
                  >
                    {split.enabled ? "Disable" : "Enable"}
                  </button>
                  <Link
                    to="/splits/new"
                    search={{ edit: split.id }}
                    className="inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-border px-3 text-sm"
                    onClick={() => setActiveSplit(split.id)}
                  >
                    Use on Home
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-md px-3 text-sm text-unsupported"
                    onClick={() => removeSplit(split.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
