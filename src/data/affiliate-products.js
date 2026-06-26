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
