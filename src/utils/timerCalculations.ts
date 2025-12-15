/**
 * Calculates timer start and end values based on player count
 */
export function calcTimerStartEndValues(startingPlayerCount: number) {
  return {
    totalNumbers: startingPlayerCount - startingPlayerCount / 5,
    dayStartValue: startingPlayerCount * 0.4 + 2,
    dayEndValue: 2,
    nightStartValue: startingPlayerCount * 0.1 + 1,
    nightEndValue: 1,
  };
}

/**
 * Rounds a number to the nearest quarter
 */
export function roundToNearestQuarter(n: number): number {
  return Math.round(n * 4) / 4;
}

/**
 * Generates exponential decay values for timer progression
 */
export function generateExponentialDecay(
  startValue: number,
  endValue: number,
  totalNumbers: number
): number[] {
  const values: number[] = [];
  const b = -Math.log(endValue / startValue);
  const step = 1 / (totalNumbers - 1);

  for (let i = 0; i < totalNumbers; i++) {
    const x = i * step;
    let y = startValue * Math.exp(-b * x);
    if (y < endValue) {
      y = endValue;
    }
    values.push(roundToNearestQuarter(y));
  }
  return values;
}

/**
 * Converts minutes array to seconds array
 */
export function convertToSeconds(values: number[]): number[] {
  return values.map((value) => value * 60);
}

