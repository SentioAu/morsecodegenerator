/**
 * Per-page Open Graph image generator
 * --------------------------------------------------------------------
 * For each "important" page in dist/, render a 1200×630 PNG OG card
 * with the page title and brand mark, save to dist/og/<slug>.png,
 * and let Layout.astro emit per-page og:image URLs that point at them.
 *
 * Twitter/Facebook/LinkedIn require PNG/JPG for OG cards (SVG is
 * silently rejected), so this is the only way to get unique social
 * previews per page on a static site without a runtime image worker.
 *
 * Strategy:
 *   1. Read the curated list of paths from src/data/og-pages.js (the
 *      same module Layout.astro imports so both sides agree on which
 *      URLs have custom OGs).
 *   2. For each path, extract the <title> from the built HTML and
 *      strip the site suffix.
 *   3. Render a hand-written SVG card and rasterize via @resvg/resvg-js.
 *   4. Write to dist/og/<slug>.png. Path slug maps:
 *        /                            -> dist/og/index.png
 *        /blog/foo/                   -> dist/og/blog/foo.png
 *        /q-codes/                    -> dist/og/q-codes/index.png
 *
 * Build pipeline: runs after the sitemap step and before
 * verify-build/indexnow-ping. Failures log but do not fail the build —
 * a missing OG falls back to the static /og-image.svg.
 */
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { OG_PAGES, OG_BRAND, OG_KICKER_BY_SECTION } from "../src/data/og-pages.js";

const DIST = path.resolve("dist");
const OG_OUT = path.join(DIST, "og");

function log(...a) { console.log("[postbuild-og]", ...a); }

// ---------- Font ----------------------------------------------------
// @fontsource/space-grotesk ships TTF-free, so we feed the woff2 file
// to resvg. v2 understands it. We bundle one weight (700) — bold heading
// is the only place the OG card uses display type.
const FONT_PATH = path.resolve(
  "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2"
);
const FONT_BUF = fs.existsSync(FONT_PATH) ? fs.readFileSync(FONT_PATH) : null;

// ---------- Title extraction ---------------------------------------
// Each built HTML carries `<title>Foo – MorseCodeGenerator.com</title>`
// (with variations). We want just "Foo" — strip the trailing brand
// suffix using a generous regex so subsidiary copy patterns work too.
function extractTitle(htmlFile) {
  try {
    const html = fs.readFileSync(htmlFile, "utf8");
    const m = html.match(/<title>([^<]+)<\/title>/i);
    if (!m) return null;
    let title = m[1].trim();
    // Strip common brand suffixes
    title = title.replace(/\s+[–—|-]\s+(MorseCodeGenerator\.com|Morse Code Generator).*$/i, "");
    title = title.replace(/\s+\(MorseCodeGenerator\.com\)\s*$/i, "");
    // Decode HTML entities
    title = title.replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"');
    return title;
  } catch { return null; }
}

// ---------- SVG card template ---------------------------------------
function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Roughly wrap a title into ≤ 3 lines so it fits the card. Word-aware,
// case-preserving. We can't measure text properly without a renderer,
// so this approximates by character count.
function wrap(title, maxLineChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxLineChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line ? line + " " : "") + w;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function pickFontSize(lines) {
  if (lines.length <= 1) return 72;
  if (lines.length === 2) return 64;
  return 56;
}

function buildSvg({ title, kicker }) {
  // Brand-consistent dark palette matches the site's --bg + --accent.
  const lines = wrap(title || "MorseCodeGenerator.com", 26);
  const fontSize = pickFontSize(lines);
  const lineHeight = Math.round(fontSize * 1.15);
  const totalHeight = lines.length * lineHeight;
  const startY = 315 - Math.round(totalHeight / 2) + Math.round(fontSize * 0.85);

  const titleTspans = lines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(ln)}</tspan>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0c"/>
      <stop offset="100%" stop-color="#1a1a20"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Accent bar across the top so the card reads as a brand artifact -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accent)"/>

  <!-- Top-left brand row -->
  <g font-family="Space Grotesk, Inter, -apple-system, sans-serif">
    <circle cx="92" cy="92" r="14" fill="#3b82f6"/>
    <rect x="116" y="83" width="28" height="18" rx="6" fill="#3b82f6"/>
    <text x="160" y="100" font-size="22" font-weight="700" fill="#ededee">${escapeXml(OG_BRAND)}</text>
  </g>

  <!-- Kicker / section indicator -->
  ${kicker ? `<text x="80" y="190"
        font-family="Space Grotesk, Inter, -apple-system, sans-serif"
        font-size="22" font-weight="700"
        letter-spacing="3"
        fill="#60a5fa">${escapeXml(kicker.toUpperCase())}</text>` : ""}

  <!-- Title -->
  <text x="80" y="${startY}"
        font-family="Space Grotesk, Inter, -apple-system, sans-serif"
        font-size="${fontSize}" font-weight="700"
        fill="#ededee">${titleTspans}</text>

  <!-- Footer URL -->
  <text x="80" y="570"
        font-family="Space Grotesk, Inter, -apple-system, sans-serif"
        font-size="20" font-weight="700"
        fill="#a1a1aa">morsecodegenerator.com</text>

  <!-- Right-edge accent dots evoking Morse -->
  <g fill="#3b82f6" opacity="0.85">
    <circle cx="1090" cy="540" r="8"/>
    <rect x="1108" y="533" width="44" height="14" rx="4"/>
    <circle cx="1166" cy="540" r="8"/>
  </g>
</svg>`;
}

// ---------- Page list ----------------------------------------------
function htmlFileForPath(p) {
  if (p === "/") return path.join(DIST, "index.html");
  const trimmed = p.replace(/^\/+|\/+$/g, "");
  return path.join(DIST, trimmed, "index.html");
}

function outFileForPath(p) {
  // / -> dist/og/index.png
  // /q-codes/ -> dist/og/q-codes/index.png
  // /blog/foo/ -> dist/og/blog/foo.png
  if (p === "/") return path.join(OG_OUT, "index.png");
  const trimmed = p.replace(/^\/+|\/+$/g, "");
  const isDirIndex = p.endsWith("/") && !trimmed.includes("/");
  if (isDirIndex) {
    return path.join(OG_OUT, trimmed, "index.png");
  }
  // Multi-segment: /blog/foo/ -> /blog/foo.png so the layout reference
  // is `/og/blog/foo.png`. Equivalent single-segment dir gets index.png.
  return path.join(OG_OUT, trimmed + ".png");
}

// ---------- Main ----------------------------------------------------
function main() {
  if (!fs.existsSync(DIST)) { log("dist missing; skipping."); return; }
  if (!FONT_BUF) log("WARN: font file not found, using resvg default. Path:", FONT_PATH);

  fs.mkdirSync(OG_OUT, { recursive: true });

  const t0 = Date.now();
  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of OG_PAGES) {
    const htmlFile = htmlFileForPath(entry);
    if (!fs.existsSync(htmlFile)) { skipped++; continue; }
    const title = extractTitle(htmlFile) || entry;
    const kicker = OG_KICKER_BY_SECTION(entry);

    const svg = buildSvg({ title, kicker });
    try {
      const resvg = new Resvg(svg, {
        fitTo: { mode: "width", value: 1200 },
        font: FONT_BUF ? {
          fontBuffers: [FONT_BUF],
          defaultFontFamily: "Space Grotesk",
        } : undefined,
      });
      const png = resvg.render().asPng();
      const out = outFileForPath(entry);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, png);
      made++;
    } catch (e) {
      failed++;
      log(`render failed for ${entry}:`, e?.message || e);
    }
  }

  const ms = Date.now() - t0;
  log(`made=${made} skipped=${skipped} failed=${failed} in ${ms}ms`);
}

main();
