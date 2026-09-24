import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Plus } from "../_libs/lucide-react.mjs";
import { r as cn } from "./router-CKVk0PkF.mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
import { S as worstStatus, _ as policySummary, a as OUTPUT_INTENT_LABELS, f as evaluateSplit, h as isTwoSided, v as profileById, x as useSage } from "./app-store-IP-6a6X2.mjs";
import { t as SplitDiagram } from "./split-diagram-CDX6lEbX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Blyvt_TW.js
var import_jsx_runtime = require_jsx_runtime();
function PreviewBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: "rounded-lg border border-partial/40 bg-partial/10 px-4 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.18em] text-partial",
			children: "Preview mode"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-muted",
			children: "Native iOS audio control is not active. Two-channel levels here are simulated. Stock iOS cannot independently route or volume two third-party apps."
		})]
	});
}
function ChannelMeter({ label, appName, output, level, active }) {
	const pct = Math.round(level * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-channel": label.toLowerCase(),
		"data-level": String(pct),
		className: "rounded-xl border border-border bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl leading-none",
				children: appName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: output ? OUTPUT_INTENT_LABELS[output] : "System route"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: active ? "Requested output — simulated" : "Idle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-2 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full bg-primary transition-[width] duration-300 ease-out", !active && "opacity-40"),
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-sm tabular-nums text-fg",
				children: [pct, "%"]
			})
		]
	});
}
function Home() {
	const { profileId, splits, activeSplitId, sim, setActiveSplit, startMusic, startForeground, stopForeground, simulateWatchMode, restoreSplit } = useSage();
	const profile = profileById(profileId);
	const active = splits.find((s) => s.id === activeSplitId && isTwoSided(s)) ?? splits.find((s) => s.enabled && isTwoSided(s)) ?? splits.find((s) => isTwoSided(s));
	const results = active ? active.capabilityResults.length ? active.capabilityResults : evaluateSplit(active) : [];
	const status = sim.watchMode ? "Watching" : sim.foregroundPlaying ? "Scrolling" : sim.musicPlaying ? "Music Focus" : "Idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium uppercase tracking-[0.22em] text-muted",
					children: ["Sounds Sage · ", profile.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl leading-none tracking-tight",
					children: "Smart Audio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm leading-relaxed text-muted",
					children: "Music on one side. Social video on the other. You name the pairing. iOS decides what is actually possible."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewBanner, {}),
			active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
							children: "Active Split"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl",
							children: active.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: worstStatus(results) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-3 text-sm text-muted",
						children: [
							"Status: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: status
							}),
							" · ",
							"Music: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: sim.musicPlaying ? "Playing" : "Idle"
							}),
							" · ",
							"Foreground:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: sim.watchMode ? "Watching" : sim.foregroundPlaying ? "Active" : "Inactive"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelMeter, {
							label: "Music",
							appName: active.musicSource?.name ?? "Music",
							output: active.musicOutputIntent,
							level: sim.musicLevel,
							active: sim.musicPlaying
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelMeter, {
							label: "Foreground",
							appName: active.foregroundSource?.name ?? "Social",
							output: active.foregroundOutputIntent,
							level: sim.foregroundLevel,
							active: sim.foregroundPlaying
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [policySummary(active), " — preview simulation. Scrolling keeps music on; Watch Mode reduces it."]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "start-music",
							type: "button",
							onClick: () => {
								setActiveSplit(active.id);
								startMusic();
							},
							className: "min-h-12 rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg transition-transform duration-150 active:scale-[0.98]",
							children: "Start Music"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "start-foreground",
							type: "button",
							onClick: () => void startForeground(),
							className: "min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]",
							children: "Start Foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "watch-mode",
							type: "button",
							onClick: () => void simulateWatchMode(),
							className: "min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]",
							children: "Simulate Watch Mode"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "restore-split",
							type: "button",
							onClick: () => void restoreSplit(),
							className: "min-h-12 rounded-lg border border-border-strong px-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98]",
							children: "Restore"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "stop-foreground",
							type: "button",
							onClick: () => void stopForeground(),
							className: "min-h-12 rounded-lg border border-border bg-surface px-3 text-sm font-medium sm:col-span-2",
							children: "Stop Foreground"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitDiagram, { split: active }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/splits/new",
					search: { edit: active.id },
					className: "flex min-h-12 items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium",
					children: "Edit Split"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No two-sided Split yet. Add one to name music and social sources."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				id: "add-split-home",
				to: "/splits/new",
				search: { edit: void 0 },
				className: "flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-medium text-primary-fg transition-transform duration-150 active:scale-[0.98]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "Add Split"]
			})
		]
	});
}
//#endregion
export { Home as component };
