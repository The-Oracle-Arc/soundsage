import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/safari-CyNowVVD.js
var import_jsx_runtime = require_jsx_runtime();
function SafariPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Phase 11"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Safari"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "Optional Safari Web Extension for granted websites. Isolated from the native audio engine."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-medium",
						children: "Mute or pause page media"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: "PARTIALLY_SUPPORTED" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Content scripts may mute or pause audio and video elements. iOS often ignores element volume. This does not control native apps and does not pick a speaker versus Bluetooth."
				})]
			})
		]
	});
}
//#endregion
export { SafariPage as component };
