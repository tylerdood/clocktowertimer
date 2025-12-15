import { create } from 'zustand';
import type { Phase, PhaseState, PhaseActions } from '../types/phase.types';

interface PhaseStore extends PhaseState, PhaseActions {}

export const usePhaseStore = create<PhaseStore>((set) => ({
  currentPhase: 'NIGHT',
  currentDay: 1,

  advancePhase: () => {
    set((state) => {
      let newPhase: Phase;
      let newDay = state.currentDay;

      switch (state.currentPhase) {
        case 'DAY':
          newPhase = 'ENDOFDAY';
          break;
        case 'ENDOFDAY':
          newPhase = 'NIGHT';
          newDay = (newDay % 15) + 1; // Increment day when going from ENDOFDAY to NIGHT
          break;
        case 'NIGHT':
          newPhase = 'DAY';
          break;
      }

      return {
        currentPhase: newPhase,
        currentDay: newDay,
      };
    });
  },

  previousPhase: () => {
    set((state) => {
      let newPhase: Phase;
      let newDay = state.currentDay;

      switch (state.currentPhase) {
        case 'DAY':
          newPhase = 'NIGHT';
          if (newDay > 1) {
            newDay = newDay - 1;
          }
          break;
        case 'ENDOFDAY':
          newPhase = 'DAY';
          break;
        case 'NIGHT':
          newPhase = 'ENDOFDAY';
          break;
      }

      return {
        currentPhase: newPhase,
        currentDay: newDay,
      };
    });
  },

  setPhase: (phase: Phase) => {
    set({ currentPhase: phase });
  },

  setDay: (day: number) => {
    set({ currentDay: day });
  },
}));

