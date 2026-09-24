import { createFileRoute, Link } from "@tanstack/react-router";
import { useSage } from "@/store/app-store";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { observation, simulateInterruption, setOwnGain } = useSage();

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Sounds Sage</p>
        <h1 className="mt-2 font-display text-4xl leading-none">Settings</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Audio behavior</h2>
        <label className="block rounded-xl border border-border bg-surface p-5">
          <span className="text-sm">Sounds Sage gain</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={observation.ownGain}
            onChange={(e) => void setOwnGain(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
          <p className="mt-2 text-xs text-muted">
            Own player volume relative to the system. Not another app’s fader.
          </p>
        </label>
        <button
          type="button"
          onClick={() => void simulateInterruption(!observation.interruptionActive)}
          className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm"
        >
          {observation.interruptionActive ? "End simulated interruption" : "Simulate phone interruption"}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Automation</h2>
        <p className="text-sm leading-relaxed text-muted">
          App Intents on iPhone: start or stop a Split, activate Smart, Music Focus, Mix, or Custom.
          Sounds Sage does not watch other apps in the background. A Shortcuts App Opened recipe can
          set device volume — that fader is global.
        </p>
        <Link to="/automation" className="text-sm text-primary underline-offset-4 hover:underline">
          App Intents and Shortcuts
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Safari</h2>
        <Link to="/safari" className="text-sm text-primary underline-offset-4 hover:underline">
          Webpage companion (not native apps)
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Capability information</h2>
        <Link to="/capabilities" className="text-sm text-primary underline-offset-4 hover:underline">
          Full registry
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Diagnostics</h2>
        <p className="text-sm text-muted">
          Platform: {observation.platform.replace("_", " ")} · Route: {observation.currentRoute} ·
          Mix: {observation.mixPolicy}
        </p>
        <Link to="/diagnostics" className="text-sm text-primary underline-offset-4 hover:underline">
          Workflow log
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Privacy</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted">
          <li>Sounds Sage does not record microphone audio.</li>
          <li>Sounds Sage does not upload audio recordings.</li>
          <li>Sounds Sage does not intercept private audio streams.</li>
          <li>Splits, profiles, and preferences stay on this device.</li>
          <li>No account. No cloud processing.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">About</h2>
        <p className="text-sm leading-relaxed text-muted">
          Native product architecture lives in the SoundsSage Swift package. This preview runs the
          same workflow, capability, mixer, router, and priority models. Compile and test session
          behavior in Xcode on a physical iPhone.
        </p>
        <Link to="/native" className="text-sm text-primary underline-offset-4 hover:underline">
          Native iOS status
        </Link>
      </section>
    </main>
  );
}
