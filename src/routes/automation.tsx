import { createFileRoute } from "@tanstack/react-router";
import { APP_INTENTS } from "@/automation/intents";
import { CapabilityBadge } from "@/components/ui/badge";

export const Route = createFileRoute("/automation")({ component: AutomationPage });

function AutomationPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Shortcuts</p>
        <h1 className="mt-2 font-display text-4xl leading-none">App Intents</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These intents ship in the native target. Sounds Sage remains useful without Shortcuts.
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {APP_INTENTS.map((intent) => (
          <li key={intent.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-medium">{intent.title}</h2>
              <CapabilityBadge status={intent.status} />
            </div>
            <p className="mt-2 text-sm text-muted">{intent.summary}</p>
            <p className="mt-2 font-mono text-[11px] text-subtle">{intent.swiftType}</p>
          </li>
        ))}
      </ul>
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-2xl">Device volume recipe</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Shortcuts can run Set Volume when an app opens. That changes the one system media volume,
          including background music. It is not TikTok volume. Offer it as a recipe, never as a fake
          per-app fader.
        </p>
      </section>
    </main>
  );
}
