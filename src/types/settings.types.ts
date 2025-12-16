export type Keybinding = string | string[];

export interface KeybindingMap {
  startstop: Keybinding;
  reset: Keybinding;
  timer: Keybinding;
  timeplus: Keybinding;
  timeminus: Keybinding;
  recall: Keybinding;
  nextphase: Keybinding;
  previousphase: Keybinding;
  aliveplus: Keybinding;
  aliveminus: Keybinding;
  voteplus: Keybinding;
  voteminus: Keybinding;
  toggleinfo: Keybinding;
  mute: Keybinding;
  fullscreen: Keybinding;
  togglesettings: Keybinding;
}

export interface Settings {
  playerCount: number;
  travelerCount: number;
  linkedTimer: boolean;
  featureSpotify: boolean;
  featureRoles: boolean;
  gameSounds: boolean;
  timeValues: {
    day: number[];
    endOfDay: number[];
  };
  keybindings: KeybindingMap;
  spotifyVolumes: number[];
  stepSize: number;
}



