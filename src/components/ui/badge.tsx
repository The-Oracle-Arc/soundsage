import { cn } from "@/lib/utils";
import type { CapabilityStatus } from "@/core/models";

const styles: Record<CapabilityStatus, string> = {
  SUPPORTED: "bg-supported/15 text-supported",
  PARTIALLY_SUPPORTED: "bg-partial/15 text-partial",
  UNSUPPORTED: "bg-unsupported/15 text-unsupported",
  UNVERIFIED: "bg-unverified/15 text-unverified",
};

const labels: Record<CapabilityStatus, string> = {
  SUPPORTED: "Supported",
  PARTIALLY_SUPPORTED: "Partially supported",
  UNSUPPORTED: "Not available on iOS",
  UNVERIFIED: "Unverified",
};

export function CapabilityBadge({
  status,
  className,
}: {
  status: CapabilityStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
