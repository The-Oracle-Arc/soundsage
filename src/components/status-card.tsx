import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatusCard({
  label,
  value,
  hint,
  children,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl leading-tight text-fg">{value}</p>
      {hint ? <p className="mt-2 text-sm leading-snug text-muted">{hint}</p> : null}
      {children}
    </section>
  );
}
