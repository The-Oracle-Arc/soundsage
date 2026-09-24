import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CapabilityBadge } from "./badge-DeE5SvS-.mjs";
import { t as CAPABILITY_REGISTRY } from "./registry-nKI8uy4V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/capabilities-CjCg-qNA.js
var import_jsx_runtime = require_jsx_runtime();
function CapabilitiesPage() {
	const records = Object.values(CAPABILITY_REGISTRY);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Registry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Capabilities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Public iOS APIs only. Unsupported actions are refused. Device rows still need a physical iPhone — this list is the product contract, not a hardware certificate."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: records.map((cap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: cap.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapabilityBadge, { status: cap.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: cap.explanation
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-[11px] text-subtle",
						children: cap.requiredApi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted",
						children: cap.limitations
					}),
					cap.fallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-partial",
						children: ["Fallback: ", cap.fallback]
					}) : null
				]
			}, cap.id))
		})]
	});
}
//#endregion
export { CapabilitiesPage as component };
