import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { webAdapter } from "@/audio/web-adapter";
import { splitSimulator } from "@/audio/split-simulator";
import { WorkflowEngine, evaluateSplit, splitIsSavable } from "@/core/workflow/engine";
import { profileById } from "@/core/profiles";
import { deriveActions, simulateLevels } from "@/core/split-intent";
import {
  createId,
  isTwoSided,
  type AudioObservation,
  type ProfileId,
  type SimMode,
  type Split,
  type WorkflowInstance,
} from "@/core/models";

const engine = new WorkflowEngine(webAdapter);

export interface SimState {
  splitId: string | null;
  mode: SimMode;
  musicPlaying: boolean;
  foregroundPlaying: boolean;
  watchMode: boolean;
  musicLevel: number;
  foregroundLevel: number;
  snapshotMusicLevel: number;
}

const idleSim = (): SimState => ({
  splitId: null,
  mode: "idle",
  musicPlaying: false,
  foregroundPlaying: false,
  watchMode: false,
  musicLevel: 0,
  foregroundLevel: 0,
  snapshotMusicLevel: 1,
});

interface AppState {
  profileId: ProfileId;
  splits: Split[];
  activeSplitId: string | null;
  observation: AudioObservation;
  routePickerOpen: boolean;
  volumeUiOpen: boolean;
  duckWarning: string | null;
  lastInstances: WorkflowInstance[];
  sim: SimState;
  setProfile: (id: ProfileId) => Promise<void>;
  setActiveSplit: (id: string) => void;
  addSplit: (split: Split) => { ok: boolean; split: Split };
  updateSplit: (id: string, patch: Partial<Split>) => void;
  removeSplit: (id: string) => void;
  toggleSplit: (id: string) => void;
  startOwnAudio: () => Promise<void>;
  stopOwnAudio: () => Promise<void>;
  setOwnGain: (gain: number) => Promise<void>;
  simulateOtherAudio: (on: boolean) => Promise<void>;
  simulateInterruption: (on: boolean) => Promise<void>;
  startMusic: () => Promise<void>;
  startForeground: () => Promise<void>;
  stopForeground: () => Promise<void>;
  simulateWatchMode: () => Promise<void>;
  restoreSplit: () => Promise<void>;
  refresh: () => void;
  dismissPickers: () => void;
}

function enabledSplits(splits: Split[], profileId: ProfileId) {
  return splits.filter(
    (s) => s.enabled && (!s.profileId || s.profileId === profileId || s.profileId === "custom"),
  );
}

function firstTwoSided(splits: Split[]) {
  return splits.find((s) => s.enabled && isTwoSided(s)) ?? splits.find((s) => isTwoSided(s)) ?? splits[0] ?? null;
}

const memoryStorage = {
  getItem: () => null as string | null,
  setItem: () => {},
  removeItem: () => {},
};

function prepareSplit(split: Split): Split {
  const withActions = {
    ...split,
    id: split.id || createId("split"),
    actions: split.actions.length ? split.actions : deriveActions(split),
  };
  return { ...withActions, capabilityResults: evaluateSplit(withActions) };
}

async function applySim(split: Split | undefined, mode: SimMode) {
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
    snapshotMusicLevel: 1,
  } satisfies SimState;
}

export const useSage = create<AppState>()(
  persist(
    (set, get) => ({
      profileId: "smart",
      splits: profileById("smart").splits(),
      activeSplitId: null,
      observation: webAdapter.observe(),
      routePickerOpen: false,
      volumeUiOpen: false,
      duckWarning: null,
      lastInstances: [],
      sim: idleSim(),
      refresh: () =>
        set({
          observation: webAdapter.observe(),
          duckWarning: webAdapter.duckWarning,
          routePickerOpen: webAdapter.wantsRoutePicker,
          volumeUiOpen: webAdapter.wantsVolumeUi,
        }),
      dismissPickers: () => {
        webAdapter.wantsRoutePicker = false;
        webAdapter.wantsVolumeUi = false;
        set({ routePickerOpen: false, volumeUiOpen: false });
      },
      setActiveSplit: (id) => {
        set({ activeSplitId: id });
      },
      setProfile: async (id) => {
        const previous = get().profileId;
        if (previous === id) return;
        const current = enabledSplits(get().splits, previous);
        for (const split of current) {
          await engine.exit(split);
        }
        await splitSimulator.stop();
        let splits = get().splits.filter((s) => !s.profileId || s.profileId === "custom");
        if (id !== "custom") {
          splits = [...profileById(id).splits(), ...splits];
        }
        const active = firstTwoSided(splits);
        set({
          profileId: id,
          splits,
          activeSplitId: active?.id ?? null,
          sim: idleSim(),
        });
        const instances = await engine.handleTrigger(splits, "profile_activated", id, {
          profileId: id,
        });
        set({ lastInstances: instances });
        get().refresh();
      },
      addSplit: (split) => {
        const next = prepareSplit(split);
        if (!splitIsSavable(next.capabilityResults, next)) {
          return { ok: false, split: next };
        }
        set({ splits: [next, ...get().splits], activeSplitId: next.id });
        return { ok: true, split: next };
      },
      updateSplit: (id, patch) => {
        const current = get().splits.find((s) => s.id === id);
        if (!current) return;
        const next = prepareSplit({ ...current, ...patch, id });
        set({
          splits: get().splits.map((s) => (s.id === id ? next : s)),
        });
      },
      removeSplit: (id) => {
        const splits = get().splits.filter((s) => s.id !== id);
        set({
          splits,
          activeSplitId: get().activeSplitId === id ? (firstTwoSided(splits)?.id ?? null) : get().activeSplitId,
        });
      },
      toggleSplit: (id) => {
        set({
          splits: get().splits.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
        });
      },
      startOwnAudio: async () => {
        await webAdapter.playOwn();
        const instances = await engine.handleTrigger(
          enabledSplits(get().splits, get().profileId),
          "sounds_sage_playback_started",
          get().profileId,
        );
        set({ lastInstances: instances });
        get().refresh();
      },
      stopOwnAudio: async () => {
        const current = enabledSplits(get().splits, get().profileId);
        for (const split of current) {
          if (split.exitCondition.kind === "sounds_sage_playback_stopped") {
            await engine.exit(split);
          }
        }
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
          for (const split of splits) {
            if (split.exitCondition.kind === "other_audio_stopped") await engine.exit(split);
          }
        }
        const instances = await engine.handleTrigger(splits, kind, get().profileId);
        set({ lastInstances: instances });
        get().refresh();
      },
      simulateInterruption: async (on) => {
        webAdapter.simulateInterruption(on);
        const kind = on ? "interruption_began" : "interruption_ended";
        const splits = enabledSplits(get().splits, get().profileId);
        if (!on) {
          for (const split of splits) {
            if (split.exitCondition.kind === "interruption_ended") await engine.exit(split);
          }
        }
        const instances = await engine.handleTrigger(splits, kind, get().profileId);
        set({ lastInstances: instances });
        get().refresh();
      },
      startMusic: async () => {
        const split =
          get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
        if (!split) return;
        const sim = await applySim(split, "music");
        sim.snapshotMusicLevel = 1;
        const instances = await engine.execute(split);
        set({ sim, activeSplitId: split.id, lastInstances: [instances] });
        get().refresh();
      },
      startForeground: async () => {
        const split =
          get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
        if (!split) return;
        webAdapter.simulateOtherAudio(true);
        const sim = await applySim(split, "scrolling");
        sim.snapshotMusicLevel = get().sim.musicLevel || 1;
        const instances = await engine.handleTrigger(
          [split],
          "other_audio_started",
          get().profileId,
        );
        set({ sim, activeSplitId: split.id, lastInstances: instances });
        get().refresh();
      },
      stopForeground: async () => {
        const split =
          get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
        webAdapter.simulateOtherAudio(false);
        if (!split) {
          set({ sim: idleSim() });
          return;
        }
        if (split.restorePolicy === "none") {
          const sim = { ...get().sim, foregroundPlaying: false, foregroundLevel: 0, watchMode: false, mode: "music" as const };
          await splitSimulator.setLevels(sim.musicLevel, 0);
          set({ sim });
        } else {
          await engine.exit(split);
          const sim = await applySim(split, "music");
          set({ sim });
        }
        get().refresh();
      },
      simulateWatchMode: async () => {
        const split =
          get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
        if (!split) return;
        webAdapter.simulateOtherAudio(true);
        const sim = await applySim(split, "watch");
        sim.snapshotMusicLevel = 1;
        set({ sim, activeSplitId: split.id });
        get().refresh();
      },
      restoreSplit: async () => {
        const split =
          get().splits.find((s) => s.id === get().activeSplitId) ?? firstTwoSided(get().splits);
        webAdapter.simulateOtherAudio(false);
        if (split) await engine.exit(split);
        if (!split || split.restorePolicy === "none") {
          const sim = get().sim;
          await splitSimulator.setLevels(sim.musicLevel, 0);
          set({
            sim: {
              ...sim,
              mode: sim.musicPlaying ? "music" : "idle",
              foregroundPlaying: false,
              foregroundLevel: 0,
              watchMode: false,
            },
          });
        } else {
          const sim = await applySim(split, "music");
          set({ sim });
        }
        get().refresh();
      },
    }),
    {
      name: "sounds-sage-v3",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : localStorage,
      ),
      partialize: (state) => ({
        profileId: state.profileId,
        splits: state.splits,
        activeSplitId: state.activeSplitId,
      }),
    },
  ),
);

export { engine as workflowEngine };
