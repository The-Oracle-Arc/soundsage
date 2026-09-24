import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./router-CKVk0PkF.mjs";
import { a as OUTPUT_INTENT_LABELS, r as MUSIC_POLICY_LABELS, t as FOREGROUND_POLICY_LABELS } from "./app-store-IP-6a6X2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/split-diagram-CDX6lEbX.js
var import_jsx_runtime = require_jsx_runtime();
function SplitDiagram({ split, className }) {
	const music = split.musicSource?.name ?? "Music";
	const foreground = split.foregroundSource?.name ?? "Foreground";
	const musicOut = split.musicOutputIntent ? OUTPUT_INTENT_LABELS[split.musicOutputIntent] : "System";
	const fgOut = split.foregroundOutputIntent ? OUTPUT_INTENT_LABELS[split.foregroundOutputIntent] : "System";
	const policy = split.musicPolicy ? MUSIC_POLICY_LABELS[split.musicPolicy] : "Mix / duck";
	const fgPolicy = split.foregroundPolicy ? FOREGROUND_POLICY_LABELS[split.foregroundPolicy] : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border border-border bg-surface p-5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs font-medium uppercase tracking-[0.2em] text-muted",
				children: "Audio Split"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-5 w-px bg-border-strong" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-stretch gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Channel, {
						title: "Music",
						app: music,
						output: musicOut
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-px bg-border-strong" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Channel, {
						title: "Foreground",
						app: foreground,
						output: fgOut
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-5 w-px bg-border-strong" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 px-3 py-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-muted",
						children: "Split policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-fg",
						children: policy
					}),
					fgPolicy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: ["Foreground: ", fgPolicy]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-subtle",
						children: split.restorePolicy === "none" ? "Keep current state" : "Restore previous music state"
					})
				]
			})
		]
	});
}
function Channel({ title, app, output }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface-2 px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-medium leading-tight",
				children: app
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: output
			})
		]
	});
}
//#endregion
export { SplitDiagram as t };
