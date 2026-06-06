// Canonical mnemonic phrases for each letter and digit.
//
// Two consumers:
//   - /teach/ uses the letter mnemonics inside the lesson plan table.
//   - /morse-code/<ch>/ shows the per-letter mnemonic on the detail
//     page so each of the 36 indexable per-character URLs carries
//     genuinely original content rather than just the Morse pattern.
//
// Each mnemonic phrase has the same stress rhythm as the Morse code
// for the letter. Said aloud with the right emphasis, the rhythm
// sticks faster than memorising dot-dash patterns. These are the
// widely-circulated Scout-meeting variants; many teachers use their
// own — the exact words don't matter as long as the rhythm matches.
//
// For digits 0–9 the mnemonic is the pattern rule rather than a
// phrase. The digits are systematic (1 starts dit, 5 is all dits;
// 6 starts dah, 0 is all dahs) so the rule beats memorising ten
// independent phrases.

export const letterMnemonics = {
  A: { code: ".-",   phrase: "a-LOOOOONG" },
  B: { code: "-...", phrase: "BOOOOOM-ba-da-da" },
  C: { code: "-.-.", phrase: "COO-ca-COO-ca" },
  D: { code: "-..",  phrase: "DOH-ga-da" },
  E: { code: ".",    phrase: "Eh" },
  F: { code: "..-.", phrase: "did-i-DAH-dit" },
  G: { code: "--.",  phrase: "GOOD-GREEEEN-grass" },
  H: { code: "....", phrase: "hippity-hop" },
  I: { code: "..",   phrase: "i-bid" },
  J: { code: ".---", phrase: "ja-MAI-CAA-AA" },
  K: { code: "-.-",  phrase: "KOOOO-ka-KAAAA" },
  L: { code: ".-..", phrase: "to LIIIIIVE for-eveh" },
  M: { code: "--",   phrase: "MOOOO-MOOOO" },
  N: { code: "-.",   phrase: "NOOOO-now" },
  O: { code: "---",  phrase: "OOO-LOOONG-HOOOOLE" },
  P: { code: ".--.", phrase: "ah-POOO-LLOOO-gize" },
  Q: { code: "--.-", phrase: "GOOOD-GOOLLY-Miss-MOOOLLY" },
  R: { code: ".-.",  phrase: "ro-TAAA-tion" },
  S: { code: "...",  phrase: "si-si-si" },
  T: { code: "-",    phrase: "TOOOOO" },
  U: { code: "..-",  phrase: "you-too-WOOOON" },
  V: { code: "...-", phrase: "vic-tor-ee-AAAAA" },
  W: { code: ".--",  phrase: "the WOOORLD WAAAR" },
  X: { code: "-..-", phrase: "XX-ray-i-XXX" },
  Y: { code: "-.--", phrase: "YOU-are-WROOONG-WROOONG" },
  Z: { code: "--..", phrase: "ZOOOO-ZOOOO-zip-zip" },
};

// Digit pattern rules. The digits 1–5 are "N dits then (5−N) dahs"
// in reverse (1 = . - - - -, 5 = . . . . .). The digits 6–0 mirror
// that with leading dahs (6 = - . . . ., 0 = - - - - -). Once you
// see the rule the digits cost no separate memorisation effort.
export const digitMnemonics = {
  0: { code: "-----", rule: "Five dahs. The far end of the pattern." },
  1: { code: ".----", rule: "One dit, then four dahs." },
  2: { code: "..---", rule: "Two dits, then three dahs." },
  3: { code: "...--", rule: "Three dits, then two dahs." },
  4: { code: "....-", rule: "Four dits, then one dah." },
  5: { code: ".....", rule: "Five dits. Mirror of 0." },
  6: { code: "-....", rule: "One dah, then four dits. Mirror of 1." },
  7: { code: "--...", rule: "Two dahs, then three dits. Mirror of 2." },
  8: { code: "---..", rule: "Three dahs, then two dits. Mirror of 3." },
  9: { code: "----.", rule: "Four dahs, then one dit. Mirror of 4." },
};

// Quick lookup that returns the mnemonic regardless of letter/digit
// type. Returns null when no mnemonic exists (e.g. punctuation).
export function mnemonicFor(ch) {
  const k = String(ch || "").toUpperCase();
  if (letterMnemonics[k]) return { kind: "letter", ...letterMnemonics[k] };
  if (digitMnemonics[k])  return { kind: "digit",  ...digitMnemonics[k] };
  return null;
}
