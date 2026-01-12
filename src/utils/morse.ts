export type MorseMap = Record<string, string>;

export function buildReverseMap(map: MorseMap): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    if (!k || !v) continue;
    out[v] = k;
  }
  return out;
}

/**
 * Convert text to Morse code.
 * - Letters separated by spaces (default)
 * - Words separated by " / "
 * - Ignores unsupported characters (does NOT echo them back into output)
 */
export function textToMorse(text: string, map: MorseMap, sep = " "): string {
  const s = (text ?? "").toString().toUpperCase().trim();
  if (!s) return "";

  const words = s.split(/\s+/).filter(Boolean);

  return words
    .map((w) =>
      w
        .split("")
        .map((ch) => map[ch] || "")
        .filter(Boolean)
        .join(sep)
    )
    .filter(Boolean)
    .join(" / ");
}

/**
 * Convert Morse to text.
 * - Accepts "/" between words (with or without spaces)
 * - Accepts multiple spaces between codes
 */
export function morseToText(
  morse: string,
  reverse: Record<string, string>,
  sep = " "
): string {
  const s = (morse ?? "").toString().trim();
  if (!s) return "";

  const words = s.split(/\s*\/\s*/).filter(Boolean);

  return words
    .map((w) =>
      w
        .trim()
        .split(/\s+/)
        .map((code) => reverse[code] || "")
        .join("")
    )
    .join(" ");
}
