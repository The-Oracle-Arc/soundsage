import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as engine, x as useSage } from "./app-store-IP-6a6X2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnostics-jJg3nvJk.js
var import_jsx_runtime = require_jsx_runtime();
function DiagnosticsPage() {
	useSage((s) => s.observation);
	const events = engine.events;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Engine"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Diagnostics"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Workflow log for this device. These events do not prove Bluetooth, AirPods, or call interruption behavior."
			})
		] }), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No events yet. Play the tone or change a profile."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-3",
			children: events.map((event, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] text-subtle",
					children: [
						event.lifecycle ?? "log",
						" · ",
						event.at
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed",
					children: event.message
				})]
			}, `${event.at}-${index}`))
		})]
	});
}
//#endregion
export { DiagnosticsPage as component };
