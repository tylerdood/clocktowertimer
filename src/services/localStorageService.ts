/**
 * LocalStorage service for settings persistence
 */
export function getSetting(key: string, defaultValue: string | null = null): string | null {
  const setting = localStorage.getItem(key);
  if (setting == null || setting === 'undefined') {
    return defaultValue;
  }
  return setting;
}

export function getBooleanSetting(key: string, defaultValue: boolean = false): boolean {
  const setting = getSetting(key, defaultValue.toString());
  if (typeof setting === 'string') {
    return setting.toLowerCase() === 'true';
  }
  return defaultValue;
}

export function getNumericSetting(key: string, defaultValue: number = 0): number {
  const setting = getSetting(key, defaultValue.toString());
  return Number(setting);
}

export function setSetting(key: string, value: string | number | boolean): void {
  localStorage.setItem(key, value.toString());
}


