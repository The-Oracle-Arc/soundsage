import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { isTwoSided, worstStatus } from "@/core/models";
import { profileById } from "@/core/profiles";
import { policySummary } from "@/core/split-intent";
import { evaluateSplit } from "@/core/workflow/engine";
import { useSage } from "@/store/app-store";
import { PreviewBanner } from "@/components/preview-banner";
import { SplitDiagram } from "@/components/split-diagram";
import { ChannelMeter } from "@/components/channel-meter";
import { CapabilityBadge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const {
    profileId,
    splits,
    activeSplitId,
    sim,
    setActiveSplit,
    startMusic,
    startForeground,
    stopForeground,
    simulateWatchMode,
    restoreSplit,
  } = useSage();
  const profile = profileById(profileId);
  const active =
    splits.find((s) => s.id === activeSplitId && isTwoSided(s)) ??
    splits.find((s) => s.enabled && isTwoSided(s)) ??
    splits.find((s) => isTwoSided(s));

  const results = active
    ? active.capabilityResults.length
      ? active.capabilityResults
      : evaluateSplit(active)
    : [];
  const status =
    sim.watchMode ? "Watching" : sim.foregroundPlaying ? "Scrolling" : sim.musicPlaying ? "Music Focus" : "Idle";

  return (
    <main className="flex flex-1 flex-col gap-3">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Sounds Sage · {profile.name}</p>
        <h1 className="mt-1 font-display text-4xl leading-none tracking-tight">Smart Audio</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Music on one side. Social video on the other. You name the pairing. iOS decides what is
          actually possible.
        </p>
      </header>

      <PreviewBanner />

      {active ? (
        <>
          <section>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Active Split</p>
                <h2 className="mt-1 font-display text-2xl">{active.name}</h2>
              </div>
              <CapabilityBadge status={worstStatus(results)} />
            </div>
            <p className="mb-3 text-sm text-muted">
              Status: <span className="text-fg">{status}</span>
              {" · "}Music: <span className="text-fg">{sim.musicPlaying ? "Playing" : "Idle"}</span>
              {" · "}Foreground:{" "}
              <span className="text-fg">
                {sim.watchMode ? "Watching" : sim.foregroundPlaying ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ChannelMeter
                label="Music"
                appName={active.musicSource?.name ?? "Music"}
                output={active.musicOutputIntent}
                level={sim.musicLevel}
                active={sim.musicPlaying}
              />
              <ChannelMeter
                label="Foreground"
                appName={active.foregroundSource?.name ?? "Social"}
                output={active.foregroundOutputIntent}
                level={sim.foregroundLevel}
                active={sim.foregroundPlaying}
              />
            </div>
            <p className="mt-2 text-xs text-subtle">
              {policySummary(active)} — preview simulation. Scrolling keeps music on; Watch Mode
              reduces it.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              id="start-music"
              type="button"
              onClick={() => {
                setActiveSplit(active.id);
                void startMusic();
              }}
              className="min-h-12 rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg transition-transform duration-150 active:scale-[0.98]"
            >
              Start Music
            </button>
            <button
              id="start-foreground"
              type="button"
              onClick={() => void startForeground()}
              className="min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]"
            >
              Start Foreground
            </button>
            <button
              id="watch-mode"
              type="button"
              onClick={() => void simulateWatchMode()}
              className="min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]"
            >
              Simulate Watch Mode
            </button>
            <button
              id="restore-split"
              type="button"
              onClick={() => void restoreSplit()}
              className="min-h-12 rounded-lg border border-border-strong px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]"
            >
              Restore
            </button>
            <button
              id="stop-foreground"
              type="button"
              onClick={() => void stopForeground()}
              className="min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium sm:col-span-2"
            >
              Stop Foreground
            </button>
          </div>

          <SplitDiagram split={active} />

          <Link
            to="/splits/new"
            search={{ edit: active.id }}
            className="flex min-h-12 items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium"
          >
            Edit Split
          </Link>
        </>
      ) : (
        <p className="text-sm text-muted">No two-sided Split yet. Add one to name music and social sources.</p>
      )}

      <Link
        id="add-split-home"
        to="/splits/new"
        search={{ edit: undefined }}
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-medium text-primary-fg transition-transform duration-150 active:scale-[0.98]"
      >
        <Plus className="size-5" />
        Add Split
      </Link>
    </main>
  );
}