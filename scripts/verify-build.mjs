// path: scripts/verify-build.mjs
import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

// If your site is small early on, lower this.
// As soon as you have word/phrase slugs, this should be much larger.
const MIN_SITEMAP_URLS = Number(process.env.MIN_SITEMAP_URLS || 25);

function detectWebRoot() {
  const dist = path.resolve("dist");
  const distPublic = path.join(dist, "public");
  if (fs.existsSync(distPublic) && fs.statSync(distPublic).isDirectory()) return distPublic;
  return dist;
}

function mustExist(p, label) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing ${label}: ${p}`);
    process.exit(1);
  }
  console.log(`✅ Found ${label}: ${p}`);
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function mustNotExist(p, label) {
  if (fs.existsSync(p)) {
    console.error(`❌ Should NOT exist (${label}): ${p}`);
    process.exit(1);
  }
  console.log(`✅ Not present (good): ${label}`);
}

function assert(condition, msg) {
  if (!condition) {
    console.error(`❌ ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

function verifyCanonicalAndH1(html, label) {
  // canonical tag exists
  const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html);
  assert(hasCanonical, `${label}: canonical tag exists`);

  // canonical has href
  const hrefMatch = html.match(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );
  assert(!!hrefMatch && !!hrefMatch[1], `${label}: canonical href exists`);

  // encourage trailing slash canonical (Layout enforces this)
  if (hrefMatch?.[1]) {
    const href = String(hrefMatch[1]);
    const ok = href.includes("?") ? true : href.endsWith("/");
    assert(ok, `${label}: canonical ends with "/" (or contains "?")`);
  }

  // h1 exists
  const hasH1 = /<h1(\s|>)/i.test(html);
  assert(hasH1, `${label}: <h1> exists`);
}

function normalizeLines(s) {
  return String(s || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Very small helper to check redirect rules in a robust way (spacing-insensitive)
function redirectsContainRule(lines, from, to) {
  const f = String(from).trim();
  const t = String(to).trim();

  return lines.some((line) => {
    if (!line || line.startsWith("#")) return false;
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return false;
    return parts[0] === f && parts[1] === t;
  });
}

function parseSitemapLocs(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) out.push(String(m[1]).trim());
  return out;
}

function hasMetaRobotsNoindex(html) {
  if (!html) return false;
  return (
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html) ||
    /<meta\s+[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["'][^>]*>/i.test(html)
  );
}

function main() {
  const webRoot = detectWebRoot();

  mustExist(webRoot, "build output directory");
  mustExist(path.join(webRoot, "index.html"), "homepage (index.html)");
  mustExist(path.join(webRoot, "robots.txt"), "robots.txt");
  mustExist(path.join(webRoot, "sitemap.xml"), "sitemap.xml");

  // Cloudflare Pages routing rules must exist
  const redirectsPath = path.join(webRoot, "_redirects");
  mustExist(redirectsPath, "_redirects");

  // robots must reference sitemap.xml EXACTLY (strict)
  const robotsPath = path.join(webRoot, "robots.txt");
  const robots = readFileSafe(robotsPath);

  const expectedSitemapLine = `Sitemap: ${SITE}/sitemap.xml`;

  const lines = normalizeLines(robots);
  const sitemapLines = lines.filter((l) => /^sitemap:/i.test(l));

  assert(sitemapLines.length > 0, "robots.txt contains a Sitemap: line");
  assert(
    sitemapLines.some((l) => l.toLowerCase() === expectedSitemapLine.toLowerCase()),
    `robots.txt sitemap line matches exactly: "${expectedSitemapLine}"`
  );

  const bad = sitemapLines.filter(
    (l) => l.toLowerCase() !== expectedSitemapLine.toLowerCase()
  );
  assert(bad.length === 0, "robots.txt has no unexpected Sitemap: lines");

  // ---- Verify sitemap.xml quality ----
  const sitemapPath = path.join(webRoot, "sitemap.xml");
  const sitemap = readFileSafe(sitemapPath);

  assert(sitemap.length > 0, "sitemap.xml is not empty");

  const locs = parseSitemapLocs(sitemap);
  assert(locs.length >= MIN_SITEMAP_URLS, `sitemap.xml contains at least ${MIN_SITEMAP_URLS} URLs`);

  // Ensure no translate entries land in sitemap (tool page should never be included)
  const translateInSitemap = locs.some((u) => {
    try {
      const url = new URL(u);
      return url.pathname === "/translate/" || url.pathname.startsWith("/translate/");
    } catch {
      return String(u).includes("/translate/");
    }
  });
  assert(!translateInSitemap, "sitemap.xml does not include /translate/");

  // ---- NEW: verify special-character redirect rules exist ----
  const redirectsRaw = readFileSafe(redirectsPath);
  const redirectLines = normalizeLines(redirectsRaw);

  const exclaimTo = "/exclamation-in-morse-code/";
  const apostTo = "/apostrophe-in-morse-code/";

  assert(
    redirectsContainRule(redirectLines, "/morse-code/%21", exclaimTo),
    `_redirects contains: /morse-code/%21 -> ${exclaimTo}`
  );
  assert(
    redirectsContainRule(redirectLines, "/morse-code/%21/", exclaimTo),
    `_redirects contains: /morse-code/%21/ -> ${exclaimTo}`
  );

  assert(
    redirectsContainRule(redirectLines, "/morse-code/%27", apostTo),
    `_redirects contains: /morse-code/%27 -> ${apostTo}`
  );
  assert(
    redirectsContainRule(redirectLines, "/morse-code/%27/", apostTo),
    `_redirects contains: /morse-code/%27/ -> ${apostTo}`
  );

  // ---- Representative page checks (canonical + h1) ----
  const samples = [
    { file: "index.html", label: "/" },
    { file: path.join("translate", "index.html"), label: "/translate/" },
    { file: path.join("morse-code", "a", "index.html"), label: "/morse-code/a/" },
    { file: path.join("morse-code", "words", "index.html"), label: "/morse-code/words/" },
    { file: path.join("phrases", "index.html"), label: "/phrases/" },
  ];

  for (const s of samples) {
    const p = path.join(webRoot, s.file);
    mustExist(p, `page ${s.label}`);
    const html = readFileSafe(p);
    verifyCanonicalAndH1(html, `page ${s.label}`);
  }

  // ---- Translator must be noindex (prevents query crawl bloat) ----
  const translateHtml = readFileSafe(path.join(webRoot, "translate", "index.html"));
  assert(hasMetaRobotsNoindex(translateHtml), "/translate/ has meta robots noindex");

  // ---- Ensure legacy duplicate families are NOT built ----
  // Old: /a-in-morse-code/ etc => must not exist
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i); // a-z
    const legacyDir = path.join(webRoot, `${ch}-in-morse-code`);
    mustNotExist(
      path.join(legacyDir, "index.html"),
      `legacy letter page /${ch}-in-morse-code/`
    );
  }

  // Old: /0-in-morse-code/ etc => must not exist
  for (let d = 0; d <= 9; d++) {
    const legacyDir = path.join(webRoot, `${d}-in-morse-code`);
    mustNotExist(
      path.join(legacyDir, "index.html"),
      `legacy digit page /${d}-in-morse-code/`
    );
  }

  console.log("✅ verify-build: all checks passed");
}

main();
