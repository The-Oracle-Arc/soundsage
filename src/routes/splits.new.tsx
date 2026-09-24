import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import {
  FOREGROUND_POLICY_LABELS,
  MUSIC_POLICY_LABELS,
  OUTPUT_INTENT_LABELS,
  TRIGGER_LABELS,
  createId,
  type ForegroundPolicy,
  type MusicPolicy,
  type OutputIntent,
  type PriorityLevel,
  type RestorePolicy,
  type Split,
} from "@/core/models";
import { MUSIC_CATALOG, OUTPUT_INTENTS, SOCIAL_CATALOG, sourceById } from "@/core/sources";
import { deriveActions, evaluateTwoSidedIntent, intentCheckSummary, outputIntentLabel } from "@/core/split-intent";
import { evaluateSplit, splitIsSavable } from "@/core/workflow/engine";
import { lookupCapability } from "@/core/capability/registry";
import { useSage } from "@/store/app-store";
import { CapabilityBadge } from "@/components/ui/badge";
import { SplitDiagram } from "@/components/split-diagram";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/splits/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  component: AddSplitPage,
});

const MUSIC_POLICIES: MusicPolicy[] = ["keep_normal", "reduce", "duck", "pause"];
const FG_POLICIES: ForegroundPolicy[] = ["suppressed", "low", "normal_when_foreground", "always_normal"];

function AddSplitPage() {
  const navigate = useNavigate();
  const { edit } = Route.useSearch();
  const splits = useSage((s) => s.splits);
  const addSplit = useSage((s) => s.addSplit);
  const updateSplit = useSage((s) => s.updateSplit);
  const existing = splits.find((s) => s.id === edit);

  const [name, setName] = useState(existing?.name ?? "Audio Split");
  const [musicApp, setMusicApp] = useState(existing?.musicSource?.appId ?? "spotify");
  const [musicOut, setMusicOut] = useState<OutputIntent>(existing?.musicOutputIntent ?? "bluetooth");
  const [socialApp, setSocialApp] = useState(existing?.foregroundSource?.appId ?? "tiktok");
  const [socialOut, setSocialOut] = useState<OutputIntent>(existing?.foregroundOutputIntent ?? "speaker");
  const [musicPolicy, setMusicPolicy] = useState<MusicPolicy>(existing?.musicPolicy ?? "duck");
  const [fgPolicy, setFgPolicy] = useState<ForegroundPolicy>(
    existing?.foregroundPolicy ?? "normal_when_foreground",
  );
  const [reduce, setReduce] = useState(existing?.musicReduceLevel ?? 0.4);
  const [restore, setRestore] = useState<RestorePolicy>(
    existing?.restorePolicy ?? "restore_sounds_sage_session",
  );
  const [priority, setPriority] = useState<PriorityLevel>(existing?.priority ?? "normal");

  const draft: Split = useMemo(() => {
    const split: Split = {
      id: existing?.id ?? createId("split"),
      name,
      enabled: existing?.enabled ?? true,
      profileId: existing?.profileId ?? "custom",
      musicSource: sourceById(musicApp, "music"),
      foregroundSource: sourceById(socialApp, "social"),
      musicOutputIntent: musicOut,
      foregroundOutputIntent: socialOut,
      musicPolicy,
      foregroundPolicy: fgPolicy,
      musicReduceLevel: reduce,
      trigger: { kind: "manual", label: TRIGGER_LABELS.manual },
      conditions: [{ kind: "always" }],
      actions: [],
      exitCondition: { kind: "manual", label: TRIGGER_LABELS.manual },
      restorePolicy: restore,
      priority,
      capabilityResults: [],
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    split.actions = deriveActions(split);
    return split;
  }, [
    existing,
    name,
    musicApp,
    musicOut,
    socialApp,
    socialOut,
    musicPolicy,
    fgPolicy,
    reduce,
    restore,
    priority,
  ]);

  const results = evaluateSplit(draft);
  const savable = splitIsSavable(results, draft);
  const intent = evaluateTwoSidedIntent(draft);

  function save() {
    if (!savable) return;
    if (existing) {
      updateSplit(existing.id, draft);
    } else {
      const result = addSplit(draft);
      if (!result.ok) return;
    }
    void navigate({ to: "/splits" });
  }

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <Link to="/splits" className="inline-flex min-h-11 items-center gap-1 text-sm text-muted">
          <ChevronLeft className="size-4" />
          Splits
        </Link>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-muted">
          {existing ? "Edit pairing" : "New pairing"}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none">Add Audio Split</h1>
      </header>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Name</span>
        <input
          id="split-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-fg outline-none ring-ring focus:ring-2"
        />
      </label>

      <Step n={1} title="Music app">
        <select
          id="music-app"
          value={musicApp}
          onChange={(e) => setMusicApp(e.target.value)}
          className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
          {MUSIC_CATALOG.map((app) => (
            <option key={app.appId} value={app.appId}>
              {app.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">Intended source. Not a stream tap.</p>
      </Step>

      <Step n={2} title="Music output">
        <select
          id="music-output"
          value={musicOut}
          onChange={(e) => setMusicOut(e.target.value as OutputIntent)}
          className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
          {OUTPUT_INTENTS.map((intent) => (
            <option key={intent} value={intent}>
              {OUTPUT_INTENT_LABELS[intent]}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">
          Requested: {outputIntentLabel(musicOut)}. Actual iOS route is one system output.
        </p>
      </Step>

      <Step n={3} title="Social / video app">
        <select
          id="social-app"
          value={socialApp}
          onChange={(e) => setSocialApp(e.target.value)}
          className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
          {SOCIAL_CATALOG.map((app) => (
            <option key={app.appId} value={app.appId}>
              {app.name}
            </option>
          ))}
        </select>
      </Step>

      <Step n={4} title="Social output">
        <select
          id="social-output"
          value={socialOut}
          onChange={(e) => setSocialOut(e.target.value as OutputIntent)}
          className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
          {OUTPUT_INTENTS.map((intent) => (
            <option key={intent} value={intent}>
              {OUTPUT_INTENT_LABELS[intent]}
            </option>
          ))}
        </select>
      </Step>

      <Step n={5} title="When social audio plays">
        <div className="flex flex-col gap-2">
          {MUSIC_POLICIES.map((policy) => (
            <RadioRow
              key={policy}
              name="music-policy"
              checked={musicPolicy === policy}
              onChange={() => setMusicPolicy(policy)}
              label={MUSIC_POLICY_LABELS[policy]}
            />
          ))}
        </div>
        {(musicPolicy === "reduce" || musicPolicy === "duck") && (
          <label className="mt-3 block">
            <span className="text-xs text-muted">Music level while watching ({Math.round(reduce * 100)}%)</span>
            <input
              id="reduce-level"
              type="range"
              min={0.1}
              max={0.8}
              step={0.05}
              value={reduce}
              onChange={(e) => setReduce(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </label>
        )}
      </Step>

      <Step n={6} title="Social audio">
        <div className="flex flex-col gap-2">
          {FG_POLICIES.map((policy) => (
            <RadioRow
              key={policy}
              name="fg-policy"
              checked={fgPolicy === policy}
              onChange={() => setFgPolicy(policy)}
              label={FOREGROUND_POLICY_LABELS[policy]}
            />
          ))}
        </div>
      </Step>

      <Step n={7} title="When foreground audio ends">
        <div className="flex flex-col gap-2">
          <RadioRow
            name="restore"
            checked={restore === "restore_sounds_sage_session"}
            onChange={() => setRestore("restore_sounds_sage_session")}
            label="Restore previous music state"
          />
          <RadioRow
            name="restore"
            checked={restore === "none"}
            onChange={() => setRestore("none")}
            label="Keep current state"
          />
        </div>
        <p className="text-xs text-muted">
          Preview restores simulated levels. Native iOS restores Sounds Sage’s session only — not
          another app’s private volume.
        </p>
      </Step>

      <Step n={8} title="Priority">
        <div className="grid grid-cols-4 gap-2">
          {(["low", "normal", "high", "critical"] as PriorityLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPriority(level)}
              className={cn(
                "min-h-11 rounded-lg border text-xs capitalize",
                priority === level ? "border-fg bg-fg text-bg" : "border-border bg-surface text-muted",
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </Step>

      <SplitDiagram split={draft} />

      <Step n={9} title="Capability check">
        <ul className="space-y-3 rounded-xl border border-border bg-surface p-5">
          {intentCheckSummary(draft).map((row) => (
            <li key={row.label} className="flex items-start justify-between gap-3">
              <span className="text-sm">{row.label}</span>
              <CapabilityBadge status={row.status} />
            </li>
          ))}
        </ul>
        <ul className="space-y-3 rounded-xl border border-border bg-surface p-5">
          {results.map((result) => (
            <li key={result.capabilityId} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">{lookupCapability(result.capabilityId).name}</span>
                <CapabilityBadge status={result.status} />
              </div>
              <p className="text-xs leading-relaxed text-muted">{result.explanation}</p>
              {result.fallback ? (
                <p className="text-xs text-partial">Fallback: {result.fallback}</p>
              ) : null}
            </li>
          ))}
        </ul>
        {intent.some((r) => r.status === "UNSUPPORTED") ? (
          <p className="text-sm text-unsupported">
            This Split can be saved as your intended pairing. Unsupported native behavior will not
            run on iPhone.
          </p>
        ) : null}
      </Step>

      <button
        id="save-split"
        type="button"
        onClick={save}
        disabled={!savable}
        className="min-h-14 rounded-xl bg-primary text-sm font-medium text-primary-fg disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save Split
      </button>
    </main>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">
        <span className="mr-2 text-sm font-sans text-muted">Step {n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RadioRow({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-surface px-3 text-sm">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
