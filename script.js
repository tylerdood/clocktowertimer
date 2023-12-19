// Element references
const timeDisplay = document.getElementById("timeDisplay");
const startStopButton = document.getElementById("startStopButton");
const resetButton = document.getElementById("resetButton");
const incrementTimeButton = document.getElementById("incrementTime");
const editTimeButton = document.getElementById("editTime");
const decrementTimeButton = document.getElementById("decrementTime");
const toggleTimeOfDayButton = document.getElementById("toggleTimeOfDayButton");
const dayValue = document.getElementById("dayValue");
const incrementDayButton = document.getElementById("incrementDay");
const dawnButton = document.getElementById("dawnButton");
const duskButton = document.getElementById("duskButton");
const body = document.body;
const muteButton = document.getElementById("muteButton");

// State variables
let isMuted = false;
let countdown;
let isTimerRunning = false;
let defaultTime = 180;
let timeRemaining = defaultTime;
let currentDay = 1;
let isDawn = true;
let timeValues = {
  dawn: [600, 480, 420, 420, 360, 360, 300, 300, 240, 180],
  dusk: [180, 150, 150, 135, 135, 120, 120, 90, 75, 60],
};
let stepSize = 15;
let attentionPeriod = 15;

function applyConfig(config) {
  if (config.timeValues) {
    if (!("dawn" in config.timeValues && "dusk" in config.timeValues)) {
      console.log("no config applied: missing key in timeValues (dawn, dusk)");
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
      console.log(`config applied: stepSize=${config.stepSize}`);
      stepSize = config.stepSize;
    }
  }
  if (config.attentionPeriod) {
    if (isNaN(config.attentionPeriod) || config.attentionPeriod <= 0) {
      console.log("no config applied: attentionPeriod is NaN (or <= 0)");
    } else {
      console.log(`config applied: attentionPeriod=${config.attentionPeriod}`);
      attentionPeriod = config.attentionPeriod;
    }
  }
}

function getCurrentConfigUrl() {
  return encodeURI(
    `${window.location.href.split("?")[0]}?timeValues=${JSON.stringify(
      timeValues
    )}&stepSize=${stepSize}&attentionPeriod=${attentionPeriod}`
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

  if (seconds <= attentionPeriod) {
    document.body.style.backgroundColor = "#750825";
  } else {
    document.body.style.backgroundColor = "#1a1a1a";
  }
  updateBackgroundColor();
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
      startStopButton.textContent = "Restart";
      timeRemaining = defaultTime;
      playSound();
      return;
    }
    if (secondsLeft % 60 === 0 && secondsLeft !== 0) {
      playMinuteMarkSound();
    }
    timeRemaining = secondsLeft;
    displayTimeLeft(timeRemaining);
  }, 1000);
}

function playMinuteMarkSound() {
  if (!isMuted) {
    const sound = document.getElementById("minuteSound");
    sound.play();
  }
}

function playDawnSound() {
  if (!isMuted) {
    const sound = document.getElementById("dawnSound");
    sound.play();
  }
}

function playDuskSound() {
  if (!isMuted) {
    const sound = document.getElementById("duskSound");
    sound.play();
  }
}

function playSound() {
  if (!isMuted) {
    const sound = document.getElementById("endTimer");
    sound.play();
  }
}

function updateBackgroundColor() {
  if (timeRemaining <= attentionPeriod) {
    document.body.style.backgroundColor = "#b35657";
  } else {
    document.body.style.backgroundColor = isDawn ? "#7a6275" : "#1e0121";
  }
}

function updateDefaultTime() {
  let newTime = isDawn
    ? timeValues.dawn[Math.min(currentDay, timeValues.dawn.length) - 1]
    : timeValues.dusk[Math.min(currentDay, timeValues.dusk.length) - 1];

  if (!isTimerRunning) {
    defaultTime = newTime;
    timeRemaining = newTime;
    displayTimeLeft(timeRemaining);
  }
}

startStopButton.addEventListener("click", () => {
  if (!isTimerRunning) {
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
});

resetButton.addEventListener("click", () => {
  if (!isTimerRunning) {
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
});

incrementTimeButton.addEventListener("click", () => {
  if (!isTimerRunning) {
    defaultTime = Math.min(defaultTime + stepSize, 3599);
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
});

editTimeButton.addEventListener("click", () => {
  if (!isTimerRunning) {
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
});

decrementTimeButton.addEventListener("click", () => {
  if (!isTimerRunning) {
    defaultTime = Math.max(defaultTime - stepSize, 0);
    timeRemaining = defaultTime;
    displayTimeLeft(timeRemaining);
  }
});

incrementDayButton.addEventListener("click", function () {
  if (!isTimerRunning) {
    currentDay += 1;
    dayValue.textContent = currentDay;

    isDawn = true;
    updateToggleButtonText();
    updateBackgroundColor();
    updateDefaultTime();
    playDawnSound();
  }
});

muteButton.addEventListener("click", function () {
  isMuted = !isMuted;
  const icon = muteButton.querySelector("i");
  if (isMuted) {
    icon.className = "fas fa-volume-mute";
  } else {
    icon.className = "fas fa-volume-up";
  }
});

toggleTimeOfDayButton.addEventListener("click", function () {
  if (!isTimerRunning) {
    isDawn = !isDawn;
    updateToggleButtonText();
    updateBackgroundColor();
    updateDefaultTime();
    if (isDawn) {
      playDawnSound();
    } else {
      playDuskSound();
    }
  }
});

function updateToggleButtonText() {
  toggleTimeOfDayButton.textContent = isDawn ? "Dawn" : "Dusk";
}

const config = {};
const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams.entries()) {
  config[key] = JSON.parse(value);
}
applyConfig(config);
console.log(getCurrentConfigUrl());

updateToggleButtonText();
updateBackgroundColor();
updateDefaultTime();
