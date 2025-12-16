export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  defaultTime: number;
  stepSize: number;
}

export interface TimerActions {
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  incrementTimer: () => void;
  decrementTimer: () => void;
  setTime: (time: number) => void;
  setDefaultTime: (time: number) => void;
  setStepSize: (size: number) => void;
  tick: () => void;
}



