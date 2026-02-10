const form = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const feedback = document.getElementById("feedback");
const feedbackText = document.getElementById("feedback-text");
const attemptsEl = document.getElementById("attempts");
const bestEl = document.getElementById("best");
const rangeEl = document.getElementById("range");
const historyList = document.getElementById("history-list");
const resetBtn = document.getElementById("reset-btn");
const shareBtn = document.getElementById("share-btn");
const confettiRoot = document.getElementById("confetti");
const winModal = document.getElementById("win-modal");
const winMessage = document.getElementById("win-message");
const playAgainBtn = document.getElementById("play-again");
const copyScoreBtn = document.getElementById("copy-score");
const heatFill = document.getElementById("heat-fill");
const heatValue = document.getElementById("heat-value");
const heatHint = document.getElementById("heat-hint");

const MIN = 1;
const MAX = 100;
let secretNumber = 0;
let attempts = 0;
let history = [];

const BEST_KEY = "number-guess-best";
const sounds = {
  low: new Audio("assets/audio/low.mp3"),
  win: new Audio("assets/audio/win.mp3"),
  reset: new Audio("assets/audio/reset.mp3"),
};

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


function initGame() {
  secretNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  attempts = 0;
  history = [];
  attemptsEl.textContent = "0";
  rangeEl.textContent = `${MIN}–${MAX}`;
  feedbackText.textContent = "Make your first guess to begin.";
  feedback.className = "feedback";
  historyList.innerHTML = "";
  guessInput.value = "";
  guessInput.focus();
  guessInput.disabled = false;
  winModal.classList.remove("show");
  winModal.setAttribute("aria-hidden", "true");
  updateHeat(null);
  updateBest();
}

function updateBest(newScore) {
  const best = Number(localStorage.getItem(BEST_KEY)) || null;
  if (newScore && (!best || newScore < best)) {
    localStorage.setItem(BEST_KEY, String(newScore));
  }
  const updatedBest = Number(localStorage.getItem(BEST_KEY));
  bestEl.textContent = updatedBest ? `${updatedBest}` : "--";
}

function addHistory(value) {
  history.unshift(value);
  history = history.slice(0, 8);
  historyList.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function setFeedback(message, type) {
  feedbackText.textContent = message;
  feedback.className = `feedback${type ? ` ${type}` : ""}`;
}

function updateHeat(value) {
  const heatClasses = ["cold", "cool", "warm", "hot", "boiling"];
  guessInput.classList.remove(...heatClasses);
  if (value === null) {
    heatFill.style.width = "0%";
    heatValue.textContent = "--%";
    heatHint.textContent = "No heat yet. Make a guess.";
    return "";
  }
  const distance = Math.abs(value - secretNumber);
  const maxDistance = MAX - MIN;
  const heat = Math.max(0, 1 - distance / maxDistance);
  const heatPercent = Math.round(heat * 100);
  heatFill.style.width = `${heatPercent}%`;
  heatValue.textContent = `${heatPercent}%`;

  let heatClass = "cold";
  if (heatPercent >= 85) {
    heatHint.textContent = "Boiling hot! You are extremely close.";
    heatClass = "boiling";
  } else if (heatPercent >= 65) {
    heatHint.textContent = "Hot! Keep going.";
    heatClass = "hot";
  } else if (heatPercent >= 40) {
    heatHint.textContent = "Warm. You're getting closer.";
    heatClass = "warm";
  } else if (heatPercent >= 20) {
    heatHint.textContent = "Cool. Try adjusting more.";
    heatClass = "cool";
  } else {
    heatHint.textContent = "Cold. You're far from the number.";
  }

  guessInput.classList.add(heatClass);
  return heatClass;
}

function launchConfetti() {
  confettiRoot.innerHTML = "";
  const pieces = 80;
  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("span");
    const size = Math.random() * 8 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.4}px`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = "-20px";
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 85%, 65%)`;
    piece.style.animationDuration = `${Math.random() * 2 + 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    confettiRoot.appendChild(piece);
  }

  setTimeout(() => {
    confettiRoot.innerHTML = "";
  }, 3500);
}

function handleGuess(event) {
  event.preventDefault();
  startTension();
  const value = Number(guessInput.value);
  if (!Number.isFinite(value)) {
    setFeedback("Enter a valid number.", "error");
    updateHeat(null);
    return;
  }
  if (value < MIN || value > MAX) {
    setFeedback(`Keep it between ${MIN} and ${MAX}.`, "error");
    updateHeat(null);
    return;
  }

  attempts += 1;
  attemptsEl.textContent = `${attempts}`;
  addHistory(value);
  const heatClass = updateHeat(value);

  if (value < secretNumber) {
    setFeedback("Too low. Try a higher number.", heatClass);
    playSound(sounds.low);
  } else if (value > secretNumber) {
    setFeedback("Too high. Try a lower number.", heatClass);
    playSound(sounds.low);
  } else {
    setFeedback(`You got it in ${attempts} attempts.`, "success");
    updateBest(attempts);
    launchConfetti();
    playSound(sounds.win);
    stopTension();
    winMessage.textContent = `You guessed the number in ${attempts} attempt${attempts === 1 ? "" : "s"}.`;
    winModal.classList.add("show");
    winModal.setAttribute("aria-hidden", "false");
    guessInput.disabled = true;
  }

  guessInput.select();
}

async function handleShare() {
  const best = Number(localStorage.getItem(BEST_KEY));
  const shareText = best
    ? `My best score is ${best} attempts. Can you beat it?`
    : "Try this number guessing game.";

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Number Guessing Game",
        text: shareText,
        url: window.location.href,
      });
    } catch (error) {
      setFeedback("Share canceled.", "error");
    }
  } else {
    navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
    setFeedback("Link copied. Share it anywhere.", "success");
  }
}

form.addEventListener("submit", handleGuess);
resetBtn.addEventListener("click", () => {
  playSound(sounds.reset);
  initGame();
});
shareBtn.addEventListener("click", handleShare);
playAgainBtn.addEventListener("click", () => {
  playSound(sounds.reset);
  initGame();
});
copyScoreBtn.addEventListener("click", async () => {
  const best = Number(localStorage.getItem(BEST_KEY)) || attempts;
  const text = `I guessed the number in ${attempts} attempts. Best: ${best}.`;
  await navigator.clipboard?.writeText(text);
  setFeedback("Score copied to clipboard.", "success");
});

initGame();
