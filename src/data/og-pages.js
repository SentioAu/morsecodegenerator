// Curated list of pages that get a custom Open Graph PNG card.
//
// Both Layout.astro and scripts/postbuild-og.mjs import this module
// so the per-page og:image URL and the actual generated file always
// agree. Pages NOT in this set fall back to the static
// /og-image.svg shipped in public/.
//
// The set is curated rather than "every URL on the site" because
// 65+ programmatic-SEO pages (per-letter, per-Q-code, per-abbreviation,
// per-prosign detail pages) don't typically get shared on social, so
// they don't justify the build-time + storage cost of generating PNGs
// for each. The hubs do.

export const OG_BRAND = "MorseCodeGenerator.com";

// Section kickers — the small uppercase tag above the title on the
// OG card. Tells social-card viewers what *kind* of page this is at a
// glance. Mapped by URL path prefix so we don't have to maintain a
// per-URL map.
export function OG_KICKER_BY_SECTION(p) {
  if (p === "/") return "The hub of Morse code";
  if (p.startsWith("/blog/")) return "Article";
  if (p.startsWith("/q-codes/")) return "Q-code";
  if (p.startsWith("/abbreviations/")) return "CW abbreviation";
  if (p.startsWith("/prosigns/")) return "Prosign";
  if (p === "/translate/") return "Translator";
  if (p === "/decoder/") return "Decoder";
  if (p === "/practice/") return "Practice";
  if (p === "/keyer/") return "Send practice";
  if (p === "/morse-bracelet/") return "Make something";
  if (p === "/daily/") return "Daily challenge";
  if (p.startsWith("/gear/")) return "Gear guide";
  if (p === "/flashcards/") return "Flashcards quiz";
  if (p === "/random-cw/") return "Practice generator";
  if (p === "/timing-calculator/") return "Tool";
  if (p === "/chart/") return "Reference";
  if (p === "/worksheets/") return "Printable worksheets";
  if (p === "/cheat-sheet/") return "One-page reference";
  if (p === "/glossary/") return "Glossary";
  if (p === "/faq/") return "FAQ";
  if (p === "/history/") return "History";
  if (p === "/operating/") return "CW operating";
  if (p === "/teach/") return "For teachers + parents";
  if (p === "/about/") return "About";
  if (p === "/sponsor/") return "Partner";
  if (p === "/disclosure/") return "Disclosure";
  if (p === "/sitemap/") return "Site directory";
  if (p === "/api/" || p === "/integrations/") return "Developer";
  if (p === "/embed/") return "Embed widget";
  if (p === "/nato/" || p === "/abbreviations/" || p === "/q-codes/" || p === "/prosigns/")
    return "Reference";
  if (p === "/names-in-morse-code/") return "Names";
  if (p === "/es/") return "Código Morse";
  if (p === "/es/traductor/") return "Traductor";
  if (p === "/es/alfabeto-morse/") return "Alfabeto Morse";
  if (p.startsWith("/morse-code/") || p === "/phrases/") return "Learn";
  return "MorseCodeGenerator.com";
}

// The set of paths that get a generated PNG. Layout.astro checks set
// membership before emitting the per-page og:image URL.
export const OG_PAGES = new Set([
  "/",

  // Tools
  "/translate/",
  "/decoder/",
  "/practice/",
  "/keyer/",
  "/morse-bracelet/",
  "/daily/",
  "/flashcards/",
  "/random-cw/",
  "/timing-calculator/",
  "/chart/",
  "/worksheets/",
  "/cheat-sheet/",
  "/embed/",
  "/api/",
  "/integrations/",

  // Reference hubs
  "/morse-code/",
  "/morse-code/numbers/",
  "/morse-code/punctuation/",
  "/morse-code/words/",
  "/names-in-morse-code/",
  "/phrases/",
  "/operating/",
  "/teach/",

  // Gear guides
  "/gear/",
  "/gear/best-morse-code-keys/",
  "/gear/best-cw-paddles-for-beginners/",
  "/gear/qrp-cw-transceivers/",
  "/q-codes/",
  "/abbreviations/",
  "/prosigns/",
  "/nato/",
  "/glossary/",
  "/faq/",
  "/history/",

  // Blog index + every post
  "/blog/",
  "/blog/how-to-learn-morse-code-in-30-days/",
  "/blog/why-morse-code-is-still-used-today/",
  "/blog/morse-code-vs-binary/",
  "/blog/the-story-behind-sos/",
  "/blog/best-ways-to-practice-morse-code/",
  "/blog/morse-code-in-aviation/",
  "/blog/emergency-morse-code-cheat-sheet/",
  "/blog/how-to-send-morse-code/",
  "/blog/common-cw-mistakes-and-how-to-fix-them/",
  "/blog/international-vs-american-morse/",
  "/blog/morse-code-in-pop-culture/",
  "/blog/best-morse-code-keys-buyers-guide/",
  "/blog/farnsworth-timing-explained/",

  // Spanish (es)
  "/es/",
  "/es/traductor/",
  "/es/alfabeto-morse/",

  // Site / meta
  "/about/",
  "/sponsor/",
  "/disclosure/",
  "/sitemap/",
]);

// Map a URL path to the public URL of its generated OG image. Returns
// null for paths not in OG_PAGES — caller should fall back to the
// static SVG.
export function ogUrlForPath(p) {
  if (!OG_PAGES.has(p)) return null;
  if (p === "/") return "/og/index.png";
  const trimmed = p.replace(/^\/+|\/+$/g, "");
  // For directory-style single-segment paths we use /og/<seg>/index.png
  // so the URL mirrors the directory structure. Multi-segment paths
  // (e.g. /blog/foo/) get the flat /og/blog/foo.png form.
  const isSingleSegDir = !trimmed.includes("/");
  if (isSingleSegDir) return `/og/${trimmed}/index.png`;
  return `/og/${trimmed}.png`;
}
