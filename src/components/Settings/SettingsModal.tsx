import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import { useCharacterStore } from '../../store/characterStore';
import { useTimerStore } from '../../store/timerStore';
import { Button } from '../UI/Button';
import {
  calcTimerStartEndValues,
  roundToNearestQuarter,
  generateExponentialDecay,
  convertToSeconds,
} from '../../utils/timerCalculations';
import { parseTime, formatTime } from '../../utils/timeUtils';
import { useSpotify } from '../../hooks/useSpotify';
import { KeybindingsEditor } from './KeybindingsEditor';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const settings = useSettingsStore();
  const { updateCounts } = useCharacterStore();
  const { setStepSize } = useTimerStore();
  const { togglePlay, setVolume } = useSpotify();
  const [showInfo, setShowInfo] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    playerCount: settings.playerCount,
    travelerCount: settings.travelerCount,
    linkedTimer: settings.linkedTimer,
    featureSpotify: settings.featureSpotify,
    featureRoles: settings.featureRoles,
    gameSounds: settings.gameSounds,
    stepSize: settings.stepSize,
    day1Timer: '',
    endOfDay1Timer: '',
    dayNTimer: '',
    endOfDayNTimer: '',
    spotifyVolumes: [...settings.spotifyVolumes],
    keybindings: { ...settings.keybindings },
  });

  const [timerPreview, setTimerPreview] = useState<{
    dayValues: number[];
    endOfDayValues: number[];
  } | null>(null);

  const getNumericSetting = (key: string, defaultValue: number): number => {
    const setting = localStorage.getItem(key);
    return setting ? Number(setting) : defaultValue;
  };

  const updateTimerPreview = () => {
    const timerValues = calcTimerStartEndValues(localSettings.playerCount);
    const day1 = parseTime(localSettings.day1Timer) / 60;
    const night1 = parseTime(localSettings.endOfDay1Timer) / 60;
    const dayN = parseTime(localSettings.dayNTimer) / 60;
    const nightN = parseTime(localSettings.endOfDayNTimer) / 60;

    const totalNumbers = timerValues.totalNumbers;
    const dayDecayValues = generateExponentialDecay(day1, dayN, totalNumbers);
    const nightDecayValues = generateExponentialDecay(night1, nightN, totalNumbers);

    setTimerPreview({
      dayValues: dayDecayValues,
      endOfDayValues: nightDecayValues,
    });
  };

  useEffect(() => {
    if (isOpen) {
      const timerValues = calcTimerStartEndValues(settings.playerCount);
      const day1Value = getNumericSetting('settings_game_day1', timerValues.dayStartValue);
      const night1Value = getNumericSetting('settings_game_night1', timerValues.nightStartValue);
      const dayNValue = getNumericSetting('settings_game_dayn', timerValues.dayEndValue);
      const nightNValue = getNumericSetting('settings_game_nightn', timerValues.dayEndValue);
      
      const newSettings = {
        playerCount: settings.playerCount,
        travelerCount: settings.travelerCount,
        linkedTimer: settings.linkedTimer,
        featureSpotify: settings.featureSpotify,
        featureRoles: settings.featureRoles,
        gameSounds: settings.gameSounds,
        stepSize: settings.stepSize,
        day1Timer: formatTime(roundToNearestQuarter(day1Value) * 60),
        endOfDay1Timer: formatTime(roundToNearestQuarter(night1Value) * 60),
        dayNTimer: formatTime(roundToNearestQuarter(dayNValue) * 60),
        endOfDayNTimer: formatTime(roundToNearestQuarter(nightNValue) * 60),
        spotifyVolumes: [...settings.spotifyVolumes],
        keybindings: { ...settings.keybindings },
      };
      
      setLocalSettings(newSettings);
      
      // Update preview
      setTimeout(() => {
        const day1 = parseTime(newSettings.day1Timer) / 60;
        const night1 = parseTime(newSettings.endOfDay1Timer) / 60;
        const dayN = parseTime(newSettings.dayNTimer) / 60;
        const nightN = parseTime(newSettings.endOfDayNTimer) / 60;
        const totalNumbers = timerValues.totalNumbers;
        const dayDecayValues = generateExponentialDecay(day1, dayN, totalNumbers);
        const nightDecayValues = generateExponentialDecay(night1, nightN, totalNumbers);
        setTimerPreview({
          dayValues: dayDecayValues,
          endOfDayValues: nightDecayValues,
        });
      }, 100);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (isOpen) {
      updateTimerPreview();
    }
  }, [
    localSettings.playerCount,
    localSettings.day1Timer,
    localSettings.endOfDay1Timer,
    localSettings.dayNTimer,
    localSettings.endOfDayNTimer,
    isOpen,
  ]);

  const handlePlayerCountChange = (value: number) => {
    const timerValues = calcTimerStartEndValues(value);
    setLocalSettings({
      ...localSettings,
      playerCount: value,
      ...(localSettings.linkedTimer
        ? {
            day1Timer: formatTime(roundToNearestQuarter(timerValues.dayStartValue) * 60),
            dayNTimer: formatTime(roundToNearestQuarter(timerValues.dayEndValue) * 60),
            endOfDay1Timer: formatTime(roundToNearestQuarter(timerValues.nightStartValue) * 60),
            endOfDayNTimer: formatTime(roundToNearestQuarter(timerValues.nightEndValue) * 60),
          }
        : {}),
    });
  };

  const handleSave = () => {
    // Update settings store
    useSettingsStore.setState({
      playerCount: localSettings.playerCount,
      travelerCount: localSettings.travelerCount,
      linkedTimer: localSettings.linkedTimer,
      featureSpotify: localSettings.featureSpotify,
      featureRoles: localSettings.featureRoles,
      gameSounds: localSettings.gameSounds,
      stepSize: localSettings.stepSize,
      spotifyVolumes: localSettings.spotifyVolumes,
      keybindings: localSettings.keybindings,
    });

    // Recalculate time values
    const timerValues = calcTimerStartEndValues(localSettings.playerCount);
    const day1 = parseTime(localSettings.day1Timer) / 60;
    const night1 = parseTime(localSettings.endOfDay1Timer) / 60;
    const dayN = parseTime(localSettings.dayNTimer) / 60;
    const nightN = parseTime(localSettings.endOfDayNTimer) / 60;

    const totalNumbers = timerValues.totalNumbers;
    const dayDecayValues = generateExponentialDecay(day1, dayN, totalNumbers);
    const nightDecayValues = generateExponentialDecay(night1, nightN, totalNumbers);

    useSettingsStore.setState({
      timeValues: {
        day: convertToSeconds(dayDecayValues),
        endOfDay: convertToSeconds(nightDecayValues),
      },
    });

    // Update character counts
    updateCounts(localSettings.playerCount, localSettings.travelerCount);
    setStepSize(localSettings.stepSize);

    // Save to localStorage
    localStorage.setItem('settings_game_playercount', localSettings.playerCount.toString());
    localStorage.setItem('settings_game_travellercount', localSettings.travelerCount.toString());
    localStorage.setItem('settings_game_linkedtimer', localSettings.linkedTimer.toString());
    localStorage.setItem('settings_feature_spotify', localSettings.featureSpotify.toString());
    localStorage.setItem('settings_feature_roles', localSettings.featureRoles.toString());
    localStorage.setItem('settings_game_sounds', localSettings.gameSounds.toString());
    localStorage.setItem('settings_timer_stepsize', localSettings.stepSize.toString());
    localStorage.setItem('settings_game_day1', day1.toString());
    localStorage.setItem('settings_game_night1', night1.toString());
    localStorage.setItem('settings_game_dayn', dayN.toString());
    localStorage.setItem('settings_game_nightn', nightN.toString());
    localStorage.setItem('settings_spotify_dawn', localSettings.spotifyVolumes[0].toString());
    localStorage.setItem('settings_spotify_dusk', localSettings.spotifyVolumes[1].toString());
    localStorage.setItem('settings_spotify_night', localSettings.spotifyVolumes[2].toString());

    // Save keybindings
    const kb = localSettings.keybindings;
    if (Array.isArray(kb.startstop)) {
      localStorage.setItem('settings_key_timerstart', kb.startstop[0] || 'Spacebar');
    } else {
      localStorage.setItem('settings_key_timerstart', kb.startstop || 'Spacebar');
    }
    if (Array.isArray(kb.nextphase)) {
      localStorage.setItem('settings_key_phasenext', kb.nextphase[0] || 'N');
      localStorage.setItem('settings_key_phasenextalt', kb.nextphase[1] || 'Enter');
    } else {
      localStorage.setItem('settings_key_phasenext', kb.nextphase || 'N');
    }
    if (typeof kb.reset === 'string') {
      localStorage.setItem('settings_key_timerreset', kb.reset);
    }
    if (typeof kb.timer === 'string') {
      localStorage.setItem('settings_key_timeredit', kb.timer);
    }
    if (Array.isArray(kb.timeplus)) {
      localStorage.setItem('settings_key_timerplus', kb.timeplus[0] || 'ArrowUp');
      localStorage.setItem('settings_key_timerplusalt', kb.timeplus[1] || 'ArrowRight');
      localStorage.setItem('settings_key_timerplusalt2', kb.timeplus[2] || '+');
    }
    if (Array.isArray(kb.timeminus)) {
      localStorage.setItem('settings_key_timerminus', kb.timeminus[0] || 'ArrowDown');
      localStorage.setItem('settings_key_timerminusalt', kb.timeminus[1] || 'ArrowLeft');
      localStorage.setItem('settings_key_timerminusalt2', kb.timeminus[2] || '-');
    }
    if (typeof kb.recall === 'string') {
      localStorage.setItem('settings_key_recall', kb.recall);
    }
    if (typeof kb.previousphase === 'string') {
      localStorage.setItem('settings_key_phaseprev', kb.previousphase);
    }
    if (typeof kb.aliveplus === 'string') {
      localStorage.setItem('settings_key_aliveplus', kb.aliveplus);
    }
    if (typeof kb.aliveminus === 'string') {
      localStorage.setItem('settings_key_aliveminus', kb.aliveminus);
    }
    if (typeof kb.voteplus === 'string') {
      localStorage.setItem('settings_key_voteplus', kb.voteplus);
    }
    if (typeof kb.voteminus === 'string') {
      localStorage.setItem('settings_key_voteminus', kb.voteminus);
    }
    if (typeof kb.mute === 'string') {
      localStorage.setItem('settings_key_togglemute', kb.mute);
    }
    if (typeof kb.fullscreen === 'string') {
      localStorage.setItem('settings_key_togglefullscreen', kb.fullscreen);
    }
    if (typeof kb.toggleinfo === 'string') {
      localStorage.setItem('settings_key_toggleinfo', kb.toggleinfo);
    }
    if (typeof kb.togglesettings === 'string') {
      localStorage.setItem('settings_key_togglesettings', kb.togglesettings);
    }

    // Reload settings to apply keybindings
    useSettingsStore.getState().loadSettings();

    onClose();
  };

  if (!isOpen) return null;

  const timerValues = calcTimerStartEndValues(localSettings.playerCount);
  const dayNLabel = `Day ${Math.ceil(timerValues.totalNumbers)}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.dialog
          open={isOpen}
          className="bg-[rgb(30,30,30)] text-clocktower-text p-6 rounded-[50px] max-h-[90vh] overflow-y-auto w-[90vw] max-w-3xl text-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-almendra">Settings</h1>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-clocktower-gold hover:text-clocktower-red transition-colors text-lg"
              title="Information"
            >
              <i className="fas fa-info-circle"></i>
            </button>
          </div>

          {showInfo && (
            <motion.div
              className="bg-clocktower-dark p-3 rounded-lg mb-3 text-left text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                className="float-right text-lg font-bold cursor-pointer text-clocktower-text hover:text-clocktower-red"
                onClick={() => setShowInfo(false)}
              >
                ×
              </button>
              <p className="mb-2">
                About: This is a timer for Blood on the Clocktower. Use the controls to start,
                stop, reset, and adjust the timer. Advance phases to progress through the game.
              </p>
              <p className="mb-2">
                You may control this app using configurable keyboard-shortcuts.
              </p>
              <p className="text-xs italic">
                Disclaimer: Clocktowertimer is open source and not affiliated with The Pandemonium
                Institute.
              </p>
            </motion.div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <fieldset className="border border-white/20 p-3 rounded">
              <legend className="font-almendra text-sm px-2">Gamestate</legend>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <label className="text-right pr-2">Starting Player Count</label>
                <input
                  type="number"
                  min="5"
                  max="15"
                  value={localSettings.playerCount}
                  onChange={(e) =>
                    handlePlayerCountChange(parseInt(e.target.value) || 5)
                  }
                  className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                />

                <label className="text-right pr-2">Linked Timer</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.linkedTimer}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, linkedTimer: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                </div>

                <label className="text-right pr-2">Traveller Count</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={localSettings.travelerCount}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      travelerCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                />
              </div>

              <div className="mt-3 space-y-2">
                <div className="text-sm mb-1">Day 1</div>
                <div className="flex items-center gap-2 text-sm">
                  <label className="w-6 text-center">
                    <i className="fa fa-comments"></i>
                  </label>
                  <input
                    type="text"
                    value={localSettings.day1Timer}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, day1Timer: e.target.value });
                    }}
                    className={`bg-gray-700 text-white p-1 rounded text-center w-[75px] ${
                      localSettings.linkedTimer ? 'bg-red-900/50' : ''
                    }`}
                  />
                  <label className="w-6 text-center">
                    <i className="fa fa-skull"></i>
                  </label>
                  <input
                    type="text"
                    value={localSettings.endOfDay1Timer}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, endOfDay1Timer: e.target.value });
                    }}
                    className={`bg-gray-700 text-white p-1 rounded text-center w-[75px] ${
                      localSettings.linkedTimer ? 'bg-red-900/50' : ''
                    }`}
                  />
                </div>

                <div className="text-sm mb-1 mt-3">{dayNLabel}</div>
                <div className="flex items-center gap-2 text-sm">
                  <label className="w-6 text-center">
                    <i className="fa fa-comments"></i>
                  </label>
                  <input
                    type="text"
                    value={localSettings.dayNTimer}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, dayNTimer: e.target.value });
                    }}
                    className={`bg-gray-700 text-white p-1 rounded text-center w-[75px] ${
                      localSettings.linkedTimer ? 'bg-red-900/50' : ''
                    }`}
                  />
                  <label className="w-6 text-center">
                    <i className="fa fa-skull"></i>
                  </label>
                  <input
                    type="text"
                    value={localSettings.endOfDayNTimer}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, endOfDayNTimer: e.target.value });
                    }}
                    className={`bg-gray-700 text-white p-1 rounded text-center w-[75px] ${
                      localSettings.linkedTimer ? 'bg-red-900/50' : ''
                    }`}
                  />
                </div>
              </div>

              {timerPreview && (
                <div className="mt-3">
                  <table className="border border-white/30 rounded p-1 mx-auto text-xs">
                    <thead>
                      <tr>
                        <th className="px-1">Day</th>
                        {timerPreview.dayValues.map((_, idx) => (
                          <th key={idx} className="px-1">
                            {idx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="px-1">
                          <i className="fa fa-comments"></i>
                        </th>
                        {timerPreview.dayValues.map((minutes, idx) => (
                          <td key={idx} className="px-1 text-center">
                            {formatTime(minutes * 60)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="px-1">
                          <i className="fa fa-skull"></i>
                        </th>
                        {timerPreview.endOfDayValues.map((minutes, idx) => (
                          <td key={idx} className="px-1 text-center">
                            {formatTime(minutes * 60)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </fieldset>

            <fieldset className="border border-white/20 p-3 rounded">
              <legend className="font-almendra text-sm px-2">Features</legend>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <label className="text-right pr-2">Spotify</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.featureSpotify}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, featureSpotify: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                </div>

                <label className="text-right pr-2">Life & Vote Trackers</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.featureRoles}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, featureRoles: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                </div>

                <label className="text-right pr-2">App Audio</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.gameSounds}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, gameSounds: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </fieldset>

            {localSettings.featureSpotify && (
              <fieldset className="border border-white/20 p-3 rounded">
                <legend className="font-almendra text-sm px-2">Spotify</legend>
                <div className="space-y-2 text-sm">
                  <div>
                    <a
                      href="spotify.html"
                      target="_blank"
                      className="text-clocktower-gold hover:text-clocktower-red underline"
                    >
                      Connect Clocktowertimer to Spotify API
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <span className="text-right pr-2">Adjust Volume:</span>
                    <div></div>
                    <label className="text-right pr-2">
                      <i className="fa fa-moon"></i>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={localSettings.spotifyVolumes[2]}
                      onChange={(e) => {
                        const newVolumes = [...localSettings.spotifyVolumes];
                        newVolumes[2] = parseInt(e.target.value) || 0;
                        setLocalSettings({ ...localSettings, spotifyVolumes: newVolumes });
                      }}
                      className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                    />
                    <label className="text-right pr-2">
                      <i className="fa fa-comments"></i>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={localSettings.spotifyVolumes[0]}
                      onChange={(e) => {
                        const newVolumes = [...localSettings.spotifyVolumes];
                        newVolumes[0] = parseInt(e.target.value) || 0;
                        setLocalSettings({ ...localSettings, spotifyVolumes: newVolumes });
                      }}
                      className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                    />
                    <label className="text-right pr-2">
                      <i className="fa fa-skull"></i>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={localSettings.spotifyVolumes[1]}
                      onChange={(e) => {
                        const newVolumes = [...localSettings.spotifyVolumes];
                        newVolumes[1] = parseInt(e.target.value) || 0;
                        setLocalSettings({ ...localSettings, spotifyVolumes: newVolumes });
                      }}
                      className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                    />
                  </div>
                  <div className="mt-2 space-x-2">
                    <span className="text-sm">Test:</span>
                    <button
                      type="button"
                      onClick={() => togglePlay(true)}
                      className="bg-clocktower-dark text-clocktower-gold px-2 py-1 rounded text-xs hover:bg-clocktower-gold hover:text-black transition-colors"
                    >
                      Toggle Play/Pause
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolume(localSettings.spotifyVolumes[2], true)}
                      className="bg-clocktower-dark text-clocktower-gold px-2 py-1 rounded text-xs hover:bg-clocktower-gold hover:text-black transition-colors"
                    >
                      Volume at Night
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolume(localSettings.spotifyVolumes[0], true)}
                      className="bg-clocktower-dark text-clocktower-gold px-2 py-1 rounded text-xs hover:bg-clocktower-gold hover:text-black transition-colors"
                    >
                      Volume at Dawn
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolume(localSettings.spotifyVolumes[1], true)}
                      className="bg-clocktower-dark text-clocktower-gold px-2 py-1 rounded text-xs hover:bg-clocktower-gold hover:text-black transition-colors"
                    >
                      Volume at Dusk
                    </button>
                  </div>
                </div>
              </fieldset>
            )}

            <fieldset className="border border-white/20 p-3 rounded">
              <legend className="font-almendra text-sm px-2">Timer</legend>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <label className="text-right pr-2">Step width for +/-</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  step="1"
                  value={localSettings.stepSize}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      stepSize: parseInt(e.target.value) || 15,
                    })
                  }
                  className="bg-gray-700 text-white p-1 rounded text-center w-[75px]"
                />
              </div>
            </fieldset>

            <KeybindingsEditor
              onKeybindingsChange={(keybindings) =>
                setLocalSettings({ ...localSettings, keybindings })
              }
            />

            <div className="flex gap-4 justify-end mt-4">
              <Button type="button" onClick={onClose} variant="default" className="text-sm">
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="text-sm">
                Save Settings
              </Button>
            </div>
          </form>
        </motion.dialog>
      </motion.div>
    </AnimatePresence>
  );
}
