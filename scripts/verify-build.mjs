import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://morsecodegenerator.com").replace(
  /\/$/,
  ""
);

function detectWebRoot() {
  const dist = path.resolve("dist");
  const distPublic = path.join(dist, "public");
  if (fs.existsSync(distPublic) && fs.statSync(distPublic).isDirectory())
    return distPublic;
  return dist;
}

function mustExist(p, label) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing ${label}: ${p}`);
    process.exit(1);
  }
  console.log(`✅ Found ${label}: ${p}`);
}

function mustNotExist(p, label) {
  if (fs.existsSync(p)) {
    console.error(`❌ Should NOT exist (${label}): ${p}`);
    process.exit(1);
  }
  console.log(`✅ Not present (good): ${label}`);
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
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

/**
 * Extract internal hrefs from HTML (best-effort; enough for CI verification)
 */
function extractHrefs(html) {
  const out = new Set();
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = String(m[1] || "").trim();
    if (!href) continue;
    out.add(href);
  }
  return Array.from(out);
}

function isSkippableHref(href) {
  const h = String(href || "").trim();
  if (!h) return true;
  if (h.startsWith("#")) return true;
  if (h.startsWith("mailto:")) return true;
  if (h.startsWith("tel:")) return true;
  if (h.startsWith("javascript:")) return true;
  return false;
}

function toPathname(href) {
  const h = String(href || "").trim();

  // Absolute URL: only enforce if it's our own site
  if (/^https?:\/\//i.test(h)) {
    try {
      const u = new URL(h);
      const base = new URL(SITE + "/");
      if (u.origin !== base.origin) return null;
      return u.pathname || "/";
    } catch {
      return null;
    }
  }

  // Root-relative internal
  if (h.startsWith("/")) {
    // strip query/hash
    return h.split("#")[0].split("?")[0] || "/";
  }

  // Relative links: treat as internal but we can't resolve reliably without base path context.
  // Most of your site uses root-relative hrefs, so we skip relative paths to avoid false positives.
  return null;
}

function isAssetPath(p) {
  const pathname = String(p || "");
  // treat common assets as file paths, not directories
  return /\.(xml|txt|js|css|map|png|jpg|jpeg|gif|webp|svg|ico|webmanifest)$/i.test(
    pathname
  );
}

function pathExistsForRoute(webRoot, pathname) {
  const p = String(pathname || "/");
  if (!p.startsWith("/")) return false;

  // Decode (avoid failing on %xx)
  let decoded = p;
  try {
    decoded = decodeURI(p);
  } catch {
    decoded = p;
  }

  // Normalize: collapse multiple slashes
  decoded = decoded.replace(/\/{2,}/g, "/");

  // Asset routes (sitemap.xml, robots.txt, mcg-tool.js, etc.)
  if (isAssetPath(decoded)) {
    const fp = path.join(webRoot, decoded.replace(/^\//, ""));
    return fs.existsSync(fp);
  }

  // Directory-style routes -> /path/ => dist/path/index.html
  const clean = decoded.replace(/[?#].*$/, "");

  // Accept both /foo and /foo/ by checking both
  const variants = new Set();
  variants.add(clean);
  variants.add(clean.endsWith("/") ? clean.slice(0, -1) : clean + "/");

  for (const v of variants) {
    const rel = v.replace(/^\//, "");
    const dirIndex = path.join(webRoot, rel, "index.html");
    if (fs.existsSync(dirIndex)) return true;

    // Also allow direct file output (/something.html) if it exists
    const direct = path.join(webRoot, rel);
    if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return true;
  }

  return false;
}

function verifyInternalLinksExist(webRoot, samplePages) {
  // Read sample pages and verify their internal links exist in dist
  for (const s of samplePages) {
    const p = path.join(webRoot, s.file);
    const html = readFileSafe(p);
    const hrefs = extractHrefs(html);

    for (const href of hrefs) {
      if (isSkippableHref(href)) continue;

      const pathname = toPathname(href);
      if (!pathname) continue;

      // Allow known non-html endpoints and any internal assets
      const ok = pathExistsForRoute(webRoot, pathname);
      assert(ok, `internal link exists from ${s.label}: ${pathname}`);
    }
  }
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

  // ensure no other sitemap lines point somewhere else (strict)
  const bad = sitemapLines.filter(
    (l) => l.toLowerCase() !== expectedSitemapLine.toLowerCase()
  );
  assert(bad.length === 0, "robots.txt has no unexpected Sitemap: lines");

  // ---- Verify special-character redirect rules exist ----
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

  // ---- NEW: verify internal links from sample pages resolve to real output ----
  verifyInternalLinksExist(webRoot, samples);

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
