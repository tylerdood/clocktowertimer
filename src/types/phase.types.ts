export type Phase = 'DAY' | 'ENDOFDAY' | 'NIGHT';

export interface PhaseState {
  currentPhase: Phase;
  currentDay: number;
}

export interface PhaseActions {
  advancePhase: () => void;
  previousPhase: () => void;
  setPhase: (phase: Phase) => void;
  setDay: (day: number) => void;
}

