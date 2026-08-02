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
// Per-placement tracking IDs — how we find out WHICH pages earn.
//
// Amazon's reports break down by tracking ID, not by page. With one ID for
// the whole site its report can tell you 69 clicks and 4 sales, but never
// which section produced them. GA4 does record the page (the affiliate_click
// event carries it), but that is consent-gated — visitors who don't accept
// cookies fire nothing, so it undercounts by an unknown amount.
//
// Separate tracking IDs fix both problems: Amazon attributes the sale itself,
// with no consent dependency and no undercounting.
//
// TO ENABLE: create the extra IDs in Associates Central (Account Settings →
// Manage Tracking IDs; up to 100 are allowed), then replace the fallbacks
// below. Until then every one resolves to the main tag, so behaviour is
// unchanged and nothing can break.
//
// Keep `mcg0d2-20` as the default so existing links and reporting history
// stay continuous.
// ---------------------------------------------------------------------
export const TAGS = {
  // Tool pages — /keyer/, /practice/. Highest-intent CW audience.
  tools: import.meta.env?.AMAZON_TAG_TOOLS || TAG,
  // /gear/* buying guides.
  gear: import.meta.env?.AMAZON_TAG_GEAR || TAG,
  // Reference hubs — /q-codes/, /prosigns/, /abbreviations/.
  reference: import.meta.env?.AMAZON_TAG_REFERENCE || TAG,
  // The word/name/gift cluster. Worth isolating: it holds 245 of the links
  // but the search data says it has almost no traffic — a separate ID
  // settles whether that read is right.
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
