// path: public/mcg-tool.js
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function resolveMorseJsonUrl() {
    // Prefer root, but remain robust in subpath previews.
    // If you always deploy at root, this still works.
    try {
      return new URL("/morse.json", window.location.origin).toString();
    } catch {
      return "/morse.json";
    }
  }

  async function loadMorsePayload() {
    const url = resolveMorseJsonUrl();
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
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

  function normText(s) {
    return (s || "").toUpperCase();
  }

  function normMorse(s) {
    // Accept common variations people paste:
    // - middle dot (·) -> .
    // - en/em dash (–/—) -> -
    // Also allow "|" as word separator (normalize to "/")
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
      // Keep first occurrence if there’s a collision
      if (out[v] == null) out[v] = k;
    }
    return out;
  }

  function textToMorse(input, CHAR_TO_MORSE) {
    const s = normText(input).trim();
    if (!s) return "";

    // Split by whitespace into words
    const words = s.split(/\s+/).filter(Boolean);

    return words
      .map((w) =>
        w
          .split("")
          .map((ch) => {
            const code = CHAR_TO_MORSE[ch];
            return code ? code : "?"; // visible fallback for unknown chars
          })
          .join(" ")
      )
      .join(" / ");
  }

  function morseToText(input, MORSE_TO_CHAR) {
    const s = normMorse(input);
    if (!s) return "";

    // allow "/" word separator (optionally surrounded by spaces)
    const words = s.split(/\s*\/\s*/).filter(Boolean);

    return words
      .map((w) =>
        w
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((code) => MORSE_TO_CHAR[code] || "?") // visible fallback
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
      // Fallback
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
      const val = (output.value || "").trim();
      if (!val) return;

      const ok = await copyToClipboard(val);
      const old = btnCopy.textContent;

      btnCopy.textContent = ok ? "Copied ✓" : "Copy failed";
      setTimeout(() => (btnCopy.textContent = old), 900);
    });
  });
})();
