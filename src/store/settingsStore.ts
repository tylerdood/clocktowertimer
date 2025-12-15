import { create } from 'zustand';
import type { Settings, KeybindingMap } from '../types/settings.types';
import {
  getSetting,
  getBooleanSetting,
  getNumericSetting,
} from '../services/localStorageService';
import { DEFAULT_KEYBINDINGS, DEFAULT_VOLUMES } from '../utils/constants';
import {
  calcTimerStartEndValues,
  generateExponentialDecay,
  convertToSeconds,
} from '../utils/timerCalculations';
import { fillAlternativeKeys } from '../utils/keybindings';

interface SettingsStore extends Settings {
  loadSettings: () => void;
}

const initialTimeValues = {
  day: [180],
  endOfDay: [180],
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  playerCount: 10,
  travelerCount: 0,
  linkedTimer: true,
  featureSpotify: false,
  featureRoles: true,
  gameSounds: true,
  timeValues: initialTimeValues,
  keybindings: { ...DEFAULT_KEYBINDINGS } as KeybindingMap,
  spotifyVolumes: [...DEFAULT_VOLUMES],
  stepSize: 15,

  loadSettings: () => {
    const playerCount = getNumericSetting('settings_game_playercount', 10);
    const travelerCount = getNumericSetting('settings_game_travellercount', 0);
    const linkedTimer = getBooleanSetting('settings_game_linkedtimer', true);

    // Load timer values
    const timerValues = calcTimerStartEndValues(playerCount);
    const day1 = getNumericSetting('settings_game_day1', timerValues.dayStartValue) * 60;
    const night1 = getNumericSetting('settings_game_night1', timerValues.nightStartValue) * 60;
    const dayN = getNumericSetting('settings_game_dayn', timerValues.dayEndValue) * 60;
    const nightN = getNumericSetting('settings_game_nightn', timerValues.dayEndValue) * 60;

    // Calculate time values
    const totalNumbers = timerValues.totalNumbers;
    const dayDecayValues = generateExponentialDecay(
      day1 / 60,
      dayN / 60,
      totalNumbers
    );
    const nightDecayValues = generateExponentialDecay(
      night1 / 60,
      nightN / 60,
      totalNumbers
    );

    // Load keybindings
    const keybindings: KeybindingMap = {
      startstop: getSetting('settings_key_timerstart', 'Spacebar') || 'Spacebar',
      reset: getSetting('settings_key_timerreset', 'Backspace') || 'Backspace',
      timer: getSetting('settings_key_timeredit', 'Z') || 'Z',
      timeplus: [
        getSetting('settings_key_timerplus', 'ArrowUp') || 'ArrowUp',
        getSetting('settings_key_timerplusalt', 'ArrowRight') || 'ArrowRight',
        getSetting('settings_key_timerplusalt2', '+') || '+',
      ],
      timeminus: [
        getSetting('settings_key_timerminus', 'ArrowDown') || 'ArrowDown',
        getSetting('settings_key_timerminusalt', 'ArrowLeft') || 'ArrowLeft',
        getSetting('settings_key_timerminusalt2', '-') || '-',
      ],
      recall: getSetting('settings_key_recall', 'R') || 'R',
      nextphase: [
        getSetting('settings_key_phasenext', 'N') || 'N',
        getSetting('settings_key_phasenextalt', 'Enter') || 'Enter',
      ],
      previousphase: getSetting('settings_key_phaseprev', 'P') || 'P',
      aliveplus: getSetting('settings_key_aliveplus', 'Z') || 'Z',
      aliveminus: getSetting('settings_key_aliveminus', 'X') || 'X',
      voteplus: getSetting('settings_key_voteplus', 'C') || 'C',
      voteminus: getSetting('settings_key_voteminus', 'V') || 'V',
      toggleinfo: getSetting('settings_key_toggleinfo', 'I') || 'I',
      mute: getSetting('settings_key_togglemute', 'D') || 'D',
      fullscreen: getSetting('settings_key_togglefullscreen', 'F') || 'F',
      togglesettings: getSetting('settings_key_togglesettings', 'Q') || 'Q',
    };

    fillAlternativeKeys(keybindings);

    const newTimeValues = {
      day: convertToSeconds(dayDecayValues),
      endOfDay: convertToSeconds(nightDecayValues),
    };

    set({
      playerCount,
      travelerCount,
      linkedTimer,
      featureSpotify: getBooleanSetting('settings_feature_spotify', false),
      featureRoles: getBooleanSetting('settings_feature_roles', true),
      gameSounds: getBooleanSetting('settings_game_sounds', true),
      timeValues: newTimeValues,
      keybindings,
      spotifyVolumes: [
        getNumericSetting('settings_spotify_dawn', DEFAULT_VOLUMES[0]),
        getNumericSetting('settings_spotify_dusk', DEFAULT_VOLUMES[1]),
        getNumericSetting('settings_spotify_night', DEFAULT_VOLUMES[2]),
      ],
      stepSize: getNumericSetting('settings_timer_stepsize', 15),
    });
  },
}));

