import type { AudioObservation, MixPolicy, SessionSnapshot } from "../core/models";
import type { AudioAdapter, ApplyMixOptions, RestoreOptions } from "./adapter";

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

export class WebPrototypeAdapter implements AudioAdapter {
  policy: MixPolicy = "mix";
  ownGain = 0.6;
  playing = false;
  speakerOverride = false;
  interruptionActive = false;
  otherAudioPlaying = false;
  duckUntil: number | null = null;
  lastNotifyOthers = false;
  wantsRoutePicker = false;
  wantsVolumeUi = false;
  duckWarning: string | null = null;

  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private osc: OscillatorNode | null = null;

  observe(): AudioObservation {
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
      platform: "web_prototype",
    };
  }

  async configureSession(policy: MixPolicy) {
    this.policy = policy;
  }

  async activateSession() {
    if (this.playing) return;
    await this.playOwn();
  }

  async deactivateSession(notifyOthers: boolean) {
    this.lastNotifyOthers = notifyOthers;
    await this.stopOwn();
  }

  async applyMixPolicy(policy: MixPolicy, options: ApplyMixOptions) {
    this.policy = policy;
    this.duckWarning = null;
    if (policy === "duck" && options.duckTemporary) {
      this.duckUntil = Date.now() + 4000;
      this.duckWarning =
        "Duck is active for a few seconds only — Apple’s documented limit. This is not a per-app fader.";
    } else {
      this.duckUntil = null;
    }
  }

  async overrideOutput(port: "speaker" | "none") {
    this.speakerOverride = port === "speaker";
  }

  async setOwnGain(gain: number, fadeMs: number) {
    const next = clamp(gain);
    if (this.gain && fadeMs > 0 && this.ctx) {
      const t = this.ctx.currentTime;
      this.gain.gain.cancelScheduledValues(t);
      this.gain.gain.setValueAtTime(this.gain.gain.value, t);
      this.gain.gain.linearRampToValueAtTime(next * 0.08, t + fadeMs / 1000);
    } else if (this.gain) {
      this.gain.gain.value = next * 0.08;
    }
    this.ownGain = next;
  }

  private async ensureGraph() {
    if (this.ctx && this.gain && this.osc) return;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = this.ownGain * 0.08;
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

  async restore(snapshot: SessionSnapshot, options: RestoreOptions) {
    this.policy = snapshot.mixPolicy;
    this.speakerOverride = snapshot.speakerOverride;
    this.lastNotifyOthers = options.notifyOthers;
    await this.setOwnGain(snapshot.ownGain, 180);
    if (snapshot.playing) await this.playOwn();
    else await this.stopOwn();
  }

  simulateOtherAudio(on: boolean) {
    this.otherAudioPlaying = on;
  }

  simulateInterruption(on: boolean) {
    this.interruptionActive = on;
    if (on) void this.stopOwn();
  }
}

export const webAdapter = new WebPrototypeAdapter();
