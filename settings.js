let keybindings = {
  startstop: [" ", "Spacebar"],
  reset: "Backspace",
  timer: "Z",
  timeplus: ["Up", "ArrowUp", "Right", "ArrowRight", "+"],
  timeminus: ["Down", "ArrowDown", "Left", "ArrowLeft", "-"],
  recall: "R",
  nextphase: ["N", "Enter"],
  previousphase: "P",
  aliveplus: "Z",
  aliveminus: "X",
  voteplus: "C",
  voteminus: "V",
  toggleinfo: "I",
  mute: "D",
  fullscreen: "F",
  togglesettings: "Q",
};
let stepSize = 15;
let volume = [50, 30, 80];

function getSetting(key, def = null) {
  const setting = localStorage.getItem(key);
  if (setting == null || setting == "undefined") {
    return def;
  }
  return setting;
}
function getBooleanSetting(key, def = false) {
  const setting = getSetting(key, def);
  if (typeof setting == "string") {
    return setting.toLowerCase() === "true";
  }
  return setting === true;
}

function getNumericSetting(key, def = 0) {
  const setting = getSetting(key, def);
  return Number(setting);
}

function setSetting(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Load settings from **localStorage** and apply them to the app
 */
function loadSettings() {
  const playercount = (document.getElementById("playerCountInput").value =
    getNumericSetting("settings_game_playercount", 10));
  document.getElementById("linkedTimerInput").checked = getBooleanSetting(
    "settings_game_linkedtimer",
    true
  );
  settingsLinkedTimer();
  const travellercount = (document.getElementById("travellerCountInput").value =
    getNumericSetting("settings_game_travellercount", 0));
  updatePlayerCount(playercount, travellercount);
  const timerValues = calcTimerStartEndValues(playercount);
  document.getElementById("day1TimerInput").value = formatTime(
    roundToNearestQuarter(
      getNumericSetting("settings_game_day1", timerValues["dayStartValue"])
    ) * 60
  );
  document.getElementById("endofday1TimerInput").value = formatTime(
    roundToNearestQuarter(
      getNumericSetting("settings_game_night1", timerValues["nightStartValue"])
    ) * 60
  );
  document.getElementById("settingsDayN").innerHTML = `Day ${Math.ceil(
    timerValues["totalNumbers"]
  )}`;
  document.getElementById("dayNTimerInput").value = formatTime(
    roundToNearestQuarter(
      getNumericSetting("settings_game_dayn", timerValues["dayEndValue"])
    ) * 60
  );
  document.getElementById("endofdayNTimerInput").value = formatTime(
    roundToNearestQuarter(
      getNumericSetting("settings_game_nightn", timerValues["dayEndValue"])
    ) * 60
  );
  settingsUpdateTimer(true);
  document.getElementById("featureSpotify").checked = getBooleanSetting(
    "settings_feature_spotify",
    false
  );
  settingsFeatureSpotifyTimer();
  let featureRoles = (document.getElementById("featureRoles").checked =
    getBooleanSetting("settings_feature_roles", true));
  const controlElementsSelector =
    "#timerControlsContainer .informationText:last-of-type, #increaseHeart, #decreaseHeart, #decreaseVote, #increaseVote, #trackerDivider";
  if (!featureRoles) {
    document
      .getElementById("roleDistributionContainer")
      .classList.add("hidden");
    document.querySelectorAll(controlElementsSelector).forEach((elem) => {
      elem.classList.add("noDisplay");
    });
    document
      .getElementById("timerControlsContainer")
      .classList.add("grid-2-columns");
  } else {
    document
      .getElementById("roleDistributionContainer")
      .classList.remove("hidden");
    document.querySelectorAll(controlElementsSelector).forEach((elem) => {
      elem.classList.remove("noDisplay");
    });
    document
      .getElementById("timerControlsContainer")
      .classList.remove("grid-2-columns");
  }
  volume[2] = document.getElementById("nightVolumeInput").value =
    getNumericSetting("settings_spotify_night", "80");
  volume[0] = document.getElementById("dawnVolumeInput").value =
    getNumericSetting("settings_spotify_dawn", "50");
  volume[1] = document.getElementById("duskVolumeInput").value =
    getNumericSetting("settings_spotify_dusk", "30");
  stepSize = document.getElementById("stepSizeInput").value = getNumericSetting(
    "settings_timer_stepsize",
    "15"
  );
  let bind1, bind2, bind3;
  keybindings["startstop"] = document.getElementById("timerstart").innerHTML =
    getSetting("settings_key_timerstart", "Spacebar");
  keybindings["recall"] = document.getElementById("recall").innerHTML =
    getSetting("settings_key_recall", "R");
  bind1 = document.getElementById("phasenext").innerHTML = getSetting(
    "settings_key_phasenext",
    "N"
  );
  bind2 = document.getElementById("phasenextalt").innerHTML = getSetting(
    "settings_key_phasenextalt",
    "Enter"
  );
  keybindings["nextphase"] = [bind1, bind2];
  keybindings["previousphase"] = document.getElementById(
    "phaseprev"
  ).innerHTML = getSetting("settings_key_phaseprev", "P");
  keybindings["aliveplus"] = document.getElementById("aliveplus").innerHTML =
    getSetting("settings_key_aliveplus", "Z");
  keybindings["aliveminus"] = document.getElementById("aliveminus").innerHTML =
    getSetting("settings_key_aliveminus", "X");
  keybindings["voteplus"] = document.getElementById("voteplus").innerHTML =
    getSetting("settings_key_voteplus", "C");
  keybindings["voteminus"] = document.getElementById("voteminus").innerHTML =
    getSetting("settings_key_voteminus", "V");
  keybindings["reset"] = document.getElementById("timerreset").innerHTML =
    getSetting("settings_key_timerreset", "Backspace");
  keybindings["timer"] = document.getElementById("timeredit").innerHTML =
    getSetting("settings_key_timeredit", "Z");
  bind1 = document.getElementById("timerplus").innerHTML = getSetting(
    "settings_key_timerplus",
    "ArrowUp"
  );
  bind2 = document.getElementById("timerplusalt").innerHTML = getSetting(
    "settings_key_timerplusalt",
    "ArrowRight"
  );
  bind3 = document.getElementById("timerplusalt2").innerHTML = getSetting(
    "settings_key_timerplusalt2",
    "+"
  );
  keybindings["timeplus"] = [bind1, bind2, bind3];
  bind1 = document.getElementById("timerminus").innerHTML = getSetting(
    "settings_key_timerminus",
    "ArrowDown"
  );
  bind2 = document.getElementById("timerminusalt").innerHTML = getSetting(
    "settings_key_timerminusalt",
    "ArrowLeft"
  );
  bind3 = document.getElementById("timerminusalt2").innerHTML = getSetting(
    "settings_key_timerminusalt2",
    "-"
  );
  keybindings["timeminus"] = [bind1, bind2, bind3];
  keybindings["mute"] = document.getElementById("togglemute").innerHTML =
    getSetting("settings_key_togglemute", "D");
  keybindings["fullscreen"] = document.getElementById(
    "togglefullscreen"
  ).innerHTML = getSetting("settings_key_togglefullscreen", "F");
  keybindings["toggleinfo"] = document.getElementById("toggleinfo").innerHTML =
    getSetting("settings_key_toggleinfo", "I");
  keybindings["togglesettings"] = document.getElementById(
    "togglesettings"
  ).innerHTML = getSetting("settings_key_togglesettings", "Q");
  fillAlternativeKeys(keybindings);
}
loadSettings();

function fillAlternativeKeys(keys) {
  for (const k in keys) {
    if (typeof keys[k] === "string") {
      keys[k] = [keys[k]];
    }
    if (keys[k].includes("Spacebar")) keys[k].push(" ");
    else if (keys[k].includes(" ")) keys[k].push("Spacebar");
    if (keys[k].includes("Up")) keys[k].push("ArrowUp");
    else if (keys[k].includes("ArrowUp")) keys[k].push("Up");
    if (keys[k].includes("Down")) keys[k].push("ArrowDown");
    else if (keys[k].includes("ArrowDown")) keys[k].push("Down");
    if (keys[k].includes("Left")) keys[k].push("ArrowLeft");
    else if (keys[k].includes("ArrowLeft")) keys[k].push("Left");
    if (keys[k].includes("Right")) keys[k].push("ArrowRight");
    else if (keys[k].includes("ArrowRight")) keys[k].push("Right");
  }
}

/**
 * Store settings to **localStorage** and apply them to the app
 */
function saveSettings() {
  setSetting(
    "settings_game_playercount",
    document.getElementById("playerCountInput").value
  );
  setSetting(
    "settings_game_linkedtimer",
    document.getElementById("linkedTimerInput").checked
  );
  setSetting(
    "settings_game_travellercount",
    document.getElementById("travellerCountInput").value
  );
  setSetting(
    "settings_game_day1",
    parseTime(document.getElementById("day1TimerInput").value) / 60
  );
  setSetting(
    "settings_game_night1",
    parseTime(document.getElementById("endofday1TimerInput").value) / 60
  );
  setSetting(
    "settings_game_dayn",
    parseTime(document.getElementById("dayNTimerInput").value) / 60
  );
  setSetting(
    "settings_game_nightn",
    parseTime(document.getElementById("endofdayNTimerInput").value) / 60
  );
  setSetting(
    "settings_feature_spotify",
    document.getElementById("featureSpotify").checked
  );
  setSetting(
    "settings_feature_roles",
    document.getElementById("featureRoles").checked
  );
  setSetting(
    "settings_spotify_night",
    document.getElementById("nightVolumeInput").value
  );
  setSetting(
    "settings_spotify_dawn",
    document.getElementById("dawnVolumeInput").value
  );
  setSetting(
    "settings_spotify_dusk",
    document.getElementById("duskVolumeInput").value
  );
  setSetting(
    "settings_timer_stepsize",
    document.getElementById("stepSizeInput").value
  );
  setSetting(
    "settings_key_timerstart",
    document.getElementById("timerstart").innerHTML
  );
  setSetting(
    "settings_key_recall",
    document.getElementById("recall").innerHTML
  );
  setSetting(
    "settings_key_phasenext",
    document.getElementById("phasenext").innerHTML
  );
  setSetting(
    "settings_key_phasenextalt",
    document.getElementById("phasenextalt").innerHTML
  );
  setSetting(
    "settings_key_phaseprev",
    document.getElementById("phaseprev").innerHTML
  );
  setSetting(
    "settings_key_aliveplus",
    document.getElementById("aliveplus").innerHTML
  );
  setSetting(
    "settings_key_aliveminus",
    document.getElementById("aliveminus").innerHTML
  );
  setSetting(
    "settings_key_voteplus",
    document.getElementById("voteplus").innerHTML
  );
  setSetting(
    "settings_key_voteminus",
    document.getElementById("voteminus").innerHTML
  );
  setSetting(
    "settings_key_timerreset",
    document.getElementById("timerreset").innerHTML
  );
  setSetting(
    "settings_key_timeredit",
    document.getElementById("timeredit").innerHTML
  );
  setSetting(
    "settings_key_timerplus",
    document.getElementById("timerplus").innerHTML
  );
  setSetting(
    "settings_key_timerplusalt",
    document.getElementById("timerplusalt").innerHTML
  );
  setSetting(
    "settings_key_timerplusalt2",
    document.getElementById("timerplusalt2").innerHTML
  );
  setSetting(
    "settings_key_timerminus",
    document.getElementById("timerminus").innerHTML
  );
  setSetting(
    "settings_key_timerminusalt",
    document.getElementById("timerminusalt").innerHTML
  );
  setSetting(
    "settings_key_timerminusalt2",
    document.getElementById("timerminusalt2").innerHTML
  );
  setSetting(
    "settings_key_togglemute",
    document.getElementById("togglemute").innerHTML
  );
  setSetting(
    "settings_key_togglefullscreen",
    document.getElementById("togglefullscreen").innerHTML
  );
  setSetting(
    "settings_key_toggleinfo",
    document.getElementById("toggleinfo").innerHTML
  );
  setSetting(
    "settings_key_togglesettings",
    document.getElementById("togglesettings").innerHTML
  );
}

let keyId = null;
function waitForKey(e) {
  keyId = e.target.id;
  document.querySelectorAll(".key.active").forEach((elem) => {
    elem.classList.remove("active");
  });
  document.getElementById(keyId).classList.add("active");
  document.addEventListener(
    "keydown",
    (ke) => {
      let key = ke.key.length === 1 ? ke.key.toUpperCase() : ke.key;
      if (key === " ") key = "Spacebar";
      if (key !== "Escape") {
        document.getElementById(keyId).innerText = key;
      }
      document.getElementById(keyId).classList.remove("active");
      document.getElementById(keyId).blur();
      ke.preventDefault();
    },
    { once: true }
  );
  e.preventDefault(); // prevent dialog from closing
}
document
  .querySelector("#settings")
  .querySelectorAll(".key")
  .forEach((elem) => {
    elem.addEventListener("click", waitForKey);
  });

function settingsFeatureSpotifyTimer() {
  const fsSpotify = document.querySelector('fieldset[name="spotify"]');
  if (document.getElementById("featureSpotify").checked) {
    fsSpotify.classList.remove("noDisplay");
  } else {
    fsSpotify.classList.add("noDisplay");
  }
}

document
  .getElementById("featureSpotify")
  .addEventListener("change", settingsFeatureSpotifyTimer);

function settingsFeatureRolesTrackers() {
  const trackerkeys = document.getElementById('trackerkeys');
  if (document.getElementById("featureRoles").checked) {
    trackerkeys.classList.remove("noDisplay");
  } else {
    trackerkeys.classList.add("noDisplay");
  }
}

document
  .getElementById("featureRoles")
  .addEventListener("change", settingsFeatureRolesTrackers);

function settingsUpdateTimeValues() {
  const timerValues = calcTimerStartEndValues(
    document.getElementById("playerCountInput").value
  );
  document.getElementById("settingsDayN").innerHTML = `Day ${Math.ceil(
    timerValues["totalNumbers"]
  )}`;
  if (document.getElementById("linkedTimerInput").checked) {
    document.getElementById("day1TimerInput").value = formatTime(
      roundToNearestQuarter(timerValues["dayStartValue"]) * 60
    );
    document.getElementById("dayNTimerInput").value = formatTime(
      roundToNearestQuarter(timerValues["dayEndValue"]) * 60
    );
    document.getElementById("endofday1TimerInput").value = formatTime(
      roundToNearestQuarter(timerValues["nightStartValue"]) * 60
    );
    document.getElementById("endofdayNTimerInput").value = formatTime(
      roundToNearestQuarter(timerValues["nightEndValue"]) * 60
    );
  }
  settingsUpdateTimer();
}
document
  .getElementById("playerCountInput")
  .addEventListener("change", settingsUpdateTimeValues);

function settingsUpdateTimer(save = false) {
  const totalNumbers = calcTimerStartEndValues(
    document.getElementById("playerCountInput").value
  )["totalNumbers"];
  const dayStartValue =
    parseTime(document.getElementById("day1TimerInput").value) / 60;
  const dayEndValue =
    parseTime(document.getElementById("dayNTimerInput").value) / 60;
  const nightStartValue =
    parseTime(document.getElementById("endofday1TimerInput").value) / 60;
  const nightEndValue =
    parseTime(document.getElementById("endofdayNTimerInput").value) / 60;

  let dayDecayValues = generateExponentialDecay(
    dayStartValue,
    dayEndValue,
    totalNumbers
  );
  let nightDecayValues = generateExponentialDecay(
    nightStartValue,
    nightEndValue,
    totalNumbers
  );
  let table = "<table><tr><th>Day</th>";
  dayDecayValues.forEach((day, idx) => {
    table += `<td>${idx + 1}</td>`;
  });
  table += '</tr><tr><th><i class="fa fa-comments"></i></th>';
  dayDecayValues.forEach((minutes) => {
    table += `<td>${formatTime(minutes * 60)}</td>`;
  });
  table += '</tr><tr><th><i class="fa fa-skull"></i></th>';
  nightDecayValues.forEach((minutes) => {
    table += `<td>${formatTime(minutes * 60)}</td>`;
  });
  table += "</tr></table>";
  document.getElementById("settingsTimerPreview").innerHTML = table;
  if (save) {
    timeValues = {
      day: convertToSeconds(dayDecayValues),
      endOfDay: convertToSeconds(nightDecayValues),
    };
  }
}
document
  .getElementById("day1TimerInput")
  .addEventListener("change", settingsUpdateTimer);
document
  .getElementById("dayNTimerInput")
  .addEventListener("change", settingsUpdateTimer);
document
  .getElementById("endofday1TimerInput")
  .addEventListener("change", settingsUpdateTimer);
document
  .getElementById("endofdayNTimerInput")
  .addEventListener("change", settingsUpdateTimer);

function settingsLinkedTimer() {
  if (document.getElementById("linkedTimerInput").checked) {
    document.getElementById("settingsEditTimer").classList.add("autoupdate");
  } else {
    document.getElementById("settingsEditTimer").classList.remove("autoupdate");
  }
}
document
  .getElementById("linkedTimerInput")
  .addEventListener("change", settingsLinkedTimer);
