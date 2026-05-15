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
  },
];
