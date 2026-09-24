export function PreviewBanner() {
  return (
    <div
      role="status"
      className="rounded-lg border border-partial/40 bg-partial/10 px-4 py-2.5"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-partial">Preview mode</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Native iOS audio control is not active. Two-channel levels here are simulated. Stock iOS
        cannot independently route or volume two third-party apps.
      </p>
    </div>
  );
}
