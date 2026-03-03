const SIZE_INPUT = document.getElementById('sizeInput');
const RANDOM_BTN = document.getElementById('randomizeBtn');
const RESET_BTN = document.getElementById('resetBtn');
const START_BTN = document.getElementById('startBtn');
const ARRAY_CONTAINER = document.getElementById('arrayContainer');

let array = [];
let original = [];
let isRunning = false;
let stepDelay = 450; // ms between main steps (adjust for animation speed)

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
function clearAllStates() {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  bars.forEach(b => {
    b.classList.remove('left', 'right', 'merged');
    b.style.opacity = '1';
  });
}

function markRange(left, right, side) {
  // applies 'left' or 'right' class to bars in [left..right]
  clearAllStates();
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  for (let i = left; i <= right; i++) {
    if (i >= 0 && i < bars.length) {
      bars[i].classList.add(side);
    }
  }
}

function markMerged(pos) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  if (pos >= 0 && pos < bars.length) {
    bars[pos].classList.add('merged');
  }
}

function setBarValueVisual(index, value) {
  const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
  const b = bars[index];
  if (!b) return;
  const heightPercent = 20 + (value / 10) * 80;
  b.style.height = `${heightPercent}%`;
  b.querySelector('.label').textContent = value;
}

// Merge algorithm with visualization; performs merging of two adjacent ranges: [l..m] and [m+1..r]
// This function mutates the global array and updates visuals step-by-step.
async function visualizeMerge(l, m, r) {
  // Mark ranges visually
  const leftRange = [l, m];
  const rightRange = [m + 1, r];

  // Copy of the ranges to act as aux arrays for visualization
  const leftCopy = array.slice(l, m + 1);
  const rightCopy = array.slice(m + 1, r + 1);

  // pointers
  let i = 0; // index in leftCopy
  let j = 0; // index in rightCopy
  let k = l; // position in the main array where next element goes

  // Show left and right ranges
  markRange(l, m, 'left');
  // highlight right as well by adding 'right' without removing 'left'
  const barsAll = ARRAY_CONTAINER.querySelectorAll('.bar');
  for (let x = m + 1; x <= r; x++) {
    if (barsAll[x]) barsAll[x].classList.add('right');
  }
  await wait(stepDelay);

  while (i < leftCopy.length && j < rightCopy.length) {
    // highlight the items being compared
    // slightly reduce opacity for others
    barsAll.forEach((b, idx) => {
      b.style.opacity = idx === (l + i) || idx === (m + 1 + j) || idx === k ? '1' : '0.6';
    });

    // show comparison by adding small pause
    await wait(Math.round(stepDelay * 0.7));

    if (leftCopy[i] <= rightCopy[j]) {
      array[k] = leftCopy[i];
      setBarValueVisual(k, leftCopy[i]);
      // mark this as merged for visual permanence
      markMerged(k);
      i++;
    } else {
      array[k] = rightCopy[j];
      setBarValueVisual(k, rightCopy[j]);
      markMerged(k);
      j++;
    }
    k++;
    await wait(Math.round(stepDelay * 0.9));
  }

  // copy remaining elements from leftCopy
  while (i < leftCopy.length) {
    barsAll.forEach((b, idx) => b.style.opacity = idx === k ? '1' : '0.6');
    array[k] = leftCopy[i];
    setBarValueVisual(k, leftCopy[i]);
    markMerged(k);
    i++; k++;
    await wait(Math.round(stepDelay * 0.8));
  }

  // copy remaining elements from rightCopy
  while (j < rightCopy.length) {
    barsAll.forEach((b, idx) => b.style.opacity = idx === k ? '1' : '0.6');
    array[k] = rightCopy[j];
    setBarValueVisual(k, rightCopy[j]);
    markMerged(k);
    j++; k++;
    await wait(Math.round(stepDelay * 0.8));
  }

  // restore normal visuals and ensure merged region is styled as merged
  barsAll.forEach(b => b.style.opacity = '1');
  for (let pos = l; pos <= r; pos++) {
    if (barsAll[pos]) {
      barsAll[pos].classList.remove('left', 'right');
      barsAll[pos].classList.add('merged');
    }
  }
  await wait(160);
}

// Top-down merge sort that visualizes each merge step
async function runMergeSortVisual() {
  if (isRunning) return;
  isRunning = true;
  setControls(false);

  // We'll implement an iterative bottom-up merge schedule (easier to manage visualization steps)
  // but we'll still animate merges left-to-right for natural progression.

  const n = array.length;
  // initially clear any states
  clearAllStates();
  await wait(80);

  for (let width = 1; width < n; width *= 2) {
    for (let i = 0; i < n; i += 2 * width) {
      if (!isRunning) break;
      const left = i;
      const mid = Math.min(i + width - 1, n - 1);
      const right = Math.min(i + 2 * width - 1, n - 1);

      if (mid < right) {
        // visualize merging [left..mid] and [mid+1..right]
        await visualizeMerge(left, mid, right);
      } else {
        // nothing to merge; mark region as merged for consistency
        const bars = ARRAY_CONTAINER.querySelectorAll('.bar');
        for (let k = left; k <= right; k++) {
          if (bars[k]) bars[k].classList.add('merged');
        }
      }
    }
    // small pause after each width-level
    await wait(220);
  }

  // final state: ensure all bars are marked merged
  const barsFinal = ARRAY_CONTAINER.querySelectorAll('.bar');
  barsFinal.forEach(b => {
    b.classList.add('merged');
    b.style.opacity = '1';
  });

  isRunning = false;
  setControls(true);
}

// Start button handler
START_BTN.addEventListener('click', async () => {
  if (isRunning) return;
  await runMergeSortVisual();
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