import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./router-CKVk0PkF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DeE5SvS-.js
var import_jsx_runtime = require_jsx_runtime();
var styles = {
	SUPPORTED: "bg-supported/15 text-supported",
	PARTIALLY_SUPPORTED: "bg-partial/15 text-partial",
	UNSUPPORTED: "bg-unsupported/15 text-unsupported",
	UNVERIFIED: "bg-unverified/15 text-unverified"
};
var labels = {
	SUPPORTED: "Supported",
	PARTIALLY_SUPPORTED: "Partially supported",
	UNSUPPORTED: "Not available on iOS",
	UNVERIFIED: "Unverified"
};
function CapabilityBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide", styles[status], className),
		children: labels[status]
	});
}
//#endregion
export { CapabilityBadge as t };
