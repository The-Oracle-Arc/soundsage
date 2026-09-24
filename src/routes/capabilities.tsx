import { createFileRoute } from "@tanstack/react-router";
import { CAPABILITY_REGISTRY } from "@/core/capability/registry";
import { CapabilityBadge } from "@/components/ui/badge";

export const Route = createFileRoute("/capabilities")({ component: CapabilitiesPage });

function CapabilitiesPage() {
  const records = Object.values(CAPABILITY_REGISTRY);
  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Registry</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Capabilities</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Public iOS APIs only. Unsupported actions are refused. Device rows still need a physical
          iPhone — this list is the product contract, not a hardware certificate.
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {records.map((cap) => (
          <li key={cap.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-medium">{cap.name}</h2>
              <CapabilityBadge status={cap.status} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{cap.explanation}</p>
            <p className="mt-3 font-mono text-[11px] text-subtle">{cap.requiredApi}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{cap.limitations}</p>
            {cap.fallback ? (
              <p className="mt-2 text-xs text-partial">Fallback: {cap.fallback}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
