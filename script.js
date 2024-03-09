// Element references
const timeDisplay = document.getElementById("timeDisplay");
const startStopButton = document.getElementById("startStopButton");
const resetButton = document.getElementById("resetButton");
const incrementTimeButton = document.getElementById("incrementTime");
const editTimeButton = document.getElementById("editTime");
const decrementTimeButton = document.getElementById("decrementTime");
const recallButton = document.getElementById("recallButton");
const toggleTimeOfDayButton = document.getElementById("toggleTimeOfDayButton");
const dayValue = document.getElementById("dayValue");
const body = document.body;
const muteButton = document.getElementById("muteButton");
let timeValues = {}; // Initialize `timeValues` at a higher scope

function updateTimeValues(playerCount) {
  const startingPlayerCount = playerCount;
  const dayTotalNumbers = startingPlayerCount - startingPlayerCount / 5;
  const dayStartValue = startingPlayerCount * 0.6 + 3;
  const dayEndValue = 3;
  const nightTotalNumbers = startingPlayerCount - startingPlayerCount / 5;
  const nightStartValue = 4;
  const nightEndValue = 1;

  function roundToNearestQuarter(n) {
    return Math.round(n * 4) / 4;
  }

  function generateExponentialDecay(startValue, endValue, totalNumbers) {
    let values = [];
    let b = -Math.log(endValue / startValue);
    let step = 1 / (totalNumbers - 1);

    for (let i = 0; i < totalNumbers; i++) {
      let x = i * step;
      let y = startValue * Math.exp(-b * x);
      if (y < endValue) {
        y = endValue;
      }
      values.push(roundToNearestQuarter(y));
    }

    return values;
  }

  let dayDecayValues = generateExponentialDecay(
    dayStartValue,
    dayEndValue,
    dayTotalNumbers
  );
  let nightDecayValues = generateExponentialDecay(
    nightStartValue,
    nightEndValue,
    nightTotalNumbers
  );

  function convertToSeconds(values) {
    return values.map((value) => value * 60);
  }

  const dayDecayValuesSeconds = convertToSeconds(dayDecayValues);
  const nightDecayValuesSeconds = convertToSeconds(nightDecayValues);

  timeValues = {
    day: dayDecayValuesSeconds,
    endOfDay: nightDecayValuesSeconds,
  };
}

updateTimeValues(10);

function updateCharacterAmounts(userInput) {
  const characterAmounts = {
    5: [3, 0, 1, 1],
    6: [3, 1, 1, 1],
    7: [5, 0, 1, 1],
    8: [5, 1, 1, 1],
    9: [5, 2, 1, 1],
    10: [7, 0, 2, 1],
    11: [7, 1, 2, 1],
    12: [7, 2, 2, 1],
    13: [9, 0, 3, 1],
    14: [9, 1, 3, 1],
    15: [9, 2, 3, 1]
  };
  
  const numbersArray = characterAmounts[userInput];
  
  document.getElementById('townsfolkAmount').textContent = numbersArray[0];
  document.getElementById('outsiderAmount').textContent = numbersArray[1];
  document.getElementById('minionAmount').textContent = numbersArray[2];
  document.getElementById('demonAmount').textContent = numbersArray[3];
}


document.getElementById("updateButton").addEventListener("click", function () {
  let inputCount = parseInt(
    prompt(
      "Please enter a number between 5 and 15: (this will determine the default timer length)"
    )
  );
  if (inputCount >= 5 && inputCount <= 15) {
    updateTimeValues(inputCount);
  updateCharacterAmounts(inputCount);
  } else {
    alert("Please enter a valid number between 5 and 15.");
  }
});

// State variables
let isMuted = false;
let countdown;
let isTimerRunning = false;
let defaultTime = 180;
let timeRemaining = defaultTime;
let currentDay = 1;
let phase = 2;
const DAY = 0,
  ENDOFDAY = 1,
  NIGHT = 2;
let stepSize = 15;
let volume = [50, 30, 80];
let timeOfDayText = document.getElementById("timeOfDayText");
let keybindings = {
  startstop: [" ", "Spacebar"],
  reset: "Backspace",
  timer: "Z",
  timeplus: ["Up", "ArrowUp", "Right", "ArrowRight", "+"],
  timeminus: ["Down", "ArrowDown", "Left", "ArrowLeft", "-"],
  recall: "R",
  nextphase: ["N", "Enter"],
  previousphase: "P",
  day: "F1",
  endOfDay: "F2",
  night: "F3",
  nextday: "F4",
  toggleinfo: "Q",
  mute: "D",
  fullscreen: "F",
};

function findKey(search, map) {
  if (search.length == 1) search = search.toUpperCase();
  for (const key in map) {
    if (
      (typeof map[key] === "string" && map[key] === search) ||
      (typeof map[key] === "object" && map[key].includes(search))
    ) {
      return key;
    }
  }
  return null;
}

function parseKeydown(e) {
  let action = findKey(e.key, keybindings);
  switch (action) {
    case "startstop":
      startStopTimer();
      break;
    case "reset":
      resetTimer();
      break;
    case "timer":
      editTimer();
      break;
    case "timeplus":
      incrementTimer();
      break;
    case "timeminus":
      decrementTimer();
      break;
    case "recall":
      recall();
      break;
    case "nextphase":
      advanceTime();
      break;
    case "previousphase":
      if (currentDay == 1 && isNight()) break;
      if (!isEndOfDay()) {
        currentDay = currentDay - 1;
      }
      phase++;
      advanceTime();
      break;
    case "toggleinfo":
      const dialogueBox = document.getElementById("dialogueBox");
      if (dialogueBox.classList.contains("hidden")) {
        showInfo();
      } else {
        exitInfo();
      }
      break;
    case "mute":
      mute();
      break;
    case "fullscreen":
      if (
        document.fullscreenElement /* Standard syntax */ ||
        document.webkitFullscreenElement /* Safari and Opera syntax */ ||
        document.msFullscreenElement /* IE11 syntax */
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      } else {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          /* IE11 */
          elem.msRequestFullscreen();
        }
      }
      break;
    default:
      console.debug(`No Action for key: ${e.key} (${e.keyCode})`);
  }
  if (action != null) {
    e.preventDefault();
  }
}

document.addEventListener("keydown", parseKeydown);

function isDay() {
  return phase == DAY;
}

function isEndOfDay() {
  return phase == ENDOFDAY;
}

function isNight() {
  return phase == NIGHT;
}

function applyConfig(config) {
  if (config.timeValues) {
    if (!("day" in config.timeValues && "endOfDay" in config.timeValues)) {
      console.log(
        "no config applied: missing key in timeValues (day, endOfDay)"
      );
    } else {
      let invalidElement = false;
      for (const key in config.timeValues) {
        config.timeValues[key] = config.timeValues[key].map((elem) => {
          if (!isNaN(elem) && elem > 0) {
            // formatted e.g. 480 (already meaning seconds), no conversion needed
            return elem;
          }
          parsedTime = parseTime(elem);
          if (parsedTime <= 0) {
            invalidElement = String(elem);
            return elem;
          }
          // formatted e.g. 8m, 8:00 or 480s, converted to 480
          return parsedTime;
        });
      }
      if (invalidElement) {
        console.log(
          `no config applied: ${invalidElement} in timeValues is of an invalid format (or <= 0)`
        );
      } else {
        console.log(
          `config applied: "timeValues":${JSON.stringify(config.timeValues)}`
        );
        timeValues = config.timeValues;
      }
    }
  }
  if (config.stepSize) {
    if (isNaN(config.stepSize) || config.stepSize <= 0) {
      console.log("no config applied: stepSize is NaN (or <= 0)");
    } else {
      console.log(`config applied: "stepSize":${config.stepSize}`);
      stepSize = config.stepSize;
    }
  }
  if (config.volume) {
    let invalidElement = false;
    config.volume.map((elem) => {
      if (isNaN(elem) || elem < 0 || elem > 100) {
        invalidElement = String(elem);
      }
      return elem;
    });
    if (invalidElement) {
      console.log(
        `no config applied: ${invalidElement} in volume is of an invalid format (or not between 0 and 100)`
      );
    } else {
      console.log(`config applied: "volume":${JSON.stringify(config.volume)}`);
      volume = config.volume;
    }
  }
}

function getCurrentConfigUrl() {
  return encodeURI(
    `${window.location.href.split("?")[0]}?timeValues=${JSON.stringify(
      timeValues
    )}&stepSize=${stepSize}&volume=${JSON.stringify(volume)}`
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function parseTime(timeValue) {
  if (/^-?\d*\.?\d+m?$/.test(timeValue)) {
    if (typeof timeValue === "string") timeValue = timeValue.replace("m", "");
    parsedTime = Math.round(timeValue * 60);
  } else if (timeValue.includes(":")) {
    timeValue = timeValue.split(":");
    if (timeValue[0].startsWith("-") || timeValue[1].startsWith("-")) {
      return 0;
    }
    parsedTime = timeValue[0] * 60 + timeValue[1] * 1;
  } else if (timeValue.endsWith("s")) {
    parsedTime = Math.round(timeValue.substr(0, timeValue.length - 1));
  } else {
    parsedTime = 0;
  }
  return parsedTime;
}

function displayTimeLeft(seconds) {
  timeDisplay.textContent = formatTime(seconds);
}

function timer() {
  clearInterval(countdown);
  const now = Date.now();
  const then = now + timeRemaining * 1000;
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0) {
      clearInterval(countdown);
      isTimerRunning = false;
      body.classList.remove("timerRunning");
      timeRemaining = defaultTime;
      playSound();
      return;
    }
    timeRemaining = secondsLeft;
    displayTimeLeft(timeRemaining);
  }, 1000);
}

function playDaySound() {
  if (!isMuted) {
    const sound = document.getElementById("daySound");
    sound.play();
  }
}

function playEndOfDaySound() {
  if (!isMuted) {
    const sound = document.getElementById("endOfDaySound");
    sound.play();
  }
}

function playNightSound() {
  if (!isMuted) {
    const sound = document.getElementById("nightSound");
    sound.play();
  }
}

function playSound() {
  if (!isMuted) {
    const sound = document.getElementById("endTimer");
    sound.play();
  }
}

function updateBackground() {
  const body = document.body; // or the main container element

  // Remove classes to start fresh
  body.classList.remove(
    "background-day",
    "background-endOfDay",
    "background-night"
  );

  // Add the appropriate class based on the phase (Day, End of Day or Night)
  switch (phase) {
    case DAY:
      body.classList.add("background-day");
      break;
    case ENDOFDAY:
      body.classList.add("background-endOfDay");
      break;
    case NIGHT:
      body.classList.add("background-night");
      break;
  }
}

function updateDefaultTime() {
  let newTime = isDay()
    ? timeValues.day[Math.min(currentDay, timeValues.day.length) - 1]
    : timeValues.endOfDay[Math.min(currentDay, timeValues.endOfDay.length) - 1];

  if (!isTimerRunning) {
    defaultTime = newTime;
    timeRemaining = newTime;
    displayTimeLeft(timeRemaining);
  }
}

function startStopTimer() {
  if (!isTimerRunning && !isNight()) {
    timer();
    isTimerRunning = true;
    body.classList.add("timerRunning");
    startStopButton.innerHTML = '<i class="fas fa-stop"></i>';
  } else {
    clearInterval(countdown);
    isTimerRunning = false;
    body.classList.remove("timerRunning");
    startStopButton.innerHTML = '<i class="fas fa-play"></i>';
  }
  startStopButton.blur();
}

startStopButton.addEventListener("click", startStopTimer);

function resetTimer() {
  if (!isTimerRunning && !isNight()) {
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
  resetButton.blur();
}

resetButton.addEventListener("click", resetTimer);

function incrementTimer() {
  if (!isTimerRunning && !isNight()) {
    defaultTime = Math.min(defaultTime + stepSize, 3599);
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
  incrementTimeButton.blur();
}

incrementTimeButton.addEventListener("click", incrementTimer);

function editTimer() {
  if (!isTimerRunning && !isNight()) {
    const userTime = prompt(
      "New Time:\nPossible formats: 7.5, 7:30, 450s\nPossible range: 1 second - 59:99"
    );
    if (userTime != null) {
      const parsedTime = parseTime(userTime);
      if (parsedTime <= 0 || parsedTime > 3599) {
        alert(
          `Invalid input '${userTime}'\nPossible formats: 7.5, 7:30, 450s\nPossible range: 1 second - 59:59`
        );
        return;
      }
      defaultTime = parsedTime;
      timeRemaining = defaultTime;
      displayTimeLeft(timeRemaining);
    }
  }
  editTimeButton.blur();
}

editTimeButton.addEventListener("click", editTimer);

function decrementTimer() {
  if (!isTimerRunning && !isNight()) {
    defaultTime = Math.max(defaultTime - stepSize, 0);
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
  decrementTimeButton.blur();
}

decrementTimeButton.addEventListener("click", decrementTimer);

function mute() {
  isMuted = !isMuted;
  const icon = muteButton.querySelector("i");
  if (isMuted) {
    icon.className = "fas fa-volume-mute";
  } else {
    icon.className = "fas fa-volume-up";
  }
  muteButton.blur();
}

muteButton.addEventListener("click", mute);

function setTimerToZero() {
  timeRemaining = 0;
  displayTimeLeft(timeRemaining);
}

function recall() {
  if (!isNight()) {
    if (isTimerRunning) {
      startStopTimer();
    }
    playSound();
    setTimerToZero();
  }
  recallButton.blur();
}

recallButton.addEventListener("click", recall);

function advanceTime() {
  phase = (phase + 1) % 3;

  if (phase === NIGHT) {
    currentDay = (currentDay % 15) + 1;
  }

  updateToggleButtonText();
  updateBackground();
  updateDefaultTime();
  updateSpanText();
  dayValue.textContent = currentDay;

  switch (phase) {
    case DAY:
      playDaySound();
      break;
    case ENDOFDAY:
      playEndOfDaySound();
      break;
    case NIGHT:
      playNightSound();
      break;
  }

  if (useSpotify()) {
    spotifyVolume(volume[phase]);
  }

  toggleTimeOfDayButton.blur();
}

toggleTimeOfDayButton.addEventListener("click", advanceTime);

function showInfo() {
  const dialogueBox = document.getElementById("dialogueBox");
  dialogueBox.classList.remove("hidden");
  dialogueBox.style.display = "block";
}

document.getElementById("infoIcon").addEventListener("click", showInfo);

function exitInfo() {
  const dialogueBox = document.getElementById("dialogueBox");
  dialogueBox.classList.add("hidden");
  dialogueBox.style.display = "none";
}

document.getElementById("closeButton").addEventListener("click", exitInfo);

function updateToggleButtonText() {
  toggleTimeOfDayButton.innerHTML = isDay()
    ? "<span>End the Day</span>"
    : isEndOfDay()
    ? "<span>Go to Sleep</span>"
    : "<span>Wake Up</span>";
}

function updateSpanText() {
  timeOfDayText.innerText = isDay()
    ? "Day"
    : isEndOfDay()
    ? "End of Day"
    : "Night";
}

const config = {};
const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams.entries()) {
  config[key] = JSON.parse(value);
}
applyConfig(config);
console.log(getCurrentConfigUrl());

updateToggleButtonText();
updateBackground();
updateDefaultTime();
updateSpanText();
