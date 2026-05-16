// Central registry for /blog/ posts. Each entry produces a page at
// /blog/<slug>/ and an entry on the blog index. Keep this file edit-only:
// no scraping, no external CMS — short, sharp, evergreen content the
// "hub of Morse code" can stand behind for years.
//
// `published` is ISO date (YYYY-MM-DD).
// `kind` is what the post is for SEO (Article, FAQPage, HowTo, etc.).
//    - "how-to"     → Schema.org HowTo
//    - "faq"        → Schema.org FAQPage
//    - "compare"    → Schema.org Article (comparison)
//    - "explainer"  → Schema.org Article
//    - "glossary"   → Schema.org DefinedTermSet
//
// `excerpt` is the listing-page sub-line (≤ 180 chars).
// `tags` are used for related-post matching and the blog index.
//
// `steps` (HowTo only) is required for rich-result eligibility. Each
// step's `name` should match (or paraphrase) the corresponding H2/H3
// in the body so the markup mirrors what Google's crawler reads.

export const posts = [
  {
    slug: "how-to-learn-morse-code-in-30-days",
    title: "How to learn Morse code in 30 days (a daily plan)",
    excerpt:
      "A pragmatic 30-day plan to copy plain-text Morse at 20 WPM, using the Koch method, daily 5-minute drills, and the right tooling.",
    published: "2026-05-14",
    kind: "how-to",
    minutes: 9,
    tags: ["learning", "koch", "practice", "wpm"],
    steps: [
      { name: "Set a realistic target", text: "Commit to 5 minutes per day for 30 days with a goal of 20 WPM character speed using Farnsworth timing." },
      { name: "Learn the Koch alphabet pairs", text: "Start with two letters (K and M) at full target speed and add one new letter each session as accuracy hits 90%." },
      { name: "Drill with the trainer", text: "Use the /practice/ Koch trainer for one 5-minute session daily — accuracy first, speed will follow." },
      { name: "Practice head-copy", text: "By week 3, copy short Morse phrases mentally without writing. Use the translator's audio at 15 WPM character speed." },
      { name: "Get on the air or use a simulated QSO", text: "By day 30, run a slow-speed QSO (real or simulated) at 15–20 WPM to lock in fluency." },
    ],
  },
  {
    slug: "why-morse-code-is-still-used-today",
    title: "Why Morse code is still used today (and who uses it)",
    excerpt:
      "Beyond nostalgia: amateur radio CW, aviation VOR/NDB identifiers, military comms, emergency signaling, and accessibility uses that keep Morse alive.",
    published: "2026-05-14",
    kind: "explainer",
    minutes: 8,
    tags: ["ham-radio", "aviation", "emergency", "history"],
  },
  {
    slug: "morse-code-vs-binary",
    title: "Morse code vs binary: similarities and key differences",
    excerpt:
      "Both encode information with two symbols, but the timing rules, alphabet size, error tolerance, and bandwidth are completely different.",
    published: "2026-05-14",
    kind: "compare",
    minutes: 7,
    tags: ["compare", "binary", "encoding"],
  },
  {
    slug: "the-story-behind-sos",
    title: "The story behind SOS: why we chose three dots, three dashes, three dots",
    excerpt:
      "SOS doesn't stand for 'Save Our Souls.' It was chosen in 1906 because the rhythm is unmistakable under poor signal. Here's the full story.",
    published: "2026-05-14",
    kind: "explainer",
    minutes: 6,
    tags: ["sos", "history", "emergency"],
  },
  {
    slug: "best-ways-to-practice-morse-code",
    title: "The 7 best ways to practice Morse code (ranked)",
    excerpt:
      "Koch trainer, single-letter drills, head-copy at low WPM, the morsetic mnemonic, on-air QSOs — what works and what doesn't.",
    published: "2026-05-14",
    kind: "how-to",
    minutes: 8,
    tags: ["practice", "learning", "koch"],
    steps: [
      { name: "Koch-method trainer", text: "Train at full target speed with 2 letters, adding one per session at 90% accuracy. Most effective single drill." },
      { name: "Single-letter rhythm drills", text: "Loop one character at a time at slow WPM until the rhythm is in muscle memory before moving on." },
      { name: "Head-copy at low WPM", text: "Listen at 12–15 WPM and decode mentally — never write. Forces pattern recognition." },
      { name: "Mnemonic learning (CodeQuick / G4FON style)", text: "Map dits/dahs to phrases for stubborn letters. Useful for older learners; remove the crutch by week 2." },
      { name: "Translator audio playback", text: "Type a word, listen, repeat. Cheap loop for self-quizzing on common phrases." },
      { name: "On-air slow-speed CW", text: "Once you can copy 15 WPM in your head, get on the air with a Slow Speed Net. Real QSOs accelerate fluency fast." },
      { name: "Spaced repetition with a deck", text: "Anki + Morse audio for letters/numbers/prosigns. Best for revision, not initial learning." },
    ],
  },
  {
    slug: "morse-code-in-aviation",
    title: "Morse code in aviation: VOR, NDB, and why pilots still copy it",
    excerpt:
      "Every navaid identifies itself in Morse. Here's how pilots use it, what the chart shows, and why it's still a required pilot skill in 2026.",
    published: "2026-05-14",
    kind: "explainer",
    minutes: 7,
    tags: ["aviation", "navaid", "vor", "ndb"],
  },
  {
    slug: "emergency-morse-code-cheat-sheet",
    title: "Emergency Morse code cheat sheet (SOS, MAYDAY, HELP)",
    excerpt:
      "Distress signals, how to send SOS with light or sound, what to do if you're lost without a radio. Printable, copy-able, memorize-able.",
    published: "2026-05-14",
    kind: "how-to",
    minutes: 5,
    tags: ["emergency", "sos", "survival"],
    steps: [
      { name: "Send SOS with light", text: "Three short flashes, three long flashes, three short flashes. Pause two seconds. Repeat. Any flashlight works — phone torch, headlamp, signal mirror at the sun." },
      { name: "Send SOS with sound", text: "Three short whistle blasts, three long, three short. Pause. Repeat. A whistle carries further than a shout and uses no energy." },
      { name: "Send MAYDAY by voice on radio", text: "Say 'Mayday, mayday, mayday', your call sign or boat name, your position, nature of distress, number of people aboard. Wait for response, repeat if no answer." },
      { name: "If you have a CW key", text: "SOS is sent as one symbol: ...---... — no inter-letter gap. Repeat with a 2-second pause between repetitions." },
      { name: "What not to do", text: "Don't change the pattern. Don't combine SOS with random Morse. Rescuers listen for the rhythm; muddying it costs lives." },
    ],
  },
  {
    slug: "common-cw-mistakes-and-how-to-fix-them",
    title: "Common CW mistakes (and how to fix them)",
    excerpt:
      "Ten timing, technique, and operating mistakes that hold CW operators back — with the specific drill or habit change that fixes each one.",
    published: "2026-05-16",
    kind: "article",
    minutes: 8,
    tags: ["practice", "sending", "common-mistakes", "intermediate"],
  },
  {
    slug: "how-to-send-morse-code",
    title: "How to send Morse code: a beginner's guide to keying",
    excerpt:
      "Choosing a key, finding the right speed, building rhythm before letters, and getting on the air. The companion to learning copy — finally a guide that teaches you to send.",
    published: "2026-05-16",
    kind: "how-to",
    minutes: 9,
    tags: ["sending", "keying", "practice", "beginner"],
    steps: [
      { name: "Pick a key that matches your stage", text: "Beginners do best on a straight key for the first month — it forces clean timing and rewards rhythm over speed. Move to a paddle or bug only after you can copy 15 WPM reliably." },
      { name: "Set up the station for relaxed sending", text: "Anchor the key on a heavy non-slip surface, wrist resting flat, elbow on the desk. The forearm — not the fingers — drives the key. A flexed shoulder will betray you within five minutes." },
      { name: "Pick a target character speed (12–15 WPM)", text: "Set your tone source (a code-practice oscillator, the /timing-calculator/, or just a head-copy of a metronome) to 12–15 WPM. Most learners overshoot the speed they can sustain accurately." },
      { name: "Drill the rhythm before the alphabet", text: "Spend a week sending just the PARIS rhythm: each letter equal-weight, gaps clean. The shape comes before the meaning. Bad rhythm at this stage will haunt you at every speed above 20 WPM." },
      { name: "Build the alphabet in Koch order", text: "Add letters in the same Koch order you learned to copy: K, M, then one new letter each session. Send the new letter 50 times solo, then mix it in. Record yourself and listen back the next day." },
      { name: "Cross-check with the decoder", text: "Use the /decoder/ live microphone mode or simply key into a recorder. The decoder catches the timing flaws your ear glosses over." },
      { name: "Get on the air with a slow-speed net", text: "Once you can send a clean call sign and RST at 13 WPM, find a SKCC (Straight Key Century Club) sked or a slow-speed net. Real on-air time accelerates fluency more than any drill." },
    ],
  },
];
