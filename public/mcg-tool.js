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
    // Normalize common dot/dash glyphs + normalize separators.
    return (s || "")
      .replaceAll("·", ".")
      .replaceAll("•", ".")
      .replaceAll("–", "-")
      .replaceAll("—", "-")
      .replace(/\s*\|\s*/g, " / ")
      .replace(/\s*\/+\s*/g, " / ")
      .replace(/\s+/g, " ")
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

  function uniqSorted(arr) {
    return Array.from(new Set(arr)).sort();
  }

  // text -> morse + report unsupported chars (preserve word breaks)
  function textToMorseWithReport(input, CHAR_TO_MORSE) {
    const raw = normText(input);
    const s = raw.trim();
    if (!s) return { out: "", unsupported: [] };

    const unsupported = [];
    const words = s.split(/\s+/).filter(Boolean);

    const out = words
      .map((w) =>
        w
          .split("")
          .map((ch) => {
            const v = CHAR_TO_MORSE[ch];
            if (!v) {
              // Ignore whitespace (already split) but record other unsupported chars
              unsupported.push(ch);
              return "";
            }
            return v;
          })
          .filter(Boolean)
          .join(" ")
      )
      .filter(Boolean)
      .join(" / ");

    return { out, unsupported: uniqSorted(unsupported) };
  }

  // morse -> text + report unsupported codes
  function morseToTextWithReport(input, MORSE_TO_CHAR) {
    const s = normMorse(input);
    if (!s) return { out: "", unsupported: [] };

    const unsupported = [];
    const words = s.split(/\s*\/\s*/).filter(Boolean);

    const out = words
      .map((w) =>
        w
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((code) => {
            const ch = MORSE_TO_CHAR[code];
            if (!ch) {
              unsupported.push(code);
              return "";
            }
            return ch;
          })
          .join("")
      )
      .join(" ");

    return { out, unsupported: uniqSorted(unsupported) };
  }

  // Improved heuristic:
  // - If letters exist => text
  // - If it contains dot/dash and consists ONLY of morse-ish chars => morse
  function looksLikeMorse(raw) {
    const s = (raw || "").trim();
    if (!s) return false;

    if (/[A-Za-z]/.test(s)) return false;

    // Must contain dot/dash somewhere
    if (!/[.\-·–—•]/.test(s)) return false;

    // If it contains lots of non-morse characters, treat as text
    // Allowed: dot/dash, spaces, slash, pipes (will normalize), line breaks
    const nonMorse = s.replace(/[.\-·–—•/\s|]/g, "");
    if (nonMorse.length > 0) return false;

    return true;
  }

  function formatWarning(kind, list) {
    if (!list || !list.length) return "";
    const shown = list.slice(0, 10).join(", ");
    const more = list.length > 10 ? ` (+${list.length - 10} more)` : "";
    return `\n\n⚠ Unsupported ${kind}: ${shown}${more}`;
  }

  onReady(async () => {
    const input = document.getElementById("mcg-input");
    const output = document.getElementById("mcg-output");
    const btnT2M = document.getElementById("mcg-text-to-morse");
    const btnM2T = document.getElementById("mcg-morse-to-text");
    const btnSwap = document.getElementById("mcg-swap");
    const btnClear = document.getElementById("mcg-clear");

    // If page doesn't have the tool, do nothing
    if (!input || !output || !btnT2M || !btnM2T) return;

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
      const { out, unsupported } = textToMorseWithReport(input.value, CHAR_TO_MORSE);
      output.value = out + formatWarning("characters", unsupported);
    }

    function runMorseToText() {
      const { out, unsupported } = morseToTextWithReport(input.value, MORSE_TO_CHAR);
      output.value = out + formatWarning("codes", unsupported);
    }

    // Buttons
    btnT2M.addEventListener("click", runTextToMorse);
    btnM2T.addEventListener("click", runMorseToText);

    btnSwap?.addEventListener("click", () => {
      const a = input.value || "";
      const b = output.value || "";
      input.value = b;
      output.value = a;
      input.focus();
    });

    btnClear?.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      input.focus();
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
