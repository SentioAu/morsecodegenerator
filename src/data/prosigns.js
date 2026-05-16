// Canonical prosign data shared by /prosigns/ (hub) and
// /prosigns/<slug>/ (per-prosign detail page).
//
// A prosign is a procedural signal — two letters sent without the
// inter-letter gap so they form one sound shape. Conventionally written
// with an overbar (SK̅) or as joined letters. Standard reference:
// ITU-R M.1677-1 and the ARRL operating handbook.
//
// Each entry:
//   sign     – the two-letter (or one-letter) prosign as conventionally written
//   slug     – URL slug for the detail page (lowercase a-z0-9)
//   code     – Morse pattern sent as one shape (no inter-letter gap)
//   meaning  – short label for the hub table
//   summary  – SERP-friendly description (one sentence)
//   context  – paragraph of when/where this prosign is sent
//   examples – array of [usage, plain-English] pairs
//   notation – how this prosign is written in text (overbar, alias, plus, etc.)
//   tags     – facets for related-page selection

export const prosigns = [
  {
    sign: "AA",
    slug: "aa",
    code: ".-.-",
    meaning: "New line / line break",
    summary:
      "Marks the end of a line of plain text inside a longer message. Same code as the comma in some references.",
    context:
      "Used in formal message handling (NTS traffic) to indicate a line break inside the message body. Rare in casual rag-chews; the operator simply pauses instead.",
    examples: [
      ["NAME JIM AA QTH BOSTON", "Name: Jim. (new line) Location: Boston."],
    ],
    notation: "Written AA or as the conjoined letters A+A.",
    tags: ["formatting", "traffic"],
  },
  {
    sign: "AR",
    slug: "ar",
    code: ".-.-.",
    meaning: "End of message (+)",
    summary:
      "Closes the current message. Shares the Morse pattern of the plus sign and is sometimes written +.",
    context:
      "AR is the 'I have nothing more to add to this message' signal. Often followed by your call sign and then K (go ahead) or SK (end of contact).",
    examples: [
      ["73 AR K", "Best regards, end of message, go ahead."],
      ["TNX FB QSO AR W1AW K", "Thanks for the fine QSO, end of message, W1AW, go ahead."],
    ],
    notation: "Written AR (joined) or + when typed.",
    tags: ["closing", "message-control"],
  },
  {
    sign: "AS",
    slug: "as",
    code: ".-...",
    meaning: "Wait / standby",
    summary:
      "Asks the other operator to standby — typically while you tune a radio, take a phone call, or check a reference.",
    context:
      "Often sent solo and followed by a duration: 'AS 5' = wait 5 minutes (the unit is informal). A bare AS means a brief pause of a few seconds.",
    examples: [
      ["AS 5", "Standby five (minutes)."],
      ["AS", "Wait a moment."],
    ],
    notation: "Written AS (joined) or sometimes &.",
    tags: ["interaction", "message-control"],
  },
  {
    sign: "BK",
    slug: "bk",
    code: "-...-.-",
    meaning: "Break",
    summary:
      "'Break' — invites the receiving station to transmit, often mid-sentence to hand over quickly.",
    context:
      "Common in fast QSOs where the operators want to alternate rapidly. Heard between back-and-forth exchanges of a few sentences at a time.",
    examples: [
      ["UR RST 599 BK", "Your signal is 599, go ahead."],
      ["FB QSO BK", "Fine business contact, over to you."],
    ],
    notation: "Written BK (joined).",
    tags: ["interaction"],
  },
  {
    sign: "BT",
    slug: "bt",
    code: "-...-",
    meaning: "New paragraph (=)",
    summary:
      "Marks a paragraph break inside a longer transmission. Shares the Morse pattern of the equals sign and is often typed as =.",
    context:
      "Used to separate logical sections of a transmission: identification, then BT, then signal report, then BT, then closing. Pacing tool for the listener.",
    examples: [
      ["NAME JIM BT QTH BOSTON BT RIG K3", "Name Jim. (pause) Location Boston. (pause) Rig K3."],
      ["W1AW DE K1ABC BT 73", "W1AW from K1ABC, paragraph, 73."],
    ],
    notation: "Written BT (joined) or = when typed.",
    tags: ["formatting", "message-control"],
  },
  {
    sign: "CL",
    slug: "cl",
    code: "-.-..-..",
    meaning: "Going off the air",
    summary:
      "Signals that the operator is closing the station and clearing the frequency. Final word before going QRT.",
    context:
      "Heard at the end of a long operating session. Stronger than SK (which only ends one contact); CL means the station itself is going off the air.",
    examples: [
      ["73 SK CL", "Best regards, end of contact, station closing."],
      ["TNX QSO CL", "Thanks for the QSO, going off the air."],
    ],
    notation: "Written CL (joined).",
    tags: ["closing", "operating"],
  },
  {
    sign: "CT",
    slug: "ct",
    code: "-.-.-",
    meaning: "Start of transmission (KA)",
    summary:
      "'Attention — beginning a new transmission.' Also written KA in older references.",
    context:
      "Used at the start of a formal message or net call to capture the attention of listeners. Less common in modern casual amateur use; net controllers still use it.",
    examples: [
      ["CT NET TIME 0200Z", "Attention: net opens at 02:00 UTC."],
      ["CT QST DE W1AW", "Attention: general broadcast from W1AW."],
    ],
    notation: "Written CT or KA (the older form).",
    tags: ["opening", "operating"],
  },
  {
    sign: "HH",
    slug: "hh",
    code: "........",
    meaning: "Error / disregard",
    summary:
      "Eight dots, sent fast — 'disregard the previous group, here it is again.' The CW equivalent of crossing something out.",
    context:
      "Used the moment you make a sending error: send HH, pause, then send the corrected word. Listening operators erase the previous word mentally.",
    examples: [
      ["BOSON HH BOSTON", "Boson — disregard — Boston."],
      ["599 HH 569", "599 — correction — 569."],
    ],
    notation: "Written HH; just eight consecutive dits.",
    tags: ["correction", "message-control"],
  },
  {
    sign: "KN",
    slug: "kn",
    code: "-.--.",
    meaning: "Go ahead, named station only",
    summary:
      "Invites only the explicitly-named station to reply. Excludes any third stations from breaking in.",
    context:
      "After working a station and wanting to continue with just them, send their call followed by KN. Other stations should not call you until you send K (any station) or sign off.",
    examples: [
      ["W1AW DE K1ABC KN", "K1ABC inviting only W1AW to reply."],
      ["UR RST 599 KN", "Signal report 599, go ahead only-named-station."],
    ],
    notation: "Written KN (joined). Same code as the open paren character.",
    tags: ["interaction", "exclusion"],
  },
  {
    sign: "K",
    slug: "k",
    code: "-.-",
    meaning: "Go ahead (any station)",
    summary:
      "'Over' — invites any listening station to reply.",
    context:
      "Standard end-of-transmission invite. After your call sign at the end of a CQ ('CQ DE W1AW K'), any station can answer. K alone after a QSO turn means 'your turn'.",
    examples: [
      ["CQ DE W1AW K", "Standard CQ — anyone reply."],
      ["UR RST 599 K", "599, over to anyone."],
    ],
    notation: "Written K. Technically a single character, not a joined pair.",
    tags: ["interaction", "opening"],
  },
  {
    sign: "R",
    slug: "r",
    code: ".-.",
    meaning: "Received / roger",
    summary:
      "Confirms that the previous transmission was received correctly. The Morse equivalent of 'roger' on voice.",
    context:
      "Quick acknowledgement after a critical exchange — signal report, name, QTH. 'R FB' = received, fine. Don't send R if you didn't actually copy everything; ask for AGN instead.",
    examples: [
      ["R FB OM", "Received, fine business sir."],
      ["R QSL", "Received and confirmed."],
    ],
    notation: "Written R.",
    tags: ["acknowledgement"],
  },
  {
    sign: "SK",
    slug: "sk",
    code: "...-.-",
    meaning: "End of contact",
    summary:
      "Closes the QSO. The most-sent prosign on amateur CW.",
    context:
      "Sent right before 73 or as 73 SK. Indicates the contact itself is over, though the station may stay on the air for more QSOs. CL is stronger (station closing).",
    examples: [
      ["73 SK", "Best regards, end of contact."],
      ["TNX QSO 73 SK W1AW", "Thanks, 73, end of contact, W1AW signing."],
    ],
    notation: "Written SK (joined). Sometimes called 'VA' in older European references.",
    tags: ["closing", "operating"],
  },
  {
    sign: "SN",
    slug: "sn",
    code: "...-.",
    meaning: "Understood (VE)",
    summary:
      "'Understood.' Confirms that you got the message and grasped its content. Also written VE in older books.",
    context:
      "Stronger acknowledgement than R: R = 'received'; SN = 'received and understood.' Use for instructions, frequencies, schedules.",
    examples: [
      ["QSY 14045 SN", "Moving to 14.045, understood."],
      ["SK ED 1900Z SN", "Schedule 1900Z, understood."],
    ],
    notation: "Written SN or VE (older form).",
    tags: ["acknowledgement"],
  },
  {
    sign: "SOS",
    slug: "sos",
    code: "...---...",
    meaning: "International distress",
    summary:
      "The universal distress signal: three dits, three dahs, three dits — sent as one continuous shape with no inter-letter gaps.",
    context:
      "Reserved for actual emergency. The pattern was chosen at the 1906 Berlin Convention specifically because the rhythm is unambiguous under poor signal. NEVER send SOS for practice without making it clear it's a drill.",
    examples: [
      ["SOS SOS SOS DE <call> <call> POSITION… NATURE OF DISTRESS…", "Standard distress format."],
    ],
    notation: "Written SOS but sent as one shape (no inter-letter gap).",
    tags: ["distress", "emergency", "history"],
  },
];
