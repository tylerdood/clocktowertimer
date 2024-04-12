function calcTimerStartEndValues(startingPlayerCount) {
  return {
    totalNumbers: startingPlayerCount - startingPlayerCount / 5,
    dayStartValue: startingPlayerCount * 0.4 +2,
    dayEndValue: 2,
    nightStartValue: startingPlayerCount * 0.1 +1,
    nightEndValue: 1
  };
}

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

function convertToSeconds(values) {
  return values.map((value) => value * 60);
}

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

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function parseTime(timeValue) {
  timeValue = timeValue.replace(',', '.');
  let parsedTime = 0;
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
  }
  return parsedTime;
}

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
    15: [9, 2, 3, 1],
  };
  const numbersArray = characterAmounts[userInput];
  document.getElementById("townsfolkAmount").textContent = numbersArray[0];
  document.getElementById("outsiderAmount").textContent = numbersArray[1];
  document.getElementById("minionAmount").textContent = numbersArray[2];
  document.getElementById("demonAmount").textContent = numbersArray[3];
}

function updateTravelerAmount(userInput) {
  document.getElementById("travelerAmount").textContent = userInput;
}

function updatePlayerCount(player, traveller) {
  updateTravelerAmount(traveller);
  updateCharacterAmounts(player);
  document.getElementById("heartNumber").innerText =
    player + traveller;
  document.getElementById("voteNumber").innerText =
    player + traveller;
}
