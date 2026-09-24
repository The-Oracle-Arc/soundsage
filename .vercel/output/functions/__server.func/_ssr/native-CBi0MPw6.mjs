import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/native-CBi0MPw6.js
var import_jsx_runtime = require_jsx_runtime();
function NativePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
				children: "Xcode"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl leading-none",
				children: "Native iOS"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "This builder cannot compile Swift. The product lives in the SoundsSage folder as a native architecture for Xcode. This web surface is a prototype of the same models — not a substitute for AVAudioSession."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-3 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open SoundsSage/README.md on a Mac." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Create an iOS app target, enable Audio, AirPlay, and Picture in Picture." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Wire IOSAudioAdapter to AVAudioSession. Do not use private APIs." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Test speaker, wired, Bluetooth, AirPods, AirPlay, calls, Siri, lock, and background on hardware." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Safari Web Extension is a later phase and cannot control native apps." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Still required"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Mac, Xcode, Apple Developer Program, physical iPhones, AirPods or Bluetooth headphones, and the commercial apps you want to observe (Music, Spotify, TikTok, YouTube). Simulator is not enough."
				})]
			})
		]
	});
}
//#endregion
export { NativePage as component };
