import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { findKey } from '../utils/keybindings';
import { useTimer } from './useTimer';
import { usePhase } from './usePhase';
import { useCharacterStore } from '../store/characterStore';

export function useKeybindings() {
  const { keybindings } = useSettingsStore();
  const {
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    decrementTimer,
    isRunning,
  } = useTimer();
  const { advance, previous } = usePhase();
  const {
    increaseHeart,
    decreaseHeart,
    increaseVote,
    decreaseVote,
  } = useCharacterStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if a dialog is open
      if (document.querySelector('dialog[open]')) return;

      const action = findKey(e.key, keybindings);
      if (!action) return;

      e.preventDefault();

      switch (action) {
        case 'startstop':
          if (isRunning) {
            stopTimer();
          } else {
            startTimer();
          }
          break;
        case 'reset':
          resetTimer();
          break;
        case 'timer':
          // Edit timer - handled by component
          break;
        case 'timeplus':
          incrementTimer();
          break;
        case 'timeminus':
          decrementTimer();
          break;
        case 'recall':
          // Recall - handled by component
          break;
        case 'nextphase':
          advance();
          break;
        case 'previousphase':
          previous();
          break;
        case 'aliveplus':
          increaseHeart();
          break;
        case 'aliveminus':
          decreaseHeart();
          break;
        case 'voteplus':
          increaseVote();
          break;
        case 'voteminus':
          decreaseVote();
          break;
        case 'mute':
          // Mute - handled by settings
          break;
        case 'fullscreen':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    keybindings,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    decrementTimer,
    advance,
    previous,
    increaseHeart,
    decreaseHeart,
    increaseVote,
    decreaseVote,
  ]);
}

