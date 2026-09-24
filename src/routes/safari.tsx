import { createFileRoute } from "@tanstack/react-router";
import { CapabilityBadge } from "@/components/ui/badge";

export const Route = createFileRoute("/safari")({ component: SafariPage });

function SafariPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Phase 11</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Safari</h1>
      </header>
      <p className="text-sm leading-relaxed text-muted">
        Optional Safari Web Extension for granted websites. Isolated from the native audio engine.
      </p>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Mute or pause page media</h2>
          <CapabilityBadge status="PARTIALLY_SUPPORTED" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Content scripts may mute or pause audio and video elements. iOS often ignores element
          volume. This does not control native apps and does not pick a speaker versus Bluetooth.
        </p>
      </div>
    </main>
  );
}
