// generate-course.mjs — builds the "Koch Method CW Audio Course" product.
//
// ============================================================
// THIS PRODUCES THE PAID PRODUCT FILES — they are NOT committed or
// deployed (output dir is git-ignored). The owner runs this, then zips
// and uploads the result to Gumroad. The site only hosts the /cw-audio-
// course/ sales page.
// ============================================================
//
//   npm run course                 # full course, defaults below
//   LESSONS=10 MINUTES=3 npm run course
//   WPM=18 FARNSWORTH=9 npm run course
//
// Output (default ./course-output/):
//   lesson-01.wav … lesson-NN.wav   the practice audio
//   lesson-01.txt … answer keys (the 5-char groups, to self-check)
//   README.txt                       how to use the course
//
// Audio is a clean 600 Hz sine (raised-cosine ramps to avoid clicks),
// 8 kHz mono 16-bit — tiny files, and 8 kHz is far above Nyquist for a
// 600 Hz tone. Timing is true Koch/Farnsworth (characters at full speed,
// stretched spacing for a slower overall speed) using the ARRL formula.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const morse = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/morse.json"), "utf8")).morseMap;

// ---- Config ----
const WPM = Number(process.env.WPM || 20);          // character speed
const FARNSWORTH = Number(process.env.FARNSWORTH || 10); // overall speed (<= WPM)
const MINUTES = Number(process.env.MINUTES || 5);
const TONE = Number(process.env.TONE || 600);
const RATE = Number(process.env.RATE || 8000);
const OUT = process.env.OUT || path.join(ROOT, "course-output");

// Standard Koch character order.
const KOCH = "KMRSUAPTLOWI.NJEF0Y,VG5/Q9ZH38B?42 7C1D6X".replace(/ /g, "").split("");
const LESSONS = Number(process.env.LESSONS || (KOCH.length - 1)); // lesson 1 = first 2 chars

// ---- Farnsworth timing (ARRL formula), all in ms ----
function timing(wc, ws) {
  ws = Math.min(ws, wc);
  const u = 1200 / wc;                    // dit at character speed
  const taSec = (60 * wc - 37.2 * ws) / (wc * ws); // total spacing delay per "word", seconds
  const spaceUnit = Math.max(u, (taSec * 1000) / 19); // never tighter than standard
  return {
    dit: u,
    dah: 3 * u,
    intra: u,                 // gap between elements within a character
    interChar: 3 * spaceUnit, // gap between characters (Farnsworth-stretched)
    word: 7 * spaceUnit,      // gap between groups
  };
}

// ---- Audio synthesis ----
const RAMP_MS = 5;
function appendTone(samples, ms) {
  const n = Math.round((ms / 1000) * RATE);
  const ramp = Math.round((RAMP_MS / 1000) * RATE);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < ramp) env = 0.5 - 0.5 * Math.cos((Math.PI * i) / ramp);
    else if (i > n - ramp) env = 0.5 - 0.5 * Math.cos((Math.PI * (n - i)) / ramp);
    samples.push(Math.sin((2 * Math.PI * TONE * i) / RATE) * 0.6 * env);
  }
}
function appendSilence(samples, ms) {
  const n = Math.round((ms / 1000) * RATE);
  for (let i = 0; i < n; i++) samples.push(0);
}

function renderGroups(groups, t) {
  const s = [];
  groups.forEach((group, gi) => {
    [...group].forEach((ch, ci) => {
      const code = morse[ch.toUpperCase()];
      if (!code) return;
      [...code].forEach((sym, si) => {
        appendTone(s, sym === "-" ? t.dah : t.dit);
        if (si < code.length - 1) appendSilence(s, t.intra);
      });
      if (ci < group.length - 1) appendSilence(s, t.interChar);
    });
    if (gi < groups.length - 1) appendSilence(s, t.word);
  });
  return s;
}

function wav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v < 0 ? v * 0x8000 : v * 0x7fff), 44 + i * 2);
  }
  return buf;
}

function randGroups(chars, count) {
  const g = [];
  for (let i = 0; i < count; i++) {
    let w = "";
    for (let j = 0; j < 5; j++) w += chars[Math.floor(Math.random() * chars.length)];
    g.push(w);
  }
  return g;
}

// ---- Self-test: render "PARIS" at standard timing, decode the envelope,
// assert it reads back as PARIS. Proves the audio timing is correct
// without anyone having to listen. ----
function selfTest() {
  const t = timing(20, 20); // standard spacing for a clean decode
  const samples = renderGroups(["PARIS"], t);
  // Envelope via 2 ms frames (a raw sine crosses zero ~1200×/s, so we must
  // measure peak amplitude per frame, not per sample).
  const frame = Math.round(RATE * 0.002);
  const frames = [];
  for (let i = 0; i < samples.length; i += frame) {
    let peak = 0;
    for (let j = i; j < i + frame && j < samples.length; j++) peak = Math.max(peak, Math.abs(samples[j]));
    frames.push(peak > 0.15 ? 1 : 0);
  }
  const frameMs = (frame / RATE) * 1000;
  const runs = []; let on = frames[0], len = 0;
  for (const f of frames) { if (f === on) len++; else { runs.push([on, len * frameMs]); on = f; len = 1; } }
  runs.push([on, len * frameMs]);
  const rev = {}; for (const k in morse) rev[morse[k]] = k;
  let out = "", cur = "";
  for (const [o, ms] of runs) {
    if (o) cur += ms > t.dit * 2 ? "-" : ".";
    else {
      if (ms > t.interChar * 1.5) { out += (rev[cur] || "?"); cur = ""; out += " "; }
      else if (ms > t.dit * 2) { out += (rev[cur] || "?"); cur = ""; }
    }
  }
  if (cur) out += (rev[cur] || "?");
  const got = out.replace(/\s+/g, "");
  if (got !== "PARIS") throw new Error(`self-test FAILED: decoded "${got}" (expected PARIS)`);
  return true;
}

function main() {
  selfTest();
  console.log("[course] self-test passed (PARIS decodes correctly)");
  fs.mkdirSync(OUT, { recursive: true });
  const t = timing(WPM, FARNSWORTH);
  // groups so each lesson is ~MINUTES long: estimate ~ (avg char ms) …
  // simplest: fixed groups/min tuned by overall speed.
  const groupsPerLesson = Math.max(10, Math.round((FARNSWORTH * MINUTES) )); // ~5-char groups ≈ 1 word
  let total = 0;
  for (let lesson = 1; lesson <= LESSONS; lesson++) {
    const chars = KOCH.slice(0, lesson + 1); // lesson 1 → first 2 chars
    const groups = randGroups(chars, groupsPerLesson);
    const samples = renderGroups(groups, t);
    const id = String(lesson).padStart(2, "0");
    fs.writeFileSync(path.join(OUT, `lesson-${id}.wav`), wav(samples));
    fs.writeFileSync(
      path.join(OUT, `lesson-${id}.txt`),
      `Koch CW Course — Lesson ${lesson}\nNew character set: ${chars.join(" ")}\nSpeed: ${WPM} WPM character / ${FARNSWORTH} WPM overall (Farnsworth)\n\nGroups sent (check your copy against this):\n\n${groups.join(" ")}\n`
    );
    total += samples.length / RATE;
  }
  fs.writeFileSync(path.join(OUT, "README.txt"), readme());
  console.log(`[course] wrote ${LESSONS} lessons to ${OUT} (~${Math.round(total / 60)} min audio total)`);
  console.log("[course] zip the folder and upload to Gumroad.");
}

function readme() {
  return `Koch Method CW (Morse Code) Audio Practice Course
=================================================
${LESSONS} graded lessons · ${WPM} WPM character speed · ${FARNSWORTH} WPM overall (Farnsworth)

HOW TO USE
1. Start with lesson-01. It uses just two characters at full speed, with
   wide gaps so your brain learns the SOUND of each character (not counting
   dots). Grab paper and a pencil.
2. Play the lesson and write down what you hear, in 5-character groups.
3. Check your copy against lesson-01.txt. When you reach ~90% accuracy,
   move to the next lesson — it adds one new character.
4. Repeat daily. 15-20 minutes a day beats an hour once a week.

WHY KOCH + FARNSWORTH
- Koch: learn at full target speed from day one, one character at a time.
- Farnsworth: characters are sent fast, but spaced out, so you never learn
  to "count" — you learn the rhythm. The gaps shrink as you speed up.

More free practice tools: https://morsecodegenerator.com/practice/
`;
}

main();
