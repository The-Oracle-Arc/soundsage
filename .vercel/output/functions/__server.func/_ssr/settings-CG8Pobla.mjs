import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as useSage } from "./app-store-IP-6a6X2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CG8Pobla.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { observation, simulateInterruption, setOwnGain } = useSage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Sounds Sage"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Settings"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted",
						children: "Audio behavior"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Sounds Sage gain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: observation.ownGain,
								onChange: (e) => void setOwnGain(Number(e.target.value)),
								className: "mt-3 w-full accent-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "Own player volume relative to the system. Not another app’s fader."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void simulateInterruption(!observation.interruptionActive),
						className: "min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm",
						children: observation.interruptionActive ? "End simulated interruption" : "Simulate phone interruption"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted",
						children: "Automation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "App Intents on iPhone: start or stop a Split, activate Smart, Music Focus, Mix, or Custom. Sounds Sage does not watch other apps in the background. A Shortcuts App Opened recipe can set device volume — that fader is global."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/automation",
						className: "text-sm text-primary underline-offset-4 hover:underline",
						children: "App Intents and Shortcuts"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.16em] text-muted",
					children: "Safari"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/safari",
					className: "text-sm text-primary underline-offset-4 hover:underline",
					children: "Webpage companion (not native apps)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.16em] text-muted",
					children: "Capability information"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/capabilities",
					className: "text-sm text-primary underline-offset-4 hover:underline",
					children: "Full registry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted",
						children: "Diagnostics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Platform: ",
							observation.platform.replace("_", " "),
							" · Route: ",
							observation.currentRoute,
							" · Mix: ",
							observation.mixPolicy
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/diagnostics",
						className: "text-sm text-primary underline-offset-4 hover:underline",
						children: "Workflow log"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] uppercase tracking-[0.16em] text-muted",
					children: "Privacy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm leading-relaxed text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sounds Sage does not record microphone audio." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sounds Sage does not upload audio recordings." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sounds Sage does not intercept private audio streams." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Splits, profiles, and preferences stay on this device." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No account. No cloud processing." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted",
						children: "About"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Native product architecture lives in the SoundsSage Swift package. This preview runs the same workflow, capability, mixer, router, and priority models. Compile and test session behavior in Xcode on a physical iPhone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/native",
						className: "text-sm text-primary underline-offset-4 hover:underline",
						children: "Native iOS status"
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
