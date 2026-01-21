import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

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
function writeText(p, s) {
  fs.writeFileSync(p, s, "utf8");
}
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

const root = process.cwd();
const dist = path.join(root, "dist");
const outSitemap = path.join(dist, "sitemap.xml");
const robotsPath = path.join(dist, "robots.txt");

if (!exists(dist)) {
  console.log("[postbuild-sitemap] dist/ not found — skipping");
  process.exit(0);
}

// Astro sitemap plugin may output:
// - sitemap.xml
// - sitemap-index.xml (+ sitemap-0.xml, sitemap-1.xml...)
// - sitemap-0.xml (rare)
const candidates = [
  path.join(dist, "sitemap.xml"),
  path.join(dist, "sitemap-index.xml"),
  path.join(dist, "sitemap-0.xml"),
];

let picked = candidates.find(exists);

if (!picked) {
  const files = fs
    .readdirSync(dist)
    .filter((f) => f.toLowerCase().includes("sitemap") && f.toLowerCase().endsWith(".xml"));
  const prefer = ["sitemap.xml", "sitemap-index.xml", "sitemap-0.xml"];
  const best = prefer.map((n) => files.find((f) => f === n)).find(Boolean);
  picked = best ? path.join(dist, best) : files[0] ? path.join(dist, files[0]) : null;
}

if (!picked) {
  console.log("[postbuild-sitemap] No sitemap files found in dist/ — skipping");
} else {
  if (path.basename(picked) === "sitemap.xml") {
    console.log("[postbuild-sitemap] sitemap.xml already present — OK");
  } else {
    copyFile(picked, outSitemap);
    console.log(`[postbuild-sitemap] Copied ${path.basename(picked)} -> sitemap.xml`);
  }
}

/* ---------------------------------------------------------
   SEO QUALITY GATE: remove noindex pages from sitemap(s)
   - reads dist HTML pages and checks meta robots noindex
   - works for sitemap.xml urlset OR sitemap.xml sitemapindex
---------------------------------------------------------- */

function isSameOriginUrl(u) {
  try {
    const url = new URL(u);
    const site = new URL(SITE);
    return url.origin === site.origin;
  } catch {
    return false;
  }
}

function urlToPathname(u) {
  try {
    const url = new URL(u);
    return url.pathname || "/";
  } catch {
    // if it's already a pathname
    if (typeof u === "string" && u.startsWith("/")) return u;
    return null;
  }
}

// trailingSlash: "always" => pages are usually /x/ => dist/x/index.html
function pathnameToHtmlFile(pn) {
  const p = pn || "/";
  if (p === "/") return path.join(dist, "index.html");

  // If a sitemap accidentally includes /404.html etc.
  if (p.endsWith(".html")) return path.join(dist, p.replace(/^\//, ""));

  // Normalize to folder/index.html
  const folder = p.endsWith("/") ? p : `${p}/`;
  return path.join(dist, folder.replace(/^\//, ""), "index.html");
}

function htmlIsNoindex(html) {
  // Fast + robust enough for static output
  // Matches: <meta name="robots" content="noindex,...">
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function shouldExcludeUrl(loc) {
  if (!loc) return false;

  // only evaluate same-origin URLs; keep external URLs untouched
  if (!isSameOriginUrl(loc)) return false;

  const pn = urlToPathname(loc);
  if (!pn) return false;

  const htmlPath = pathnameToHtmlFile(pn);

  // If file missing => exclude (prevents 404s in sitemap)
  if (!exists(htmlPath)) return true;

  // Check noindex
  try {
    // Read only the first chunk typically enough (but read all is fine for small pages)
    const html = readText(htmlPath);
    return htmlIsNoindex(html);
  } catch {
    // If can't read, be conservative: exclude
    return true;
  }
}

function rewriteUrlsetXml(xmlText, fileLabel) {
  const openTagMatch = xmlText.match(/<urlset\b[^>]*>/i);
  const closeTagMatch = xmlText.match(/<\/urlset>/i);
  if (!openTagMatch || !closeTagMatch) return { changed: false, xml: xmlText };

  const openTag = openTagMatch[0];
  const urlBlocks = xmlText.match(/<url\b[^>]*>[\s\S]*?<\/url>/gi) || [];

  const kept = [];
  let removed = 0;

  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/i);
    const loc = locMatch ? locMatch[1].trim() : "";
    if (loc && shouldExcludeUrl(loc)) {
      removed += 1;
      continue;
    }
    kept.push(block);
  }

  const xmlDecl = xmlText.startsWith("<?xml") ? xmlText.match(/^<\?xml[^>]*\?>\s*/i)?.[0] || "" : "";
  const out =
    `${xmlDecl}${openTag}\n` +
    (kept.length ? kept.join("\n") + "\n" : "") +
    `</urlset>\n`;

  return { changed: removed > 0, removed, kept: kept.length, xml: out, fileLabel };
}

function parseIndexLocs(xmlText) {
  const isIndex = /<sitemapindex\b/i.test(xmlText);
  if (!isIndex) return null;
  const sitemapBlocks = xmlText.match(/<sitemap\b[^>]*>[\s\S]*?<\/sitemap>/gi) || [];
  const locs = [];
  for (const block of sitemapBlocks) {
    const locMatch = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/i);
    if (locMatch?.[1]) locs.push(locMatch[1].trim());
  }
  return locs;
}

function indexLocToLocalFile(loc) {
  // Usually loc is absolute: https://site/sitemap-0.xml
  // or relative: /sitemap-0.xml
  try {
    const u = new URL(loc);
    const pn = u.pathname || "";
    const base = path.basename(pn);
    return path.join(dist, base);
  } catch {
    if (loc.startsWith("/")) return path.join(dist, path.basename(loc));
    return path.join(dist, path.basename(loc));
  }
}

// 1) Always try filtering urlset sitemap.xml itself if it is urlset
// 2) If sitemap.xml is sitemapindex, filter each referenced sitemap file
try {
  if (exists(outSitemap)) {
    const sm = readText(outSitemap);

    if (/<urlset\b/i.test(sm)) {
      const res = rewriteUrlsetXml(sm, "sitemap.xml");
      if (res.changed) {
        writeText(outSitemap, res.xml);
        console.log(
          `[postbuild-sitemap] Filtered ${res.fileLabel}: removed ${res.removed}, kept ${res.kept}`
        );
      } else {
        console.log("[postbuild-sitemap] sitemap.xml filter: no changes");
      }
    } else if (/<sitemapindex\b/i.test(sm)) {
      const locs = parseIndexLocs(sm) || [];
      let totalRemoved = 0;
      let totalKept = 0;
      let touched = 0;

      for (const loc of locs) {
        const local = indexLocToLocalFile(loc);
        if (!exists(local)) continue;

        const childXml = readText(local);
        if (!/<urlset\b/i.test(childXml)) continue;

        const res = rewriteUrlsetXml(childXml, path.basename(local));
        if (res.changed) {
          writeText(local, res.xml);
          touched += 1;
          totalRemoved += res.removed;
          totalKept += res.kept;
          console.log(
            `[postbuild-sitemap] Filtered ${res.fileLabel}: removed ${res.removed}, kept ${res.kept}`
          );
        }
      }

      if (touched === 0) {
        console.log("[postbuild-sitemap] sitemap index filter: no child sitemaps changed");
      } else {
        console.log(
          `[postbuild-sitemap] sitemap index filter summary: changed ${touched} file(s), removed ${totalRemoved}, kept ${totalKept}`
        );
      }
    } else {
      console.log("[postbuild-sitemap] sitemap.xml is not urlset or index — skipping filter");
    }
  }
} catch (e) {
  console.log("[postbuild-sitemap] sitemap filter failed (non-fatal):", e?.message || e);
}

// Ensure dist/robots.txt has the correct Sitemap line (keep existing rules)
try {
  let robots = exists(robotsPath) ? readText(robotsPath) : `User-agent: *\nAllow: /\n`;

  // remove any existing Sitemap lines
  robots = robots
    .split(/\r?\n/)
    .filter((line) => !/^sitemap:/i.test(line.trim()))
    .join("\n")
    .trimEnd();

  // ensure it ends with newline then add Sitemap
  robots = `${robots}\n\nSitemap: ${SITE}/sitemap.xml\n`;
  writeText(robotsPath, robots);

  console.log("[postbuild-sitemap] robots.txt updated with Sitemap");
} catch (e) {
  console.log("[postbuild-sitemap] robots.txt update failed (non-fatal):", e?.message || e);
}
