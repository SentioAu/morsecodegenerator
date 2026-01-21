import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://morsecodegenerator.com";

function fail(msg) {
  console.error(`❌ [verify-build] ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ [verify-build] ${msg}`);
}

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function assertFile(relPath) {
  const p = path.join(DIST, relPath);
  if (!exists(p)) fail(`Missing file: dist/${relPath}`);
  else ok(`Found dist/${relPath}`);
  return p;
}

function extract(html, re, label) {
  const m = html.match(re);
  if (!m) return null;
  return m[1] ?? m[0] ?? null;
}

function assertCanonical(html, expectedPath, relPath) {
  const href = extract(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
    "canonical"
  );
  if (!href) return fail(`Missing canonical in dist/${relPath}`);

  const expected = `${SITE}${expectedPath.endsWith("/") ? expectedPath : expectedPath + "/"}`;
  if (href !== expected) {
    fail(`Canonical mismatch in dist/${relPath}\n  expected: ${expected}\n  found:    ${href}`);
  } else {
    ok(`Canonical OK in dist/${relPath}`);
  }
}

function assertRobotsMeta(html, relPath, mustContain) {
  const content = extract(
    html,
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (!content) return fail(`Missing robots meta in dist/${relPath}`);

  const norm = content.toLowerCase().replace(/\s+/g, "");
  const want = mustContain.toLowerCase().replace(/\s+/g, "");
  if (!norm.includes(want)) {
    fail(`Robots meta mismatch in dist/${relPath}\n  expected to include: ${mustContain}\n  found: ${content}`);
  } else {
    ok(`Robots meta OK in dist/${relPath}`);
  }
}

function assertHasH1(html, relPath) {
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1) fail(`Missing <h1> in dist/${relPath}`);
  else ok(`<h1> OK in dist/${relPath}`);
}

function assertNotNoindex(html, relPath) {
  const robots = extract(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (robots && robots.toLowerCase().includes("noindex")) {
    fail(`Unexpected noindex in dist/${relPath} (content="${robots}")`);
  } else {
    ok(`No unwanted noindex in dist/${relPath}`);
  }
}

// ----------------------------
// Start checks
// ----------------------------
if (!exists(DIST)) {
  console.log("[verify-build] dist/ not found — skipping");
  process.exit(0);
}

// Core outputs
assertFile("robots.txt");
assertFile("sitemap.xml");

// robots.txt content sanity
{
  const robotsPath = path.join(DIST, "robots.txt");
  const txt = readText(robotsPath);
  if (!/Sitemap:\s*https:\/\/morsecodegenerator\.com\/sitemap\.xml/i.test(txt)) {
    fail(`robots.txt missing/incorrect Sitemap line. Expected Sitemap: ${SITE}/sitemap.xml`);
  } else {
    ok("robots.txt Sitemap line OK");
  }
}

// sitemap.xml sanity
{
  const sitemapPath = path.join(DIST, "sitemap.xml");
  const xml = readText(sitemapPath);
  const isSitemap = xml.includes("<urlset") || xml.includes("<sitemapindex");
  if (!isSitemap) fail("sitemap.xml does not look like a sitemap (missing <urlset> or <sitemapindex>)");
  else ok("sitemap.xml looks valid");
}

// Key pages (these must exist)
const pages = [
  { rel: "index.html", canon: "/", robots: "index,follow", h1: true, indexable: true },
  { rel: "translate/index.html", canon: "/translate/", robots: "index,follow", h1: true, indexable: true },
  { rel: "phrases/index.html", canon: "/phrases/", robots: "index,follow", h1: true, indexable: true },
  { rel: "morse-code/a/index.html", canon: "/morse-code/a/", robots: "index,follow", h1: true, indexable: true },
  { rel: "morse-code/punctuation/index.html", canon: "/morse-code/punctuation/", robots: "index,follow", h1: true, indexable: true },
  { rel: "404.html", canon: "/404/", robots: "noindex", h1: true, indexable: false }
];

for (const p of pages) {
  const filePath = assertFile(p.rel);
  const html = readText(filePath);

  if (p.h1) assertHasH1(html, p.rel);
  assertCanonical(html, p.canon, p.rel);
  assertRobotsMeta(html, p.rel, p.robots);
  if (p.indexable) assertNotNoindex(html, p.rel);
}

// Special slug pages (your pain point)
const special = [
  { rel: "exclamation-in-morse-code/index.html", canon: "/exclamation-in-morse-code/", indexable: true },
  { rel: "apostrophe-in-morse-code/index.html", canon: "/apostrophe-in-morse-code/", indexable: true }
];

for (const p of special) {
  if (!exists(path.join(DIST, p.rel))) {
    fail(`Missing special page: dist/${p.rel} (check seo-slugs.json includes it + getStaticPaths filters allow it)`);
    continue;
  }
  const html = readText(path.join(DIST, p.rel));
  assertHasH1(html, p.rel);
  assertCanonical(html, p.canon, p.rel);
  assertNotNoindex(html, p.rel);
  ok(`Special page OK: dist/${p.rel}`);
}

if (process.exitCode === 1) {
  console.error("❌ [verify-build] Build verification FAILED.");
  process.exit(1);
} else {
  ok("Build verification PASSED.");
}
