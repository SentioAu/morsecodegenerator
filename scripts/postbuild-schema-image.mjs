/**
 * postbuild-schema-image
 * ----------------------------------------------------------------
 * Injects a valid `image` into Article / HowTo / BlogPosting JSON-LD
 * nodes that don't already have one.
 *
 * Why this exists
 * ---------------
 * Google requires `image` on Article and HowTo structured data, and an
 * Ahrefs crawl (2026-07-26) flagged ~102 pages for it: 82 Article nodes
 * and 16 HowTo nodes with no image at all. The nodes are built by hand in
 * ~20 different page files, so fixing them at the source would mean 20
 * near-identical edits plus the same edit again on every future page.
 *
 * Doing it here instead means:
 *   - one place to reason about,
 *   - every page uses ITS OWN og:image, which the Layout already computes
 *     correctly per page (postbuild-og.mjs renders those PNGs),
 *   - new pages are covered automatically.
 *
 * Format matters: Google only accepts .jpg / .png / .gif for structured
 * data images. Pages outside OG_PAGES fall back to /og-image.svg for
 * og:image, which is fine for social cards but NOT valid here — so those
 * fall back to the homepage's rendered PNG, which is a real 1200x630
 * raster and always exists.
 *
 * What it deliberately does NOT do: invent a `datePublished`. Several of
 * these are undated reference pages (prosigns, Q-codes), and a fabricated
 * date is worse than an absent one. That stays a content decision.
 */
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const SITE = String(process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");
const FALLBACK_IMAGE = `${SITE}/og/index.png`;
const TARGET_TYPES = new Set(["Article", "BlogPosting", "TechArticle", "HowTo"]);

function log(...a) { console.log("[postbuild-schema-image]", ...a); }

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === "index.html") out.push(full);
  }
  return out;
}

/** The page's own OG image, but only if it's a raster Google will accept. */
function rasterOgImage(html) {
  const m = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!m) return null;
  return /\.(png|jpe?g|gif)$/i.test(m[1]) ? m[1] : null;
}

function addImages(node, image) {
  let touched = 0;
  if (Array.isArray(node)) {
    for (const n of node) touched += addImages(n, image);
    return touched;
  }
  if (!node || typeof node !== "object") return 0;
  if (Array.isArray(node["@graph"])) touched += addImages(node["@graph"], image);

  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some((t) => TARGET_TYPES.has(t)) && !node.image) {
    node.image = image;
    touched += 1;
  }
  return touched;
}

let filesChanged = 0;
let nodesFixed = 0;
let usedFallback = 0;

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, "utf8");
  if (!/"@type":\s*"(Article|BlogPosting|TechArticle|HowTo)"/.test(html)) continue;

  const own = rasterOgImage(html);
  const image = own || FALLBACK_IMAGE;

  let fixedHere = 0;
  const next = html.replace(
    /(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (whole, open, body, close) => {
      let data;
      try { data = JSON.parse(body); } catch { return whole; }
      const n = addImages(data, image);
      if (!n) return whole;
      fixedHere += n;
      return open + JSON.stringify(data) + close;
    }
  );

  if (fixedHere > 0) {
    fs.writeFileSync(file, next);
    filesChanged += 1;
    nodesFixed += fixedHere;
    if (!own) usedFallback += 1;
  }
}

log(
  `added image to ${nodesFixed} node(s) across ${filesChanged} page(s); ` +
  `${filesChanged - usedFallback} used the page's own OG PNG, ${usedFallback} used the site fallback.`
);
