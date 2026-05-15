// Canonical CW abbreviations shared by /abbreviations/ (hub) and
// /abbreviations/<slug>/ (per-abbreviation detail page).
//
// Each entry:
//   code       - the on-air shorthand exactly as sent (may include ? or /)
//   slug       - URL slug for the detail page (lowercase, [a-z0-9-])
//   group      - hub-page grouping label
//   meaning    - one-line definition for the hub table
//   summary    - SERP-friendly elevator description
//   context    - paragraph of where/when this abbreviation is used
//   examples   - array of [usage, plain English] pairs
//   tags       - facets for related-page selection
//
// Notes
//  - Q-codes (QRP, QRO, QTH, etc.) are intentionally NOT included here
//    because /q-codes/<code>/ is their canonical home.
//  - Abbreviations that have a "?" suffix on air (HW?) get a clean slug
//    without the punctuation.

export const abbrs = [
  // ---------------- Greetings & sign-off ----------------
  {
    code: "73",
    slug: "73",
    group: "Greetings & sign-off",
    meaning: "Best regards",
    summary:
      "The universal CW sign-off. 'Best regards' — sent at the close of nearly every ham QSO.",
    context:
      "Originated in the Western Union 92 Code (1859) for use on landline telegraphy. The original definition was 'best regards' and it has held that meaning unchanged in amateur use for over 160 years. Always singular: '73' is correct, '73s' is informal and slightly frowned on.",
    examples: [
      ["TU FER QSO 73", "Thanks for the QSO, best regards."],
      ["73 DE W1AW SK", "Best regards from W1AW, end of contact."],
      ["GL 73", "Good luck, best regards."],
    ],
    tags: ["sign-off", "courtesy", "history"],
  },
  {
    code: "88",
    slug: "88",
    group: "Greetings & sign-off",
    meaning: "Love and kisses",
    summary:
      "Informal CW sign-off meaning 'love and kisses' — used between operators in romantic relationships, or as a warm closer.",
    context:
      "Also from the Western Union 92 Code. Today it's most often sent op-to-spouse or between close friends; sending it to a stranger is overly familiar. Combined as '73 88' to a couple operating together.",
    examples: [
      ["73 88 TO XYL", "Best regards and love to your wife."],
      ["88 ES 73", "Love and kisses, best regards."],
    ],
    tags: ["sign-off", "courtesy", "history"],
  },
  {
    code: "GM",
    slug: "gm",
    group: "Greetings & sign-off",
    meaning: "Good morning",
    summary: "Standard CW greeting for morning hours.",
    context:
      "Greeting choice tracks the operator's local time. Hams often open with the appropriate G* greeting after exchanging call signs. On long DX paths the greetings may not match (GM here, GE there).",
    examples: [
      ["GM OM TNX FER CALL", "Good morning sir, thanks for the call."],
      ["GM ES WELCOME", "Good morning and welcome."],
    ],
    tags: ["greeting", "courtesy"],
  },
  {
    code: "GA",
    slug: "ga",
    group: "Greetings & sign-off",
    meaning: "Good afternoon",
    summary: "Standard CW greeting for afternoon hours.",
    context:
      "Used after roughly local noon. On HF, you'll commonly hear stations exchanging different G* greetings because the propagation path crosses time zones.",
    examples: [
      ["GA TNX FB QSO", "Good afternoon, thanks for the fine QSO."],
    ],
    tags: ["greeting", "courtesy"],
  },
  {
    code: "GE",
    slug: "ge",
    group: "Greetings & sign-off",
    meaning: "Good evening",
    summary: "Standard CW greeting for evening hours.",
    context:
      "Used roughly between sunset and about 10 pm local. The most common greeting on amateur HF because evenings are peak operating hours.",
    examples: [
      ["GE NAME HR JIM", "Good evening, my name is Jim."],
      ["GE OM HW CPY?", "Good evening sir, how is your copy?"],
    ],
    tags: ["greeting", "courtesy"],
  },
  {
    code: "GN",
    slug: "gn",
    group: "Greetings & sign-off",
    meaning: "Good night",
    summary: "Standard CW closing for late-night QSOs.",
    context:
      "Used as a goodbye when one or both operators are signing off for sleep. Often paired with '73' or 'SK' (end of contact).",
    examples: [
      ["GN 73 SK", "Good night, best regards, signing off."],
      ["GN TU OM", "Good night, thank you sir."],
    ],
    tags: ["greeting", "sign-off", "courtesy"],
  },
  {
    code: "TNX",
    slug: "tnx",
    group: "Greetings & sign-off",
    meaning: "Thanks",
    summary: "Universal CW shorthand for 'thanks'. Sometimes sent as TKS.",
    context:
      "One of the most-sent abbreviations on CW. The form TKS is older; modern operators almost always use TNX. Pair with FER ('for') to thank someone for a specific thing: TNX FER CALL.",
    examples: [
      ["TNX FER CALL", "Thanks for the call."],
      ["TNX FB QSO 73", "Thanks for the fine QSO, best regards."],
      ["TNX RPT", "Thanks for the repeat."],
    ],
    tags: ["courtesy"],
  },
  {
    code: "TU",
    slug: "tu",
    group: "Greetings & sign-off",
    meaning: "Thank you",
    summary: "Shorter form of 'thank you'. Often the final word of a contest QSO.",
    context:
      "TU is preferred in contests where every keystroke matters; TNX is more conversational. A contest exchange typically ends 'TU QRZ?' meaning 'thanks, who's next?'",
    examples: [
      ["TU QRZ?", "Thank you, who's calling next?"],
      ["TU 73", "Thank you, best regards."],
    ],
    tags: ["courtesy", "sign-off"],
  },
  {
    code: "CUL",
    slug: "cul",
    group: "Greetings & sign-off",
    meaning: "See you later",
    summary:
      "Informal CW closer meaning 'see you later'. Implies expecting another QSO with this operator.",
    context:
      "Sent when the operator expects to hear the other station again — same band same time tomorrow, next contest, next sked. Less formal than '73 SK'.",
    examples: [
      ["CUL OM 73", "See you later sir, best regards."],
      ["CUL ON 20", "See you later on 20m."],
    ],
    tags: ["sign-off", "courtesy"],
  },

  // ---------------- People ----------------
  {
    code: "OM",
    slug: "om",
    group: "People",
    meaning: "Old man (any male op)",
    summary:
      "Generic friendly term for any male amateur operator, regardless of age.",
    context:
      "'OM' is gender-specific but age-neutral — a 17-year-old male op is still 'OM' on the air. The 'old' is a term of affection, not literal. Female operators use YL.",
    examples: [
      ["GE OM", "Good evening, sir."],
      ["TNX FER QSO OM 73", "Thanks for the QSO sir, best regards."],
    ],
    tags: ["identity", "courtesy"],
  },
  {
    code: "YL",
    slug: "yl",
    group: "People",
    meaning: "Young lady (female op)",
    summary:
      "Generic term for any female amateur operator. Age-neutral, like OM.",
    context:
      "Some YLs prefer first-name address on the air rather than the YL/XYL distinction; pay attention to how they sign and reciprocate.",
    examples: [
      ["YL OP HR SARAH", "The operator here is a YL, Sarah."],
      ["73 YL", "Best regards to you."],
    ],
    tags: ["identity", "courtesy"],
  },
  {
    code: "XYL",
    slug: "xyl",
    group: "People",
    meaning: "Wife (ex-young lady)",
    summary:
      "An operator's wife. The 'X' prefix dates to mid-20th-century slang for 'former'.",
    context:
      "Send greetings 'TO UR XYL' to the other operator's wife if she's mentioned during the QSO. Mostly heard in casual rag-chew QSOs.",
    examples: [
      ["FB ES TNX TO UR XYL", "Fine business, and thanks to your wife."],
      ["MY XYL ALSO HAM", "My wife is also licensed."],
    ],
    tags: ["identity"],
  },
  {
    code: "DE",
    slug: "de",
    group: "People",
    meaning: "From / this is",
    summary:
      "The 'this is' separator in a CW call. Always sent between the called station and the calling station.",
    context:
      "Structure of a CQ: CQ CQ CQ DE [your call] [your call] K. The DE is mandatory because CW has no audible 'this is now me speaking' — DE plays that role.",
    examples: [
      ["CQ DE W1AW", "Calling any station, this is W1AW."],
      ["K1ABC DE W1AW", "K1ABC, this is W1AW calling you."],
    ],
    tags: ["connector", "operating"],
  },
  {
    code: "UR",
    slug: "ur",
    group: "People",
    meaning: "Your / you're",
    summary:
      "Shorthand for 'your' or 'you're'. Same abbreviation handles both based on context.",
    context:
      "Most common in signal reports and operator identification: 'UR RST 599' or 'UR NAME?' One of the highest-frequency abbreviations after DE and TNX.",
    examples: [
      ["UR RST 599 5NN", "Your signal report is 599."],
      ["UR FB OP", "You're a fine operator."],
      ["UR QTH?", "Your location?"],
    ],
    tags: ["connector", "operating"],
  },

  // ---------------- Operating ----------------
  {
    code: "CQ",
    slug: "cq",
    group: "Operating",
    meaning: "Calling any station",
    summary:
      "The general call. 'CQ' invites any listening station to reply.",
    context:
      "CQ derives from the French 'sécu' (security/attention) of early commercial telegraphy, repurposed by amateurs as 'seek you'. Standard call structure: CQ CQ CQ DE <call> <call> K. For a DX-only call, append DX: CQ DX CQ DX DE <call>.",
    examples: [
      ["CQ CQ CQ DE W1AW W1AW K", "Standard CQ from W1AW, anyone reply."],
      ["CQ DX DE K1ABC", "Looking for DX contacts, this is K1ABC."],
      ["CQ TEST DE W1AW", "CQ Contest from W1AW."],
    ],
    tags: ["operating", "calling"],
  },
  {
    code: "DX",
    slug: "dx",
    group: "Operating",
    meaning: "Long distance",
    summary:
      "DX = a long-distance station, especially across oceans or to a rare country.",
    context:
      "Used as both noun and adjective. A 'DX contact' is a long-distance contact; 'DXing' is the hobby of chasing rare entities. Threshold varies — on 160m a 1000-km contact is DX; on 20m it means transcontinental.",
    examples: [
      ["CQ DX", "Calling DX stations only."],
      ["TNX FB DX QSO", "Thanks for the fine DX contact."],
      ["DX HR", "DX station here."],
    ],
    tags: ["operating", "propagation"],
  },
  {
    code: "RST",
    slug: "rst",
    group: "Operating",
    meaning: "Signal report (Readability/Strength/Tone)",
    summary:
      "Standard 3-digit signal report: Readability 1–5, Strength 1–9, Tone 1–9.",
    context:
      "On CW you always send three digits (TONE is included); on phone you drop the T and send only two. '599' is the universal contest report; '5NN' is the same with N-shapes substituted for 9 to save keying time.",
    examples: [
      ["UR RST 599", "Your signal: perfect readability, strong, clean tone."],
      ["RST 5NN", "Same as 599 in contest shorthand."],
      ["RST 449", "Readability 4, strength 4, clean tone."],
    ],
    tags: ["signal", "operating"],
  },
  {
    code: "FB",
    slug: "fb",
    group: "Operating",
    meaning: "Fine business (excellent)",
    summary:
      "All-purpose approval: 'fine business' = great, excellent, well done.",
    context:
      "Originated in commercial telegraph slang. Today the meaning is just 'great' or 'awesome'. Compounds well: 'FB SIG' (great signal), 'FB QSO' (great contact).",
    examples: [
      ["FB OM TNX", "Great, sir, thanks."],
      ["FB SIG", "Great signal."],
      ["FB QSO 73", "Fine business contact, best regards."],
    ],
    tags: ["courtesy", "operating"],
  },
  {
    code: "AGN",
    slug: "agn",
    group: "Operating",
    meaning: "Again",
    summary:
      "Request the other operator to repeat what they just sent.",
    context:
      "Sent when copy fails. 'AGN?' is the explicit request; bare 'AGN' is a statement that you missed something. Often followed by the specific element needed: 'NAME AGN?' = 'repeat your name'.",
    examples: [
      ["AGN?", "Say again."],
      ["NAME AGN?", "Repeat your name."],
      ["RST AGN?", "Repeat the signal report."],
    ],
    tags: ["operating", "interaction"],
  },
  {
    code: "PSE",
    slug: "pse",
    group: "Operating",
    meaning: "Please",
    summary:
      "Standard CW politeness particle. Frequent in QRS PSE (please slow down) and similar.",
    context:
      "Always appended, not standalone. Common combinations: PSE QRS (please send slower), PSE AGN (please repeat), PSE QRX (please standby).",
    examples: [
      ["PSE QRS", "Please send slower."],
      ["PSE AGN", "Please send again."],
      ["PSE K", "Please go ahead."],
    ],
    tags: ["courtesy", "operating"],
  },
  {
    code: "HW?",
    slug: "hw",
    group: "Operating",
    meaning: "How copy?",
    summary:
      "Asks how well the other station is receiving you. Equivalent to 'how do you read?' on voice.",
    context:
      "Often answered with an RST and a comment: 'HW?' → 'UR RST 579 SOLID CPY'. A polite check during a borderline-condition QSO.",
    examples: [
      ["HW?", "How is your copy?"],
      ["HW CPY?", "Same, longer form."],
      ["UR HW?", "How is your reception of me?"],
    ],
    tags: ["operating", "signal"],
  },
  {
    code: "WX",
    slug: "wx",
    group: "Operating",
    meaning: "Weather",
    summary:
      "Standard rag-chew topic. 'WX HR' = 'the weather here is …'",
    context:
      "WX often gets a small report: 'WX HR SUNNY 18C' or 'WX RAIN 12C ES WIND'. Operators in different climates love comparing notes.",
    examples: [
      ["UR WX?", "What's your weather?"],
      ["WX HR SUNNY 22C", "Sunny and 22°C here."],
      ["WX RAIN ES COLD", "Rainy and cold."],
    ],
    tags: ["rag-chew", "operating"],
  },
  {
    code: "RIG",
    slug: "rig",
    group: "Operating",
    meaning: "Radio equipment",
    summary:
      "The radio itself, sometimes including the entire station setup.",
    context:
      "Exchanging 'RIG HR' info is a rag-chew staple: 'RIG HR FT-991 100W ANT G5RV' = Yaesu FT-991, 100 watts, G5RV antenna.",
    examples: [
      ["RIG HR K3 ES KPA500", "Radio here is an Elecraft K3 with KPA500 amp."],
      ["UR RIG?", "What's your equipment?"],
    ],
    tags: ["equipment", "rag-chew"],
  },
  {
    code: "ANT",
    slug: "ant",
    group: "Operating",
    meaning: "Antenna",
    summary:
      "Generic abbreviation for antenna. Often follows RIG in equipment exchanges.",
    context:
      "Common follow-on: 'ANT HR DIPOLE AT 30FT' or 'ANT MOXON ON 20M'. Antenna details drive QSO topics — gain, height, multi-band capability.",
    examples: [
      ["ANT HR DIPOLE", "Antenna here is a dipole."],
      ["UR ANT?", "What's your antenna?"],
    ],
    tags: ["equipment", "rag-chew"],
  },
  {
    code: "PWR",
    slug: "pwr",
    group: "Operating",
    meaning: "Power",
    summary:
      "Transmitter output power, usually in watts.",
    context:
      "'PWR 100W' = 100 watts, 'PWR 5W' = QRP (5 watts), 'PWR 1KW' = legal-limit station. Spelling out the unit is optional — 100W is the same as 100.",
    examples: [
      ["PWR 100W", "Running 100 watts."],
      ["UR PWR?", "What's your power?"],
      ["LO PWR HR 5W", "Low power here, 5 watts."],
    ],
    tags: ["equipment", "rag-chew"],
  },

  // ---------------- Generic connectors ----------------
  {
    code: "ES",
    slug: "es",
    group: "Connectors",
    meaning: "And",
    summary:
      "CW shorthand for 'and', from the Morse character for the ampersand (·-···).",
    context:
      "Used wherever you'd write 'and' on paper. The single character & is sent as a 5-element prosign, so 'ES' (two characters) is actually less keying.",
    examples: [
      ["73 ES 88", "Best regards and love."],
      ["ANT G5RV ES VERT", "Antennas: G5RV and a vertical."],
      ["GUD COPY ES TNX", "Good copy and thanks."],
    ],
    tags: ["connector"],
  },
  {
    code: "NR",
    slug: "nr",
    group: "Connectors",
    meaning: "Number",
    summary:
      "Precedes a numeric value — contest serial, message number, frequency.",
    context:
      "Contest QSOs send 'NR 001' for serial 1, 'NR 042' for serial 42. NTS traffic messages use 'NR 12 ROUTINE…' to identify the message number.",
    examples: [
      ["NR 042", "Serial number 42."],
      ["NR 12 ROUTINE", "Message number 12, routine precedence."],
    ],
    tags: ["connector", "contest"],
  },
  {
    code: "ABT",
    slug: "abt",
    group: "Connectors",
    meaning: "About",
    summary:
      "Approximation: 'ABT 50 MILES', 'ABT 1985'. Saves typing 'approximately'.",
    context:
      "Use ABT when the value is close-enough rather than exact. Common with ages, distances, dates, signal-strength estimates.",
    examples: [
      ["ABT 50 MILES NORTH", "About 50 miles north."],
      ["LIC ABT 1985", "Licensed around 1985."],
    ],
    tags: ["connector"],
  },
  {
    code: "BTW",
    slug: "btw",
    group: "Connectors",
    meaning: "By the way",
    summary:
      "Casual rag-chew interjection. Same meaning as the texting abbreviation.",
    context:
      "Predates the texting era — has been used on CW since the 1950s. Rare in contests, common in casual rag-chews.",
    examples: [
      ["BTW UR FB OP", "By the way, you're a fine operator."],
      ["BTW MY 2ND QSO TDY", "By the way, this is my second QSO today."],
    ],
    tags: ["connector", "rag-chew"],
  },
  {
    code: "WL",
    slug: "wl",
    group: "Connectors",
    meaning: "Will / well",
    summary:
      "Both 'will' and 'well' map to WL — context disambiguates.",
    context:
      "'WL CU LTR' = 'will see you later'. 'GUD CPY WL' = 'good copy, well/fine'. Compact substitute for two of the most common short English words.",
    examples: [
      ["WL CALL TMW", "Will call tomorrow."],
      ["GUD CPY WL", "Good copy, fine."],
    ],
    tags: ["connector"],
  },
];
