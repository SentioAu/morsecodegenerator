import fs from "node:fs";
import path from "node:path";

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
  // canonical
  const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html);
  assert(hasCanonical, `${label}: canonical tag exists`);

  // ensure canonical has an href
  const hrefMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  assert(!!hrefMatch && !!hrefMatch[1], `${label}: canonical href exists`);

  // optional: encourage trailing slash canonical (your Layout enforces this)
  if (hrefMatch?.[1]) {
    const href = String(hrefMatch[1]);
    // allow query canonicals if any, but your canonical should generally end with /
    const ok = href.includes("?") ? true : href.endsWith("/");
    assert(ok, `${label}: canonical ends with "/" (or contains "?")`);
  }

  // h1
  const hasH1 = /<h1(\s|>)/i.test(html);
  assert(hasH1, `${label}: <h1> exists`);
}

function main() {
  const webRoot = detectWebRoot();

  mustExist(webRoot, "build output directory");
  mustExist(path.join(webRoot, "index.html"), "homepage (index.html)");
  mustExist(path.join(webRoot, "robots.txt"), "robots.txt");
  mustExist(path.join(webRoot, "sitemap.xml"), "sitemap.xml");

  // robots should reference sitemap.xml (absolute OR relative accepted)
  const robotsPath = path.join(webRoot, "robots.txt");
  const robots = readFileSafe(robotsPath);
  const hasSitemapLine =
    /Sitemap:\s*\S+/i.test(robots) && (robots.includes("/sitemap.xml") || robots.includes("sitemap.xml"));
  assert(hasSitemapLine, "robots.txt references sitemap.xml");

  // ---- Representative page checks (canonical + h1) ----
  // Keep this list small but meaningful; add more later if you want.
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

  // ---- Ensure legacy duplicate families are NOT built ----
  // Old: /a-in-morse-code/ => must not exist in output after consolidation
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i); // a-z
    const legacyDir = path.join(webRoot, `${ch}-in-morse-code`);
    // In Astro trailingSlash "always" builds as folder/index.html
    mustNotExist(path.join(legacyDir, "index.html"), `legacy letter page /${ch}-in-morse-code/`);
  }

  // Old: /0-in-morse-code/ etc => must not exist
  for (let d = 0; d <= 9; d++) {
    const legacyDir = path.join(webRoot, `${d}-in-morse-code`);
    mustNotExist(path.join(legacyDir, "index.html"), `legacy digit page /${d}-in-morse-code/`);
  }

  console.log("✅ verify-build: all checks passed");
}

main();
