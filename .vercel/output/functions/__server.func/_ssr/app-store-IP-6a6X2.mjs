import { a as lookupCapability, i as evaluateAction, n as TRIGGER_CAPABILITY, r as canExecute } from "./registry-nKI8uy4V.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-store-IP-6a6X2.js
function clamp(n) {
	return Math.min(1, Math.max(0, n));
}
var WebPrototypeAdapter = class {
	policy = "mix";
	ownGain = .6;
	playing = false;
	speakerOverride = false;
	interruptionActive = false;
	otherAudioPlaying = false;
	duckUntil = null;
	lastNotifyOthers = false;
	wantsRoutePicker = false;
	wantsVolumeUi = false;
	duckWarning = null;
	ctx = null;
	gain = null;
	osc = null;
	observe() {
		if (this.duckUntil && Date.now() > this.duckUntil && this.policy === "duck") {
			this.policy = "mix";
			this.duckUntil = null;
			this.duckWarning = "Temporary duck ended. Apple does not allow persistent ducking.";
		}
		return {
			otherAudioPlaying: this.otherAudioPlaying,
			secondaryAudioShouldBeSilenced: this.otherAudioPlaying && this.policy === "exclusive",
			currentRoute: "speaker",
			availableRoutes: ["speaker"],
			ownPlaying: this.playing,
			ownGain: this.ownGain,
			mixPolicy: this.policy,
			speakerOverride: this.speakerOverride,
			interruptionActive: this.interruptionActive,
			platform: "web_prototype"
		};
	}
	async configureSession(policy) {
		this.policy = policy;
	}
	async activateSession() {
		if (this.playing) return;
		await this.playOwn();
	}
	async deactivateSession(notifyOthers) {
		this.lastNotifyOthers = notifyOthers;
		await this.stopOwn();
	}
	async applyMixPolicy(policy, options) {
		this.policy = policy;
		this.duckWarning = null;
		if (policy === "duck" && options.duckTemporary) {
			this.duckUntil = Date.now() + 4e3;
			this.duckWarning = "Duck is active for a few seconds only — Apple’s documented limit. This is not a per-app fader.";
		} else this.duckUntil = null;
	}
	async overrideOutput(port) {
		this.speakerOverride = port === "speaker";
	}
	async setOwnGain(gain, fadeMs) {
		const next = clamp(gain);
		if (this.gain && fadeMs > 0 && this.ctx) {
			const t = this.ctx.currentTime;
			this.gain.gain.cancelScheduledValues(t);
			this.gain.gain.setValueAtTime(this.gain.gain.value, t);
			this.gain.gain.linearRampToValueAtTime(next * .08, t + fadeMs / 1e3);
		} else if (this.gain) this.gain.gain.value = next * .08;
		this.ownGain = next;
	}
	async ensureGraph() {
		if (this.ctx && this.gain && this.osc) return;
		const ctx = new AudioContext();
		const gain = ctx.createGain();
		gain.gain.value = this.ownGain * .08;
		const osc = ctx.createOscillator();
		osc.type = "sine";
		osc.frequency.value = 220;
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		this.ctx = ctx;
		this.gain = gain;
		this.osc = osc;
	}
	async playOwn() {
		await this.ensureGraph();
		if (this.ctx?.state === "suspended") await this.ctx.resume();
		this.playing = true;
	}
	async stopOwn() {
		if (this.ctx?.state === "running") await this.ctx.suspend();
		this.playing = false;
	}
	requestRoutePicker() {
		this.wantsRoutePicker = true;
	}
	requestVolumeUi() {
		this.wantsVolumeUi = true;
	}
	async restore(snapshot, options) {
		this.policy = snapshot.mixPolicy;
		this.speakerOverride = snapshot.speakerOverride;
		this.lastNotifyOthers = options.notifyOthers;
		await this.setOwnGain(snapshot.ownGain, 180);
		if (snapshot.playing) await this.playOwn();
		else await this.stopOwn();
	}
	simulateOtherAudio(on) {
		this.otherAudioPlaying = on;
	}
	simulateInterruption(on) {
		this.interruptionActive = on;
		if (on) this.stopOwn();
	}
};
var webAdapter = new WebPrototypeAdapter();
var SplitSimulator = class {
	musicLevel = 0;
	foregroundLevel = 0;
	running = false;
	ctx = null;
	musicGain = null;
	foregroundGain = null;
	musicOsc = null;
	foregroundOsc = null;
	async ensure() {
		if (this.ctx && this.musicGain && this.foregroundGain) return;
		const ctx = new AudioContext();
		const musicGain = ctx.createGain();
		const foregroundGain = ctx.createGain();
		musicGain.gain.value = 0;
		foregroundGain.gain.value = 0;
		const musicOsc = ctx.createOscillator();
		const foregroundOsc = ctx.createOscillator();
		musicOsc.type = "sine";
		musicOsc.frequency.value = 196;
		foregroundOsc.type = "triangle";
		foregroundOsc.frequency.value = 784;
		musicOsc.connect(musicGain);
		foregroundOsc.connect(foregroundGain);
		musicGain.connect(ctx.destination);
		foregroundGain.connect(ctx.destination);
		musicOsc.start();
		foregroundOsc.start();
		this.ctx = ctx;
		this.musicGain = musicGain;
		this.foregroundGain = foregroundGain;
		this.musicOsc = musicOsc;
		this.foregroundOsc = foregroundOsc;
	}
	async setLevels(music, foreground, fadeMs = 320) {
		this.musicLevel = music;
		this.foregroundLevel = foreground;
		if (!this.running && music <= 0 && foreground <= 0) return;
		await this.ensure();
		if (this.ctx?.state === "suspended") await this.ctx.resume();
		const t = this.ctx.currentTime;
		const seconds = Math.max(.04, fadeMs / 1e3);
		if (this.musicGain) {
			this.musicGain.gain.cancelScheduledValues(t);
			this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
			this.musicGain.gain.linearRampToValueAtTime(music * .07, t + seconds);
		}
		if (this.foregroundGain) {
			this.foregroundGain.gain.cancelScheduledValues(t);
			this.foregroundGain.gain.setValueAtTime(this.foregroundGain.gain.value, t);
			this.foregroundGain.gain.linearRampToValueAtTime(foreground * .055, t + seconds);
		}
		this.running = music > 0 || foreground > 0;
	}
	async stop() {
		await this.setLevels(0, 0, 180);
		if (this.ctx?.state === "running") await this.ctx.suspend();
		this.running = false;
	}
};
var splitSimulator = new SplitSimulator();
var PRIORITY_RANK = {
	low: 1,
	normal: 2,
	high: 3,
	critical: 4
};
var TRIGGER_LABELS = {
	sounds_sage_playback_started: "Sounds Sage playback starts",
	sounds_sage_playback_stopped: "Sounds Sage playback stops",
	other_audio_started: "Other audio starts (unidentified)",
	other_audio_stopped: "Other audio stops",
	route_changed: "Output route changes",
	interruption_began: "Audio interruption begins",
	interruption_ended: "Audio interruption ends",
	session_activated: "Sounds Sage session activates",
	session_deactivated: "Sounds Sage session deactivates",
	profile_activated: "A profile is activated",
	manual: "I start this Split",
	app_opened: "Another app opens"
};
var MUSIC_POLICY_LABELS = {
	keep_normal: "Keep music normal",
	reduce: "Reduce music",
	duck: "Duck music",
	pause: "Pause music"
};
var FOREGROUND_POLICY_LABELS = {
	suppressed: "Suppressed",
	low: "Low",
	normal_when_foreground: "Normal when foreground",
	always_normal: "Always normal"
};
var OUTPUT_INTENT_LABELS = {
	bluetooth: "Bluetooth",
	airpods: "AirPods",
	headphones: "Wired Headphones",
	airplay: "AirPlay",
	speaker: "iPhone Speaker"
};
function createId(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function isTwoSided(split) {
	return Boolean(split.musicSource && split.foregroundSource);
}
function worstStatus(results) {
	if (results.some((r) => r.status === "UNSUPPORTED")) return "UNSUPPORTED";
	if (results.some((r) => r.status === "PARTIALLY_SUPPORTED")) return "PARTIALLY_SUPPORTED";
	if (results.some((r) => r.status === "UNVERIFIED")) return "UNVERIFIED";
	return "SUPPORTED";
}
function policyFromActions(actions) {
	const kinds = new Set(actions.map((a) => a.kind));
	let policy = "exclusive";
	let duckTemporary = false;
	if (kinds.has("duck_others")) {
		policy = "duck";
		duckTemporary = true;
	} else if (kinds.has("interrupt_spoken_and_mix")) policy = "interrupt_spoken_and_mix";
	else if (kinds.has("mix_with_others")) policy = "mix";
	else if (kinds.has("exclusive_playback")) policy = "exclusive";
	const gainAction = actions.find((a) => a.kind === "set_own_gain");
	const fadeAction = actions.find((a) => a.kind === "fade_own_audio");
	return {
		policy,
		ownGain: gainAction?.ownGain,
		fadeMs: fadeAction?.fadeMs,
		duckTemporary
	};
}
var EXCLUSIVE_GROUP = [
	"exclusive_playback",
	"mix_with_others",
	"duck_others",
	"interrupt_spoken_and_mix"
];
function comparePriority(a, b) {
	return PRIORITY_RANK[b] - PRIORITY_RANK[a];
}
function resolveConflicts(candidates) {
	const sorted = [...candidates].sort((a, b) => {
		const p = comparePriority(a.priority, b.priority);
		if (p !== 0) return p;
		return a.createdAt.localeCompare(b.createdAt);
	});
	const selected = [];
	const suppressed = [];
	const takenExclusive = /* @__PURE__ */ new Set();
	const actions = [];
	for (const split of sorted) {
		const exclusiveActions = split.actions.filter((a) => EXCLUSIVE_GROUP.includes(a.kind));
		const conflict = exclusiveActions.find((a) => {
			if (takenExclusive.size === 0) return false;
			if (takenExclusive.has(a.kind) && a.kind === "duck_others") return false;
			return [...takenExclusive].some((taken) => taken !== a.kind);
		});
		if (conflict && takenExclusive.size > 0) {
			suppressed.push({
				split,
				reason: `Mix policy already claimed by a higher-priority Split. ${conflict.kind} was not applied.`
			});
			const nonPolicy = split.actions.filter((a) => !EXCLUSIVE_GROUP.includes(a.kind));
			if (nonPolicy.length === 0) continue;
			selected.push({
				...split,
				actions: nonPolicy
			});
			for (const action of nonPolicy) actions.push({
				splitId: split.id,
				kind: action.kind
			});
			continue;
		}
		selected.push(split);
		for (const action of exclusiveActions) takenExclusive.add(action.kind);
		for (const action of split.actions) actions.push({
			splitId: split.id,
			kind: action.kind
		});
	}
	return {
		selected,
		suppressed,
		actions
	};
}
function result(id, extra) {
	const cap = lookupCapability(id);
	return {
		capabilityId: cap.id,
		status: cap.status,
		explanation: cap.explanation,
		fallback: cap.fallback,
		executed: false,
		usedFallback: false,
		...extra
	};
}
function deriveActions(split) {
	if (!isTwoSided(split)) return split.actions;
	const actions = [];
	const policy = split.musicPolicy ?? "keep_normal";
	if (policy === "keep_normal") actions.push({ kind: "mix_with_others" });
	if (policy === "duck" || policy === "reduce") actions.push({ kind: "duck_others" });
	if (policy === "pause") actions.push({ kind: "interrupt_spoken_and_mix" });
	if (split.profileId === "music_focus") actions.push({ kind: "exclusive_playback" });
	actions.push({ kind: "show_route_picker" });
	if (split.musicOutputIntent && split.foregroundOutputIntent && split.musicOutputIntent !== split.foregroundOutputIntent) actions.push({ kind: "route_app_independently" });
	if (policy === "reduce" || policy === "duck" || policy === "pause" || split.foregroundPolicy === "suppressed" || split.foregroundPolicy === "low") actions.push({ kind: "set_third_party_volume" });
	if (split.musicSource?.appId !== "sounds_sage") actions.push({ kind: "identify_source_app" });
	if (split.restorePolicy === "restore_sounds_sage_session") actions.push({ kind: "notify_others_on_deactivation" });
	return actions;
}
function evaluateTwoSidedIntent(split) {
	if (!isTwoSided(split)) return [];
	const results = [
		result("select_music_app"),
		result("select_foreground_app"),
		result("detect_other_audio")
	];
	const musicOut = split.musicOutputIntent;
	const fgOut = split.foregroundOutputIntent;
	results.push(result("output_intent_system_route"));
	if (musicOut === "bluetooth" || fgOut === "bluetooth") results.push(result("bluetooth_route"));
	if (musicOut === "airpods" || fgOut === "airpods") results.push(result("airpods_route"));
	if (musicOut === "airplay" || fgOut === "airplay") results.push(result("airplay_route"));
	if (musicOut && fgOut && musicOut !== fgOut) results.push(result("route_app_independently"));
	results.push(result("multi_route_own"));
	const policy = split.musicPolicy ?? "keep_normal";
	if (policy === "keep_normal") results.push(result("mix_with_others"));
	if (policy === "duck" || policy === "reduce") results.push(result("duck_others"));
	if (policy === "pause") results.push(result("interrupt_spoken_and_mix"));
	if (policy === "reduce" || policy === "duck" || policy === "pause" || split.foregroundPolicy === "suppressed" || split.foregroundPolicy === "low") results.push(result("set_third_party_volume"));
	results.push(result("mix_third_party_streams"));
	results.push(result("capture_other_app_audio"));
	results.push(result("restore_third_party_volume"));
	if (split.restorePolicy === "restore_sounds_sage_session") results.push(result("notify_others_on_deactivation"));
	results.push(result("identify_source_app"));
	return uniqueResults(results);
}
function uniqueResults(results) {
	const seen = /* @__PURE__ */ new Set();
	return results.filter((r) => {
		if (seen.has(r.capabilityId)) return false;
		seen.add(r.capabilityId);
		return true;
	});
}
function musicLevelFor(policy, mode, reduce = .4) {
	const level = Math.min(.9, Math.max(.1, reduce));
	if (mode === "idle") return 0;
	if (mode === "music") return 1;
	if (mode === "scrolling") {
		if (policy === "pause") return 1;
		return 1;
	}
	if (policy === "keep_normal") return 1;
	if (policy === "pause") return 0;
	return level;
}
function foregroundLevelFor(policy, mode) {
	if (mode === "idle" || mode === "music") return 0;
	if (mode === "scrolling") {
		if (policy === "always_normal") return 1;
		if (policy === "low") return .25;
		if (policy === "suppressed") return 0;
		return .12;
	}
	if (policy === "suppressed") return 0;
	if (policy === "low") return .4;
	return 1;
}
function simulateLevels(split, mode) {
	const reduce = split.musicReduceLevel ?? .4;
	return {
		music: musicLevelFor(split.musicPolicy, mode, reduce),
		foreground: foregroundLevelFor(split.foregroundPolicy, mode)
	};
}
function policySummary(split) {
	return {
		keep_normal: "Keep music normal",
		reduce: "Reduce music",
		duck: "Duck music",
		pause: "Pause music"
	}[split.musicPolicy ?? "keep_normal"];
}
function outputIntentLabel(intent) {
	switch (intent) {
		case "bluetooth": return "Bluetooth";
		case "airpods": return "AirPods";
		case "headphones": return "Wired Headphones";
		case "airplay": return "AirPlay";
		case "speaker": return "iPhone Speaker";
		default: return "System route";
	}
}
function routeCapability(intent) {
	if (intent === "bluetooth") return "bluetooth_route";
	if (intent === "airpods") return "airpods_route";
	if (intent === "airplay") return "airplay_route";
	if (intent === "speaker") return "output_intent_system_route";
	return "output_intent_system_route";
}
function intentCheckSummary(split) {
	const musicApp = split.musicSource?.name ?? "Music";
	const fgApp = split.foregroundSource?.name ?? "Social";
	const musicOut = outputIntentLabel(split.musicOutputIntent);
	const fgOut = outputIntentLabel(split.foregroundOutputIntent);
	return [
		{
			label: `${musicApp} → ${musicOut}`,
			...result(routeCapability(split.musicOutputIntent))
		},
		{
			label: `${fgApp} → ${fgOut}`,
			...result(routeCapability(split.foregroundOutputIntent))
		},
		{
			label: "Third-party app audio separation",
			...result("mix_third_party_streams")
		},
		{
			label: `Independent ${fgApp} volume`,
			...result("set_third_party_volume")
		},
		{
			label: "Capture another app's audio",
			...result("capture_other_app_audio")
		},
		{
			label: "Mix Sounds Sage with other audio",
			...result("mix_with_others")
		},
		{
			label: "Audio session ducking",
			...result("duck_others")
		},
		{
			label: "Restore another app's private volume",
			...result("restore_third_party_volume")
		}
	];
}
function matchesCondition(condition, obs, profileId) {
	switch (condition.kind) {
		case "always": return true;
		case "other_audio_playing": return obs.otherAudioPlaying;
		case "other_audio_not_playing": return !obs.otherAudioPlaying;
		case "own_audio_playing": return obs.ownPlaying;
		case "route_is": return obs.currentRoute === condition.routePort;
		case "profile_is": return profileId === condition.profileId;
		default: return false;
	}
}
function conditionsPass(split, obs, profileId) {
	if (split.conditions.length === 0) return true;
	return split.conditions.every((c) => matchesCondition(c, obs, profileId));
}
function triggerMatches(split, kind, extras) {
	if (split.trigger.kind !== kind) return false;
	if (split.trigger.profileId && extras?.profileId && split.trigger.profileId !== extras.profileId) return false;
	if (split.trigger.routePort && extras?.routePort && split.trigger.routePort !== extras.routePort) return false;
	return true;
}
function evaluateCapabilities(actions) {
	return actions.map((action) => {
		const cap = evaluateAction(action);
		const executable = canExecute(cap.status);
		return {
			capabilityId: cap.id,
			status: cap.status,
			explanation: cap.explanation,
			fallback: cap.fallback,
			executed: false,
			usedFallback: cap.status === "PARTIALLY_SUPPORTED" && executable
		};
	});
}
function evaluateSplit(split) {
	const intent = evaluateTwoSidedIntent(split);
	const actionResults = evaluateCapabilities(split.actions.length ? split.actions : deriveActions(split));
	const triggerCapId = TRIGGER_CAPABILITY[split.trigger.kind];
	const extra = [];
	if (triggerCapId) {
		const cap = lookupCapability(triggerCapId);
		extra.push({
			capabilityId: cap.id,
			status: cap.status,
			explanation: cap.explanation,
			fallback: cap.fallback,
			executed: false,
			usedFallback: false
		});
	}
	const merged = [
		...intent,
		...extra,
		...actionResults
	];
	const seen = /* @__PURE__ */ new Set();
	return merged.filter((r) => {
		if (seen.has(r.capabilityId)) return false;
		seen.add(r.capabilityId);
		return true;
	});
}
function splitIsSavable(results, split) {
	if (split && isTwoSided(split)) return Boolean(split.name.trim() && split.musicSource && split.foregroundSource);
	return !results.some((r) => r.status === "UNSUPPORTED");
}
function snapshotFrom(obs) {
	return {
		mixPolicy: obs.mixPolicy,
		ownGain: obs.ownGain,
		speakerOverride: obs.speakerOverride,
		playing: obs.ownPlaying,
		capturedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var WorkflowEngine = class {
	instances = /* @__PURE__ */ new Map();
	events = [];
	adapter;
	constructor(adapter) {
		this.adapter = adapter;
	}
	log(message, splitId, lifecycle) {
		this.events.unshift({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			splitId,
			lifecycle,
			message
		});
		this.events = this.events.slice(0, 80);
	}
	getInstance(splitId) {
		return this.instances.get(splitId);
	}
	async handleTrigger(splits, kind, profileId, extras) {
		const obs = this.adapter.observe();
		const matched = splits.filter((s) => s.enabled && triggerMatches(s, kind, extras) && conditionsPass(s, obs, profileId));
		if (matched.length === 0) return [];
		const resolution = resolveConflicts(matched);
		for (const item of resolution.suppressed) this.log(item.reason, item.split.id, "evaluating");
		const ran = [];
		for (const split of resolution.selected) ran.push(await this.execute(split, obs));
		return ran;
	}
	async execute(split, obs) {
		const observation = obs ?? this.adapter.observe();
		const instance = {
			splitId: split.id,
			lifecycle: "triggered",
			snapshot: null,
			results: [],
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.instances.set(split.id, instance);
		instance.lifecycle = "evaluating";
		if (!conditionsPass(split, observation, split.profileId ?? "custom")) {
			instance.lifecycle = "complete";
			instance.completedAt = (/* @__PURE__ */ new Date()).toISOString();
			this.log("Conditions not met.", split.id, "complete");
			return instance;
		}
		instance.lifecycle = "capability_check";
		instance.results = evaluateSplit(split);
		split.capabilityResults = instance.results;
		const blocked = instance.results.filter((r) => r.status === "UNSUPPORTED");
		const twoSided = isTwoSided(split);
		if (blocked.length > 0 && !twoSided) {
			instance.lifecycle = "unsupported";
			instance.error = blocked.map((b) => b.explanation).join(" ");
			this.log(`Split “${split.name}” was not executed. ${blocked.length} unsupported action${blocked.length === 1 ? "" : "s"}.`, split.id, "unsupported");
			return instance;
		}
		instance.snapshot = snapshotFrom(observation);
		instance.lifecycle = "executing";
		try {
			const executable = (split.actions.length ? split.actions : deriveActions(split)).filter((action) => {
				const cap = evaluateAction(action);
				return canExecute(cap.status);
			});
			const command = policyFromActions(executable);
			await this.adapter.applyMixPolicy(command.policy, { duckTemporary: command.duckTemporary });
			if (command.ownGain !== void 0) await this.adapter.setOwnGain(command.ownGain, command.fadeMs ?? 0);
			if (executable.some((a) => a.kind === "override_speaker")) await this.adapter.overrideOutput("speaker");
			if (executable.some((a) => a.kind === "clear_speaker_override")) await this.adapter.overrideOutput("none");
			if (executable.some((a) => a.kind === "show_route_picker")) this.adapter.requestRoutePicker();
			if (executable.some((a) => a.kind === "show_system_volume_ui")) this.adapter.requestVolumeUi();
			if (executable.some((a) => a.kind === "deactivate_session")) await this.adapter.deactivateSession(executable.some((a) => a.kind === "notify_others_on_deactivation"));
			instance.results = instance.results.map((r) => ({
				...r,
				executed: r.status === "SUPPORTED" || r.status === "PARTIALLY_SUPPORTED",
				usedFallback: r.status === "PARTIALLY_SUPPORTED"
			}));
			if (blocked.length > 0) this.log(`Split “${split.name}” is active for supported session policy only. ${blocked.length} native intent${blocked.length === 1 ? "" : "s"} not applied.`, split.id, "active");
			else this.log(`Split “${split.name}” is active.`, split.id, "active");
			instance.lifecycle = "active";
		} catch (error) {
			instance.lifecycle = "error";
			instance.error = error instanceof Error ? error.message : "Audio adapter failed.";
			this.log(instance.error, split.id, "error");
		}
		return instance;
	}
	async exit(split) {
		const instance = this.instances.get(split.id);
		if (!instance || instance.lifecycle !== "active" && instance.lifecycle !== "executing") return instance;
		instance.lifecycle = "exiting";
		if (split.restorePolicy === "none") {
			instance.lifecycle = "complete";
			instance.completedAt = (/* @__PURE__ */ new Date()).toISOString();
			this.log(`Split “${split.name}” ended without restore.`, split.id, "complete");
			return instance;
		}
		instance.lifecycle = "restoring";
		try {
			if (instance.snapshot) await this.adapter.restore(instance.snapshot, { notifyOthers: split.restorePolicy === "notify_others_on_deactivation" });
			instance.lifecycle = "complete";
			instance.completedAt = (/* @__PURE__ */ new Date()).toISOString();
			this.log(`Restored Sounds Sage session state. Third-party private volume is not stored or restored.`, split.id, "complete");
		} catch (error) {
			instance.lifecycle = "error";
			instance.error = error instanceof Error ? error.message : "Restore failed.";
		}
		return instance;
	}
};
var MUSIC_CATALOG = [
	{
		appId: "spotify",
		name: "Spotify",
		category: "music",
		role: "music"
	},
	{
		appId: "apple_music",
		name: "Apple Music",
		category: "music",
		role: "music"
	},
	{
		appId: "youtube_music",
		name: "YouTube Music",
		category: "music",
		role: "music"
	},
	{
		appId: "sounds_sage",
		name: "Sounds Sage",
		category: "music",
		role: "music"
	},
	{
		appId: "other_music",
		name: "Other music source",
		category: "music",
		role: "music"
	}
];
var SOCIAL_CATALOG = [
	{
		appId: "tiktok",
		name: "TikTok",
		category: "social",
		role: "foreground"
	},
	{
		appId: "instagram",
		name: "Instagram",
		category: "social",
		role: "foreground"
	},
	{
		appId: "youtube",
		name: "YouTube",
		category: "social",
		role: "foreground"
	},
	{
		appId: "facebook",
		name: "Facebook",
		category: "social",
		role: "foreground"
	},
	{
		appId: "x",
		name: "X",
		category: "social",
		role: "foreground"
	},
	{
		appId: "other_social",
		name: "Other social / video source",
		category: "social",
		role: "foreground"
	}
];
var OUTPUT_INTENTS = [
	"bluetooth",
	"airpods",
	"headphones",
	"airplay",
	"speaker"
];
function sourceById(id, category) {
	const list = category === "music" ? MUSIC_CATALOG : SOCIAL_CATALOG;
	return list.find((s) => s.appId === id) ?? list[list.length - 1];
}
function stamp(partial) {
	const split = {
		...partial,
		actions: partial.actions ?? [],
		capabilityResults: [],
		createdAt: "2026-01-01T00:00:00.000Z"
	};
	split.actions = deriveActions(split);
	return split;
}
var PROFILE_DEFINITIONS = [
	{
		id: "smart",
		name: "Smart",
		tagline: "Music stays on while you scroll. Watching ducks music and lets social audio through.",
		explanation: "Smart records Spotify + TikTok as intended sources. While scrolling, music stays normal and social audio stays low. Watching ducks music in the preview. Native iOS cannot independently mix those two apps. On iPhone, Sounds Sage can only mix or duck its own session.",
		splits: () => [stamp({
			id: "profile-smart-scroll",
			name: "Smart scroll",
			enabled: true,
			profileId: "smart",
			musicSource: sourceById("spotify", "music"),
			foregroundSource: sourceById("tiktok", "social"),
			musicOutputIntent: "bluetooth",
			foregroundOutputIntent: "speaker",
			musicPolicy: "duck",
			foregroundPolicy: "normal_when_foreground",
			musicReduceLevel: .4,
			trigger: {
				kind: "manual",
				label: "I start this Split"
			},
			conditions: [{ kind: "always" }],
			exitCondition: {
				kind: "manual",
				label: "I start this Split"
			},
			restorePolicy: "restore_sounds_sage_session",
			priority: "normal"
		})]
	},
	{
		id: "music_focus",
		name: "Music Focus",
		tagline: "Music holds the room. Foreground audio ducks it only when you watch.",
		explanation: "Intended pairing: music on Bluetooth, social on speaker, duck music when watching, then restore. Independent routing and third-party volume stay unsupported on stock iOS. Exclusive playback applies only if Sounds Sage itself is playing.",
		splits: () => [stamp({
			id: "profile-music-focus",
			name: "Music Focus",
			enabled: true,
			profileId: "music_focus",
			musicSource: sourceById("spotify", "music"),
			foregroundSource: sourceById("tiktok", "social"),
			musicOutputIntent: "bluetooth",
			foregroundOutputIntent: "speaker",
			musicPolicy: "duck",
			foregroundPolicy: "normal_when_foreground",
			musicReduceLevel: .4,
			trigger: {
				kind: "profile_activated",
				label: "A profile is activated",
				profileId: "music_focus"
			},
			conditions: [{ kind: "always" }],
			exitCondition: {
				kind: "profile_activated",
				label: "Another profile is activated"
			},
			restorePolicy: "restore_sounds_sage_session",
			priority: "high"
		})]
	},
	{
		id: "mix",
		name: "Mix",
		tagline: "Both sides stay audible. One system route on iPhone.",
		explanation: "Keep music normal and let foreground audio play. The preview mixes two tones. Native iOS still has one output route for ordinary apps; mixWithOthers applies to Sounds Sage’s session only.",
		splits: () => [stamp({
			id: "profile-mix",
			name: "Mix",
			enabled: true,
			profileId: "mix",
			musicSource: sourceById("spotify", "music"),
			foregroundSource: sourceById("tiktok", "social"),
			musicOutputIntent: "bluetooth",
			foregroundOutputIntent: "speaker",
			musicPolicy: "keep_normal",
			foregroundPolicy: "always_normal",
			musicReduceLevel: .4,
			trigger: {
				kind: "profile_activated",
				label: "A profile is activated",
				profileId: "mix"
			},
			conditions: [{ kind: "always" }],
			actions: [{ kind: "mix_with_others" }],
			exitCondition: {
				kind: "profile_activated",
				label: "Another profile is activated"
			},
			restorePolicy: "restore_sounds_sage_session",
			priority: "normal"
		})]
	},
	{
		id: "custom",
		name: "Custom",
		tagline: "Your Splits, same engine.",
		explanation: "Custom is not a separate engine. It is whatever two-sided Splits you enable.",
		splits: () => []
	}
];
function profileById(id) {
	return PROFILE_DEFINITIONS.find((p) => p.id === id) ?? PROFILE_DEFINITIONS[3];
}
var engine = new WorkflowEngine(webAdapter);
var idleSim = () => ({
	splitId: null,
	mode: "idle",
	musicPlaying: false,
	foregroundPlaying: false,
	watchMode: false,
	musicLevel: 0,
	foregroundLevel: 0,
	snapshotMusicLevel: 1
});
function enabledSplits(splits, profileId) {
	return splits.filter((s) => s.enabled && (!s.profileId || s.profileId === profileId || s.profileId === "custom"));
}
function firstTwoSided(splits) {
	return splits.find((s) => s.enabled && isTwoSided(s)) ?? splits.find((s) => isTwoSided(s)) ?? splits[0] ?? null;
}
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
function prepareSplit(split) {
	const withActions = {
		...split,
		id: split.id || createId("split"),
		actions: split.actions.length ? split.actions : deriveActions(split)
	};
	return {
		...withActions,
		capabilityResults: evaluateSplit(withActions)
	};
}
async function applySim(split, mode) {
	if (!split) {
		await splitSimulator.stop();
		return idleSim();
	}
	const levels = simulateLevels(split, mode);
	await splitSimulator.setLevels(levels.music, levels.foreground);
	return {
		splitId: split.id,
		mode,
		musicPlaying: levels.music > 0,
		foregroundPlaying: levels.foreground > 0,
		watchMode: mode === "watch",
		musicLevel: levels.music,
		foregroundLevel: levels.foreground,
		snapshotMusicLevel: 1
	};
}
var useSage = create()(persist((set, get) => ({
	profileId: "smart",
	splits: profileById("smart").splits(),
	activeSplitId: null,
	observation: webAdapter.observe(),
	routePickerOpen: false,
	volumeUiOpen: false,
	duckWarning: null,
	lastInstances: [],
	sim: idleSim(),
	refresh: () => set({
		observation: webAdapter.observe(),
		duckWarning: webAdapter.duckWarning,
		routePickerOpen: webAdapter.wantsRoutePicker,
		volumeUiOpen: webAdapter.wantsVolumeUi
	}),
	dismissPickers: () => {
		webAdapter.wantsRoutePicker = false;
		webAdapter.wantsVolumeUi = false;
		set({
			routePickerOpen: false,
			volumeUiOpen: false
		});
	},
	setActiveSplit: (id) => {
		set({ activeSplitId: id });
	},
	setProfile: async (id) => {
		const previous = get().profileId;
		if (previous === id) return;
		const current = enabledSplits(get().splits, previous);
		for (const split of current) await engine.exit(split);
		await splitSimulator.stop();
		let splits = get().splits.filter((s) => !s.profileId || s.profileId === "custom");
		if (id !== "custom") splits = [...profileById(id).splits(), ...splits];
		const active = firstTwoSided(splits);
		set({
			profileId: id,
			splits,
			activeSplitId: active?.id ?? null,
			sim: idleSim()
		});
		set({ lastInstances: await engine.handleTrigger(splits, "profile_activated", id, { profileId: id }) });
		get().refresh();
	},
	addSplit: (split) => {
		const next = prepareSplit(split);
		if (!splitIsSavable(next.capabilityResults, next)) return {
			ok: false,
			split: next
		};
		set({
			splits: [next, ...get().splits],
			activeSplitId: next.id
		});
		return {
			ok: true,
			split: next
		};
	},
	updateSplit: (id, patch) => {
		const current = get().splits.find((s) => s.id === id);
		if (!current) return;
		const next = prepareSplit({
			...current,
			...patch,
			id
		});
		set({ splits: get().splits.map((s) => s.id === id ? next : s) });
	},
	removeSplit: (id) => {
		const splits = get().splits.filter((s) => s.id !== id);
		set({
			splits,
			activeSplitId: get().activeSplitId === id ? firstTwoSided(splits)?.id ?? null : get().activeSplitId
		});
	},
	toggleSplit: (id) => {
		set({ splits: get().splits.map((s) => s.id === id ? {
			...s,
			enabled: !s.enabled
		} : s) });
	},
	startOwnAudio: async () => {
		await webAdapter.playOwn();
		set({ lastInstances: await engine.handleTrigger(enabledSplits(get().splits, get().profileId), "sounds_sage_playback_started", get().profileId) });
		get().refresh();
	},
	stopOwnAudio: async () => {
		const current = enabledSplits(get().splits, get().profileId);
		for (const split of current) if (split.exitCondition.kind === "sounds_sage_playback_stopped") await engine.exit(split);
		await webAdapter.stopOwn();
		await engine.handleTrigger(current, "sounds_sage_playback_stopped", get().profileId);
		get().refresh();
	},
	setOwnGain: async (gain) => {
		await webAdapter.setOwnGain(gain, 80);
		get().refresh();
	},
	simulateOtherAudio: async (on) => {
		webAdapter.simulateOtherAudio(on);
		const kind = on ? "other_audio_started" : "other_audio_stopped";
		const splits = enabledSplits(get().splits, get().profileId);
		if (!on) {
			for (const split of splits) if (split.exitCondition.kind === "other_audio_stopped") await engine.exit(split);
		}
		set({ lastInstances: await engine.handleTrigger(splits, kind, get().profileId) });
		get().refresh();
	},
	simulateInterruption: async (on) => {
		webAdapter.simulateInterruption(on);
		const kind = on ? "interruption_began" : "interruption_ended";
		const splits = enabledSplits(get().splits, get().profileId);
		if (!on) {
			for (const split of splits) if (split.exitCondition.kind === "interruption_ended") await engine.exit(split);
		}
		set({ lastInstances: await engine.handleTrigger(splits, kind, get().profileId) });
		get().refresh();
	},
	startMusic: async () => {
		const split = get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
		if (!split) return;
		const sim = await applySim(split, "music");
		sim.snapshotMusicLevel = 1;
		const instances = await engine.execute(split);
		set({
			sim,
			activeSplitId: split.id,
			lastInstances: [instances]
		});
		get().refresh();
	},
	startForeground: async () => {
		const split = get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
		if (!split) return;
		webAdapter.simulateOtherAudio(true);
		const sim = await applySim(split, "scrolling");
		sim.snapshotMusicLevel = get().sim.musicLevel || 1;
		const instances = await engine.handleTrigger([split], "other_audio_started", get().profileId);
		set({
			sim,
			activeSplitId: split.id,
			lastInstances: instances
		});
		get().refresh();
	},
	stopForeground: async () => {
		const split = get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
		webAdapter.simulateOtherAudio(false);
		if (!split) {
			set({ sim: idleSim() });
			return;
		}
		if (split.restorePolicy === "none") {
			const sim = {
				...get().sim,
				foregroundPlaying: false,
				foregroundLevel: 0,
				watchMode: false,
				mode: "music"
			};
			await splitSimulator.setLevels(sim.musicLevel, 0);
			set({ sim });
		} else {
			await engine.exit(split);
			set({ sim: await applySim(split, "music") });
		}
		get().refresh();
	},
	simulateWatchMode: async () => {
		const split = get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
		if (!split) return;
		webAdapter.simulateOtherAudio(true);
		const sim = await applySim(split, "watch");
		sim.snapshotMusicLevel = 1;
		set({
			sim,
			activeSplitId: split.id
		});
		get().refresh();
	},
	restoreSplit: async () => {
		const split = get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
		webAdapter.simulateOtherAudio(false);
		if (split) await engine.exit(split);
		if (!split || split.restorePolicy === "none") {
			const sim = get().sim;
			await splitSimulator.setLevels(sim.musicLevel, 0);
			set({ sim: {
				...sim,
				mode: sim.musicPlaying ? "music" : "idle",
				foregroundPlaying: false,
				foregroundLevel: 0,
				watchMode: false
			} });
		} else set({ sim: await applySim(split, "music") });
		get().refresh();
	}
}), {
	name: "sounds-sage-v3",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
	partialize: (state) => ({
		profileId: state.profileId,
		splits: state.splits,
		activeSplitId: state.activeSplitId
	})
}));
//#endregion
export { worstStatus as S, policySummary as _, OUTPUT_INTENT_LABELS as a, splitIsSavable as b, TRIGGER_LABELS as c, engine as d, evaluateSplit as f, outputIntentLabel as g, isTwoSided as h, OUTPUT_INTENTS as i, createId as l, intentCheckSummary as m, MUSIC_CATALOG as n, PROFILE_DEFINITIONS as o, evaluateTwoSidedIntent as p, MUSIC_POLICY_LABELS as r, SOCIAL_CATALOG as s, FOREGROUND_POLICY_LABELS as t, deriveActions as u, profileById as v, useSage as x, sourceById as y };
