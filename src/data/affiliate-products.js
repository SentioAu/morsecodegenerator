// Curated affiliate products mapped to specific gift/phrase pages.
//
// Why this exists
// --------------
// Some phrase pages (e.g. "i love you") have a matching ready-made product
// on Amazon. Those pages already funnel to the FREE bracelet generator
// ("make your own"); when a real product exists we ALSO offer a "buy one
// instead" option — capturing the visitor who'd rather purchase than DIY.
//
// Affiliate policy (same as gear.js): every outbound product link must
// carry rel="sponsored nofollow noopener" and data-aff="<id>" (the Layout
// fires a GA4 affiliate_click event off that attribute). Amazon short
// links (amzn.to/…) already embed the associate tag, so they earn without
// AMAZON_ASSOC_TAG being set.
//
// Keyed by the EN phrase slug (the same slug the /<slug>-in-morse-code/
// route uses). Spanish counterparts reuse the entry via affiliateForSlug().

// Amazon Associates tracking ID. Public by design (it shows in every
// outbound affiliate link), so we ship a sensible default and let the
// Cloudflare Pages env var override it — same pattern as ADSENSE_CLIENT.
// This is the single source of truth for the tag across the whole site
// (gear.js re-imports amazonSearch from here).
const TAG = import.meta.env?.AMAZON_ASSOC_TAG || "mcg0d2-20";

// Tagged Amazon search URL. Search links never 404 (unlike specific
// product/ASIN links that die when a listing changes hands), so they're
// the safe default for the long tail of gift/phrase/name pages.
export function amazonSearch(query) {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  return TAG ? `${base}&tag=${encodeURIComponent(TAG)}` : base;
}

// Build a "shop ready-made on Amazon" link for a gift/phrase/name page.
// Names → a personalized (custom-word) necklace; phrases → a bracelet for
// that phrase.
export function amazonGiftSearch(term, { kind = "phrase" } = {}) {
  const t = String(term || "").trim();
  const query =
    kind === "name"
      ? `${t} personalized morse code necklace`
      : `${t} morse code bracelet`;
  return amazonSearch(query);
}

export const AFFILIATE_PRODUCTS = {
  "i-love-you": {
    id: "aff-i-love-you-bracelet",
    title: "“I love you” Morse code bracelet",
    note:
      "A ready-made beaded bracelet that spells “I love you” in Morse code — a quick gift if you'd rather buy one than make it.",
    url: "https://amzn.to/4g754Ay",
    cta: "See it on Amazon",
  },
};

export function affiliateForSlug(slug) {
  return AFFILIATE_PRODUCTS[String(slug || "").toLowerCase()] || null;
}
