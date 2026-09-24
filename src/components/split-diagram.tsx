import {
  FOREGROUND_POLICY_LABELS,
  MUSIC_POLICY_LABELS,
  OUTPUT_INTENT_LABELS,
  type Split,
} from "@/core/models";
import { cn } from "@/lib/utils";

export function SplitDiagram({
  split,
  className,
}: {
  split: Split;
  className?: string;
}) {
  const music = split.musicSource?.name ?? "Music";
  const foreground = split.foregroundSource?.name ?? "Foreground";
  const musicOut = split.musicOutputIntent ? OUTPUT_INTENT_LABELS[split.musicOutputIntent] : "System";
  const fgOut = split.foregroundOutputIntent
    ? OUTPUT_INTENT_LABELS[split.foregroundOutputIntent]
    : "System";
  const policy = split.musicPolicy ? MUSIC_POLICY_LABELS[split.musicPolicy] : "Mix / duck";
  const fgPolicy = split.foregroundPolicy ? FOREGROUND_POLICY_LABELS[split.foregroundPolicy] : "";

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", className)}>
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Audio Split
      </p>
      <div className="mx-auto mt-3 h-5 w-px bg-border-strong" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        <Channel
          title="Music"
          app={music}
          output={musicOut}
        />
        <div className="flex flex-col items-center">
          <div className="h-full w-px bg-border-strong" />
        </div>
        <Channel
          title="Foreground"
          app={foreground}
          output={fgOut}
        />
      </div>
      <div className="mx-auto h-5 w-px bg-border-strong" />
      <div className="rounded-lg border border-border bg-surface-2 px-3 py-3 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Split policy</p>
        <p className="mt-1 text-sm text-fg">{policy}</p>
        {fgPolicy ? <p className="mt-1 text-xs text-muted">Foreground: {fgPolicy}</p> : null}
        <p className="mt-2 text-xs text-subtle">
          {split.restorePolicy === "none" ? "Keep current state" : "Restore previous music state"}
        </p>
      </div>
    </div>
  );
}

function Channel({ title, app, output }: { title: string; app: string; output: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{title}</p>
      <p className="mt-2 text-sm font-medium leading-tight">{app}</p>
      <p className="mt-1 text-xs text-muted">{output}</p>
    </div>
  );
}
