export const PHASE_DAY = 0;
export const PHASE_ENDOFDAY = 1;
export const PHASE_NIGHT = 2;

export const DEFAULT_TIME = 180; // 3 minutes in seconds
export const DEFAULT_STEP_SIZE = 15;
export const MAX_TIME = 3599; // 59:59
export const MIN_TIME = 0;

export const CHARACTER_AMOUNTS: Record<number, [number, number, number, number]> = {
  5: [3, 0, 1, 1],
  6: [3, 1, 1, 1],
  7: [5, 0, 1, 1],
  8: [5, 1, 1, 1],
  9: [5, 2, 1, 1],
  10: [7, 0, 2, 1],
  11: [7, 1, 2, 1],
  12: [7, 2, 2, 1],
  13: [9, 0, 3, 1],
  14: [9, 1, 3, 1],
  15: [9, 2, 3, 1],
};

export const DEFAULT_KEYBINDINGS = {
  startstop: [' ', 'Spacebar'],
  reset: 'Backspace',
  timer: 'Z',
  timeplus: ['Up', 'ArrowUp', 'Right', 'ArrowRight', '+'],
  timeminus: ['Down', 'ArrowDown', 'Left', 'ArrowLeft', '-'],
  recall: 'R',
  nextphase: ['N', 'Enter'],
  previousphase: 'P',
  aliveplus: 'Z',
  aliveminus: 'X',
  voteplus: 'C',
  voteminus: 'V',
  toggleinfo: 'I',
  mute: 'D',
  fullscreen: 'F',
  togglesettings: 'Q',
};

export const DEFAULT_VOLUMES = [50, 30, 80]; // Dawn, Dusk, Night

