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
    if (!res.ok) throw new Error("Failed to load /morse.json");
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

  function norm(s) {
    return (s || "").toUpperCase();
  }

  function buildReverseMap(map) {
    // guard: ignore empty keys/values
    const entries = Object.entries(map).filter(([k, v]) => k && v);
    return Object.fromEntries(entries.map(([k, v]) => [v, k]));
  }

  function textToMorse(input, CHAR_TO_MORSE) {
    const s = norm(input).trim();
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
      .join(" / ");
  }

  function morseToText(input, MORSE_TO_CHAR) {
    const s = (input || "").trim();
    if (!s) return "";

    const words = s.split(/\s*\/\s*/).filter(Boolean);
    return words
      .map((w) =>
        w
          .trim()
          .split(/\s+/)
          .map((code) => MORSE_TO_CHAR[code] || "")
          .join("")
      )
      .join(" ");
  }

  async function copyToClipboard(text) {
    const t = text || "";
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
      return true;
    }
  }

  onReady(async () => {
    const input = document.getElementById("mcg-input");
    const output = document.getElementById("mcg-output");
    const btnT2M = document.getElementById("mcg-text-to-morse");
    const btnM2T = document.getElementById("mcg-morse-to-text");
    const btnCopy = document.getElementById("mcg-copy");

    // If page doesn't have the tool, do nothing (safe for other pages)
    if (!input || !output || !btnT2M || !btnM2T || !btnCopy) return;

    let CHAR_TO_MORSE;
    let MORSE_TO_CHAR;

    try {
      const payload = await loadMorsePayload();
      CHAR_TO_MORSE = extractCharToMorse(payload);

      if (!CHAR_TO_MORSE || !Object.keys(CHAR_TO_MORSE).length) {
        throw new Error("Morse map is empty or invalid");
      }

      MORSE_TO_CHAR = buildReverseMap(CHAR_TO_MORSE);
    } catch (e) {
      console.error(e);
      output.value = "Error: failed to load Morse map.";
      return;
    }

    btnT2M.addEventListener("click", () => {
      output.value = textToMorse(input.value, CHAR_TO_MORSE);
    });

    btnM2T.addEventListener("click", () => {
      output.value = morseToText(input.value, MORSE_TO_CHAR);
    });

    btnCopy.addEventListener("click", async () => {
      await copyToClipboard(output.value);
      const old = btnCopy.textContent;
      btnCopy.textContent = "Copied ✓";
      setTimeout(() => (btnCopy.textContent = old), 900);
    });
  });
})();
