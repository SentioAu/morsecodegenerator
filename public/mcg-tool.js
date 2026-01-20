// path: public/mcg-tool.js
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  }

  async function loadMorsePayload() {
    const res = await fetch("/morse.json", { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load /morse.json (${res.status})`);
    return await res.json();
  }

  function extractCharToMorse(payload) {
    // Supports:
    // 1) { morseMap: { A: ".-", ... }, phrases: [...] }
    // 2) { A: ".-", ... } (legacy)
    if (payload && typeof payload === "object") {
      if (payload.morseMap && typeof payload.morseMap === "object") return payload.morseMap;
      return payload;
    }
    return {};
  }

  function sanitizeCharMap(map) {
    // Ignore " " mapping if present. Word separation is handled by joining words with " / ".
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      if (!k || !v) continue;
      if (k === " ") continue;
      out[String(k).toUpperCase()] = String(v);
    }
    return out;
  }

  function buildReverseMap(map) {
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      if (!k || !v) continue;
      // Keep first if collision
      if (out[v] == null) out[v] = k;
    }
    return out;
  }

  // -------------------------
  // Normalizers
  // -------------------------
  function normText(s) {
    return String(s || "").toUpperCase();
  }

  function normMorse(s) {
    // Accept common variations people paste:
    // - middle dot (·) / bullet (•) -> .
    // - en/em dash (–/—) -> -
    // - "|" or "\" as word separator -> "/"
    // - collapse spaces
    return String(s || "")
      .replaceAll("·", ".")
      .replaceAll("•", ".")
      .replaceAll("–", "-")
      .replaceAll("—", "-")
      .replace(/\s*(\||\\)\s*/g, " / ")
      .replace(/\s*\/+\s*/g, " / ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function looksLikeMorse(s) {
    // Heuristic: contains only morse-ish chars (., -, /, spaces) and at least one dot/dash
    const t = String(s || "").trim();
    if (!t) return false;
    const hasSignal = /[.\-]/.test(t) || /[·•–—]/.test(t);
    const okChars = /^[.\-\/\s|\\·•–—]+$/.test(t);
    return hasSignal && okChars;
  }

  // -------------------------
  // Converters
  // -------------------------
  function textToMorseDetailed(input, CHAR_TO_MORSE) {
    const s = normText(input).trim();
    if (!s) return { out: "", missing: [] };

    const missing = [];
    const words = s.split(/\s+/).filter(Boolean);

    const out = words
      .map((w) =>
        w
          .split("")
          .map((ch) => {
            const m = CHAR_TO_MORSE[ch];
            if (!m) {
              // Track unsupported (but ignore whitespace which we already split on)
              missing.push(ch);
              return "";
            }
            return m;
          })
          .filter(Boolean)
          .join(" ")
      )
      .filter(Boolean)
      .join(" / ");

    // De-dupe missing
    const uniqMissing = Array.from(new Set(missing)).filter((x) => x && x !== " ");
    return { out, missing: uniqMissing };
  }

  function morseToText(input, MORSE_TO_CHAR) {
    const s = normMorse(input);
    if (!s) return "";

    const words = s.split(/\s*\/\s*/).filter(Boolean);

    return words
      .map((w) =>
        w
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((code) => MORSE_TO_CHAR[code] || "")
          .join("")
      )
      .join(" ");
  }

  // -------------------------
  // Clipboard
  // -------------------------
  async function copyToClipboard(text) {
    const t = text || "";
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = t;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return !!ok;
      } catch {
        return false;
      }
    }
  }

  // -------------------------
  // UI helpers
  // -------------------------
  function setBtnLabel(btn, text, ms) {
    if (!btn) return;
    const old = btn.textContent;
    btn.textContent = text;
    if (ms) setTimeout(() => (btn.textContent = old), ms);
  }

  function ensureHintEl(output) {
    // Adds a small muted line under output textarea (no CSS dependency)
    const parent = output?.parentElement;
    if (!parent) return null;

    let el = parent.querySelector("[data-mcg-hint]");
    if (!el) {
      el = document.createElement("p");
      el.setAttribute("data-mcg-hint", "true");
      el.style.margin = "10px 0 0";
      el.style.fontSize = "13px";
      el.style.opacity = "0.78";
      el.style.maxWidth = "72ch";
      parent.appendChild(el);
    }
    return el;
  }

  function debounce(fn, wait) {
    let t = null;
    return function (...args) {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  onReady(async () => {
    const input = document.getElementById("mcg-input");
    const output = document.getElementById("mcg-output");
    const btnT2M = document.getElementById("mcg-text-to-morse");
    const btnM2T = document.getElementById("mcg-morse-to-text");
    const btnCopy = document.getElementById("mcg-copy");
    const btnSwap = document.getElementById("mcg-swap");
    const btnClear = document.getElementById("mcg-clear");

    // Safe for other pages
    if (!input || !output) return;

    let CHAR_TO_MORSE;
    let MORSE_TO_CHAR;

    try {
      const payload = await loadMorsePayload();
      const raw = extractCharToMorse(payload);
      CHAR_TO_MORSE = sanitizeCharMap(raw);

      if (!CHAR_TO_MORSE || !Object.keys(CHAR_TO_MORSE).length) {
        throw new Error("Morse map is empty or invalid");
      }

      MORSE_TO_CHAR = buildReverseMap(CHAR_TO_MORSE);
    } catch (e) {
      console.error(e);
      output.value = "Error: failed to load Morse map.";
      return;
    }

    const hint = ensureHintEl(output);

    function renderHint(message) {
      if (!hint) return;
      hint.textContent = message || "";
      hint.style.display = message ? "" : "none";
    }

    function runAutoConvert() {
      const v = String(input.value || "").trim();
      if (!v) {
        output.value = "";
        renderHint("");
        return;
      }

      if (looksLikeMorse(v)) {
        const decoded = morseToText(v, MORSE_TO_CHAR);
        output.value = decoded;
        renderHint("Detected Morse input → decoded to text.");
      } else {
        const { out, missing } = textToMorseDetailed(v, CHAR_TO_MORSE);
        output.value = out;
        if (missing.length) {
          renderHint(`Some characters were skipped (no Morse mapping): ${missing.join(" ")}`);
        } else {
          renderHint("Detected text input → converted to Morse.");
        }
      }
    }

    const runAutoConvertDebounced = debounce(runAutoConvert, 120);

    // Buttons (if present)
    btnT2M?.addEventListener("click", () => {
      const { out, missing } = textToMorseDetailed(input.value, CHAR_TO_MORSE);
      output.value = out;
      if (missing.length) {
        renderHint(`Some characters were skipped (no Morse mapping): ${missing.join(" ")}`);
      } else {
        renderHint("Converted: Text → Morse.");
      }
    });

    btnM2T?.addEventListener("click", () => {
      output.value = morseToText(input.value, MORSE_TO_CHAR);
      renderHint("Converted: Morse → Text.");
    });

    btnCopy?.addEventListener("click", async () => {
      const val = String(output.value || "").trim();
      if (!val) return;
      const ok = await copyToClipboard(val);
      setBtnLabel(btnCopy, ok ? "Copied ✓" : "Copy failed", 900);
    });

    btnSwap?.addEventListener("click", () => {
      const a = input.value;
      input.value = output.value;
      output.value = a;
      input.focus();
      runAutoConvertDebounced();
      renderHint("Swapped input/output.");
    });

    btnClear?.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      input.focus();
      renderHint("");
    });

    // Live feel: auto-convert on input
    input.addEventListener("input", runAutoConvertDebounced);

    // Initial run (for default HELLO or ?q=)
    runAutoConvertDebounced();
  });
})();
