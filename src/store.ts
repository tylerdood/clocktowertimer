import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CHARACTER_AMOUNTS, MAX_DAYS, MAX_TIME, Phase, buildSchedule } from './logic';
import { play } from './sound';
import { applyPhaseVolume, DEFAULT_SPOTIFY_VOLUMES, DEFAULT_SPOTIFY_CLIENT_ID } from './spotify';
import type { Language } from './i18n';

export interface Prefs {
  playerCount: number;
  travelerCount: number;
  linkedTimer: boolean;
  day1: number;
  dayN: number;
  night1: number;
  nightN: number;
  stepSize: number;
  trackers: boolean;
  sound: boolean;
  haptics: boolean;
  keepAwake: boolean;
  language: Language;
  spotify: boolean;
  spotifyVolumes: number[];
  spotifyClientId: string;
}

const defaultPrefs: Prefs = {
  playerCount: 10,
  travelerCount: 0,
  linkedTimer: true,
  day1: 6,
  dayN: 2,
  night1: 2,
  nightN: 2,
  stepSize: 15,
  trackers: true,
  sound: true,
  haptics: true,
  keepAwake: true,
  language: 'auto',
  spotify: false,
  spotifyVolumes: DEFAULT_SPOTIFY_VOLUMES,
  spotifyClientId: DEFAULT_SPOTIFY_CLIENT_ID,
};

interface Game {
  phase: Phase;
  day: number;
  timeRemaining: number;
  defaultTime: number;
  endAt: number | null;
  hearts: number;
  votes: number;
}

interface Actions {
  setPrefs: (p: Partial<Prefs>) => void;
  resetGame: () => void;
  start: () => void;
  stop: () => void;
  tick: () => void;
  reset: () => void;
  setTime: (s: number) => void;
  nudge: (dir: 1 | -1) => void;
  recall: () => void;
  advance: () => void;
  previous: () => void;
  hearts_: (d: 1 | -1) => void;
  votes_: (d: 1 | -1) => void;
}

type Store = Prefs & Game & Actions;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function phaseTime(s: Prefs, phase: Phase, day: number): number | null {
  if (phase === 'NIGHT') return null;
  const sched = buildSchedule(s);
  const list = phase === 'DAY' ? sched.day : sched.endOfDay;
  return list[Math.min(day - 1, list.length - 1)];
}

const buzz = (s: Prefs, style = Haptics.ImpactFeedbackStyle.Light) => {
  if (s.haptics) Haptics.impactAsync(style).catch(() => {});
};

/** Never let a corrupt/unreadable saved game block startup: drop it and start fresh. */
const safeStorage = {
  getItem: async (name: string) => {
    try {
      const raw = await AsyncStorage.getItem(name);
      if (raw != null) JSON.parse(raw);
      return raw;
    } catch {
      try { await AsyncStorage.removeItem(name); } catch { /* ignore */ }
      return null;
    }
  },
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value).catch(() => {}),
  removeItem: (name: string) => AsyncStorage.removeItem(name).catch(() => {}),
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...defaultPrefs,
      phase: 'NIGHT',
      day: 1,
      timeRemaining: 180,
      defaultTime: 180,
      endAt: null,
      hearts: 10,
      votes: 10,

      setPrefs: (p) => {
        set(p);
        const s = get();
        // Re-sync counts and the current phase's time when game settings change.
        if ('playerCount' in p || 'travelerCount' in p) {
          set({ hearts: s.playerCount + s.travelerCount, votes: s.playerCount + s.travelerCount });
        }
        if (s.endAt === null) {
          const t = phaseTime(s, s.phase, s.day);
          if (t !== null) set({ timeRemaining: t, defaultTime: t });
        }
      },
      resetGame: () => {
        const s = get();
        set({
          phase: 'NIGHT',
          day: 1,
          endAt: null,
          hearts: s.playerCount + s.travelerCount,
          votes: s.playerCount + s.travelerCount,
        });
      },

      start: () => {
        const s = get();
        if (s.endAt !== null || s.phase === 'NIGHT' || s.timeRemaining <= 0) return;
        buzz(s, Haptics.ImpactFeedbackStyle.Medium);
        set({ endAt: Date.now() + s.timeRemaining * 1000 });
      },
      stop: () => {
        const s = get();
        if (s.endAt === null) return;
        buzz(s);
        set({ endAt: null, timeRemaining: Math.max(0, Math.ceil((s.endAt - Date.now()) / 1000)) });
      },
      tick: () => {
        const { endAt } = get();
        if (endAt === null) return;
        const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        if (left === 0) {
          set({ endAt: null, timeRemaining: 0 });
          play('bell');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        } else if (left !== get().timeRemaining) {
          set({ timeRemaining: left });
        }
      },
      reset: () => {
        const s = get();
        if (s.endAt !== null) return;
        buzz(s);
        set({ timeRemaining: s.defaultTime });
      },
      setTime: (t) => {
        const s = get();
        if (s.endAt !== null) return;
        const v = clamp(t, 0, MAX_TIME);
        set({ timeRemaining: v, defaultTime: v });
      },
      nudge: (dir) => {
        const s = get();
        if (s.endAt !== null) return;
        buzz(s);
        const v = clamp(s.defaultTime + dir * s.stepSize, 0, MAX_TIME);
        set({ timeRemaining: v, defaultTime: v });
      },
      recall: () => {
        const s = get();
        if (s.phase === 'NIGHT') return;
        buzz(s, Haptics.ImpactFeedbackStyle.Heavy);
        play('bell');
        set({ endAt: null, timeRemaining: 0 });
      },

      advance: () => {
        const s = get();
        const phase: Phase = s.phase === 'DAY' ? 'ENDOFDAY' : s.phase === 'ENDOFDAY' ? 'NIGHT' : 'DAY';
        const day = s.phase === 'ENDOFDAY' ? (s.day % MAX_DAYS) + 1 : s.day;
        const t = phaseTime(s, phase, day);
        buzz(s, Haptics.ImpactFeedbackStyle.Medium);
        play(phase === 'DAY' ? 'day' : phase === 'ENDOFDAY' ? 'endOfDay' : 'night');
        set({ phase, day, endAt: null, ...(t !== null ? { timeRemaining: t, defaultTime: t } : {}) });
        applyPhaseVolume(phase, s.spotify, s.spotifyVolumes);
      },
      previous: () => {
        const s = get();
        if (s.day === 1 && s.phase === 'NIGHT') return;
        const phase: Phase = s.phase === 'DAY' ? 'NIGHT' : s.phase === 'ENDOFDAY' ? 'DAY' : 'ENDOFDAY';
        const day = s.phase === 'DAY' ? Math.max(1, s.day - 1) : s.day;
        const t = phaseTime(s, phase, day);
        buzz(s);
        set({ phase, day, endAt: null, ...(t !== null ? { timeRemaining: t, defaultTime: t } : {}) });
      },

      hearts_: (d) => {
        const s = get();
        const v = clamp(s.hearts + d, 0, 20);
        if (v === s.hearts) return;
        buzz(s, d < 0 ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
        play(d < 0 ? 'knife' : 'wind');
        set({ hearts: v });
      },
      votes_: (d) => {
        const s = get();
        const v = clamp(s.votes + d, 0, 20);
        if (v === s.votes) return;
        buzz(s);
        play(d < 0 ? 'tissue' : 'page');
        set({ votes: v });
      },
    }),
    {
      name: 'clocktower-timer-v3',
      storage: createJSONStorage(() => safeStorage),
      // Persist preferences and the game in progress (timer is paused on restore).
      partialize: (s) => ({
        playerCount: s.playerCount, travelerCount: s.travelerCount, linkedTimer: s.linkedTimer,
        day1: s.day1, dayN: s.dayN, night1: s.night1, nightN: s.nightN, stepSize: s.stepSize,
        trackers: s.trackers, sound: s.sound, haptics: s.haptics, keepAwake: s.keepAwake,
        language: s.language, spotify: s.spotify, spotifyVolumes: s.spotifyVolumes, spotifyClientId: s.spotifyClientId,
        phase: s.phase, day: s.day, timeRemaining: s.timeRemaining, defaultTime: s.defaultTime,
        hearts: s.hearts, votes: s.votes,
      }),
    },
  ),
);

export const counts = (playerCount: number) => CHARACTER_AMOUNTS[playerCount] ?? [0, 0, 0, 0];
