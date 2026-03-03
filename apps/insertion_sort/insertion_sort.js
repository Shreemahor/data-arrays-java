/*
  Interactive insertion sort visualization.
  Mirrors the selection-sort implementation pattern you provided, but adapted
  to show insertion by shifting elements and inserting the key.
*/
const SIZE_INPUT = document.getElementById('sizeInput');
const RANDOM_BTN = document.getElementById('randomizeBtn');
const RESET_BTN = document.getElementById('resetBtn');
const START_BTN = document.getElementById('startBtn');
const ARRAY_CONTAINER = document.getElementById('arrayContainer');

let array = [];
let original = [];
let isRunning = false;
let stepDelay = 520; // ms between atomic steps (adjust to taste)

// Utility: generate random array with values 1..10
function generateRandomArray(size = 8) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 10) + 1);
  }
  return arr;
}

// Render the array as bars; attaches click-to-edit handlers
function renderArray() {
  ARRAY_CONTAINER.innerHTML = '';
  array.forEach((val, idx) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.dataset.index = idx;
    const heightPercent = 20 + (val / 10) * 80; // map 1..10 to 20%..100%
    bar.style.height = `${heightPercent}%`;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = val;
    bar.appendChild(label);

    // click to edit value
    bar.addEventListener('click', (e) => {
      if (isRunning) return;
      openEditor(bar, idx);
    });

    ARRAY_CONTAINER.appendChild(bar);
  });
}

// Open an inline editor to change a value
function openEditor(barEl, index) {
  const current = array[index];
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 1;
  input.max = 10;
  input.value = current;
  input.style.width = '52px';
  input.style.padding = '6px';
  input.style.borderRadius = '6px';

  const label = barEl.querySelector('.label');
  barEl.replaceChild(input, label);
  input.focus();
  input.select();

  function finish() {
    const v = Math.max(1, Math.min(10, Number(input.value) || current));
    array[index] = v;
    renderArray();
  }

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    } else if (ev.key === 'Escape') {
      renderArray();
    }
  });
}

function setControls(enabled) {
  SIZE_INPUT.disabled = !enabled;
  RANDOM_BTN.disabled = !enabled;
  RESET_BTN.disabled = !enabled;
  START_BTN.disabled = !enabled;
}

// Initialize app
function init() {
  const size = Number(SIZE_INPUT.value) || 8;
  array = generateRandomArray(size);
  original = array.slice();
  renderArray();
}

SIZE_INPUT.addEventListener('change', () => {
  const size = Math.max(2, Math.min(12, Number(SIZE_INPUT.value) || 8));
  SIZE_INPUT.value = size;
  array = generateRandomArray(size);
  original = array.slice();
  renderArray();
});

RANDOM_BTN.addEventListener('click', () => {
  const size = Number(SIZE_INPUT.value) || 8;
  array = generateRandomArray(size);
  original = array.slice();
  renderArray();
});

RESET_BTN.addEventListener('click', () => {
  if (isRunning) return;
  array = original.slice();
  renderArray();
});

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function clearStates() {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach(b => {
    b.classList.remove('key', 'compare', 'sorted');
  });
}

function markSorted(uptoIndex) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach((b, idx) => {
    b.classList.toggle('sorted', idx <= uptoIndex);
  });
}

// Shift visual: move bar at position k to position k+1 (visual and label swap)
function shiftVisual(k, kPlus1) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  const bk = bars[k];
  const bk1 = bars[kPlus1];

  // swap heights and labels to simulate shift
  const tmpHeight = bk.style.height;
  bk.style.height = bk1.style.height;
  bk1.style.height = tmpHeight;

  const t = bk.querySelector('.label').textContent;
  bk.querySelector('.label').textContent = bk1.querySelector('.label').textContent;
  bk1.querySelector('.label').textContent = t;
}

// Insert visual: set bar at pos to a given value (height + label)
function setBarValueVisual(pos, value) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  const b = bars[pos];
  const heightPercent = 20 + (value / 10) * 80;
  b.style.height = `${heightPercent}%`;
  b.querySelector('.label').textContent = value;
}

// Run insertion sort with step-by-step visualization
async function runInsertionSort() {
  if (isRunning) return;
  isRunning = true;
  setControls(false);

  const n = array.length;

  // At start, leftmost element is considered sorted (index 0)
  markSorted(0);
  for (let i = 1; i < n; i++) {
    if (!isRunning) break;

    // key is the element to insert
    let key = array[i];
    let j = i - 1;

    // visually mark the key
    clearStates();
    const barsStart = ARRAY_CONTAINER.querySelectorAll('.bar');
    barsStart[i].classList.add('key');
    // mark sorted left portion
    for (let s = 0; s < i; s++) barsStart[s].classList.add('sorted');

    await wait(stepDelay);

    // Shift elements greater than key to the right
    while (j >= 0 && array[j] > key) {
      if (!isRunning) break;

      // mark the element being compared / shifted
      clearStates();
      const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
      bars[j].classList.add('compare');
      bars[i].classList.add('key'); // show where key originates from visually
      for (let s = 0; s < i; s++) bars[s].classList.add('sorted');
      await wait(Math.round(stepDelay * 0.8));

      // shift in model
      array[j + 1] = array[j];

      // visually shift: copy bar j into j+1
      shiftVisual(j, j + 1);
      await wait(Math.round(stepDelay * 0.9));

      j--;
    }

    // place key at j+1 in model
    array[j + 1] = key;

    // visually set the inserted value
    clearStates();
    const barsAfter = ARRAY_CONTAINER.querySelectorAll('.bar');
    barsAfter[j + 1].classList.add('key');
    for (let s = 0; s <= i; s++) barsAfter[s].classList.add('sorted');
    setBarValueVisual(j + 1, key);
    await wait(stepDelay);

    // mark up to i as sorted (since we've inserted the ith element)
    markSorted(i);
    await wait(140);
  }

  // final state: fully sorted
  clearStates();
  markSorted(n - 1);
  isRunning = false;
  setControls(true);
}

// Start / Stop handler
START_BTN.addEventListener('click', async () => {
  if (isRunning) return;
  await runInsertionSort();
});

// Prevent accidental edits while running
window.addEventListener('beforeunload', (e) => {
  if (isRunning) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Initialize render
init();