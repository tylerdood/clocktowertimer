import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const files = {
  bell: require('../assets/sounds/bell.wav'),
  day: require('../assets/sounds/day.wav'),
  night: require('../assets/sounds/night.wav'),
  endOfDay: require('../assets/sounds/endofday.wav'),
  knife: require('../assets/sounds/knife.wav'),
  wind: require('../assets/sounds/wind.wav'),
  tissue: require('../assets/sounds/tissue.wav'),
  page: require('../assets/sounds/page.wav'),
  accept: require('../assets/sounds/accept.mp3'),
  ambience: require('../assets/sounds/ambience.wav'),
  win: require('../assets/sounds/win.wav'),
};
export type SoundKey = keyof typeof files;

const players: Partial<Record<SoundKey, AudioPlayer>> = {};
let enabled = true;

export function initAudio() {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
}
export function setSoundEnabled(on: boolean) {
  enabled = on;
}
export function play(key: SoundKey) {
  if (!enabled) return;
  try {
    const p = (players[key] ??= createAudioPlayer(files[key]));
    p.seekTo(0);
    p.play();
  } catch {
    /* audio is best-effort */
  }
}
