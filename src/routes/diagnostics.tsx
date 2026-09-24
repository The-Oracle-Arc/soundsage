import { createFileRoute } from "@tanstack/react-router";
import { useSage, workflowEngine } from "@/store/app-store";

export const Route = createFileRoute("/diagnostics")({ component: DiagnosticsPage });

function DiagnosticsPage() {
  useSage((s) => s.observation);
  const events = workflowEngine.events;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Engine</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Diagnostics</h1>
        <p className="mt-3 text-sm text-muted">
          Workflow log for this device. These events do not prove Bluetooth, AirPods, or call
          interruption behavior.
        </p>
      </header>
      {events.length === 0 ? (
        <p className="text-sm text-muted">No events yet. Play the tone or change a profile.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {events.map((event, index) => (
            <li key={`${event.at}-${index}`} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-mono text-[11px] text-subtle">
                {event.lifecycle ?? "log"} · {event.at}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{event.message}</p>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
