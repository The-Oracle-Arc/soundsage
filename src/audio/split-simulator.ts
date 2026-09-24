export class SplitSimulator {
  musicLevel = 0;
  foregroundLevel = 0;
  running = false;

  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private foregroundGain: GainNode | null = null;
  private musicOsc: OscillatorNode | null = null;
  private foregroundOsc: OscillatorNode | null = null;

  private async ensure() {
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

  async setLevels(music: number, foreground: number, fadeMs = 320) {
    this.musicLevel = music;
    this.foregroundLevel = foreground;
    if (!this.running && music <= 0 && foreground <= 0) return;
    await this.ensure();
    if (this.ctx?.state === "suspended") await this.ctx.resume();
    const t = this.ctx!.currentTime;
    const seconds = Math.max(0.04, fadeMs / 1000);
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(music * 0.07, t + seconds);
    }
    if (this.foregroundGain) {
      this.foregroundGain.gain.cancelScheduledValues(t);
      this.foregroundGain.gain.setValueAtTime(this.foregroundGain.gain.value, t);
      this.foregroundGain.gain.linearRampToValueAtTime(foreground * 0.055, t + seconds);
    }
    this.running = music > 0 || foreground > 0;
  }

  async stop() {
    await this.setLevels(0, 0, 180);
    if (this.ctx?.state === "running") await this.ctx.suspend();
    this.running = false;
  }
}

export const splitSimulator = new SplitSimulator();
