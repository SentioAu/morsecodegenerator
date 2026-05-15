// Canonical Q-code data shared by /q-codes/ (hub) and
// /q-codes/<code>/ (per-code detail page).
//
// Each entry:
//   code      – 3 letters, all caps
//   question  – the Q-code used with a "?" suffix
//   answer    – the Q-code used as a statement
//   summary   – one-sentence elevator description for SERP snippets
//   context   – paragraph of where/when this Q-code is used in practice
//   examples  – array of [usage, plain English] pairs
//   tags      – facets for related-page selection
//
// Q-codes are defined by ITU-R M.1172 (maritime/aero) and the ARRL CW
// Operator Reference for amateur use. The wording below follows current
// amateur CW practice; aero/maritime variants are noted in `context`
// where they differ materially.

export const qcodes = [
  {
    code: "QRA",
    question: "What is the name of your station?",
    answer: "The name of my station is …",
    summary:
      "Asks for the station name. Rarely heard on amateur CW today; common in maritime traffic logs.",
    context:
      "Although Q-codes originated for ship and aero use, QRA is uncommon on amateur HF — call signs already serve the identity role. You'll most often see QRA on coastal-station logs or in older operating handbooks.",
    examples: [
      ["QRA?", "What is the name of your station?"],
      ["QRA SHANNON RADIO", "The name of my station is Shannon Radio."],
    ],
    tags: ["identity"],
  },
  {
    code: "QRG",
    question: "What is my exact frequency?",
    answer: "Your exact frequency is …",
    summary:
      "Asks for or states a precise transmit frequency, usually in kHz or MHz.",
    context:
      "Used during net checkins, contest spotting, and when a station is drifting. The answer is normally a numeric frequency; on CW it's often abbreviated (e.g. 14040 instead of 14.040 MHz).",
    examples: [
      ["QRG?", "What is my exact frequency?"],
      ["QRG 14040", "Your exact frequency is 14.040 MHz."],
      ["UR QRG 7028", "Your frequency is 7.028 MHz."],
    ],
    tags: ["frequency", "operating"],
  },
  {
    code: "QRK",
    question: "What is the readability of my signals (1–5)?",
    answer: "Your readability is …",
    summary:
      "Asks the receiving station to rate how readable your signal is on the standard 1–5 scale.",
    context:
      "The 'R' in RST. 1 = unreadable, 5 = perfectly readable. Modern QSOs usually combine QRK with QSA (signal strength) into a single RST report sent during the contact.",
    examples: [
      ["QRK?", "How readable am I?"],
      ["QRK 5", "Your readability is 5 (perfect)."],
      ["RST 599", "Readability 5, Strength 9, Tone 9."],
    ],
    tags: ["signal-report", "operating"],
  },
  {
    code: "QRL",
    question: "Are you busy / is this frequency in use?",
    answer: "I am busy / this frequency is in use. Please do not interfere.",
    summary:
      "The standard 'is this frequency in use?' courtesy check before transmitting on a clear-sounding frequency.",
    context:
      "Always send QRL? before calling CQ on what you think is an empty frequency. A weak DX station you can't hear may be calling. Many regulars answer with just C (yes) or QRL.",
    examples: [
      ["QRL?", "Is this frequency in use?"],
      ["QRL", "Yes, it's in use."],
      ["C", "Yes (short for 'confirm')."],
    ],
    tags: ["operating", "etiquette"],
  },
  {
    code: "QRM",
    question: "Is there man-made interference on my signal?",
    answer: "There is man-made interference (QRM).",
    summary:
      "Specifically man-made interference: other stations, electrical noise from devices, switched-mode PSUs.",
    context:
      "Contrast with QRN (natural noise). A common QRM report is 'QRM 599' meaning you're being interfered with at strength 9. Numeric severity 1–5 is sometimes appended: QRM3 = moderate.",
    examples: [
      ["QRM?", "Am I being interfered with?"],
      ["QRM", "Yes, there's man-made QRM."],
      ["QRM5 QSY", "Severe interference; let's change frequency."],
    ],
    tags: ["signal-report", "interference"],
  },
  {
    code: "QRN",
    question: "Are you troubled by static (natural noise)?",
    answer: "I am troubled by static (lightning, atmospheric noise).",
    summary:
      "Natural atmospheric noise — lightning crashes, summer static — as opposed to QRM (man-made).",
    context:
      "QRN is worst on low bands (160m, 80m) in summer thunderstorm season. Severity 1–5 is often appended (QRN3 = moderate). High QRN usually means slowing down (QRS) or moving to a higher band.",
    examples: [
      ["QRN?", "Are you troubled by static?"],
      ["QRN", "Yes, heavy static here."],
      ["QRN5 QRS", "Severe static; please send slower."],
    ],
    tags: ["signal-report", "interference"],
  },
  {
    code: "QRO",
    question: "Shall I increase transmit power?",
    answer: "Increase your power.",
    summary:
      "Used as a verb on amateur CW: 'go QRO' means switch to a high-power amplifier; opposite of QRP.",
    context:
      "Often used to describe an operating style: a QRO station runs the legal limit. Polite during a difficult QSO ('UR WK QRO PSE' = your signal is weak, please increase power).",
    examples: [
      ["QRO?", "Shall I increase power?"],
      ["QRO", "Increase your power."],
      ["GOING QRO", "I'm switching to high power now."],
    ],
    tags: ["power", "operating"],
  },
  {
    code: "QRP",
    question: "Shall I decrease transmit power?",
    answer: "Decrease your power. (Also: I am operating QRP.)",
    summary:
      "Decrease power, or — as a noun — low-power CW operating (≤ 5 W output).",
    context:
      "QRP is a whole subculture: dedicated awards (QRP-ARCI 1000 Miles per Watt), kit radios (Elecraft KX-series, QCX), and contests. As a request, it means 'reduce power'; as a label, it means the station is running 5 W or less.",
    examples: [
      ["QRP?", "Shall I decrease power?"],
      ["QRP 5W", "I'm running 5 watts QRP."],
      ["QRP DE W1AW", "Low-power station calling from W1AW."],
    ],
    tags: ["power", "operating", "qrp"],
  },
  {
    code: "QRQ",
    question: "Shall I send faster?",
    answer: "Send faster (… WPM).",
    summary:
      "Request to speed up. Sometimes followed by the target WPM.",
    context:
      "QRQ also names the high-speed CW community — stations who run 35 WPM and up. A 'QRQ contest' is anything above ordinary contest speed.",
    examples: [
      ["QRQ?", "Shall I send faster?"],
      ["QRQ 30", "Send at 30 WPM."],
      ["QRQ NET", "High-speed CW net."],
    ],
    tags: ["speed", "operating"],
  },
  {
    code: "QRS",
    question: "Shall I send slower?",
    answer: "Send slower (… WPM).",
    summary:
      "Request to slow down. The polite alternative when copy is failing.",
    context:
      "Slow-speed CW nets are often labelled 'QRS nets' and run 10–13 WPM specifically for learners. A bare 'QRS' without WPM means 'as slow as you can, please.'",
    examples: [
      ["QRS?", "Shall I send slower?"],
      ["QRS PSE", "Please send slower."],
      ["QRS 12", "Slow to 12 WPM."],
    ],
    tags: ["speed", "operating"],
  },
  {
    code: "QRT",
    question: "Shall I stop sending?",
    answer: "I am closing down / stop sending.",
    summary:
      "Either a request to stop, or a self-announcement of shutting the station down.",
    context:
      "Often the last word of a session: 'TU QRT 73'. Also used to politely end a long conversation when conditions deteriorate.",
    examples: [
      ["QRT?", "Shall I stop sending?"],
      ["QRT 73", "Shutting down; best regards."],
      ["TU QRT", "Thank you, signing off."],
    ],
    tags: ["operating", "etiquette"],
  },
  {
    code: "QRU",
    question: "Have you anything for me?",
    answer: "I have nothing for you.",
    summary:
      "Asks whether the other station has any traffic (messages, weather, news) to pass.",
    context:
      "Standard in formal NTS (National Traffic System) handling. A bare 'QRU' near the end of a QSO is the polite signal that you're ready to wrap up.",
    examples: [
      ["QRU?", "Anything for me?"],
      ["QRU", "Nothing for you."],
      ["QRU TU 73", "Nothing more, thanks, 73."],
    ],
    tags: ["traffic", "operating"],
  },
  {
    code: "QRV",
    question: "Are you ready?",
    answer: "I am ready.",
    summary:
      "Generic readiness check — ready to copy, ready to start the contest, ready to handle traffic.",
    context:
      "Net controllers use QRV during round-the-table checkins: 'QRV?' means 'ready when you are.' Also used after fixing an antenna or radio: 'QRV NW' = ready now.",
    examples: [
      ["QRV?", "Are you ready?"],
      ["QRV", "I'm ready."],
      ["QRV NW", "Ready now."],
    ],
    tags: ["operating"],
  },
  {
    code: "QRX",
    question: "When will you call me again?",
    answer: "Stand by / I will call you at …",
    summary:
      "Asks for a callback time, or asks the other operator to stand by.",
    context:
      "Bare 'QRX' = please wait. With a time, it sets the next sked. 'QRX 5' often means 'standby 5 minutes', not '5 seconds'.",
    examples: [
      ["QRX?", "When will you call again?"],
      ["QRX 5", "Standby 5 minutes."],
      ["QRX TMW 1900Z", "Call again tomorrow at 1900 UTC."],
    ],
    tags: ["operating", "timing"],
  },
  {
    code: "QRZ",
    question: "Who is calling me?",
    answer: "You are being called by …",
    summary:
      "The classic 'who's calling?' query, sent when a partial call comes through the noise.",
    context:
      "QRZ is also the name of the largest amateur callbook (qrz.com). On the air, a bare 'QRZ?' after CQing means 'I missed your call, please send again'.",
    examples: [
      ["QRZ?", "Who's calling me?"],
      ["QRZ DE W1AW", "You are being called by W1AW."],
      ["CQ CQ DE K1ABC K1ABC QRZ?", "Standard CQ + 'who's calling me?'"],
    ],
    tags: ["identity", "operating"],
  },
  {
    code: "QSB",
    question: "Are my signals fading?",
    answer: "Your signals are fading.",
    summary:
      "Reports fading on HF — the natural ionospheric signal-strength variation.",
    context:
      "QSB is the QRS's cousin: not noise, just slow strength variation. Common on 20m/40m DX paths. Severity 1–5 is sometimes appended (QSB3 = moderate fading).",
    examples: [
      ["QSB?", "Am I fading?"],
      ["QSB3", "Moderate fading on your signal."],
      ["UR SIGS QSB", "Your signal is fading."],
    ],
    tags: ["signal-report", "propagation"],
  },
  {
    code: "QSL",
    question: "Can you acknowledge receipt?",
    answer: "I confirm receipt.",
    summary:
      "Confirms that a transmission has been received. Also names the postal/electronic QSL card tradition.",
    context:
      "On-air 'QSL' = 'roger, copied.' Off-air, a QSL card is the postcard-sized confirmation mailed (or uploaded to Logbook of the World / eQSL) after a contact, used for awards like DXCC.",
    examples: [
      ["QSL?", "Did you copy?"],
      ["QSL", "Roger, copied."],
      ["QSL TNX", "Confirmed, thanks."],
    ],
    tags: ["confirmation", "operating"],
  },
  {
    code: "QSO",
    question: "Can you communicate directly with …?",
    answer: "I can communicate directly with …",
    summary:
      "Originally 'can you reach X?' — but today the noun 'QSO' just means 'a contact' / 'a conversation'.",
    context:
      "Modern usage is almost always the noun form: 'first QSO of the contest', 'long-rag-chew QSO'. The original interrogative is rarely sent.",
    examples: [
      ["TNX FB QSO", "Thanks for the fine business contact."],
      ["QSO B4", "We've worked before."],
      ["1ST QSO HR", "My first contact here."],
    ],
    tags: ["operating"],
  },
  {
    code: "QSY",
    question: "Shall I change frequency?",
    answer: "Change to frequency …",
    summary:
      "Move to another frequency. Standard on busy bands and during net operations.",
    context:
      "'QSY UP 5' means move 5 kHz up; 'QSY DN' means move down. DX operators frequently work 'split': listening on a different frequency than they transmit on.",
    examples: [
      ["QSY?", "Shall I change frequency?"],
      ["QSY 14045", "Move to 14.045 MHz."],
      ["QSY UP 5", "Move up 5 kHz."],
    ],
    tags: ["frequency", "operating"],
  },
  {
    code: "QTH",
    question: "What is your location?",
    answer: "My location is …",
    summary:
      "The classic 'where are you?' query. Often answered with city, state, country, or Maidenhead grid square.",
    context:
      "QTH is one of the most-used Q-codes in casual amateur QSOs. Granularity ranges from country-level ('QTH USA') to grid-square ('QTH FN31') to street address (rarely on-air).",
    examples: [
      ["QTH?", "Where are you?"],
      ["QTH BOSTON MA", "Boston, Massachusetts."],
      ["QTH FN42", "Maidenhead grid FN42."],
    ],
    tags: ["location", "operating"],
  },
  {
    code: "QTR",
    question: "What is the correct time?",
    answer: "The correct time is …",
    summary:
      "Asks for the time, usually UTC. Less used on ham bands now that smartphones exist, but still common in formal nets.",
    context:
      "Amateur radio time is UTC ('Zulu'). 'QTR 1430Z' = 14:30 UTC. NTS traffic-handling nets always log message times in UTC using QTR-style fields.",
    examples: [
      ["QTR?", "What's the time?"],
      ["QTR 1430Z", "14:30 UTC."],
      ["QTR 0205Z 15 MAY", "02:05 UTC on 15 May."],
    ],
    tags: ["time", "operating"],
  },
];
