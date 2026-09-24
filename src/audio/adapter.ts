import type { AudioObservation, MixPolicy, RoutePort, SessionSnapshot } from "../core/models.ts";

export interface ApplyMixOptions {
  duckTemporary: boolean;
}

export interface RestoreOptions {
  notifyOthers: boolean;
}

export interface AudioAdapter {
  configureSession(policy: MixPolicy): Promise<void>;
  activateSession(): Promise<void>;
  deactivateSession(notifyOthers: boolean): Promise<void>;
  applyMixPolicy(policy: MixPolicy, options: ApplyMixOptions): Promise<void>;
  overrideOutput(port: "speaker" | "none"): Promise<void>;
  setOwnGain(gain: number, fadeMs: number): Promise<void>;
  playOwn(): Promise<void>;
  stopOwn(): Promise<void>;
  observe(): AudioObservation;
  requestRoutePicker(): void;
  requestVolumeUi(): void;
  restore(snapshot: SessionSnapshot, options: RestoreOptions): Promise<void>;
}

export const WEB_AVAILABLE_ROUTES: RoutePort[] = ["speaker"];
