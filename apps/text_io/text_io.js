function javaTextIOGame() {
  // Title logic: extract from main JS function name
  const titleEl = "Just placeholder because the title is hardcoded in the HTML";
  titleEl.textContent = toTitleFromFunctionName(javaTextIOGame.name);

  // Populate static educational snippets
  document.getElementById("demoWriteCode").textContent = getWriteSnippet();
  document.getElementById("demoErrorCode").textContent = getErrorSnippet();

  // Demo files for the visualization panels (these live in memory, not localStorage)
  const demoFiles = {
    "hello.txt": "Hello from a file!\nThis is line 2.\n",
    "scores.txt": "Alice 10\nBob 14\nCharlie 9\n",
    "notes.txt": "Scanner reads tokens.\nPrintWriter writes text.\nTry-catch handles failures.\n"
  };

  setupDemoVisualization(demoFiles);

  // Interactive simulator (localStorage-backed)
  const store = createLocalFileStore("javaTextIO.files.v1");
  seedIfEmpty(store);

  wireInteractiveUI(store);
}

/* ------------------------- Title helpers ------------------------- */

function toTitleFromFunctionName(fnName) {
  // camelCase / PascalCase / snake_case / kebab-case -> "Nice Title"
  const spaced = fnName
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  return spaced
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ----------------------- Demo visualization ---------------------- */

function setupDemoVisualization(files) {
  const listEl = document.getElementById("fileList");
  const previewEl = document.getElementById("filePreview");
  const badgeEl = document.getElementById("activeFileBadge");

  listEl.innerHTML = "";

  const names = Object.keys(files);
  let active = names[0] || null;

  const render = () => {
    previewEl.textContent = active ? files[active] : "(select a file)";
    badgeEl.textContent = active || "none";

    // buttons
    [...listEl.querySelectorAll("button")].forEach(btn => {
      btn.setAttribute("aria-selected", btn.dataset.name === active ? "true" : "false");
    });
  };

  names.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "filebtn";
    btn.dataset.name = name;
    btn.type = "button";
    btn.innerHTML = `
      <span style="font-weight:700">${escapeHtml(name)}</span>
      <span class="filemeta">${files[name].split("\n").filter(Boolean).length} lines</span>
    `;
    btn.addEventListener("click", () => {
      active = name;
      render();
    });
    listEl.appendChild(btn);
  });

  render();
}

/* ------------------------- Local file store ----------------------- */

function createLocalFileStore(key) {
  const loadAll = () => {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      return parsed;
    } catch {
      return {};
    }
  };

  const saveAll = (obj) => {
    localStorage.setItem(key, JSON.stringify(obj));
  };

  return {
    list() {
      const obj = loadAll();
      return Object.keys(obj).sort((a, b) => a.localeCompare(b));
    },
    exists(name) {
      const obj = loadAll();
      return Object.prototype.hasOwnProperty.call(obj, name);
    },
    read(name) {
      const obj = loadAll();
      if (!name || typeof name !== "string") {
        throw new Error("Invalid filename (must be a non-empty string).");
      }
      if (!Object.prototype.hasOwnProperty.call(obj, name)) {
        const err = new Error(`FileNotFoundException: ${name}`);
        err.code = "FileNotFoundException";
        throw err;
      }
      return String(obj[name] ?? "");
    },
    write(name, content) {
      if (!name || typeof name !== "string") {
        throw new Error("Invalid filename (must be a non-empty string).");
      }
      if (name.length > 60) {
        throw new Error("Invalid filename (too long).");
      }
      // Simple "bad path" simulation
      if (name.includes("..") || name.includes("\\") || name.startsWith("/")) {
        throw new Error("Invalid path. Use a simple filename like notes.txt (no .., no absolute paths).");
      }
      if (typeof content !== "string") {
        throw new Error("Invalid data: content must be text.");
      }
      const obj = loadAll();
      obj[name] = content;
      saveAll(obj);
    },
    appendLine(name, line) {
      if (typeof line !== "string") throw new Error("Invalid data: line must be text.");
      const current = this.exists(name) ? this.read(name) : "";
      const next = current + (current.endsWith("\n") || current.length === 0 ? "" : "\n") + line + "\n";
      this.write(name, next);
      return next;
    }
  };
}

function seedIfEmpty(store) {
  if (store.list().length > 0) return;

  store.write("io-demo.txt", "First line\nSecond line\nThird line\n");
  store.write("numbers.txt", "10 20 30\n40 50\n");
  store.write("empty.txt", "");
}

/* -------------------------- Interactive UI ------------------------ */

function wireInteractiveUI(store) {
  const textInput = document.getElementById("textInput");
  const filenameInput = document.getElementById("filenameInput");

  const fileSelect = document.getElementById("fileSelect");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");

  const readBtn = document.getElementById("readBtn");
  const nextLineBtn = document.getElementById("nextLineBtn");
  const appendBtn = document.getElementById("appendBtn");

  const statusBox = document.getElementById("statusBox");
  const outputBox = document.getElementById("outputBox");

  // "Scanner state"
  let scannerLines = [];
  let scannerIndex = 0;
  let scannerOpenFile = null;

  const setStatus = (type, msg) => {
    const cls = type === "err" ? "err" : "ok";
    statusBox.innerHTML = `<span class="${cls}">${type === "err" ? "Error:" : "OK:"}</span> ${escapeHtml(msg)}`;
  };

  const refreshSelect = (preferName) => {
    const names = store.list();
    fileSelect.innerHTML = "";
    names.forEach(n => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      fileSelect.appendChild(opt);
    });

    if (names.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "(no files yet)";
      fileSelect.appendChild(opt);
      fileSelect.value = "";
      return;
    }

    if (preferName && names.includes(preferName)) fileSelect.value = preferName;
    else fileSelect.value = names[0];
  };

  const currentSelectedName = () => {
    const v = fileSelect.value;
    return v && v !== "(no files yet)" ? v : "";
  };

  const openScanner = (name) => {
    const text = store.read(name);
    scannerLines = text.split(/\r?\n/); // like nextLine reading
    // If file ends with newline, last item is "" (common); keep it to demonstrate blank line behavior.
    scannerIndex = 0;
    scannerOpenFile = name;
  };

  const closeScanner = () => {
    scannerLines = [];
    scannerIndex = 0;
    scannerOpenFile = null;
  };

  const appendOutput = (s) => {
    if (outputBox.textContent === "(output appears here)") outputBox.textContent = "";
    outputBox.textContent += s;
    outputBox.scrollTop = outputBox.scrollHeight;
  };

  refreshSelect();
  filenameInput.value = currentSelectedName() || "notes.txt";

  // Save (overwrite)
  saveBtn.addEventListener("click", () => {
    const name = filenameInput.value.trim();
    const content = textInput.value;

    try {
      store.write(name, content);
      refreshSelect(name);
      setStatus("ok", `Wrote ${content.length} characters to "${name}" (PrintWriter overwrite simulation).`);
      closeScanner();
    } catch (e) {
      setStatus("err", e.message || String(e));
    }
  });

  // Load (preview content into textarea)
  loadBtn.addEventListener("click", () => {
    const name = currentSelectedName();
    try {
      if (!name) throw new Error("No file selected.");
      const content = store.read(name);
      textInput.value = content;
      filenameInput.value = name;
      setStatus("ok", `Loaded "${name}" into the editor.`);
    } catch (e) {
      setStatus("err", e.message || String(e));
    }
  });

  // Read File (prepare "Scanner")
  readBtn.addEventListener("click", () => {
    const name = currentSelectedName();
    try {
      if (!name) throw new Error("No file selected.");
      openScanner(name);
      outputBox.textContent = "";
      setStatus("ok", `Opened Scanner on "${name}". Click "Next Line" to read sequentially.`);
      appendOutput(`[open] ${name}\n`);
    } catch (e) {
      setStatus("err", e.message || String(e));
      closeScanner();
    }
  });

  // Next Line (simulate nextLine calls)
  nextLineBtn.addEventListener("click", () => {
    try {
      if (!scannerOpenFile) throw new Error("Scanner is not open. Click 'Read File' first.");
      if (scannerIndex >= scannerLines.length) {
        appendOutput("[eof]\n");
        setStatus("ok", `End of file reached for "${scannerOpenFile}". (Scanner would stop here.)`);
        return;
      }
      const line = scannerLines[scannerIndex++];
      appendOutput(line + "\n");
      setStatus("ok", `Read line ${scannerIndex}/${scannerLines.length} from "${scannerOpenFile}".`);
    } catch (e) {
      setStatus("err", e.message || String(e));
    }
  });

  // Append line (simulate write-new-line + close)
  appendBtn.addEventListener("click", () => {
    const name = currentSelectedName() || filenameInput.value.trim();
    const line = textInput.value.trim();

    try {
      if (!name) throw new Error("Pick a file or type a filename first.");
      if (!line) throw new Error("Invalid data: nothing to append (textarea is empty).");

      store.appendLine(name, line);
      refreshSelect(name);

      setStatus("ok", `Appended 1 line to "${name}" (write → flush → close simulation).`);
      appendOutput(`[write] appended to ${name}: ${line}\n`);

      // If scanner is open on same file, demonstrate that you'd typically need to re-open to see new content
      if (scannerOpenFile === name) {
        appendOutput("[note] Scanner already open; re-open to read newly appended content.\n");
      }
    } catch (e) {
      setStatus("err", e.message || String(e));
    }
  });

  // Keep filename input synced with dropdown selection
  fileSelect.addEventListener("change", () => {
    const name = currentSelectedName();
    if (name) filenameInput.value = name;
  });
}

/* ---------------------------- Snippets ---------------------------- */

function getWriteSnippet() {
  return `import java.io.File;
import java.io.PrintWriter;

public class WriteExample {
  public static void main(String[] args) throws Exception {
    File out = new File("notes.txt");

    PrintWriter pw = new PrintWriter(out); // overwrite mode
    pw.println("Hello file!");
    pw.println("This is another line.");
    pw.close(); // flush + close (always close!)
  }
}`;
}

function getErrorSnippet() {
  return `import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;

public class SafeIOExample {

  // Approach 1: handle errors here (try-catch)
  static String readAll(File f) {
    StringBuilder sb = new StringBuilder();
    try (Scanner sc = new Scanner(f)) {
      while (sc.hasNextLine()) {
        sb.append(sc.nextLine()).append("\\n");
      }
    } catch (FileNotFoundException e) {
      return "Could not open file: " + f.getPath();
    }
    return sb.toString();
  }

  // Approach 2: let the caller deal with it (throws)
  static void writeLine(File f, String line) throws FileNotFoundException {
    try (PrintWriter pw = new PrintWriter(f)) {
      pw.println(line);
    }
  }
}`;
}

/* ---------------------------- Utilities --------------------------- */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ----------------------------- Start ------------------------------ */

javaTextIOGame();