import { useEffect, useRef } from 'react';
import { usePhaseStore } from '../store/phaseStore';
import { useTimerStore } from '../store/timerStore';
import { useSettingsStore } from '../store/settingsStore';
import { useSound } from './useSound';
import { useSpotify } from './useSpotify';

export function usePhase() {
  const { currentPhase, currentDay, advancePhase, previousPhase } = usePhaseStore();
  const { isRunning, stopTimer } = useTimerStore();
  const { timeValues } = useSettingsStore();
  const { playDaySound, playEndOfDaySound, playNightSound } = useSound();
  const { setVolume: setSpotifyVolume, isConnected } = useSpotify();
  const previousPhaseRef = useRef(currentPhase);
  const previousDayRef = useRef(currentDay);

  // Update default time and timeRemaining when phase or day changes (if timer not running)
  useEffect(() => {
    // Only update if phase or day actually changed, not just when isRunning changes
    const phaseChanged = previousPhaseRef.current !== currentPhase;
    const dayChanged = previousDayRef.current !== currentDay;
    
    if (!phaseChanged && !dayChanged) {
      // Update refs but don't change timer
      previousPhaseRef.current = currentPhase;
      previousDayRef.current = currentDay;
      return;
    }

    if (isRunning) {
      // Update refs but don't change timer if running
      previousPhaseRef.current = currentPhase;
      previousDayRef.current = currentDay;
      return;
    }

    const dayIndex = Math.min(currentDay - 1, timeValues.day.length - 1);

    if (currentPhase === 'DAY' || currentPhase === 'ENDOFDAY') {
      const newTime = currentPhase === 'DAY' 
        ? timeValues.day[dayIndex] 
        : timeValues.endOfDay[dayIndex];
      
      // Update both defaultTime and timeRemaining when phase/day changes
      useTimerStore.setState({ 
        defaultTime: newTime,
        timeRemaining: newTime 
      });
    }

    // Update refs
    previousPhaseRef.current = currentPhase;
    previousDayRef.current = currentDay;
  }, [currentPhase, currentDay, timeValues, isRunning]);

  const advance = () => {
    advancePhase();
    
    // Stop timer if running
    if (isRunning) {
      stopTimer();
    }
    
    // Play sounds and adjust Spotify volume
    setTimeout(() => {
      const newPhase = usePhaseStore.getState().currentPhase;
      if (newPhase === 'DAY') {
        playDaySound();
        if (isConnected) {
          setSpotifyVolume(useSettingsStore.getState().spotifyVolumes[0]);
        }
      } else if (newPhase === 'ENDOFDAY') {
        playEndOfDaySound();
        if (isConnected) {
          setSpotifyVolume(useSettingsStore.getState().spotifyVolumes[1]);
        }
      } else if (newPhase === 'NIGHT') {
        playNightSound();
        if (isConnected) {
          setSpotifyVolume(useSettingsStore.getState().spotifyVolumes[2]);
        }
      }
    }, 100);
  };

  const previous = () => {
    if (currentDay === 1 && currentPhase === 'NIGHT') return;
    previousPhase();
  };

  return {
    currentPhase,
    currentDay,
    advance,
    previous,
  };
}

