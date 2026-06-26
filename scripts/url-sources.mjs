/**
 * Shared URL → source-file mapping.
 *
 * Used by:
 *   - scripts/postbuild-sitemap.mjs (decides each URL's <lastmod>)
 *   - scripts/indexnow-ping.mjs    (decides which URLs are "new this
 *                                    deploy" and worth pinging)
 *
 * Layout.astro is deliberately excluded — a layout edit otherwise
 * invalidates every URL and triggers a full IndexNow resubmit of the
 * whole site for cosmetic changes.
 */

export function sourcesForUrl(urlPath) {
  if (urlPath === "/") return ["src/pages/index.astro"];

  // Blog posts.
  const blogMatch = urlPath.match(/^\/blog\/([^/]+)\/$/);
  if (blogMatch) {
    if (blogMatch[1] === "index") return ["src/pages/blog/index.astro", "src/data/blog-posts.js"];
    return [
      "src/data/blog-bodies.js",
      "src/data/blog-posts.js",
      "src/pages/blog/[slug].astro",
    ];
  }
  if (urlPath === "/blog/") {
    return ["src/pages/blog/index.astro", "src/data/blog-posts.js"];
  }

  // Q-codes detail pages.
  if (/^\/q-codes\/[a-z0-9]+\/$/.test(urlPath)) {
    return ["src/data/q-codes.js", "src/pages/q-codes/[code].astro"];
  }
  if (urlPath === "/q-codes/") return ["src/data/q-codes.js", "src/pages/q-codes.astro"];

  // CW abbreviations detail pages.
  if (/^\/abbreviations\/[a-z0-9-]+\/$/.test(urlPath)) {
    return ["src/data/cw-abbreviations.js", "src/pages/abbreviations/[slug].astro"];
  }
  if (urlPath === "/abbreviations/") {
    return ["src/data/cw-abbreviations.js", "src/pages/abbreviations.astro"];
  }

  // Prosigns detail pages.
  if (/^\/prosigns\/[a-z0-9]+\/$/.test(urlPath)) {
    return ["src/data/prosigns.js", "src/pages/prosigns/[slug].astro"];
  }
  if (urlPath === "/prosigns/") {
    return ["src/data/prosigns.js", "src/pages/prosigns.astro"];
  }

  // Per-letter/digit pages.
  if (/^\/morse-code\/[a-z0-9]\/$/.test(urlPath)) {
    return ["src/data/morse.json", "src/pages/morse-code/[ch].astro"];
  }

  // Per-phrase pages.
  if (/^\/phrases\/[a-z0-9-]+\/$/.test(urlPath)) {
    return ["src/data/morse.json", "src/pages/phrases/[slug].astro"];
  }

  // Spanish (es) pages.
  if (urlPath === "/es/") return ["src/pages/es/index.astro"];
  if (urlPath === "/es/traductor/") return ["src/pages/es/traductor.astro", "src/data/morse.json"];
  if (urlPath === "/es/alfabeto-morse/") return ["src/pages/es/alfabeto-morse.astro", "src/data/morse.json"];
  if (urlPath === "/es/sos-en-codigo-morse/") return ["src/pages/es/sos-en-codigo-morse.astro", "src/data/morse.json"];
  if (urlPath === "/es/numeros-en-codigo-morse/") return ["src/pages/es/numeros-en-codigo-morse.astro", "src/data/morse.json"];
  if (urlPath === "/es/te-amo-en-codigo-morse/") return ["src/pages/es/te-amo-en-codigo-morse.astro", "src/data/morse.json"];
  if (urlPath === "/es/te-quiero-en-codigo-morse/") return ["src/pages/es/te-quiero-en-codigo-morse.astro", "src/data/morse.json"];
  if (urlPath === "/es/aprender-codigo-morse/") return ["src/pages/es/aprender-codigo-morse.astro"];

  // Names hub — static page (must be matched before the generic
  // /<word>-in-morse-code/ rule below, which would otherwise claim it).
  if (urlPath === "/names-in-morse-code/") {
    return ["src/pages/names-in-morse-code.astro", "src/data/names.js", "src/data/morse.json"];
  }

  // /<word>-in-morse-code/ pages (includes popular first names + gift phrases).
  if (/^\/[a-z0-9-]+-in-morse-code\/$/.test(urlPath)) {
    return ["src/pages/[slug]-in-morse-code.astro", "src/data/seo-slugs.json", "src/data/names.js", "src/data/gift-phrases.js", "src/data/morse.json"];
  }

  // Daily challenge — word list changes also refresh the page.
  if (urlPath === "/daily/") {
    return ["src/pages/daily.astro", "src/data/daily-words.js"];
  }

  // Gear guides — hub + review pages all render from the shared data file.
  if (urlPath === "/gear/") {
    return ["src/pages/gear/index.astro", "src/data/gear.js"];
  }
  const gearMatch = urlPath.match(/^\/gear\/([a-z0-9-]+)\/$/);
  if (gearMatch) {
    return [`src/pages/gear/${gearMatch[1]}.astro`, "src/data/gear.js"];
  }

  // Static one-pagers — each maps to its own .astro file.
  const named = urlPath.replace(/^\/|\/$/g, "");
  if (named && !named.includes("/")) {
    return [`src/pages/${named}.astro`];
  }

  // Two-segment routes that hit a directory index.
  const twoSegMatch = urlPath.match(/^\/([^/]+)\/([^/]+)\/$/);
  if (twoSegMatch) {
    return [`src/pages/${twoSegMatch[1]}/${twoSegMatch[2]}.astro`];
  }

  return [];
}
