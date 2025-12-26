(async function () {
  // Load morse mapping at runtime (works on any static host)
  const res = await fetch("/morse.json", { cache: "force-cache" });
  const CHAR_TO_MORSE = await res.json();
  const MORSE_TO_CHAR = Object.fromEntries(
    Object.entries(CHAR_TO_MORSE).map(([k, v]) => [v, k])
  );

  const input = document.getElementById("mcg-input");
  const output = document.getElementById("mcg-output");
  const btnT2M = document.getElementById("mcg-text-to-morse");
  const btnM2T = document.getElementById("mcg-morse-to-text");
  const btnCopy = document.getElementById("mcg-copy");

  if (!input || !output || !btnT2M || !btnM2T || !btnCopy) return;

  function norm(s) {
    return (s || "").toUpperCase();
  }

  function textToMorse(inputText) {
    const s = norm(inputText).trim();
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

  function morseToText(inputMorse) {
    const s = (inputMorse || "").trim();
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

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
    }
  }

  btnT2M.addEventListener("click", () => {
    output.value = textToMorse(input.value);
  });

  btnM2T.addEventListener("click", () => {
    output.value = morseToText(input.value);
  });

  btnCopy.addEventListener("click", async () => {
    await copy(output.value || "");
    const old = btnCopy.textContent;
    btnCopy.textContent = "Copied ✓";
    setTimeout(() => (btnCopy.textContent = old), 900);
  });
})();
