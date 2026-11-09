export type Phase = 'DAY' | 'ENDOFDAY' | 'NIGHT';

export const MAX_TIME = 3599;
export const MAX_DAYS = 15;

// [townsfolk, outsiders, minions, demons] per starting player count
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

export function calcTimerStartEndValues(players: number) {
  return {
    totalNumbers: players - players / 5,
    dayStart: players * 0.4 + 2,
    dayEnd: 2,
    nightStart: players * 0.1 + 1,
    nightEnd: 2, // matches the original app: end-of-day also decays towards 2 min
  };
}

const roundToQuarter = (n: number) => Math.round(n * 4) / 4;

export function exponentialDecay(start: number, end: number, count: number): number[] {
  const out: number[] = [];
  const b = -Math.log(end / start);
  const step = 1 / (count - 1);
  for (let i = 0; i < count; i++) {
    out.push(roundToQuarter(Math.max(start * Math.exp(-b * i * step), end)));
  }
  return out;
}

export interface TimerPrefs {
  playerCount: number;
  linkedTimer: boolean;
  day1: number; // minutes
  dayN: number;
  night1: number;
  nightN: number;
}

/** Day discussion and end-of-day (nomination) lengths per day, in seconds. */
export function buildSchedule(p: TimerPrefs) {
  const d = calcTimerStartEndValues(p.playerCount);
  const day1 = p.linkedTimer ? d.dayStart : p.day1;
  const dayN = p.linkedTimer ? d.dayEnd : p.dayN;
  const night1 = p.linkedTimer ? d.nightStart : p.night1;
  const nightN = p.linkedTimer ? d.nightEnd : p.nightN;
  const n = Math.max(2, Math.ceil(d.totalNumbers));
  return {
    day: exponentialDecay(day1, dayN, n).map((m) => Math.round(m * 60)),
    endOfDay: exponentialDecay(night1, nightN, n).map((m) => Math.round(m * 60)),
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Accepts "7.5", "7:30", "450s", "7.5m". Returns seconds (0 if invalid). */
export function parseTime(input: string): number {
  const v = input.trim().replace(',', '.');
  if (/^\d*\.?\d+m?$/.test(v)) return Math.round(parseFloat(v.replace('m', '')) * 60);
  if (v.includes(':')) {
    const [a, b] = v.split(':').map((x) => parseInt(x, 10));
    return Number.isFinite(a) && Number.isFinite(b) ? a * 60 + b : 0;
  }
  if (v.endsWith('s')) return Math.round(parseFloat(v.slice(0, -1))) || 0;
  return 0;
}
