export type MorseMap = Record<string, string>;

export type ConvertReport = {
  output: string;
  unsupported: string[]; // unique, sorted
};

function uniqSorted(arr: string[]): string[] {
  return Array.from(new Set(arr)).sort();
}

/**
 * Normalize plain text input before conversion.
 */
export function normalizeTextInput(text: string): string {
  return (text ?? "").toString().toUpperCase();
}

/**
 * Normalize Morse input:
 * - · • -> .
 * - – — -> -
 * - "|" -> "/" (word separator)
 * - collapse whitespace
 * - normalize multiple slashes to a single slash separator
 */
export function normalizeMorseInput(morse: string): string {
  return (morse ?? "")
    .toString()
    .replaceAll("·", ".")
    .replaceAll("•", ".")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replace(/\s*\|\s*/g, " / ")
    .replace(/\s*\/+\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildReverseMap(map: MorseMap): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    if (!k || !v) continue;
    // Keep first mapping to avoid overwriting collisions.
    if (out[v] == null) out[v] = k;
  }
  return out;
}

/**
 * Convert text to Morse code.
 * - Letters separated by spaces (default)
 * - Words separated by " / "
 * - Ignores unsupported characters
 */
export function textToMorse(text: string, map: MorseMap, sep = " "): string {
  return textToMorseWithReport(text, map, sep).output;
}

/**
 * Convert text to Morse code + return unsupported characters.
 */
export function textToMorseWithReport(
  text: string,
  map: MorseMap,
  sep = " "
): ConvertReport {
  const raw = normalizeTextInput(text);
  const s = raw.trim();
  if (!s) return { output: "", unsupported: [] };

  const unsupported: string[] = [];
  const words = s.split(/\s+/).filter(Boolean);

  const output = words
    .map((w) =>
      w
        .split("")
        .map((ch) => {
          const v = map[ch];
          if (!v) {
            unsupported.push(ch);
            return "";
          }
          return v;
        })
        .filter(Boolean)
        .join(sep)
    )
    .filter(Boolean)
    .join(" / ");

  return { output, unsupported: uniqSorted(unsupported) };
}

/**
 * Convert Morse to text.
 * - Accepts "/" between words (with or without spaces)
 * - Accepts multiple spaces between codes
 * - Accepts common dot/dash variants via normalizeMorseInput()
 */
export function morseToText(
  morse: string,
  reverse: Record<string, string>,
  sep = " "
): string {
  return morseToTextWithReport(morse, reverse, sep).output;
}

/**
 * Convert Morse to text + return unsupported codes.
 */
export function morseToTextWithReport(
  morse: string,
  reverse: Record<string, string>,
  sep = " "
): ConvertReport {
  const s = normalizeMorseInput(morse);
  if (!s) return { output: "", unsupported: [] };

  const unsupported: string[] = [];
  const words = s.split(/\s*\/\s*/).filter(Boolean);

  const output = words
    .map((w) =>
      w
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => {
          const ch = reverse[code];
          if (!ch) {
            unsupported.push(code);
            return "";
          }
          return ch;
        })
        .join("")
    )
    .join(sep);

  return { output, unsupported: uniqSorted(unsupported) };
}
