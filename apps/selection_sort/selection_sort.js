// Interactive selection sort visualization.
// Loads as a module.

const SIZE_INPUT = document.getElementById('sizeInput');
const RANDOM_BTN = document.getElementById('randomizeBtn');
const RESET_BTN = document.getElementById('resetBtn');
const START_BTN = document.getElementById('startBtn');
const ARRAY_CONTAINER = document.getElementById('arrayContainer');

let array = [];
let original = [];
let isRunning = false;
let stepDelay = 550; // ms between steps (adjust for animation speed)

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
    const heightPercent = 20 + (val / 10) * 80; // map 1..10 to 20%..100% for nicer min height
    bar.style.height = `${heightPercent}%`;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = val;
    bar.appendChild(label);

    // click to edit
    bar.addEventListener('click', (e) => {
      if (isRunning) return;
      openEditor(bar, idx);
    });

    ARRAY_CONTAINER.appendChild(bar);
  });
}

// Open a small inline editor to change value
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

  // Replace label visually
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

// Set control button states
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

// Async helper for delays
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Visual helpers
function clearStates() {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach(b => {
    b.classList.remove('current', 'min', 'sorted');
  });
}

function markCurrent(i) {
  clearStates();
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  if (i >= 0) bars[i].classList.add('current');
  for (let k = 0; k < i; k++) {
    bars[k].classList.add('sorted');
  }
}
function markMin(minIdx) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach(b => b.classList.remove('min'));
  if (minIdx >= 0) bars[minIdx].classList.add('min');
}
function swapVisual(i, j) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  const bi = bars[i];
  const bj = bars[j];

  // swap heights and labels
  const tmpHeight = bi.style.height;
  bi.style.height = bj.style.height;
  bj.style.height = tmpHeight;

  const ti = bi.querySelector('.label').textContent;
  const tj = bj.querySelector('.label').textContent;
  bi.querySelector('.label').textContent = tj;
  bj.querySelector('.label').textContent = ti;
}

// Run selection sort with step-by-step visualization
async function runSelectionSort() {
  if (isRunning) return;
  isRunning = true;
  setControls(false);

  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    if (!isRunning) break;
    let minIndex = i;

    // highlight current index and mark sorted portion
    markCurrent(i);
    markMin(minIndex);
    await wait(stepDelay);

    for (let j = i + 1; j < n; j++) {
      if (!isRunning) break;

      // highlight j as being compared (temporarily mark current to j)
      const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
      bars.forEach(b => b.classList.remove('compare'));
      bars[j].classList.add('current');
      await wait(Math.round(stepDelay * 0.6));

      // Compare array values
      if (array[j] < array[minIndex]) {
        minIndex = j;
        markMin(minIndex);
        await wait(Math.round(stepDelay * 0.8));
      }

      // restore i as current for next comparisons
      markCurrent(i);
    }

    // If minIndex changed, swap and animate
    if (minIndex !== i) {
      // visually highlight swap
      const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
      bars[i].classList.add('current');
      bars[minIndex].classList.add('min');
      await wait(180);

      // swap model data
      const tmp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = tmp;

      // perform visual swap
      swapVisual(i, minIndex);
      await wait(stepDelay);
    }

    // mark i as sorted
    markCurrent(i + 1);
    const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
    bars[i].classList.add('sorted');
    bars[i].classList.remove('current');
    bars[i].classList.remove('min');
    await wait(200);
  }

  // final state: all sorted
  clearStates();
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach(b => b.classList.add('sorted'));
  isRunning = false;
  setControls(true);
}

// Start / Stop handler
START_BTN.addEventListener('click', async () => {
  if (isRunning) return;
  await runSelectionSort();
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