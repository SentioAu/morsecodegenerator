// High-commercial-intent gift/message phrases that get a
// "<phrase> in morse code" page with a gift/bracelet CTA.
//
// Why this exists
// --------------
// Phrases like "i love you", "happy birthday", or "soulmate" are searched
// with strong gift/jewelry/tattoo intent. Each reuses the existing
// /<slug>-in-morse-code/ route but renders the same gift-focused CTA the
// name pages use — funnelling into /morse-bracelet/ (search → page →
// product/affiliate in one click).
//
// Slugs are lowercase, hyphenated, A–Z only, and must satisfy the slug
// route's "short phrase" rule (<= 4 words, <= 28 chars). `label` is the
// human display used in the bracelet page's idea grid; the page itself
// derives its own title from morse.json or title-casing.

export const GIFT_PHRASES = [
  { slug: "love", label: "Love" },
  { slug: "i-love-you", label: "I love you" },
  { slug: "love-you", label: "Love you" },
  { slug: "my-love", label: "My love" },
  { slug: "happy-birthday", label: "Happy birthday" },
  { slug: "happy-anniversary", label: "Happy anniversary" },
  { slug: "best-friend", label: "Best friend" },
  { slug: "soulmate", label: "Soulmate" },
  { slug: "forever", label: "Forever" },
  { slug: "always", label: "Always" },
  { slug: "be-mine", label: "Be mine" },
  { slug: "marry-me", label: "Marry me" },
  { slug: "will-you-marry-me", label: "Will you marry me" },
  { slug: "i-miss-you", label: "I miss you" },
  { slug: "good-luck", label: "Good luck" },
  { slug: "thank-you", label: "Thank you" },
  { slug: "mom", label: "Mom" },
  { slug: "dad", label: "Dad" },
  { slug: "mother", label: "Mother" },
  { slug: "father", label: "Father" },
  { slug: "sister", label: "Sister" },
  { slug: "brother", label: "Brother" },
  { slug: "daughter", label: "Daughter" },
  { slug: "son", label: "Son" },
  { slug: "wife", label: "Wife" },
  { slug: "husband", label: "Husband" },
  { slug: "baby", label: "Baby" },
  { slug: "family", label: "Family" },
  { slug: "home", label: "Home" },
  { slug: "hope", label: "Hope" },
  { slug: "faith", label: "Faith" },
  { slug: "peace", label: "Peace" },
  { slug: "strength", label: "Strength" },
  { slug: "courage", label: "Courage" },
  { slug: "believe", label: "Believe" },
  { slug: "dream", label: "Dream" },
  { slug: "joy", label: "Joy" },
  { slug: "grace", label: "Grace" },
  { slug: "blessed", label: "Blessed" },
];

export const GIFT_PHRASE_SLUGS = Array.from(
  new Set(GIFT_PHRASES.map((g) => g.slug))
).sort((a, b) => a.localeCompare(b, "en"));

export function isGiftSlug(slug) {
  return GIFT_PHRASE_SLUGS.includes(String(slug || "").toLowerCase());
}
