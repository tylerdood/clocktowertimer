import { useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const soundFiles = {
  endTimer: '/sounds/bell-fast.wav',
  daySound: '/sounds/bird-chip.wav',
  nightSound: '/sounds/owl.wav',
  endOfDaySound: '/sounds/flying-raven.wav',
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
    isMuted: !gameSounds,
  };
}

