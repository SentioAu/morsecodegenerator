// path: public/mcg-tool.js
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  async function loadMorsePayload() {
    const res = await fetch("/morse.json", { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load /morse.json (${res.status})`);
    return await res.json();
  }

  function extractCharToMorse(payload) {
    if (payload && typeof payload === "object") {
      if (payload.morseMap && typeof payload.morseMap === "object") return payload.morseMap;
      return payload;
    }
    return {};
  }

  function sanitizeCharMap(map) {
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      if (!k || !v) continue;
      if (k === " ") continue;
      out[k.toUpperCase()] = v;
    }
    return out;
  }

  function normText(s) {
    return (s || "").toUpperCase();
  }

  function normMorse(s) {
    return (s || "")
      .replaceAll("·", ".")
      .replaceAll("–", "-")
      .replaceAll("—", "-")
      .replace(/\s*\|\s*/g, " / ")
      .trim();
  }

  function buildReverseMap(map) {
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      if (!k || !v) continue;
      if (out[v] == null) out[v] = k;
    }
    return out;
  }

  // text -> morse (ignore unsupported chars, preserve word breaks)
  function textToMorse(input, CHAR_TO_MORSE) {
    const s = normText(input).trim();
    if (!s) return "";
    const words = s.split(/\s+/).filter(Boolean);

    return words
      .map((w) =>
        w
          .split("")
          .map((ch) => CHAR_TO_MORSE[ch] || "")
          .filter(Boolean)
          .join(" ")
      )
      .filter(Boolean)
      .join(" / ");
  }

  function morseToText(input, MORSE_TO_CHAR) {
    const s = normMorse(input);
    if (!s) return "";

    const words = s.split(/\s*\/+\s*/).filter(Boolean);

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

  // simple heuristic: if it contains mostly .-/ and spaces, treat as morse
  function looksLikeMorse(raw) {
    const s = (raw || "").trim();
    if (!s) return false;
    // any letters strongly suggests text
    if (/[A-Za-z0-9]/.test(s)) {
      // allow numbers in morse input too, but if there are many letters, it’s text
      const letters = (s.match(/[A-Za-z]/g) || []).length;
      if (letters > 0) return false;
    }
    // if it contains dot/dash, likely morse
    return /[.\-·–—]/.test(s);
  }

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

  function setBtnToast(btn, text) {
    if (!btn) return;
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => (btn.textContent = old), 900);
  }

  onReady(async () => {
    const input = document.getElementById("mcg-input");
    const output = document.getElementById("mcg-output");
    const btnT2M = document.getElementById("mcg-text-to-morse");
    const btnM2T = document.getElementById("mcg-morse-to-text");
    const btnCopy = document.getElementById("mcg-copy");
    const btnSwap = document.getElementById("mcg-swap");
    const btnClear = document.getElementById("mcg-clear");

    // If page doesn't have the tool, do nothing
    if (!input || !output || !btnT2M || !btnM2T || !btnCopy) return;

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

    function runTextToMorse() {
      output.value = textToMorse(input.value, CHAR_TO_MORSE);
    }
    function runMorseToText() {
      output.value = morseToText(input.value, MORSE_TO_CHAR);
    }

    // Buttons
    btnT2M.addEventListener("click", runTextToMorse);
    btnM2T.addEventListener("click", runMorseToText);

    btnCopy.addEventListener("click", async () => {
      const val = (output.value || "").trim();
      if (!val) return;
      const ok = await copyToClipboard(val);
      setBtnToast(btnCopy, ok ? "Copied ✓" : "Copy failed");
    });

    btnSwap?.addEventListener("click", () => {
      const a = input.value || "";
      const b = output.value || "";
      input.value = b;
      output.value = a;
      setBtnToast(btnSwap, "Swapped ✓");
    });

    btnClear?.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      input.focus();
      setBtnToast(btnClear, "Cleared ✓");
    });

    // Auto-detect on input (throttled)
    let t = null;
    input.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const raw = input.value || "";
        if (!raw.trim()) {
          output.value = "";
          return;
        }
        if (looksLikeMorse(raw)) runMorseToText();
        else runTextToMorse();
      }, 140);
    });

    // Run once on load to populate output for default text (e.g., "HELLO")
    const init = (input.value || "").trim();
    if (init) {
      if (looksLikeMorse(init)) runMorseToText();
      else runTextToMorse();
    }
  });
})();
