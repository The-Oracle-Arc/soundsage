import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./router-CKVk0PkF.mjs";
import { o as PROFILE_DEFINITIONS, x as useSage } from "./app-store-IP-6a6X2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profiles-Cp19FS5Y.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilesPage() {
	const { profileId, setProfile } = useSage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Presets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Profiles"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Profiles are Splits — the same two-sided pairing and the same engine. Smart, Music Focus, Mix, and Custom are configurations, not a second mixer."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: PROFILE_DEFINITIONS.map((profile) => {
				const active = profile.id === profileId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void setProfile(profile.id),
					className: cn("w-full rounded-xl border p-5 text-left transition-transform duration-150 active:scale-[0.99]", active ? "border-fg bg-surface" : "border-border bg-surface-2"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: profile.name
							}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-wide text-primary",
								children: "Active"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg",
							children: profile.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: profile.explanation
						})
					]
				}) }, profile.id);
			})
		})]
	});
}
//#endregion
export { ProfilesPage as component };
