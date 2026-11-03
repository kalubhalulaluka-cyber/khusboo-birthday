const photoInput = document.querySelector("#photo-input");
const sisterPhoto = document.querySelector("#sister-photo");
const uploadLabel = document.querySelector("#upload-label");
const photoHint = document.querySelector("#photo-hint");
const surpriseButton = document.querySelector("#surprise-button");
const surpriseMessage = document.querySelector("#surprise-message");
const celebrationLayer = document.querySelector("#celebration-layer");
const snowfallLayer = document.querySelector("#snowfall-layer");
const announcement = document.querySelector("#announcement");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const birthdayGate = document.querySelector("#birthday-gate");
const birthdayGateForm = document.querySelector("#birthday-gate-form");
const birthdayMonthInput = document.querySelector("#birthday-month");
const birthdayDayInput = document.querySelector("#birthday-day");
const gateStatus = document.querySelector("#gate-status");
const themeOptions = document.querySelectorAll("[data-theme-choice]");
const designStatus = document.querySelector("#design-status");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
// Set the birthday as MM-DD before sharing the site, for example "08-14".
const SISTER_BIRTHDAY = "11-04";

let currentPhotoUrl = null;
let celebrationTimeout;
const dashArena = document.querySelector("#dash-arena");
const dashPlayer = document.querySelector("#dash-player");
const dashOverlay = document.querySelector("#dash-overlay");
const dashScore = document.querySelector("#dash-score");
const dashLives = document.querySelector("#dash-lives");
const dashTimer = document.querySelector("#dash-timer");
const dashStatus = document.querySelector("#dash-status");
const dashStartButton = document.querySelector("#dash-start");
const codeDigits = [1, 2, 3].map((number) =>
  document.querySelector(`#code-digit-${number}`),
);
const codeGuessButton = document.querySelector("#code-guess");
const codeStartButton = document.querySelector("#code-start");
const codeHistory = document.querySelector("#code-history");
const codeAttempts = document.querySelector("#code-attempts");
const codeStatus = document.querySelector("#code-status");
const wordForm = document.querySelector("#word-form");
const wordAnswer = document.querySelector("#word-answer");
const wordSubmit = document.querySelector("#word-submit");
const wordScramble = document.querySelector("#word-scramble");
const wordHint = document.querySelector("#word-hint");
const wordRound = document.querySelector("#word-round");
const wordTimer = document.querySelector("#word-timer");
const wordScoreLabel = document.querySelector("#word-score");
const wordFeedback = document.querySelector("#word-feedback");
const wordStatus = document.querySelector("#word-status");
const wordStartButton = document.querySelector("#word-start");
const spotBoard = document.querySelector("#spot-board");
const spotOverlay = document.querySelector("#spot-overlay");
const spotRoundLabel = document.querySelector("#spot-round");
const spotTimerLabel = document.querySelector("#spot-timer");
const spotScoreLabel = document.querySelector("#spot-score");
const spotStatus = document.querySelector("#spot-status");
const spotStartButton = document.querySelector("#spot-start");

const codeMaxAttempts = 7;
const wordBank = [
  { word: "BIRTHDAY", hint: "The day we celebrate you" },
  { word: "KHUSHBOO", hint: "The birthday star's name" },
  { word: "SURPRISE", hint: "Something unexpected and lovely" },
  { word: "FRIENDS", hint: "Chosen family, always" },
  { word: "CUPCAKE", hint: "A mini cake with a swirl on top" },
  { word: "SNOWFLAKE", hint: "A tiny winter sparkle" },
  { word: "CONFETTI", hint: "Colourful little party pieces" },
  { word: "RAINBOW", hint: "Seven colours after the rain" },
];
let dashInterval = null;
let dashClock = null;
let dashSpawnClock = null;
let dashRunning = false;
let dashItems = [];
let dashPoints = 0;
let dashMisses = 0;
let dashSeconds = 30;
let dashPlayerPosition = 50;
let dashPointerActive = false;
let codeDigitsSecret = [];
let codeAttemptCount = 0;
let codeFinished = false;
let wordTimerClock = null;
let wordSeconds = 45;
let wordRoundNumber = 0;
let wordScore = 0;
let wordActive = false;
let wordQueue = [];
let wordAdvanceTimeout = null;
let spotClock = null;
let spotSeconds = 30;
let spotFound = 0;
let spotActive = false;
let spotRoundTimeout = null;

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const theme = option.dataset.themeChoice;

    document.body.dataset.theme = theme;
    themeOptions.forEach((themeOption) => {
      themeOption.setAttribute(
        "aria-pressed",
        String(themeOption === option),
      );
    });

    themeColorMeta.content = getComputedStyle(document.body)
      .getPropertyValue("--cream")
      .trim();
    designStatus.textContent = `${option.textContent.trim()} theme select ho gaya.`;
  });
});

dashStartButton.addEventListener("click", startCakeDash);
document.querySelector("#dash-left").addEventListener("click", () => moveDashPlayer(-12));
document.querySelector("#dash-right").addEventListener("click", () => moveDashPlayer(12));
codeStartButton.addEventListener("click", startCodeGame);
codeGuessButton.addEventListener("click", submitCodeGuess);
wordStartButton.addEventListener("click", startWordGame);
wordForm.addEventListener("submit", submitWordGuess);
spotStartButton.addEventListener("click", startSpotGame);
dashArena.addEventListener("pointerdown", (event) => {
  dashPointerActive = true;
  dashArena.setPointerCapture(event.pointerId);
  setDashPlayerFromPointer(event);
});
dashArena.addEventListener("pointermove", (event) => {
  if (dashPointerActive) {
    setDashPlayerFromPointer(event);
  }
});
dashArena.addEventListener("pointerup", () => {
  dashPointerActive = false;
});
dashArena.addEventListener("pointercancel", () => {
  dashPointerActive = false;
});
dashArena.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    moveDashPlayer(event.key === "ArrowLeft" ? -8 : 8);
  }
});
codeDigits.forEach((select) => {
  select.addEventListener("change", updateCodeDigitOptions);
});
startCodeGame();

birthdayMonthInput.addEventListener("change", () => {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dayCount = daysInMonth[Number(birthdayMonthInput.value) - 1] || 31;
  const selectedDay = Number(birthdayDayInput.value);

  birthdayDayInput.replaceChildren(new Option("Date", "", true, true));
  birthdayDayInput.options[0].disabled = true;

  for (let day = 1; day <= dayCount; day += 1) {
    birthdayDayInput.add(new Option(String(day), String(day).padStart(2, "0")));
  }

  if (selectedDay > 0 && selectedDay <= dayCount) {
    birthdayDayInput.value = String(selectedDay).padStart(2, "0");
  }
});

birthdayGateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!birthdayMonthInput.value || !birthdayDayInput.value) {
    gateStatus.textContent = "Birthday ka month aur date dono select karo.";
    return;
  }

  if (!SISTER_BIRTHDAY) {
    gateStatus.textContent =
      "Gate set karne ke liye script.js mein SISTER_BIRTHDAY ko MM-DD format mein set karein.";
    return;
  }

  const enteredBirthday = `${birthdayMonthInput.value}-${birthdayDayInput.value}`;

  if (enteredBirthday !== SISTER_BIRTHDAY) {
    gateStatus.textContent = "Yeh date match nahi hui. Ek baar phir try karo.";
    birthdayDayInput.value = "";
    birthdayMonthInput.focus();
    return;
  }

  birthdayGate.hidden = true;
  document.body.classList.remove("is-locked");
  announcement.textContent = "Birthday surprise unlock ho gaya.";
});

function addScrollReveals() {
  const revealItems = document.querySelectorAll(
    ".section-heading, .love-card, .message-card",
  );

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  revealItems.forEach((item) => item.classList.add("scroll-reveal"));

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -35px 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function addSnowfall() {
  if (reducedMotion.matches) {
    return;
  }

  const snowflakes = document.createDocumentFragment();
  const count = window.innerWidth <= 680 ? 16 : 30;

  for (let index = 0; index < count; index += 1) {
    const snowflake = document.createElement("span");

    snowflake.className = "snowflake";
    snowflake.textContent = "❄";
    snowflake.style.setProperty("--left", `${Math.random() * 100}%`);
    snowflake.style.setProperty("--size", `${9 + Math.random() * 13}px`);
    snowflake.style.setProperty("--duration", `${9 + Math.random() * 13}s`);
    snowflake.style.setProperty("--delay", `${Math.random() * -20}s`);
    snowflake.style.setProperty("--drift", `${Math.random() * 110 - 55}px`);
    snowflake.style.setProperty("--sway", `${Math.random() * 50 - 25}px`);
    snowflakes.append(snowflake);
  }

  snowfallLayer.append(snowflakes);
}

addScrollReveals();
addSnowfall();

function startCakeDash() {
  window.clearInterval(dashInterval);
  window.clearInterval(dashClock);
  window.clearInterval(dashSpawnClock);
  dashItems.forEach((item) => item.element.remove());
  dashItems = [];
  dashPoints = 0;
  dashMisses = 0;
  dashSeconds = 30;
  dashPlayerPosition = 50;
  dashRunning = true;
  dashScore.textContent = "Treats 0 / 12";
  dashLives.textContent = "♥ ♥ ♥";
  dashTimer.textContent = "30 sec";
  dashStatus.textContent = "Go, chef! Catch the treats, dodge the lemons.";
  dashOverlay.hidden = true;
  dashStartButton.textContent = "Restart run";
  dashPlayer.style.left = "50%";

  dashInterval = window.setInterval(updateCakeDash, 40);
  dashSpawnClock = window.setInterval(spawnDashItem, 620);
  dashClock = window.setInterval(() => {
    dashSeconds -= 1;
    dashTimer.textContent = `${dashSeconds} sec`;
    if (dashSeconds <= 0) {
      finishCakeDash(dashPoints >= 12);
    }
  }, 1000);
}

function spawnDashItem() {
  if (!dashRunning) {
    return;
  }

  const isLemon = Math.random() < 0.24;
  const element = document.createElement("span");
  element.className = `dash-item${isLemon ? " is-lemon" : ""}`;
  element.textContent = isLemon ? "🍋" : ["🧁", "🍓", "🍬", "🍪"][Math.floor(Math.random() * 4)];
  element.setAttribute("aria-hidden", "true");
  const item = {
    element,
    isLemon,
    x: 8 + Math.random() * 84,
    y: -14,
    speed: 1.65 + Math.min(1.7, dashPoints * 0.09),
  };
  dashArena.append(element);
  dashItems.push(item);
}

function updateCakeDash() {
  const catchLine = dashArena.clientHeight - 58;

  dashItems = dashItems.filter((item) => {
    item.y += item.speed;
    item.element.style.left = `${item.x}%`;
    item.element.style.top = `${item.y}px`;

    if (item.y >= catchLine) {
      const caught = Math.abs(item.x - dashPlayerPosition) < 13;
      if (caught && item.isLemon) {
        dashMisses += 1;
        dashLives.textContent = "♥ ".repeat(Math.max(0, 3 - dashMisses)).trim() || "♡ ♡ ♡";
        dashStatus.textContent = `Lemon! ${3 - dashMisses} ${3 - dashMisses === 1 ? "life" : "lives"} left.`;
      } else if (caught) {
        dashPoints += 1;
        dashScore.textContent = `Treats ${dashPoints} / 12`;
        dashStatus.textContent = dashPoints >= 12
          ? "Cake saved! What a catch! 🎉"
          : `Yum! ${12 - dashPoints} more treats to save the cake.`;
      }

      item.element.remove();
      if (dashPoints >= 12 || dashMisses >= 3) {
        finishCakeDash(dashPoints >= 12);
      }
      return false;
    }

    return true;
  });
}

function setDashPlayerFromPointer(event) {
  if (!dashRunning) {
    return;
  }

  const bounds = dashArena.getBoundingClientRect();
  dashPlayerPosition = Math.min(
    92,
    Math.max(8, ((event.clientX - bounds.left) / bounds.width) * 100),
  );
  dashPlayer.style.left = `${dashPlayerPosition}%`;
}

function moveDashPlayer(amount) {
  if (!dashRunning) {
    return;
  }

  dashPlayerPosition = Math.min(92, Math.max(8, dashPlayerPosition + amount));
  dashPlayer.style.left = `${dashPlayerPosition}%`;
}

function finishCakeDash(won) {
  if (!dashRunning) {
    return;
  }

  dashRunning = false;
  window.clearInterval(dashInterval);
  window.clearInterval(dashClock);
  window.clearInterval(dashSpawnClock);
  dashOverlay.hidden = false;
  dashOverlay.textContent = won
    ? `Cake saved with ${dashPoints} treats! You're the star baker.`
    : `${dashPoints}/12 treats and ${dashMisses} lemon hits. One more run?`;
  dashStatus.textContent = won
    ? "Champion chef unlocked! 🏆"
    : dashMisses >= 3
      ? "Too many lemons! Dodge them on your next run."
      : "Time's up! Give it another go.";
  if (won) {
    launchConfetti();
  }
}

function startCodeGame() {
  const digits = shuffleArray(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  codeDigitsSecret = digits.slice(0, 3);
  if (codeDigitsSecret[0] === "0") {
    [codeDigitsSecret[0], codeDigitsSecret[1]] = [codeDigitsSecret[1], codeDigitsSecret[0]];
  }
  codeAttemptCount = 0;
  codeFinished = false;
  codeHistory.replaceChildren();
  codeAttempts.textContent = "0 / 7";
  codeStatus.textContent = "A fresh lock. Three unique digits. You have 7 tries.";
  codeGuessButton.disabled = false;
  codeDigits.forEach((select) => {
    select.replaceChildren(new Option("—", ""));
    for (let digit = 0; digit <= 9; digit += 1) {
      select.add(new Option(String(digit), String(digit)));
    }
    select.value = "";
    select.disabled = false;
  });
  updateCodeDigitOptions();
}

function updateCodeDigitOptions() {
  const selectedDigits = codeDigits.map((select) => select.value).filter(Boolean);
  codeDigits.forEach((select) => {
    [...select.options].forEach((option) => {
      option.disabled = Boolean(
        option.value &&
        option.value !== select.value &&
        selectedDigits.includes(option.value),
      );
    });
  });
  codeGuessButton.disabled = codeDigits.some((select) => !select.value) ||
    new Set(selectedDigits).size !== 3 ||
    codeFinished;
}

function submitCodeGuess() {
  if (codeFinished || codeDigits.some((select) => !select.value)) {
    return;
  }

  const guess = codeDigits.map((select) => select.value);
  if (new Set(guess).size !== 3 || guess[0] === "0") {
    codeStatus.textContent = "Choose 3 different digits. The first digit can't be zero.";
    return;
  }

  codeAttemptCount += 1;
  const exact = guess.filter((digit, index) => digit === codeDigitsSecret[index]).length;
  const misplaced = guess.filter(
    (digit, index) => digit !== codeDigitsSecret[index] && codeDigitsSecret.includes(digit),
  ).length;
  const row = document.createElement("li");
  const guessText = document.createElement("span");
  const clueText = document.createElement("span");
  guessText.className = "code-guess-digits";
  guessText.textContent = guess.join("  ");
  clueText.className = "code-guess-clue";
  clueText.textContent = `${exact} 🟢  ${misplaced} 🟡`;
  row.append(guessText, clueText);
  codeHistory.prepend(row);
  codeAttempts.textContent = `${codeAttemptCount} / 7`;
  codeDigits.forEach((select) => {
    select.value = "";
  });
  updateCodeDigitOptions();

  if (exact === 3) {
    codeFinished = true;
    codeStatus.textContent = `Unlocked! The gift code was ${guess.join("")}. 🎁`;
    codeGuessButton.disabled = true;
    codeDigits.forEach((select) => {
      select.disabled = true;
    });
    launchConfetti();
  } else if (codeAttemptCount >= codeMaxAttempts) {
    codeFinished = true;
    codeStatus.textContent = `Lock's still closed. The code was ${codeDigitsSecret.join("")}. Try a new lock!`;
    codeGuessButton.disabled = true;
    codeDigits.forEach((select) => {
      select.disabled = true;
    });
  } else {
    codeStatus.textContent = `${exact} in the right place, ${misplaced} in the wrong place. Think again.`;
  }
}

function startWordGame() {
  window.clearInterval(wordTimerClock);
  window.clearTimeout(wordAdvanceTimeout);
  wordQueue = shuffleArray(wordBank).slice(0, 6);
  wordSeconds = 45;
  wordRoundNumber = 0;
  wordScore = 0;
  wordActive = true;
  wordTimer.textContent = "45";
  wordTimer.classList.remove("is-low");
  wordScoreLabel.textContent = "0 PTS";
  wordStartButton.textContent = "Start over";
  wordAnswer.disabled = false;
  wordSubmit.disabled = false;
  wordStatus.textContent = "Six words. 45 seconds of glory.";
  showNextWord();
  wordAnswer.focus();

  wordTimerClock = window.setInterval(() => {
    wordSeconds -= 1;
    wordTimer.textContent = String(wordSeconds).padStart(2, "0");
    wordTimer.classList.toggle("is-low", wordSeconds <= 10);
    if (wordSeconds <= 0) {
      finishWordGame();
    }
  }, 1000);
}

function showNextWord() {
  if (!wordActive) {
    return;
  }
  if (wordRoundNumber >= wordQueue.length) {
    finishWordGame();
    return;
  }

  const item = wordQueue[wordRoundNumber];
  const scrambled = shuffleArray([...item.word]);
  if (scrambled.join("") === item.word) {
    scrambled.push(scrambled.shift());
  }
  wordRound.textContent = `ROUND ${wordRoundNumber + 1} / 6`;
  wordHint.textContent = `HINT · ${item.hint}`;
  wordScramble.textContent = scrambled.join("  ");
  wordAnswer.value = "";
  wordAnswer.focus();
}

function submitWordGuess(event) {
  event.preventDefault();
  if (!wordActive) {
    return;
  }

  const guess = wordAnswer.value.trim().toUpperCase();
  const answer = wordQueue[wordRoundNumber].word;
  if (guess !== answer) {
    wordFeedback.textContent = "Not quite. Rearrange the letters and try again.";
    wordAnswer.select();
    return;
  }

  wordRoundNumber += 1;
  wordScore += 100 + wordSeconds * 5;
  wordScoreLabel.textContent = `${wordScore} PTS`;
  wordFeedback.textContent = `That's it! +${100 + wordSeconds * 5} points ✨`;
  wordAdvanceTimeout = window.setTimeout(showNextWord, 550);
}

function finishWordGame() {
  if (!wordActive) {
    return;
  }

  wordActive = false;
  window.clearInterval(wordTimerClock);
  window.clearTimeout(wordAdvanceTimeout);
  wordAnswer.disabled = true;
  wordSubmit.disabled = true;
  wordRound.textContent = `${wordRoundNumber} / 6 DONE`;
  wordScramble.textContent = wordScore ? `${wordScore} PTS` : "TIME'S UP";
  wordHint.textContent = "Your birthday word run is complete.";
  wordFeedback.textContent = `${wordRoundNumber} words solved. ${wordSeconds} seconds left.`;
  wordStatus.textContent = wordRoundNumber === 6
    ? "Word wizard! You solved every birthday word. 🪄"
    : "Nice run! Go again and beat your score.";
  if (wordRoundNumber === 6) {
    launchConfetti();
  }
}

function startSpotGame() {
  window.clearInterval(spotClock);
  window.clearTimeout(spotRoundTimeout);
  spotSeconds = 30;
  spotFound = 0;
  spotActive = true;
  spotTimerLabel.textContent = "30 sec";
  spotRoundLabel.textContent = "Find 1 / 10";
  spotScoreLabel.textContent = "0 found";
  spotStatus.textContent = "One icon is different. Trust your eyes!";
  spotOverlay.hidden = true;
  spotStartButton.textContent = "Restart hunt";
  createSpotPuzzle();
  spotClock = window.setInterval(() => {
    spotSeconds -= 1;
    spotTimerLabel.textContent = `${spotSeconds} sec`;
    if (spotSeconds <= 0) {
      finishSpotGame();
    }
  }, 1000);
}

function createSpotPuzzle() {
  if (!spotActive) {
    return;
  }
  const pairs = [
    ["❄", "❅"],
    ["✦", "✧"],
    ["♡", "♥"],
    ["☼", "☀"],
  ];
  const [commonIcon, oddIcon] = pairs[Math.floor(Math.random() * pairs.length)];
  const oddPosition = Math.floor(Math.random() * 16);
  spotBoard.querySelectorAll(".spot-tile").forEach((tile) => tile.remove());
  for (let index = 0; index < 16; index += 1) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "spot-tile";
    tile.textContent = index === oddPosition ? oddIcon : commonIcon;
    tile.setAttribute("aria-label", `Icon ${index + 1}${index === oddPosition ? ", the different one" : ""}`);
    tile.addEventListener("click", () => selectSpotTile(index, oddPosition, tile));
    spotBoard.append(tile);
  }
}

function selectSpotTile(index, oddPosition, tile) {
  if (!spotActive || tile.disabled) {
    return;
  }

  if (index === oddPosition) {
    spotFound += 1;
    spotScoreLabel.textContent = `${spotFound} found`;
    if (spotFound >= 10) {
      spotRoundLabel.textContent = "10 / 10 found";
      finishSpotGame(true);
      return;
    }

    spotRoundLabel.textContent = `Find ${spotFound + 1} / 10`;
    spotStatus.textContent = `${10 - spotFound} left. Ready for the next one?`;
    [...spotBoard.querySelectorAll(".spot-tile")].forEach((button) => {
      button.disabled = true;
    });
    spotRoundTimeout = window.setTimeout(createSpotPuzzle, 420);
    return;
  }

  tile.classList.add("is-wrong");
  tile.disabled = true;
  spotSeconds = Math.max(0, spotSeconds - 2);
  spotTimerLabel.textContent = `${spotSeconds} sec`;
  spotStatus.textContent = "Not that one—2 seconds off. Keep searching!";
  if (spotSeconds <= 0) {
    finishSpotGame();
  }
}

function finishSpotGame(won = false) {
  if (!spotActive) {
    return;
  }
  spotActive = false;
  window.clearInterval(spotClock);
  window.clearTimeout(spotRoundTimeout);
  spotOverlay.hidden = false;
  spotOverlay.textContent = won
    ? `All 10 found with ${spotSeconds} seconds left!`
    : `${spotFound}/10 found. Take a breath and try again!`;
  spotStatus.textContent = won
    ? "Eagle eyes champion! 🏆"
    : "The clock ran out. You were so close!";
  [...spotBoard.querySelectorAll(".spot-tile")].forEach((button) => {
    button.disabled = true;
  });
  if (won) {
    launchConfetti();
  }
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

photoInput.addEventListener("change", () => {
  const [file] = photoInput.files;

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    photoHint.textContent = "Please ek image file select karein.";
    announcement.textContent = "Selected file image nahi hai.";
    photoInput.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    photoHint.textContent = "Photo 10 MB se chhoti honi chahiye.";
    announcement.textContent = "Photo 10 MB se badi hai.";
    photoInput.value = "";
    return;
  }

  const nextPhotoUrl = URL.createObjectURL(file);
  const previousPhotoUrl = currentPhotoUrl;
  currentPhotoUrl = nextPhotoUrl;
  sisterPhoto.src = nextPhotoUrl;
  uploadLabel.textContent = "Sister ki photo badlein";
  photoHint.textContent = "Photo sirf isi browser mein dikhegi";
  announcement.textContent = "Birthday photo add ho gayi.";

  if (previousPhotoUrl) {
    URL.revokeObjectURL(previousPhotoUrl);
  }
});

surpriseButton.addEventListener("click", () => {
  const isOpen = !surpriseMessage.hidden;
  surpriseMessage.hidden = isOpen;
  surpriseButton.setAttribute("aria-expanded", String(!isOpen));
  surpriseButton.querySelector("span").textContent = isOpen ? "✦" : "♥";
  surpriseButton.firstChild.textContent = isOpen ? "Dil se ek note kholo " : "Note padhne ke liye shukriya ";
  announcement.textContent = isOpen
    ? "Surprise message band ho gaya."
    : "Surprise message khul gaya.";

  if (!isOpen) {
    launchConfetti();
  }
});

surpriseButton.setAttribute("aria-expanded", "false");

function launchConfetti() {
  window.clearTimeout(celebrationTimeout);
  celebrationLayer.replaceChildren();

  const styles = getComputedStyle(document.body);
  const colors = ["--pink", "--gold", "--mint", "--coral"].map((color) =>
    styles.getPropertyValue(color).trim(),
  );
  const pieces = document.createDocumentFragment();

  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("span");
    const size = 5 + Math.random() * 7;

    piece.className = "burst-piece";
    piece.style.setProperty("--start", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${size}px`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.1}s`);
    piece.style.setProperty("--delay", `${Math.random() * 0.8}s`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--spin", `${Math.random() * 900 - 450}deg`);
    pieces.append(piece);
  }

  celebrationLayer.append(pieces);
  celebrationTimeout = window.setTimeout(() => {
    celebrationLayer.replaceChildren();
  }, 6500);
}
