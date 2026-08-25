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

// ---------------------------------------------------------------------
// Per-placement tracking IDs — ⏸️ CURRENTLY OFF (2026-08-08, owner's call).
//
// Every placement below resolves to `mcg0d2-20`, so the whole site reports
// under one tracking ID again. The mechanism still works; only the fallbacks
// changed. To re-enable a split, put a real ID back in place of TAG.
//
// The IDs exist in Associates Central and remain valid:
//   mcgtool-20   /keyer/, /practice/
//   mcggear-20   /gear/*
//   mcgref-20    reference hubs
//   mcgword-20   word / gift cluster
//
// Why it was turned off. Per-ID reporting only means something with traffic
// to divide, and the pages carrying affiliate links draw about 2 visitors a
// day between them — so the split produced four near-empty reports instead
// of one small one, and made "no clicks" harder to interpret rather than
// easier.
//
// The bigger issue found at the same time is geographic, not attributional:
// roughly 53% of the audience is in countries with their own Amazon store
// (Spain, UK, Australia, Canada, Mexico, Netherlands, India, Italy), where a
// .com tag earns nothing no matter which ID is on it. That needs Amazon
// OneLink, not more tracking IDs.
// ---------------------------------------------------------------------
export const TAGS = {
  // Tool pages — /keyer/, /practice/. Highest-intent CW audience.
  tools: import.meta.env?.AMAZON_TAG_TOOLS || TAG,
  // /gear/* buying guides.
  gear: import.meta.env?.AMAZON_TAG_GEAR || TAG,
  // Reference hubs — /q-codes/, /prosigns/, /abbreviations/.
  reference: import.meta.env?.AMAZON_TAG_REFERENCE || TAG,
  // The word/name/gift cluster — the bulk of the links on the site.
  words: import.meta.env?.AMAZON_TAG_WORDS || TAG,
  // Blog posts.
  blog: import.meta.env?.AMAZON_TAG_BLOG || TAG,
};

// Tagged Amazon search URL. Search links never 404 (unlike specific
// product/ASIN links that die when a listing changes hands), so they're
// the safe default for the long tail of gift/phrase/name pages.
export function amazonSearch(query, tag = TAG) {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  return tag ? `${base}&tag=${encodeURIComponent(tag)}` : base;
}

// Direct product link when we have an ASIN, tagged search link when we don't.
//
// Search links never 404, which is why they're the default everywhere. But
// they drop the visitor on a results page still holding a decision, so they
// convert worse than a link straight to the item. For the handful of gear
// picks we actually stand behind, a direct link is worth the maintenance.
//
// Usage: give a product an `asin` in gear.js and it upgrades automatically;
// leave `asin` empty and it stays a search link. No code change either way,
// so ASINs can be filled in one at a time.
//
// ASINs die when a listing changes hands — re-check them when GEAR_UPDATED
// is bumped.
export function amazonProduct(asin, fallbackQuery, tag = TAG) {
  const id = String(asin || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(id)) return amazonSearch(fallbackQuery, tag);
  const base = `https://www.amazon.com/dp/${id}`;
  return tag ? `${base}?tag=${encodeURIComponent(tag)}` : base;
}

// Re-tag an already-built Amazon URL for a specific placement. Lets a
// component attribute a shared product list to its own tracking ID without
// the data file needing to know where it will be rendered.
export function withTag(url, tag) {
  if (!url || !tag) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)amazon\.[a-z.]+$/.test(u.hostname)) return url; // leave amzn.to short links alone
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
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
  return amazonSearch(query, TAGS.words);
}

export const AFFILIATE_PRODUCTS = {
  "i-love-you": {
    id: "aff-i-love-you-bracelet",
    title: "“I love you” Morse code couples bracelets",
    // Was an amzn.to short link, which cannot be re-tagged — its tracking ID
    // is baked in server-side. Swapped for a direct ASIN link so the tag is
    // set from TAGS like every other link, rather than being frozen inside a
    // shortener. Keep it that way even though everything currently points at
    // one ID: a short link would silently ignore any future change here.
    //
    // Copy corrected at the same time: the listing is a matching PAIR for
    // couples, not the single beaded bracelet the old note described.
    note:
      "A ready-made matching pair that spells “I love you” in Morse code — one for each of you, if you'd rather buy than make your own.",
    url: amazonProduct("B08DD4L9FY", "i love you morse code couples bracelet", TAGS.words),
    cta: "See it on Amazon",
  },
};

export function affiliateForSlug(slug) {
  return AFFILIATE_PRODUCTS[String(slug || "").toLowerCase()] || null;
}
