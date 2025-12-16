/**
 * Formats seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Parses various time input formats into seconds
 * Supports: "7.5", "7:30", "450s", "7.5m"
 */
export function parseTime(timeValue: string): number {
  timeValue = timeValue.replace(',', '.');
  let parsedTime = 0;
  
  if (/^-?\d*\.?\d+m?$/.test(timeValue)) {
    if (typeof timeValue === 'string') timeValue = timeValue.replace('m', '');
    parsedTime = Math.round(parseFloat(timeValue) * 60);
  } else if (timeValue.includes(':')) {
    const parts = timeValue.split(':');
    if (parts[0].startsWith('-') || parts[1].startsWith('-')) {
      return 0;
    }
    parsedTime = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (timeValue.endsWith('s')) {
    parsedTime = Math.round(parseFloat(timeValue.substring(0, timeValue.length - 1)));
  }
  
  return parsedTime;
}



