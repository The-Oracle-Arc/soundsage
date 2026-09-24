import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Plus } from "../_libs/lucide-react.mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
import { S as worstStatus, _ as policySummary, f as evaluateSplit, g as outputIntentLabel, h as isTwoSided, x as useSage } from "./app-store-IP-6a6X2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/splits.index-DXHOcrCb.js
var import_jsx_runtime = require_jsx_runtime();
function SplitsPage() {
	const { splits, toggleSplit, removeSplit, setActiveSplit } = useSage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.22em] text-muted",
				children: "Pairings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Splits"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/splits/new",
				search: { edit: void 0 },
				className: "inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
			})]
		}), splits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-dashed border-border bg-surface p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No Splits yet. Add a music + social pairing."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/splits/new",
				search: { edit: void 0 },
				className: "mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg",
				children: "Add Split"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: splits.map((split) => {
				const results = split.capabilityResults.length ? split.capabilityResults : evaluateSplit(split);
				const status = worstStatus(results);
				const twoSided = isTwoSided(split);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: split.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: policySummary(split)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status })]
						}),
						twoSided ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm",
									children: [
										split.musicSource?.name,
										" · ",
										outputIntentLabel(split.musicOutputIntent)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm",
									children: [
										split.foregroundSource?.name,
										" · ",
										outputIntentLabel(split.foregroundOutputIntent)
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Session policy only — no named apps."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs uppercase tracking-wide text-subtle",
							children: [
								split.enabled ? "Enabled" : "Disabled",
								" · ",
								split.priority,
								" priority"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-3 text-sm",
									onClick: () => toggleSplit(split.id),
									children: split.enabled ? "Disable" : "Enable"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/splits/new",
									search: { edit: split.id },
									className: "inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm",
									children: "Edit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-3 text-sm",
									onClick: () => setActiveSplit(split.id),
									children: "Use on Home"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md px-3 text-sm text-unsupported",
									onClick: () => removeSplit(split.id),
									children: "Remove"
								})
							]
						})
					]
				}, split.id);
			})
		})]
	});
}
//#endregion
export { SplitsPage as component };
