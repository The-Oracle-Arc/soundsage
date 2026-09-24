import { OUTPUT_INTENT_LABELS, type OutputIntent } from "@/core/models";
import { cn } from "@/lib/utils";

export function ChannelMeter({
  label,
  appName,
  output,
  level,
  active,
}: {
  label: string;
  appName: string;
  output?: OutputIntent;
  level: number;
  active: boolean;
}) {
  const pct = Math.round(level * 100);
  return (
    <section
      data-channel={label.toLowerCase()}
      data-level={String(pct)}
      className="rounded-xl border border-border bg-surface p-3"
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 font-display text-xl leading-none">{appName}</p>
      <p className="mt-1 text-sm text-muted">{output ? OUTPUT_INTENT_LABELS[output] : "System route"}</p>
      <p className="mt-1 text-xs text-subtle">{active ? "Requested output — simulated" : "Idle"}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-[width] duration-300 ease-out",
            !active && "opacity-40",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-fg">{pct}%</p>
    </section>
  );
}
