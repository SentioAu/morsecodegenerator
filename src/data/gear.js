// Gear guide data — the /gear/ hub and its review pages all render from
// this file so prices, links, and verdicts stay consistent everywhere.
//
// Affiliate policy
// ----------------
// Links are Amazon search URLs (stable for years, unlike ASIN links that
// die when a listing changes hands). When AMAZON_ASSOC_TAG is set at
// build time the tag is appended and the link earns; without it the
// link still works — never a broken funnel. Direct-manufacturer links
// are plain links (until a direct affiliate program is joined).
//
// Every outbound product link must carry rel="sponsored nofollow" and
// data-aff="<id>" (the Layout fires a GA4 affiliate_click event off
// that attribute).
//
// Prices are approximate ranges, revisited when pages are refreshed —
// see `updated` below, surfaced on every gear page.

export const GEAR_UPDATED = "2026-06-12";

// amazonSearch (and the AMAZON_ASSOC_TAG default) now live in
// affiliate-products.js so the tag is single-sourced across the site.
// Re-exported here so existing importers of gear.js keep working.
import { amazonSearch } from "./affiliate-products.js";
export { amazonSearch };

export const straightKeys = [
  {
    id: "cwmorse-pocket",
    name: "CW Morse Pocket Straight Key",
    price: "≈ $20–30",
    verdict: "Best first key",
    summary:
      "3D-printed, ball-bearing pivot, surprisingly crisp action for the price. Light enough that you'll want to tape it down or hold it, but as a first key to find out whether straight-key sending suits you, nothing touches it at this price.",
    pros: ["Cheapest decent action available new", "Adjustable gap and tension", "Made by an active ham-owned shop"],
    cons: ["Too light for desk use without fixing it down", "Plastic feel"],
    href: amazonSearch("CW Morse straight key"),
  },
  {
    id: "kent-handkey",
    name: "Kent KT-1 Hand Key",
    price: "≈ $80–120",
    verdict: "Best classic action",
    summary:
      "A heavy British-style key on a wooden base with a long lever arm and silky bearings. This is the key people imagine when they imagine Morse. Buy-it-once quality; spares available from Kent for decades.",
    pros: ["Heavy base — never moves", "Genuinely lovely action at slow and medium speed", "Repairable, serviceable, heirloom-grade"],
    cons: ["Price", "Long-arm style takes a different wrist technique than navy-style keys"],
    href: amazonSearch("Kent hand key morse"),
  },
  {
    id: "vibroplex-straight",
    name: "Vibroplex Straight Key",
    price: "≈ $120–180",
    verdict: "Best American classic",
    summary:
      "The oldest name in keys, still made in the USA. Navy-style short-arm action on a heavy base. If the budget allows and you want one straight key for life with a brand that will outlive us all, this is it.",
    pros: ["Superb fit and finish", "Heavy enough to stay put", "Holds resale value"],
    cons: ["Premium price for a beginner", "Overkill if you'll move to paddles within a year"],
    href: amazonSearch("Vibroplex straight key"),
  },
  {
    id: "surplus-military",
    name: "Military-surplus key (Czech / J-38 style)",
    price: "≈ $25–60",
    verdict: "Best character per dollar",
    summary:
      "Cold-war surplus keys — Czech army keys and American J-38s especially — are plentiful, robust, and full of history. Action quality varies key to key, so buy from a seller with photos of the actual unit.",
    pros: ["Real history on your desk", "Built to survive a war", "Often cheaper than new plastic"],
    cons: ["Condition lottery", "May need cleaning and contact polishing on arrival"],
    href: amazonSearch("military surplus morse code key J-38"),
  },
];

export const paddles = [
  {
    id: "cwmorse-sp4",
    name: "CW Morse SP4 Paddle",
    price: "≈ $35–50",
    verdict: "Best first paddle",
    summary:
      "The default recommendation for a first iambic paddle. 3D-printed with ball bearings and magnetic return, fully adjustable. Good enough that plenty of operators never upgrade; cheap enough that upgrading later costs nothing in regret.",
    pros: ["Unbeatable price for a real dual-lever paddle", "Magnetic tension feels clean", "Light for portable/SOTA use"],
    cons: ["Light base needs holding or sticking down", "Plastic flex at very high speeds"],
    href: amazonSearch("CW Morse SP4 paddle"),
  },
  {
    id: "bencher-by1",
    name: "Bencher BY-1",
    price: "≈ $130–180",
    verdict: "The benchmark",
    summary:
      "The most-sold iambic paddle ever made, now produced by Vibroplex. Chrome-and-black, heavy base, crisp contacts. Tens of thousands of operators learned on a BY-1 and the used market is deep if you ever sell.",
    pros: ["Industry-standard feel", "Heavy enough to stay planted", "Parts and service still available"],
    cons: ["Needs occasional contact cleaning", "Some find the pivot feel dated next to magnetic designs"],
    href: amazonSearch("Bencher BY-1 iambic paddle"),
  },
  {
    id: "kent-twin",
    name: "Kent TP1 Twin Paddle",
    price: "≈ $130–170",
    verdict: "Best ball-bearing feel",
    summary:
      "Kent's twin-lever paddle uses proper ball races rather than needle pivots — the action is smooth in a way that's hard to describe and harder to give up. Kit or assembled.",
    pros: ["Glass-smooth bearing action", "Solid British build, serviceable forever", "Kit version saves money and teaches you the mechanism"],
    cons: ["Bigger footprint than modern compact paddles", "Import shipping to some regions"],
    href: amazonSearch("Kent twin paddle morse"),
  },
];

export const qrpRigs = [
  {
    id: "qmx",
    name: "QRP Labs QMX (kit or assembled)",
    price: "≈ $95 kit / $145 assembled",
    verdict: "Best value in all of amateur radio",
    summary:
      "Five watts, multiple bands, built-in keyer, CW decoder, and a USB sound card for digital modes — for under a hundred dollars as a kit. Nothing else in radio comes close per dollar. The kit is a weekend of careful soldering; the assembled option skips straight to operating.",
    pros: ["Absurd capability per dollar", "Tiny — true shirt-pocket rig", "Active development and firmware updates"],
    cons: ["Kit build is not a first-soldering-project", "CW and digi only — no SSB (yet)"],
    href: "https://qrp-labs.com/qmx.html",
    direct: true,
  },
  {
    id: "trusdx",
    name: "(tr)uSDX",
    price: "≈ $90–140",
    verdict: "Cheapest multiband transceiver",
    summary:
      "An open-source five-band QRP transceiver the size of a deck of cards. Compromises everywhere — audio is thin, power is honest-five-watts-ish — but it transmits real CW on real bands for the price of a restaurant dinner.",
    pros: ["Five bands, shockingly cheap", "Open-source hardware and firmware", "Huge community of builders"],
    cons: ["Receiver audio is the weak point", "Quality varies between kit suppliers — buy from a reputable one"],
    href: amazonSearch("truSDX QRP transceiver"),
  },
  {
    id: "xiegu-g90",
    name: "Xiegu G90",
    price: "≈ $400–450",
    verdict: "Best step-up / do-everything budget rig",
    summary:
      "20 watts, built-in automatic antenna tuner, real SSB alongside CW. Heavier and thirstier than true QRP rigs, but as one radio that does CW practice today and everything else later, it's the budget sweet spot.",
    pros: ["Built-in ATU is a genuine luxury at this price", "20W closes contacts QRP can't", "Full HF coverage incl. SSB"],
    cons: ["Power-hungry for battery field use", "Keyer/menu ergonomics are workmanlike"],
    href: amazonSearch("Xiegu G90 HF transceiver"),
  },
  {
    id: "elecraft-kx2",
    name: "Elecraft KX2",
    price: "≈ $850+",
    verdict: "The dream portable",
    summary:
      "The rig CW portable operators graduate to. World-class receiver, exquisite built-in keyer, runs all day on an internal battery, fits in a jacket pocket. Listed not because a beginner should buy one, but because it's useful to know where the ladder tops out.",
    pros: ["Best-in-class receiver and keyer", "True all-day internal battery", "Legendary resale value"],
    cons: ["Price of ten QMX kits", "Waiting lists are common"],
    href: "https://elecraft.com/products/kx2-ssb-cw-data-80-10-m-transceiver",
    direct: true,
  },
];

// Books — evergreen affiliate items with real margins and zero returns.
export const books = [
  {
    id: "art-skill-radiotelegraphy",
    name: "The Art and Skill of Radio-Telegraphy (Bill Pierpont, N0HFF)",
    note: "The classic deep text on learning and mastering CW. Also free as PDF — link to print for people who want paper.",
    href: amazonSearch("Art and Skill of Radio-Telegraphy"),
  },
  {
    id: "morse-code-operating",
    name: "ARRL's Morse Code Operating for Amateur Radio",
    note: "Practical on-air operating: QSO structure, contesting, DXing with CW.",
    href: amazonSearch("ARRL Morse Code Operating for Amateur Radio"),
  },
  {
    id: "zen-art-radiotelegraphy",
    name: "Zen and the Art of Radiotelegraphy (Carlo Consoli, IK0YGJ)",
    note: "The head-copy and mindset book — what to do after 15 WPM when progress stalls.",
    href: amazonSearch("Zen and the Art of Radiotelegraphy"),
  },
];
