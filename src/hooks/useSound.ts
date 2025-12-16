import { useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const soundFiles = {
  endTimer: '/sounds/bell-fast.wav',
  daySound: '/sounds/bird-chip.wav',
  nightSound: '/sounds/owl.wav',
  endOfDaySound: '/sounds/flying-raven.wav',
  knifeSharpener: '/sounds/knifesharpener1.flac',
  shortWind: '/sounds/short wind sound.wav',
  tissueOutOfBox: '/sounds/Tissue Out Of Box Sfx.wav',
  pageTurning: '/sounds/Page Turning Sfx.wav',
  accept: '/sounds/Accept.mp3',
  ambience1: '/sounds/ambience-1.wav',
  winSound: '/sounds/Win sound.wav',
};

export function useSound() {
  const { gameSounds } = useSettingsStore();
  const soundsRef = useRef<Record<string, HTMLAudioElement>>({});

  // Preload sounds
  if (Object.keys(soundsRef.current).length === 0) {
    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      soundsRef.current[key] = audio;
    });
  }

  const playSound = (soundKey: keyof typeof soundFiles) => {
    if (!gameSounds) return;
    const sound = soundsRef.current[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore play errors (user interaction required)
      });
    }
  };

  return {
    playEndTimer: () => playSound('endTimer'),
    playDaySound: () => playSound('daySound'),
    playNightSound: () => playSound('nightSound'),
    playEndOfDaySound: () => playSound('endOfDaySound'),
    playKnifeSharpener: () => playSound('knifeSharpener'),
    playShortWind: () => playSound('shortWind'),
    playTissueOutOfBox: () => playSound('tissueOutOfBox'),
    playPageTurning: () => playSound('pageTurning'),
    playAccept: () => playSound('accept'),
    playAmbience1: () => playSound('ambience1'),
    playWinSound: () => playSound('winSound'),
    isMuted: !gameSounds,
  };
}



