// Unit tests for the core text<->Morse logic. This module is the heart of
// the whole site, so it gets the one real test suite. Run with: npm test
// (Node's built-in runner; Node >= 22 strips the TS types at load time).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  normalizeTextInput,
  normalizeMorseInput,
  buildReverseMap,
  textToMorse,
  textToMorseWithReport,
  morseToText,
  morseToTextWithReport,
} from "./morse.ts";

// Load the canonical map the same way the site does (single source of truth).
const map = JSON.parse(
  readFileSync(new URL("../data/morse.json", import.meta.url), "utf8")
).morseMap;
const reverse = buildReverseMap(map);

test("textToMorse encodes SOS", () => {
  assert.equal(textToMorse("SOS", map), "... --- ...");
});

test("textToMorse encodes a multi-word phrase with a word separator", () => {
  assert.equal(
    textToMorse("HELLO WORLD", map),
    ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
  );
});

test("textToMorse is case-insensitive", () => {
  assert.equal(textToMorse("sos", map), textToMorse("SOS", map));
});

test("morseToText decodes back to text", () => {
  assert.equal(morseToText("... --- ...", reverse), "SOS");
});

test("text -> morse -> text round-trips for letters and digits", () => {
  for (const word of ["HELLO", "MORSE", "CW", "2026", "ABC123"]) {
    const m = textToMorse(word, map);
    assert.equal(morseToText(m, reverse), word, `round-trip failed for ${word}`);
  }
});

test("morseToText accepts unicode dot/dash and pipe variants", () => {
  // ·•–— and | should normalize to . - and / before decoding
  assert.equal(morseToText("··· ——— ···", reverse), "SOS");
  // ·-·· --- ···- · = L O V E
  assert.equal(morseToText("·-·· --- ···- ·", reverse), "LOVE");
});

test("normalizeMorseInput collapses separators and whitespace", () => {
  assert.equal(normalizeMorseInput("··· ——— ···"), "... --- ...");
  assert.equal(normalizeMorseInput("...   ///   ---"), "... / ---");
  assert.equal(normalizeMorseInput("  .- | -.  "), ".- / -.");
});

test("normalizeTextInput uppercases and stringifies", () => {
  assert.equal(normalizeTextInput("hello"), "HELLO");
  // @ts-expect-error — guard against null at runtime
  assert.equal(normalizeTextInput(null), "");
});

test("textToMorseWithReport flags unsupported characters (unique + sorted)", () => {
  const r = textToMorseWithReport("A # B ~ #", map);
  assert.deepEqual(r.unsupported, ["#", "~"]);
  // supported chars still encode
  assert.equal(r.output.includes(map["A"]), true);
});

test("morseToTextWithReport flags unknown codes", () => {
  const r = morseToTextWithReport("... ........ ---", reverse);
  assert.deepEqual(r.unsupported, ["........"]);
});

test("buildReverseMap keeps the first mapping on collisions", () => {
  const collide = { A: ".-", X: ".-" };
  assert.equal(buildReverseMap(collide)[".-"], "A");
});

test("empty / whitespace input yields empty output, no crash", () => {
  assert.equal(textToMorse("", map), "");
  assert.equal(textToMorse("   ", map), "");
  assert.equal(morseToText("", reverse), "");
  assert.deepEqual(textToMorseWithReport("", map), { output: "", unsupported: [] });
});
