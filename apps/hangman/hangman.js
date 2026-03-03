// Hangman (Tea Edition) — dual input, 6 mistakes, 7 images (0..6)

const wordList = [
  "apple","chair","river","pencil","window",
  "planet","garden","pillow","bottle","castle",
  "forest","bucket","mirror","rocket","camera",
  "cookie","hammer","island","jacket","monkey",
  "napkin","orange","pirate","quartz","tunnel"
];

const images = [
  "cup-happy.png",     // 0
  "cup-neutral.png",   // 1
  "cup-worried-1.png", // 2
  "cup-worried-2.png", // 3
  "cup-worried-3.png", // 4
  "cup-defeated.png",  // 5
  "cup-dead.png"       // 6
];

// Gallows pieces appear one per wrong guess (1..6)
const gallowsOrder = ["base", "pole", "beam", "brace", "rope", "noose"];

const cupImageEl = document.getElementById("cupImage");
const wordEl = document.getElementById("word");
const keyboardEl = document.getElementById("keyboard");
const mistakesEl = document.getElementById("mistakes");
const messageEl = document.getElementById("message");
const stateTagEl = document.getElementById("stateTag");
const restartBtn = document.getElementById("restartBtn");

let targetWord = "";
let guessed = new Set();
let mistakes = 0;
let gameOver = false;

function pickWord() {
  const idx = Math.floor(Math.random() * wordList.length);
  return wordList[idx].toLowerCase();
}

function buildKeyboard() {
  keyboardEl.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (const L of letters) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "key";
    btn.textContent = L;
    btn.dataset.letter = L.toLowerCase();
    btn.addEventListener("click", () => handleGuess(btn.dataset.letter));
    keyboardEl.appendChild(btn);
  }
}

function setMessage(mainText, tagText, tagColor = null) {
  // keep structure: first child span, second strong
  messageEl.querySelector("span").textContent = mainText;
  stateTagEl.textContent = tagText;
  if (tagColor) stateTagEl.style.color = tagColor;
  else stateTagEl.style.color = "";
}

function renderWord() {
  wordEl.innerHTML = "";
  for (const ch of targetWord) {
    const slot = document.createElement("div");
    slot.className = "slot";
    if (guessed.has(ch) || gameOver) {
      slot.textContent = ch.toUpperCase();
      slot.classList.add("revealed");
    } else {
      slot.textContent = "";
    }
    wordEl.appendChild(slot);
  }
}

function updateStage() {
  // Image updates with mistakes (0..6)
  cupImageEl.src = images[Math.min(mistakes, 6)];

  // Gallows pieces: show exactly "mistakes" pieces (up to 6)
  for (let i = 0; i < gallowsOrder.length; i++) {
    const id = gallowsOrder[i];
    const el = document.getElementById(id);
    if (!el) continue;
    el.classList.toggle("show", i < mistakes);
  }

  mistakesEl.textContent = String(mistakes);
}

function disableKey(letter) {
  const btn = keyboardEl.querySelector(`.key[data-letter="${letter}"]`);
  if (btn) btn.classList.add("used"); // CSS handles pointer-events + opacity
}

function revealAllKeysUsed() {
  keyboardEl.querySelectorAll(".key").forEach(b => b.classList.add("used"));
}

function hasWon() {
  for (const ch of targetWord) {
    if (!guessed.has(ch)) return false;
  }
  return true;
}

function endGame(win) {
  gameOver = true;
  revealAllKeysUsed();
  renderWord();
  updateStage();

  if (win) {
    setMessage("You got it.", "The tea stays warm!", "#0D9488");
  } else {
    setMessage(`Spilled it. The word was "${targetWord.toUpperCase()}".`, "Game over.", "#EE5A6F");
  }
}

function handleGuess(raw) {
  if (gameOver) return;
  const letter = (raw || "").toLowerCase();

  if (!/^[a-z]$/.test(letter)) return;
  if (guessed.has(letter)) return; // prevent duplicate guesses

  guessed.add(letter);
  disableKey(letter);

  if (targetWord.includes(letter)) {
    renderWord();
    updateStage();

    if (hasWon()) endGame(true);
    else setMessage("Nice sip.", "Keep brewing…");
  } else {
    mistakes += 1;
    renderWord();
    updateStage();

    if (mistakes >= 6) endGame(false);
    else setMessage("Bitter miss.", "Careful…");
  }
}

function onKeyDown(e) {
  // physical keyboard input
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  handleGuess(e.key);
}

function resetGame() {
  targetWord = pickWord();
  guessed = new Set();
  mistakes = 0;
  gameOver = false;

  buildKeyboard();
  renderWord();
  updateStage();
  setMessage("Type a letter or tap the keyboard.", "Brewing…");
}

window.addEventListener("keydown", onKeyDown);
restartBtn.addEventListener("click", resetGame);

// Start
resetGame();