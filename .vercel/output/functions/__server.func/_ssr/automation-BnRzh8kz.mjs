import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/automation-BnRzh8kz.js
var import_jsx_runtime = require_jsx_runtime();
var APP_INTENTS = [
	{
		id: "start_split",
		title: "Start Split",
		summary: "Run a named Split through the workflow engine.",
		swiftType: "StartSplitIntent",
		status: "SUPPORTED"
	},
	{
		id: "stop_split",
		title: "Stop Split",
		summary: "Exit a Split and restore Sounds Sage session state.",
		swiftType: "StopSplitIntent",
		status: "SUPPORTED"
	},
	{
		id: "enable_split",
		title: "Enable Split",
		summary: "Mark a Split enabled without executing it.",
		swiftType: "EnableSplitIntent",
		status: "SUPPORTED"
	},
	{
		id: "disable_split",
		title: "Disable Split",
		summary: "Disable a Split so triggers skip it.",
		swiftType: "DisableSplitIntent",
		status: "SUPPORTED"
	},
	{
		id: "activate_profile",
		title: "Activate Profile",
		summary: "Activate Smart, Music Focus, Mix, or Custom.",
		swiftType: "ActivateProfileIntent",
		status: "SUPPORTED"
	},
	{
		id: "activate_music_focus",
		title: "Activate Music Focus",
		summary: "Exclusive Sounds Sage playback session.",
		swiftType: "ActivateMusicFocusIntent",
		status: "SUPPORTED"
	},
	{
		id: "activate_mix",
		title: "Activate Mix",
		summary: "mixWithOthers for Sounds Sage audio.",
		swiftType: "ActivateMixIntent",
		status: "SUPPORTED"
	},
	{
		id: "activate_smart",
		title: "Activate Smart",
		summary: "Profile that switches Mix and exclusive using the other-audio boolean.",
		swiftType: "ActivateSmartIntent",
		status: "SUPPORTED"
	},
	{
		id: "activate_custom",
		title: "Activate Custom",
		summary: "Use only user Splits.",
		swiftType: "ActivateCustomIntent",
		status: "SUPPORTED"
	}
];
function AutomationPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
					children: "Shortcuts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl leading-none",
					children: "App Intents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "These intents ship in the native target. Sounds Sage remains useful without Shortcuts."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: APP_INTENTS.map((intent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: intent.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: intent.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: intent.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-[11px] text-subtle",
							children: intent.swiftType
						})
					]
				}, intent.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Device volume recipe"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Shortcuts can run Set Volume when an app opens. That changes the one system media volume, including background music. It is not TikTok volume. Offer it as a recipe, never as a fake per-app fader."
				})]
			})
		]
	});
}
//#endregion
export { AutomationPage as component };
