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
    slug: "how-to-write-your-name-in-morse-code",
    title: "How to Write Your Name in Morse Code (Free, Step by Step)",
    excerpt:
      "Your name is the most personal thing to put in Morse — and the perfect first project or gift. Here's how to spell any name in dots and dashes, get the spacing right, and turn it into a bracelet or tattoo.",
    published: "2026-07-02",
    kind: "how-to",
    minutes: 5,
    tags: ["names", "gifts", "beginners", "how-to"],
    steps: [
      { name: "Look up each letter", text: "Convert your name one letter at a time using the alphabet chart or the translator." },
      { name: "Mind the gaps", text: "Leave a clear space between letters (3 units) so the name stays readable as Morse, not one long blur." },
      { name: "Write it out", text: "String the letters together with single spaces between letters; use a slash for a space between first and last name." },
      { name: "Hear it", text: "Play your name as audio in the translator to check the rhythm and learn to send it." },
      { name: "Turn it into a keepsake", text: "Drop the name into the free bracelet/tattoo generator to make a design you can wear or gift." },
    ],
  },
  {
    slug: "who-invented-morse-code",
    title: "Who Invented Morse Code? Samuel Morse & Alfred Vail",
    excerpt:
      "Morse code is named after Samuel Morse — but he didn't do it alone. The real story includes Alfred Vail, a much-changed code, and the 1844 message that started it all. Here's who did what.",
    published: "2026-07-02",
    kind: "explainer",
    minutes: 6,
    tags: ["history", "origins", "explainer"],
  },
  {
    slug: "how-to-call-cq-morse-code",
    title: "How to Call CQ: Your First Morse Code (CW) Contact",
    excerpt:
      "Ready to get on the air in Morse? Here's exactly how a CW contact works — calling CQ, the callsign exchange, the Q-codes and RST report you need, and how to practice sending first so you don't freeze up.",
    published: "2026-07-02",
    kind: "how-to",
    minutes: 7,
    tags: ["ham radio", "cw", "operating", "how-to"],
    steps: [
      { name: "Get set up", text: "You need a license, an HF rig, and a key or paddle. Practice sending on a keyer first so your fist is readable." },
      { name: "Learn the essentials", text: "Know CQ, DE, K, the phonetic of your callsign, the RST report, and a handful of Q-codes and abbreviations." },
      { name: "Call CQ", text: "Send 'CQ CQ CQ DE <your callsign> <your callsign> K' at a speed you can also copy." },
      { name: "Run the exchange", text: "Swap RST report, name, and QTH (location). Keep it short and standard your first few times." },
      { name: "Sign off and log it", text: "End with 73 and 'SK', then log the contact. Congratulations — you're a CW operator." },
    ],
  },
  {
    slug: "how-to-read-morse-code",
    title: "How to Read Morse Code: A Beginner's Guide to Dots & Dashes",
    excerpt:
      "Reading Morse means turning dots and dashes back into letters. Learn the two signals, the timing that trips everyone up, and the rhythm trick that lets you read by ear — with free tools to practice.",
    published: "2026-07-01",
    kind: "how-to",
    minutes: 6,
    tags: ["learning", "beginners", "reading", "alphabet"],
    steps: [
      { name: "Learn the two signals", text: "A dot is one short beep; a dash is three times as long. Every letter is a small pattern of these two." },
      { name: "Learn the gaps (timing)", text: "The silences carry meaning: 1 unit between signals, 3 between letters, 7 between words. Getting the gaps right is what makes Morse readable." },
      { name: "Start with the easy letters", text: "Begin with E (·) and T (−), then I, M, S, O — the shortest, most common letters — and build up." },
      { name: "Read by rhythm, not by counting", text: "Learn each letter as a sound/rhythm rather than counting dots. Counting hits a hard ceiling; rhythm scales." },
      { name: "Practice with a tool", text: "Use flashcards, the Koch trainer, and the translator's audio to drill reading until letters come automatically." },
    ],
  },
  {
    slug: "morse-code-gift-ideas",
    title: "Morse code gift ideas: 12 meaningful presents (and how to make them)",
    excerpt:
      "Morse code turns any word into a hidden message — which makes it a perfect personal gift. Twelve ideas from bracelets to tattoos to ham-radio gear, plus a free tool to design your own.",
    published: "2026-06-26",
    kind: "explainer",
    minutes: 7,
    tags: ["gifts", "bracelet", "jewelry", "tattoo", "ideas"],
  },
  {
    slug: "morse-code-for-kids",
    title: "Morse code for kids: 8 games & activities that actually work",
    excerpt:
      "Morse code is a perfect kids' project — a closed, masterable system they can use as a secret code. Eight tested games for home, classroom, and Scouts, plus free printables and the mnemonic trick.",
    published: "2026-06-21",
    kind: "how-to",
    minutes: 7,
    tags: ["kids", "teaching", "scouts", "activities"],
    steps: [
      { name: "Hook them with SOS", text: "Flash SOS on a torch and ask them to guess the secret message. The unmistakable rhythm grabs attention instantly." },
      { name: "Teach by sound, not sight", text: "Use the mnemonic alphabet so each letter is a rhythm they say aloud, not dots to count." },
      { name: "Start with their initials", text: "Have each child learn to send their own initials — fast, personal, motivating." },
      { name: "Play in pairs", text: "Give pairs a torch or buzzer and a chart; they take turns sending short words while the partner copies." },
      { name: "Print and practice", text: "Send them home with the free printable chart and worksheets to keep the streak going." },
    ],
  },
  {
    slug: "morse-code-tattoo-ideas",
    title: "Morse code tattoo ideas & meanings (with a free design tool)",
    excerpt:
      "Dots and dashes make a tattoo only you can read. Word ideas and meanings, how to keep it accurate, placement tips, and how to generate a clean, scalable design to hand your artist — free.",
    published: "2026-06-21",
    kind: "how-to",
    minutes: 7,
    tags: ["tattoo", "gifts", "design", "ideas"],
    steps: [
      { name: "Choose the word or date", text: "Pick something short and meaningful — a name, a single word, or a date. Shorter reads cleaner as dots and dashes." },
      { name: "Generate a clean design", text: "Use the free generator's dot-and-dash style on a transparent background to render the exact pattern." },
      { name: "Download a scalable SVG", text: "Export an SVG so your artist can resize it to any placement with zero blur." },
      { name: "Double-check the spacing", text: "Confirm the gaps between letters are clear — even spacing is what keeps it readable as real Morse." },
      { name: "Confirm with your artist", text: "Bring the file and the decoded word so the artist can verify dot vs dash sizing before inking." },
    ],
  },
  {
    slug: "morse-code-bracelet-ideas",
    title: "Morse code bracelet ideas (and how to make your own)",
    excerpt:
      "A Morse code bracelet hides a word in beads — a name, a date, \"I love you\". Here are the best word ideas, how to read the dot-and-dash bead pattern, and a step-by-step way to design and make one free.",
    published: "2026-06-21",
    kind: "how-to",
    minutes: 7,
    tags: ["gifts", "bracelet", "jewelry", "craft"],
    steps: [
      { name: "Pick a meaningful word", text: "Choose a short word, name, or date — the shorter it is, the cleaner the bracelet. \"LOVE\", a child's name, or a wedding date all work." },
      { name: "Turn it into Morse", text: "Use the free bracelet generator to convert your word into a bead pattern: small beads for dots, long beads for dashes." },
      { name: "Choose your beads", text: "Pick one bead style for dots (round) and one for dashes (a longer bead or three rounds), plus a spacer bead to separate letters." },
      { name: "String and space it", text: "Thread the beads in order, leaving a spacer between letters and a larger gap between words so the message stays readable." },
      { name: "Finish and wear it", text: "Knot or crimp the ends onto a cord or elastic. Download the PNG/SVG pattern first so you can follow it bead by bead." },
    ],
  },
  {
    slug: "farnsworth-timing-explained",
    title: "Farnsworth timing explained: the right way to learn Morse fast",
    excerpt:
      "Full character speed with stretched gaps — the timing trick that lets you learn Morse at 18 WPM from day one without counting dots. The math, the muscle memory, and how to set it up.",
    published: "2026-06-06",
    kind: "explainer",
    minutes: 8,
    tags: ["learning", "farnsworth", "wpm", "practice"],
  },
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
    title: "The story behind SOS: three dots, three dashes, three dots",
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
    slug: "best-morse-code-keys-buyers-guide",
    title: "How to choose your first Morse code key (buyer's guide)",
    excerpt:
      "Straight keys, paddles, bugs, sideswipers — the four key families, how to pick one for your stage, what to look for in the hardware, and what to avoid. Vendor-neutral; no sponsored picks.",
    published: "2026-05-16",
    kind: "how-to",
    minutes: 10,
    tags: ["buyers-guide", "keys", "equipment", "beginner"],
    steps: [
      { name: "Decide what stage you're at", text: "Brand-new learner / can copy 12 WPM / can copy 18+ WPM. The right key type is different for each stage; pretending you're further along is the #1 reason new operators give up." },
      { name: "Pick a key family for your stage", text: "Beginners: straight key. 12–18 WPM: single-lever paddle. 18+ WPM: iambic paddle. Style or historical interest: bug or sideswiper. Skip the family that doesn't match your stage even if you find a deal." },
      { name: "Set a budget by tier", text: "Starter ($30–60): a competent straight key or basic paddle from MFJ, Bencher, or similar. Mid ($120–250): Vibroplex Iambic, Begali Simplex, Kent. Premium ($400+): Begali, Vibroplex Bug, custom builds. Don't skip a tier; the next tier up has diminishing returns until you actually need them." },
      { name: "Inspect the build", text: "Heavy base (1+ kg), adjustable spring tension, adjustable contact gap, replaceable contact points, brass or stainless construction. Plastic bases slide on the desk and ruin rhythm." },
      { name: "Confirm cable + connector compatibility", text: "Most modern keys ship with a 3.5mm or 1/4-inch plug. Check your radio's key input before ordering. Adapters exist but add failure points." },
      { name: "Buy from a reputable source", text: "Manufacturer direct (Vibroplex, Begali, MFJ), an established ham retailer (DX Engineering, Ham Radio Outlet, GigaParts in the US; Waters & Stanton in the UK), or the curated used market on QRZ.com Swapmeet. Avoid generic marketplace listings with no model number." },
      { name: "Test before you commit to a style", text: "Try a friend's key at a club meet, or visit a hamfest where vendors set up tables. A key that's perfect for one operator's hand is wrong for another." },
      { name: "Upgrade only when your skill is plateaued by the gear", text: "A $300 key will not make you faster than a $50 key if your problem is rhythm. Buy the cheaper key, master it, then upgrade when you genuinely outgrow it." },
    ],
  },
  {
    slug: "morse-code-in-pop-culture",
    title: "Morse code in pop culture: movies, music, tattoos, and TikTok",
    excerpt:
      "Real Morse hidden in Rush songs, the SOS distress signal in nearly every disaster movie, jewelry that spells a partner's name in dits and dahs — where Morse code shows up in pop culture and what the patterns actually say.",
    published: "2026-05-16",
    kind: "explainer",
    minutes: 8,
    tags: ["culture", "movies", "music", "history"],
  },
  {
    slug: "international-vs-american-morse",
    title: "International Morse vs American Morse: what changed and why",
    excerpt:
      "American Morse came first, in 1844. By 1865 most of the world had switched to International. Here's what was different, why the change happened, and where the old code still echoes today.",
    published: "2026-05-16",
    kind: "compare",
    minutes: 6,
    tags: ["history", "compare", "telegraph", "international"],
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
  {
    slug: "why-morse-code-jewelry-is-usually-wrong",
    title: "Why Morse Code Jewelry Is Usually Wrong (And How to Check Yours)",
    excerpt:
      "Engraved dots almost never keep the letter gaps, and without them the message stops being readable Morse. The word LOVE, run together, has 612 valid readings. Here's how to check a design before it's permanent.",
    published: "2026-07-26",
    kind: "explainer",
    minutes: 7,
    tags: ["jewelry", "bracelets", "tattoos", "spacing", "explainer"],
  },
  {
    slug: "what-people-search-for-in-morse-code",
    title: "What People Actually Search For in Morse Code",
    excerpt:
      "We looked at 2,094 distinct Morse code searches. Barely anyone wants to learn it — over half want it translated for them. And the most-looked-up pattern of all isn't SOS, it's a full stop.",
    published: "2026-07-26",
    kind: "explainer",
    minutes: 6,
    tags: ["data", "research", "explainer"],
  },
  {
    slug: "q-code-examples-real-cw-qso",
    title: "Q-Code Examples: What They Look Like in a Real CW Contact",
    excerpt:
      "A reference table tells you QTH means location. It doesn't tell you that QTH? and QTH BOSTON are the same code doing opposite jobs. Here's a full QSO annotated line by line, and the ten Q-codes you'll actually hear.",
    published: "2026-07-26",
    kind: "explainer",
    minutes: 7,
    tags: ["q-codes", "cw", "operating", "ham radio", "explainer"],
  },
  {
    slug: "why-morse-code-wont-decode",
    title: "Why Your Morse Code Won't Decode (6 Reasons, and the Fixes)",
    excerpt:
      "Pasted a string of dots and dashes and got gibberish back? Morse is a small, rigid system, so there are only a handful of ways a pattern can fail. Here's each one, and how to fix it.",
    published: "2026-08-07",
    kind: "explainer",
    minutes: 6,
    tags: ["decoding", "troubleshooting", "spacing", "explainer"],
  },
];
