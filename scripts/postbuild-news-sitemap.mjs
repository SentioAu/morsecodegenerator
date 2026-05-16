/**
 * Google News sitemap
 * --------------------------------------------------------------------
 * Writes dist/news-sitemap.xml in the Google News sitemap format
 * (https://support.google.com/news/publisher-center/answer/9606710).
 *
 * Per Google's spec, News sitemaps only include articles published in
 * the **last 48 hours**. URLs older than that should be dropped from
 * the file — older content lives in the regular sitemap.xml.
 *
 * The publication date for each post is the `published` field in
 * src/data/blog-posts.js (YYYY-MM-DD). We treat that as 12:00 UTC for
 * staleness comparison so a date can survive the publishing day without
 * flipping stale at midnight in some random timezone.
 *
 * Failure modes
 *  - If no fresh post exists, the file is removed (or never written),
 *    so old news XML never lingers in dist/.
 *  - If the blog data import fails, we log and exit zero — the rest of
 *    the build pipeline must not fail just because Google News didn't
 *    get an empty feed.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = String(process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");
const PUBLICATION_NAME = "MorseCodeGenerator.com";
const PUBLICATION_LANG = "en";
// Google News sitemap freshness window. "2 days" in Google's docs is
// understood as a calendar window: today, yesterday, and the day before
// (so a paper dated three days ago drops out the moment a new UTC day
// begins). Using a calendar comparison rather than a strict 48-hour
// rolling window means a post never disappears at 12:01am of its third
// day for an arbitrary timezone reason.
const FRESH_WINDOW_DAYS = 2;

function log(...a) { console.log("[postbuild-news-sitemap]", ...a); }

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function loadPosts() {
  const candidate = path.resolve("src/data/blog-posts.js");
  if (!fs.existsSync(candidate)) return [];
  try {
    const mod = await import(pathToFileURL(candidate).href);
    return Array.isArray(mod.posts) ? mod.posts : [];
  } catch (e) {
    log("Failed to import blog-posts.js:", e?.message || e);
    return [];
  }
}

// Returns the UTC midnight Date for a YYYY-MM-DD string. We compare
// calendar days, not strict instants, so a post dated "today" stays
// fresh even when the script runs in the early hours of today UTC.
function utcMidnight(yyyyMmDd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(yyyyMmDd || ""));
  if (!m) return null;
  return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
}

// Number of whole UTC calendar days between two midnight-UTC dates.
function utcDayDiff(aMidnight, bMidnight) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((bMidnight.getTime() - aMidnight.getTime()) / MS_PER_DAY);
}

function buildXml(items) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
  ];
  for (const it of items) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(it.loc)}</loc>`);
    lines.push("    <news:news>");
    lines.push("      <news:publication>");
    lines.push(`        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>`);
    lines.push(`        <news:language>${PUBLICATION_LANG}</news:language>`);
    lines.push("      </news:publication>");
    lines.push(`      <news:publication_date>${escapeXml(it.publicationDate)}</news:publication_date>`);
    lines.push(`      <news:title>${escapeXml(it.title)}</news:title>`);
    lines.push("    </news:news>");
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

async function main() {
  const dist = path.resolve("dist");
  if (!fs.existsSync(dist)) {
    log("dist not found; skipping.");
    return;
  }

  const posts = await loadPosts();

  // Today's UTC midnight is the anchor we compare publication dates
  // against. A post is fresh if it was published today, yesterday, or
  // the day before today (inclusive) — a 3-calendar-day window that
  // matches Google's "last 2 days" guidance once you allow the current
  // partial day.
  const nowDate = new Date();
  const todayMidnight = new Date(
    Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate())
  );

  const fresh = posts
    .map((p) => {
      const pubMidnight = utcMidnight(p.published);
      if (!pubMidnight) return null;
      const daysOld = utcDayDiff(pubMidnight, todayMidnight);
      if (daysOld < 0) return null;                  // future-dated: skip
      if (daysOld > FRESH_WINDOW_DAYS) return null;  // outside window: skip
      return {
        loc: `${SITE}/blog/${p.slug}/`,
        title: p.title,
        // Use midnight UTC of the pub date as the canonical timestamp.
        publicationDate: pubMidnight.toISOString(),
      };
    })
    .filter(Boolean);

  const outPath = path.join(dist, "news-sitemap.xml");

  if (fresh.length === 0) {
    // Remove a stale file from a previous deploy so we don't expose
    // outdated entries when nothing is fresh.
    if (fs.existsSync(outPath)) {
      try { fs.unlinkSync(outPath); } catch {}
    }
    log(`No posts within the last ${FRESH_WINDOW_DAYS + 1} calendar days; news-sitemap.xml not written.`);
    return;
  }

  const xml = buildXml(fresh);
  fs.writeFileSync(outPath, xml, "utf8");
  log(`Wrote ${outPath} (${fresh.length} fresh post${fresh.length === 1 ? "" : "s"}).`);
}

main().catch((e) => {
  log("Fatal:", e?.message || e);
  process.exit(0); // never fail the build
});
