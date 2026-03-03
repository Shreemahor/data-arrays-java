function recursion() {
  // Title logic: derive title from main function name
  const titleEl = "just placeholder";
  if (titleEl) titleEl.textContent = toTitleFromFunctionName(recursion.name);

  // --- Elements
  const nInput = document.getElementById("nInput");
  const runSumBtn = document.getElementById("runSumBtn");
  const runSquaresBtn = document.getElementById("runSquaresBtn");
  const resetTowersBtn = document.getElementById("resetTowersBtn");

  const sumTower = document.getElementById("sumTower");
  const sqTower = document.getElementById("sqTower");
  const sumStatus = document.getElementById("sumStatus");
  const sqStatus = document.getElementById("sqStatus");

  const targetInput = document.getElementById("targetInput");
  const searchBtn = document.getElementById("searchBtn");
  const newArrayBtn = document.getElementById("newArrayBtn");
  const resetSearchBtn = document.getElementById("resetSearchBtn");

  const arrayRow = document.getElementById("arrayRow");
  const levelsEl = document.getElementById("levels");
  const bsStatus = document.getElementById("bsStatus");

  const stackList = document.getElementById("stackList");
  const stackPill = document.getElementById("stackPill");

  // --- State
  let runningTower = false;
  let bsRunning = false;

  let arr = makeSortedArray(13, 3, 6); // length, start, step randomness
  let eliminated = new Set();
  let activeRange = { lo: 0, hi: arr.length - 1 };
  let currentMid = -1;

  // --- Init render
  renderArray();
  clearLevels();
  renderStack([]);

  // --- Events
  runSumBtn.addEventListener("click", async () => {
    if (runningTower) return;
    runningTower = true;
    resetTower(sumTower, sumStatus);
    const n = clampInt(nInput.value, 1, 10);
    nInput.value = n;

    sumStatus.innerHTML = `Running <strong>sumToN(${n})</strong>...`;
    const result = await animateSumTower({
      n,
      towerEl: sumTower,
      statusEl: sumStatus,
      mode: "linear" // n + ...
    });
    sumStatus.innerHTML = `Result: <strong>${result}</strong>`;
    runningTower = false;
  });

  runSquaresBtn.addEventListener("click", async () => {
    if (runningTower) return;
    runningTower = true;
    resetTower(sqTower, sqStatus);
    const n = clampInt(nInput.value, 1, 10);
    nInput.value = n;

    sqStatus.innerHTML = `Running <strong>sumSquares(${n})</strong>...`;
    const result = await animateSumTower({
      n,
      towerEl: sqTower,
      statusEl: sqStatus,
      mode: "squares" // n*n + ...
    });
    sqStatus.innerHTML = `Result: <strong>${result}</strong>`;
    runningTower = false;
  });

  resetTowersBtn.addEventListener("click", () => {
    if (runningTower) return;
    resetTower(sumTower, sumStatus);
    resetTower(sqTower, sqStatus);
  });

  newArrayBtn.addEventListener("click", () => {
    if (bsRunning) return;
    arr = makeSortedArray(13, randInt(0, 8), 7);
    resetSearchUI();
  });

  resetSearchBtn.addEventListener("click", () => {
    if (bsRunning) return;
    resetSearchUI();
  });

  searchBtn.addEventListener("click", async () => {
    if (bsRunning) return;
    bsRunning = true;

    const t = Number(targetInput.value);
    if (!Number.isFinite(t)) {
      bsStatus.innerHTML = `Enter a valid target number.`;
      bsRunning = false;
      return;
    }

    resetSearchUI(false);
    bsStatus.innerHTML = `Searching for <strong>${t}</strong>...`;
    stackPill.textContent = "running";

    const res = await binarySearchRecursiveVisual(t);

    if (res.index >= 0) {
      bsStatus.innerHTML = `Found <strong>${t}</strong> at index <strong>${res.index}</strong>.`;
    } else {
      bsStatus.innerHTML = `Not found: <strong>${t}</strong>.`;
    }
    stackPill.textContent = "idle";
    bsRunning = false;
  });

  // --- Helpers (Title)
  function toTitleFromFunctionName(fnName) {
    // camelCase / PascalCase / snake_case / kebab-case -> Title Case
    const spaced = fnName
      .replace(/[_-]+/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .trim();
    return spaced
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // --- Tower animation (sum + sum squares)
  async function animateSumTower({ n, towerEl, statusEl, mode }) {
    // We visualize the *return phase* as blocks appearing bottom-to-top.
    // First, we "descend" to base case conceptually (brief text), then
    // we build blocks as if calls are returning.
    statusEl.innerHTML = `Descending to base case...`;
    await sleep(450);

    let result;
    if (mode === "linear") {
      result = await sumToNVisual(n);
    } else {
      result = await sumSquaresVisual(n);
    }
    return result;

    async function sumToNVisual(k) {
      // base case
      if (k === 1) {
        await showReturnBlock({
          towerEl,
          k,
          value: 1,
          expr: "base → 1",
          returned: true
        });
        return 1;
      }

      // recursive call first
      const sub = await sumToNVisual(k - 1);

      // unwind/return: now we can compute k + sub
      const val = k + sub;
      await showReturnBlock({
        towerEl,
        k,
        value: val,
        expr: `${k} + sum(${k - 1})`,
        returned: true
      });
      return val;
    }

    async function sumSquaresVisual(k) {
      if (k === 1) {
        await showReturnBlock({
          towerEl,
          k,
          value: 1,
          expr: "base → 1",
          returned: true
        });
        return 1;
      }

      const sub = await sumSquaresVisual(k - 1);
      const val = k * k + sub;
      await showReturnBlock({
        towerEl,
        k,
        value: val,
        expr: `${k}² + sumSq(${k - 1})`,
        returned: true
      });
      return val;
    }
  }

  async function showReturnBlock({ towerEl, k, value, expr, returned }) {
    const block = document.createElement("div");
    block.className = "block" + (returned ? " returned" : "");
    block.innerHTML = `
      <span class="k">n=${k}</span>
      <span class="expr">${escapeHtml(expr)}</span>
      <span class="val">${value}</span>
    `;
    towerEl.appendChild(block);
    await sleep(350);
  }

  function resetTower(towerEl, statusEl) {
    towerEl.innerHTML = "";
    statusEl.textContent = "Ready.";
  }

  // --- Binary search visualizer (recursive)
  async function binarySearchRecursiveVisual(target) {
    eliminated = new Set();
    activeRange = { lo: 0, hi: arr.length - 1 };
    currentMid = -1;
    clearLevels();
    renderArray();

    const callStack = [];

    const resultIndex = await bs(target, 0, arr.length - 1, 0);

    // Final: mark everything eliminated if not found
    if (resultIndex < 0) {
      for (let i = 0; i < arr.length; i++) eliminated.add(i);
      renderArray();
    }

    return { index: resultIndex };

    async function bs(t, lo, hi, depth) {
      // Push frame (call)
      callStack.push({ t, lo, hi, mid: null, ret: null, resolving: false });
      renderStack(callStack);

      await sleep(320);

      // Base case: not found
      if (lo > hi) {
        // resolve frame
        const top = callStack[callStack.length - 1];
        top.resolving = true;
        top.ret = -1;
        renderStack(callStack);

        addLevel({ depth, lo, hi, mid: null, midVal: null, target: t, note: "lo > hi → return -1" });
        await sleep(340);

        callStack.pop();
        renderStack(callStack);
        await sleep(120);
        return -1;
      }

      const mid = lo + Math.floor((hi - lo) / 2);

      // Update visuals for this call
      activeRange = { lo, hi };
      currentMid = mid;
      renderArray();

      // Record on frame
      {
        const top = callStack[callStack.length - 1];
        top.mid = mid;
        renderStack(callStack);
      }

      addLevel({
        depth,
        lo,
        hi,
        mid,
        midVal: arr[mid],
        target: t,
        note: `compare a[mid]=${arr[mid]}`
      });

      await sleep(520);

      if (arr[mid] === t) {
        // Resolve found
        const top = callStack[callStack.length - 1];
        top.resolving = true;
        top.ret = mid;
        renderStack(callStack);

        await sleep(420);

        // eliminate everything except found (optional: keep range highlight)
        for (let i = 0; i < arr.length; i++) if (i !== mid) eliminated.add(i);
        activeRange = { lo: mid, hi: mid };
        currentMid = mid;
        renderArray();

        callStack.pop();
        renderStack(callStack);
        await sleep(120);
        return mid;
      }

      if (t < arr[mid]) {
        // Eliminate right side including mid? In binary search, mid is excluded next.
        for (let i = mid; i <= hi; i++) eliminated.add(i);
        renderArray();
        await sleep(220);

        const res = await bs(t, lo, mid - 1, depth + 1);

        // resolve this frame with res
        const top = callStack[callStack.length - 1];
        top.resolving = true;
        top.ret = res;
        renderStack(callStack);
        await sleep(280);

        callStack.pop();
        renderStack(callStack);
        await sleep(120);
        return res;
      } else {
        // Eliminate left side including mid
        for (let i = lo; i <= mid; i++) eliminated.add(i);
        renderArray();
        await sleep(220);

        const res = await bs(t, mid + 1, hi, depth + 1);

        const top = callStack[callStack.length - 1];
        top.resolving = true;
        top.ret = res;
        renderStack(callStack);
        await sleep(280);

        callStack.pop();
        renderStack(callStack);
        await sleep(120);
        return res;
      }
    }
  }

  // --- Render: array + levels + stack
  function renderArray() {
    arrayRow.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const c = document.createElement("div");
      c.className = "cell";
      c.textContent = arr[i];

      const inActive = i >= activeRange.lo && i <= activeRange.hi;
      if (inActive) c.classList.add("active");
      if (i === currentMid) c.classList.add("mid");
      if (eliminated.has(i)) c.classList.add("elim");

      arrayRow.appendChild(c);
    }
  }

  function clearLevels() {
    levelsEl.innerHTML = "";
  }

  function addLevel({ depth, lo, hi, mid, midVal, target, note }) {
    const level = document.createElement("div");
    level.className = "level";
    const midText = mid == null ? "—" : String(mid);
    const midValText = midVal == null ? "—" : String(midVal);

    level.innerHTML = `
      <div class="level-top">
        <span>Call level ${depth}</span>
        <span>${escapeHtml(note)}</span>
      </div>
      <div class="kv">
        <span class="t">target: ${target}</span>
        <span>lo: ${lo}</span>
        <span>hi: ${hi}</span>
        <span class="m">mid: ${midText}</span>
        <span>a[mid]: ${midValText}</span>
      </div>
    `;
    levelsEl.appendChild(level);
  }

  function renderStack(frames) {
    stackList.innerHTML = "";
    if (!frames.length) {
      stackList.innerHTML = `<div class="muted" style="font-size:13px;font-weight:600;">(empty)</div>`;
      return;
    }

    for (const f of frames) {
      const div = document.createElement("div");
      div.className = "frame" + (f.resolving ? " resolving" : "");
      const midPart = f.mid == null ? "" : `, mid=${f.mid}`;
      const sig = `bs(t=${f.t}, lo=${f.lo}, hi=${f.hi}${midPart})`;

      div.innerHTML = `
        <div><span class="sig">${escapeHtml(sig)}</span></div>
        <div class="ret">${f.ret == null ? "return: (pending)" : `return: ${f.ret}`}</div>
      `;
      stackList.appendChild(div);
    }
  }

  // --- Reset search
  function resetSearchUI(regenArray = true) {
    if (regenArray) {
      // keep current arr by default; regen controlled elsewhere
    }
    eliminated = new Set();
    activeRange = { lo: 0, hi: arr.length - 1 };
    currentMid = -1;
    renderArray();
    clearLevels();
    renderStack([]);
    stackPill.textContent = "idle";
    bsStatus.textContent = "Ready.";
  }

  // --- Utilities
  function clampInt(v, min, max) {
    const n = Math.trunc(Number(v));
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function makeSortedArray(len, start, stepMax) {
    // strictly increasing, with variable steps to look natural
    const out = [];
    let cur = start;
    for (let i = 0; i < len; i++) {
      cur += randInt(2, stepMax);
      out.push(cur);
    }
    return out;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", recursion);