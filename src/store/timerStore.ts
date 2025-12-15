import { create } from 'zustand';
import type { TimerState, TimerActions } from '../types/timer.types';
import { DEFAULT_TIME, DEFAULT_STEP_SIZE, MAX_TIME, MIN_TIME } from '../utils/constants';

interface TimerStore extends TimerState, TimerActions {}

export const useTimerStore = create<TimerStore>((set, get) => ({
  timeRemaining: DEFAULT_TIME,
  isRunning: false,
  defaultTime: DEFAULT_TIME,
  stepSize: DEFAULT_STEP_SIZE,

  startTimer: () => {
    if (get().isRunning) return;
    set({ isRunning: true });
  },

  stopTimer: () => {
    // Don't reset timeRemaining, just stop the timer
    set({ isRunning: false });
  },

  resetTimer: () => {
    // Allow reset even if timer just completed (isRunning will be false)
    if (get().isRunning) return;
    const defaultTime = get().defaultTime;
    set({ timeRemaining: defaultTime });
  },

  incrementTimer: () => {
    if (get().isRunning) return;
    const newTime = Math.min(get().defaultTime + get().stepSize, MAX_TIME);
    set({ defaultTime: newTime, timeRemaining: newTime });
  },

  decrementTimer: () => {
    if (get().isRunning) return;
    const newTime = Math.max(get().defaultTime - get().stepSize, MIN_TIME);
    set({ defaultTime: newTime, timeRemaining: newTime });
  },

  setTime: (time: number) => {
    if (get().isRunning) return;
    const clampedTime = Math.max(MIN_TIME, Math.min(time, MAX_TIME));
    set({ defaultTime: clampedTime, timeRemaining: clampedTime });
  },

  setDefaultTime: (time: number) => {
    const clampedTime = Math.max(MIN_TIME, Math.min(time, MAX_TIME));
    set({ defaultTime: clampedTime });
    // Don't update timeRemaining here - it should only be updated by:
    // - resetTimer (sets to defaultTime)
    // - tick (decrements)
    // - setTime (sets to specific value)
    // - incrementTimer/decrementTimer (updates both)
  },

  setStepSize: (size: number) => {
    set({ stepSize: size });
  },

  tick: () => {
    const current = get().timeRemaining;
    if (current <= 1) {
      set({ isRunning: false, timeRemaining: 0 });
      return;
    }
    set({ timeRemaining: current - 1 });
  },
}));

