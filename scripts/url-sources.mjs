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

  // /<word>-in-morse-code/ pages.
  if (/^\/[a-z0-9-]+-in-morse-code\/$/.test(urlPath)) {
    return ["src/pages/[slug]-in-morse-code.astro", "src/data/seo-slugs.json", "src/data/morse.json"];
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
