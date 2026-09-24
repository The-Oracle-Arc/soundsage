import type { RoutePort } from "../models.ts";

export interface RouteState {
  intent: RoutePort | "user_picker" | "system_default";
  actual: RoutePort;
  available: RoutePort[];
  applied: boolean;
  reason: string;
}

export function describePort(port: RoutePort) {
  switch (port) {
    case "speaker":
      return "iPhone Speaker";
    case "receiver":
      return "Receiver";
    case "headphones":
      return "Wired Headphones";
    case "bluetooth_a2dp":
      return "Bluetooth";
    case "bluetooth_hfp":
      return "Bluetooth (calls)";
    case "airplay":
      return "AirPlay";
    case "usb":
      return "USB Audio";
    case "hdmi":
      return "HDMI";
    case "car_audio":
      return "Car Audio";
    default:
      return "Unknown";
  }
}

export function isAirPodsLike(port: RoutePort) {
  return port === "bluetooth_a2dp" || port === "bluetooth_hfp";
}

export function airPodsLabel(port: RoutePort) {
  if (port === "bluetooth_a2dp") return "AirPods / Bluetooth";
  if (port === "bluetooth_hfp") return "AirPods (call quality)";
  return describePort(port);
}

export function reconcileRoute(intent: RouteState["intent"], actual: RoutePort): RouteState {
  if (intent === "system_default" || intent === "user_picker") {
    return {
      intent,
      actual,
      available: [],
      applied: true,
      reason: "System or user selected the output. Sounds Sage did not silently reassign other apps.",
    };
  }
  if (intent === actual) {
    return {
      intent,
      actual,
      available: [],
      applied: true,
      reason: "Requested route matches the current system route.",
    };
  }
  return {
    intent,
    actual,
    available: [],
    applied: false,
    reason:
      "iOS did not apply the requested route. Sounds Sage will not pretend it did. Use the output picker.",
  };
}
