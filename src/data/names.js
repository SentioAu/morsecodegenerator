// Popular first names that get a "<name> in morse code" page.
//
// Why this list exists
// --------------------
// "[name] in morse code" is a high-volume, low-competition search
// cluster with clear gift/jewelry/tattoo intent. Each name reuses the
// existing /<slug>-in-morse-code/ route but renders a name-aware CTA
// that funnels into /morse-bracelet/ (the visual generator) — so the
// search → page → product/affiliate path is one click.
//
// Rules: A–Z only (every letter has Morse), lowercase slug form, no
// duplicates. Curated toward common English-speaking first names with
// gender balance; not exhaustive — extend as Search Console reveals
// real demand.

export const NAMES = [
  // Top female
  "emma", "olivia", "ava", "sophia", "isabella", "mia", "amelia", "harper",
  "evelyn", "abigail", "emily", "ella", "elizabeth", "camila", "luna",
  "sofia", "avery", "scarlett", "chloe", "grace", "victoria", "riley",
  "aria", "lily", "aurora", "zoey", "willow", "hazel", "nora", "layla",
  "lucy", "ruby", "stella", "ellie", "natalie", "hannah", "zoe", "leah",
  "violet", "aubrey", "savannah", "audrey", "brooklyn", "claire", "skylar",
  "lillian", "paisley", "everly", "anna", "caroline", "nova", "genesis",
  "kennedy", "samantha", "maya", "sarah", "madison", "ariana", "rose",
  "katie", "alice", "hope", "faith", "summer", "jasmine", "julia", "sophie",

  // Top male
  "liam", "noah", "oliver", "james", "elijah", "william", "henry", "lucas",
  "benjamin", "theodore", "mason", "ethan", "levi", "jack", "jackson",
  "owen", "daniel", "michael", "alexander", "sebastian", "asher", "logan",
  "matthew", "jacob", "joseph", "samuel", "david", "carter", "wyatt",
  "luke", "gabriel", "anthony", "isaac", "grayson", "dylan", "leo",
  "lincoln", "julian", "hudson", "nathan", "aaron", "ryan", "adam",
  "thomas", "charles", "caleb", "josiah", "christopher", "andrew",
  "joshua", "nathaniel", "george", "jordan", "max", "cooper", "miles",
  "max", "eli", "cole", "jason", "kevin", "tyler", "aiden", "connor",
  "evan", "ian", "blake", "chase", "hunter", "brandon",

  // Common / classic / unisex
  "john", "robert", "mary", "patricia", "jennifer", "linda", "barbara",
  "susan", "jessica", "karen", "lisa", "nancy", "betty", "sandra",
  "margaret", "ashley", "kimberly", "donna", "michelle", "carol",
  "amanda", "melissa", "deborah", "stephanie", "rebecca", "laura",
  "sharon", "cynthia", "kathleen", "amy", "angela", "shirley", "brenda",
  "pamela", "nicole", "katherine", "christine", "rachel", "diana",
  "mark", "paul", "steven", "kenneth", "joshua", "brian", "edward",
  "ronald", "timothy", "jason", "jeffrey", "gary", "scott", "eric",
  "stephen", "frank", "raymond", "gregory", "patrick", "dennis", "jerry",
  "alex", "sam", "charlie", "jamie", "taylor", "morgan", "casey", "jesse",
  "drew", "quinn", "river", "sky", "noel", "robin", "dana", "lee",
];

// De-duplicated, sorted slug list (some names appear in more than one
// group above — and "max" is listed twice on purpose to be safe).
export const NAME_SLUGS = Array.from(new Set(NAMES)).sort((a, b) =>
  a.localeCompare(b, "en")
);

export function isNameSlug(slug) {
  return NAME_SLUGS.includes(String(slug || "").toLowerCase());
}
