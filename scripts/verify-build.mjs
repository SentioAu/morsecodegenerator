import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

function detectWebRoot() {
  // Cloudflare Pages serves dist/
  return path.resolve("dist");
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
  const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html);
  assert(hasCanonical, `${label}: canonical tag exists`);

  const hrefMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  assert(!!hrefMatch && !!hrefMatch[1], `${label}: canonical href exists`);

  if (hrefMatch?.[1]) {
    const href = String(hrefMatch[1]);
    const ok = href.includes("?") ? true : href.endsWith("/");
    assert(ok, `${label}: canonical ends with "/" (or contains "?")`);
  }

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

function main() {
  const webRoot = detectWebRoot();

  mustExist(webRoot, "build output directory");
  mustExist(path.join(webRoot, "index.html"), "homepage (index.html)");
  mustExist(path.join(webRoot, "robots.txt"), "robots.txt");

  // sitemap can be either dist/sitemap.xml or dist/public/sitemap.xml
  const sitemapA = path.join(webRoot, "sitemap.xml");
  const sitemapB = path.join(webRoot, "public", "sitemap.xml");
  assert(fs.existsSync(sitemapA) || fs.existsSync(sitemapB), "sitemap.xml exists (dist or dist/public)");

  const redirectsPath = path.join(webRoot, "_redirects");
  mustExist(redirectsPath, "_redirects");

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

  const bad = sitemapLines.filter((l) => l.toLowerCase() !== expectedSitemapLine.toLowerCase());
  assert(bad.length === 0, "robots.txt has no unexpected Sitemap: lines");

  const redirectsRaw = readFileSafe(redirectsPath);
  const redirectLines = normalizeLines(redirectsRaw);

  const exclaimTo = "/exclamation-in-morse-code/";
  const apostTo = "/apostrophe-in-morse-code/";

  assert(redirectsContainRule(redirectLines, "/morse-code/%21", exclaimTo), `_redirects contains: /morse-code/%21 -> ${exclaimTo}`);
  assert(redirectsContainRule(redirectLines, "/morse-code/%21/", exclaimTo), `_redirects contains: /morse-code/%21/ -> ${exclaimTo}`);

  assert(redirectsContainRule(redirectLines, "/morse-code/%27", apostTo), `_redirects contains: /morse-code/%27 -> ${apostTo}`);
  assert(redirectsContainRule(redirectLines, "/morse-code/%27/", apostTo), `_redirects contains: /morse-code/%27/ -> ${apostTo}`);

  const samples = [
    { file: "index.html", label: "/" },
    { file: path.join("translate", "index.html"), label: "/translate/" },
    { file: path.join("morse-code", "numbers", "index.html"), label: "/morse-code/numbers/" },
    { file: path.join("morse-code", "words", "index.html"), label: "/morse-code/words/" },
    { file: path.join("phrases", "index.html"), label: "/phrases/" },
  ];

  for (const s of samples) {
    const p = path.join(webRoot, s.file);
    mustExist(p, `page ${s.label}`);
    const html = readFileSafe(p);
    verifyCanonicalAndH1(html, `page ${s.label}`);
  }

  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i);
    const legacyDir = path.join(webRoot, `${ch}-in-morse-code`);
    mustNotExist(path.join(legacyDir, "index.html"), `legacy letter page /${ch}-in-morse-code/`);
  }

  for (let d = 0; d <= 9; d++) {
    const legacyDir = path.join(webRoot, `${d}-in-morse-code`);
    mustNotExist(path.join(legacyDir, "index.html"), `legacy digit page /${d}-in-morse-code/`);
  }

  verifyAffiliateTags(webRoot);

  console.log("✅ verify-build: all checks passed");
}

/**
 * Affiliate tag guard — fails the build on a stray Amazon tracking ID.
 *
 * The owner runs several Amazon Associates sites from one account
 * (espressofit-20, playersb, …). A tracking ID from another project pasted
 * in here would silently send this site's commissions to the wrong place,
 * and nothing else in the pipeline would notice — the link still works, the
 * page still builds, the sale just lands somewhere else.
 *
 * So the allowlist is explicit: only IDs belonging to THIS site may appear
 * in the build. Adding a new placement means adding its ID here too, which
 * is the point — it forces the decision to be deliberate.
 *
 * Also catches the opposite failure: an Amazon link with no tag at all,
 * which earns nothing.
 */
function verifyAffiliateTags(webRoot) {
  const ALLOWED = new Set([
    "mcg0d2-20",   // main / legacy
    "mcgtool-20",  // /keyer/, /practice/
    "mcggear-20",  // /gear/*
    "mcgref-20",   // reference hubs
    "mcgword-20",  // word / gift cluster
  ]);

  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".html")) files.push(full);
    }
  })(webRoot);

  const foreign = new Map();
  const untagged = [];
  let total = 0;

  for (const f of files) {
    const html = readFileSafe(f);
    if (!html.includes("amazon.com")) continue;
    const rel = "/" + path.relative(webRoot, f).replace(/index\.html$/, "");
    for (const raw of html.match(/https:\/\/www\.amazon\.com\/[^"'\s<>]+/g) || []) {
      const url = raw.replace(/&amp;/g, "&");
      total += 1;
      const m = url.match(/[?&]tag=([A-Za-z0-9_-]+)/);
      if (!m) {
        untagged.push(`${rel}  ${url.slice(0, 90)}`);
      } else if (!ALLOWED.has(m[1])) {
        if (!foreign.has(m[1])) foreign.set(m[1], []);
        foreign.get(m[1]).push(rel);
      }
    }
  }

  if (foreign.size > 0) {
    console.error("❌ FOREIGN Amazon tracking ID in build — commissions would go to the wrong account:");
    for (const [tag, pages] of foreign) {
      console.error(`   tag=${tag} on ${pages.length} page(s), e.g. ${pages.slice(0, 3).join(", ")}`);
    }
    console.error(`   Allowed for this site: ${[...ALLOWED].join(", ")}`);
    process.exit(1);
  }

  if (untagged.length > 0) {
    console.error(`❌ ${untagged.length} Amazon link(s) with NO tracking tag — these earn nothing:`);
    for (const u of untagged.slice(0, 5)) console.error(`   ${u}`);
    process.exit(1);
  }

  console.log(`✅ affiliate tags: ${total} Amazon links, all tagged, no foreign tracking IDs`);
}

main();
