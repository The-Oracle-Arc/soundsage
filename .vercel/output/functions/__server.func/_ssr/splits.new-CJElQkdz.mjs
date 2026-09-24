import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as Route, r as cn } from "./router-CKVk0PkF.mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
import { a as lookupCapability } from "./registry-nKI8uy4V.mjs";
import { a as OUTPUT_INTENT_LABELS, b as splitIsSavable, c as TRIGGER_LABELS, f as evaluateSplit, g as outputIntentLabel, i as OUTPUT_INTENTS, l as createId, m as intentCheckSummary, n as MUSIC_CATALOG, p as evaluateTwoSidedIntent, r as MUSIC_POLICY_LABELS, s as SOCIAL_CATALOG, t as FOREGROUND_POLICY_LABELS, u as deriveActions, x as useSage, y as sourceById } from "./app-store-IP-6a6X2.mjs";
import { t as SplitDiagram } from "./split-diagram-CDX6lEbX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/splits.new-CJElQkdz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MUSIC_POLICIES = [
	"keep_normal",
	"reduce",
	"duck",
	"pause"
];
var FG_POLICIES = [
	"suppressed",
	"low",
	"normal_when_foreground",
	"always_normal"
];
function AddSplitPage() {
	const navigate = useNavigate();
	const { edit } = Route.useSearch();
	const splits = useSage((s) => s.splits);
	const addSplit = useSage((s) => s.addSplit);
	const updateSplit = useSage((s) => s.updateSplit);
	const existing = splits.find((s) => s.id === edit);
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "Audio Split");
	const [musicApp, setMusicApp] = (0, import_react.useState)(existing?.musicSource?.appId ?? "spotify");
	const [musicOut, setMusicOut] = (0, import_react.useState)(existing?.musicOutputIntent ?? "bluetooth");
	const [socialApp, setSocialApp] = (0, import_react.useState)(existing?.foregroundSource?.appId ?? "tiktok");
	const [socialOut, setSocialOut] = (0, import_react.useState)(existing?.foregroundOutputIntent ?? "speaker");
	const [musicPolicy, setMusicPolicy] = (0, import_react.useState)(existing?.musicPolicy ?? "duck");
	const [fgPolicy, setFgPolicy] = (0, import_react.useState)(existing?.foregroundPolicy ?? "normal_when_foreground");
	const [reduce, setReduce] = (0, import_react.useState)(existing?.musicReduceLevel ?? .4);
	const [restore, setRestore] = (0, import_react.useState)(existing?.restorePolicy ?? "restore_sounds_sage_session");
	const [priority, setPriority] = (0, import_react.useState)(existing?.priority ?? "normal");
	const draft = (0, import_react.useMemo)(() => {
		const split = {
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
			trigger: {
				kind: "manual",
				label: TRIGGER_LABELS.manual
			},
			conditions: [{ kind: "always" }],
			actions: [],
			exitCondition: {
				kind: "manual",
				label: TRIGGER_LABELS.manual
			},
			restorePolicy: restore,
			priority,
			capabilityResults: [],
			createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
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
		priority
	]);
	const results = evaluateSplit(draft);
	const savable = splitIsSavable(results, draft);
	const intent = evaluateTwoSidedIntent(draft);
	function save() {
		if (!savable) return;
		if (existing) updateSplit(existing.id, draft);
		else if (!addSplit(draft).ok) return;
		navigate({ to: "/splits" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/splits",
					className: "inline-flex min-h-11 items-center gap-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Splits"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs font-medium uppercase tracking-[0.22em] text-muted",
					children: existing ? "Edit pairing" : "New pairing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl leading-none",
					children: "Add Audio Split"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-[0.16em] text-muted",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "split-name",
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-fg outline-none ring-ring focus:ring-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 1,
				title: "Music app",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "music-app",
					value: musicApp,
					onChange: (e) => setMusicApp(e.target.value),
					className: "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm",
					children: MUSIC_CATALOG.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: app.appId,
						children: app.name
					}, app.appId))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Intended source. Not a stream tap."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 2,
				title: "Music output",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "music-output",
					value: musicOut,
					onChange: (e) => setMusicOut(e.target.value),
					className: "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm",
					children: OUTPUT_INTENTS.map((intent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: intent,
						children: OUTPUT_INTENT_LABELS[intent]
					}, intent))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"Requested: ",
						outputIntentLabel(musicOut),
						". Actual iOS route is one system output."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				n: 3,
				title: "Social / video app",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "social-app",
					value: socialApp,
					onChange: (e) => setSocialApp(e.target.value),
					className: "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm",
					children: SOCIAL_CATALOG.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: app.appId,
						children: app.name
					}, app.appId))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				n: 4,
				title: "Social output",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "social-output",
					value: socialOut,
					onChange: (e) => setSocialOut(e.target.value),
					className: "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm",
					children: OUTPUT_INTENTS.map((intent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: intent,
						children: OUTPUT_INTENT_LABELS[intent]
					}, intent))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 5,
				title: "When social audio plays",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: MUSIC_POLICIES.map((policy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioRow, {
						name: "music-policy",
						checked: musicPolicy === policy,
						onChange: () => setMusicPolicy(policy),
						label: MUSIC_POLICY_LABELS[policy]
					}, policy))
				}), (musicPolicy === "reduce" || musicPolicy === "duck") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted",
						children: [
							"Music level while watching (",
							Math.round(reduce * 100),
							"%)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "reduce-level",
						type: "range",
						min: .1,
						max: .8,
						step: .05,
						value: reduce,
						onChange: (e) => setReduce(Number(e.target.value)),
						className: "mt-2 w-full accent-primary"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				n: 6,
				title: "Social audio",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: FG_POLICIES.map((policy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioRow, {
						name: "fg-policy",
						checked: fgPolicy === policy,
						onChange: () => setFgPolicy(policy),
						label: FOREGROUND_POLICY_LABELS[policy]
					}, policy))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 7,
				title: "When foreground audio ends",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioRow, {
						name: "restore",
						checked: restore === "restore_sounds_sage_session",
						onChange: () => setRestore("restore_sounds_sage_session"),
						label: "Restore previous music state"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioRow, {
						name: "restore",
						checked: restore === "none",
						onChange: () => setRestore("none"),
						label: "Keep current state"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Preview restores simulated levels. Native iOS restores Sounds Sage’s session only — not another app’s private volume."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				n: 8,
				title: "Priority",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						"low",
						"normal",
						"high",
						"critical"
					].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPriority(level),
						className: cn("min-h-11 rounded-lg border text-xs capitalize", priority === level ? "border-fg bg-fg text-bg" : "border-border bg-surface text-muted"),
						children: level
					}, level))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitDiagram, { split: draft }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 9,
				title: "Capability check",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3 rounded-xl border border-border bg-surface p-5",
						children: intentCheckSummary(draft).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: row.status })]
						}, row.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3 rounded-xl border border-border bg-surface p-5",
						children: results.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: lookupCapability(result.capabilityId).name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: result.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-muted",
									children: result.explanation
								}),
								result.fallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-partial",
									children: ["Fallback: ", result.fallback]
								}) : null
							]
						}, result.capabilityId))
					}),
					intent.some((r) => r.status === "UNSUPPORTED") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-unsupported",
						children: "This Split can be saved as your intended pairing. Unsupported native behavior will not run on iPhone."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				id: "save-split",
				type: "button",
				onClick: save,
				disabled: !savable,
				className: "min-h-14 rounded-xl bg-primary text-sm font-medium text-primary-fg disabled:cursor-not-allowed disabled:opacity-40",
				children: "Save Split"
			})
		]
	});
}
function Step({ n, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-display text-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-2 text-sm font-sans text-muted",
				children: ["Step ", n]
			}), title]
		}), children]
	});
}
function RadioRow({ name, checked, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-12 items-center gap-3 rounded-lg border border-border bg-surface px-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "radio",
			name,
			checked,
			onChange
		}), label]
	});
}
//#endregion
export { AddSplitPage as component };
