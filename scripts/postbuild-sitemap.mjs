import fs from "node:fs";
import path from "node:path";

const SITE = String(process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

/**
 * Detect Cloudflare Pages style output (dist/public) vs plain dist.
 */
function detectWebRoot() {
  const dist = path.resolve("dist");
  const distPublic = path.join(dist, "public");
  if (fs.existsSync(distPublic) && fs.statSync(distPublic).isDirectory()) return distPublic;
  return dist;
}

function walk(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else out.push(full);
    }
  }
  return out;
}

function toUrlPath(webRoot, filePath) {
  const rel = path.relative(webRoot, filePath).replace(/\\/g, "/");

  // Only index.html pages => trailingSlash canonical
  if (rel === "index.html") return "/";
  if (!rel.endsWith("/index.html")) return null;

  const dir = rel.replace(/\/index\.html$/, "");
  return `/${dir}/`;
}

function isExcluded(urlPath) {
  if (!urlPath) return true;

  // core excludes
  if (urlPath === "/404/" || urlPath === "/404.html") return true;
  if (urlPath.startsWith("/assets/")) return true;
  if (urlPath.startsWith("/_astro/")) return true;

  // sitemap variants (we generate a single sitemap.xml)
  if (urlPath === "/sitemap.xml") return true;
  if (urlPath === "/sitemap-index.xml") return true;
  if (urlPath === "/sitemap-0.xml") return true;

  // exclude duplicate URL families you redirect away
  // letters old family: /a-in-morse-code/
  if (/^\/[a-z]-in-morse-code\/$/i.test(urlPath)) return true;
  // digits old family: /0-in-morse-code/
  if (/^\/\d+-in-morse-code\/$/.test(urlPath)) return true;

  return false;
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function isNoindexHtml(html) {
  if (!html) return false;

  // detect common noindex patterns
  // <meta name="robots" content="noindex,follow">
  // <meta content="noindex" name="robots">
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html) ||
         /<meta\s+[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["'][^>]*>/i.test(html);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(filePath) {
  try {
    const mtime = fs.statSync(filePath).mtime;
    // Sitemap accepts YYYY-MM-DD or full datetime; keep it simple + stable:
    return new Date(mtime).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function buildSitemapXml(entries) {
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  // ✅ Correct namespace must be http (spec)
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  for (const e of entries) {
    const loc = escapeXml(e.loc);
    const lastmod = e.lastmod ? escapeXml(e.lastmod) : "";
    if (lastmod) {
      lines.push(`  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`);
    } else {
      lines.push(`  <url><loc>${loc}</loc></url>`);
    }
  }

  lines.push(`</urlset>`);
  return lines.join("\n") + "\n";
}

function main() {
  const webRoot = detectWebRoot();

  if (!fs.existsSync(webRoot)) {
    console.error(`[postbuild-sitemap] Web root not found: ${webRoot}`);
    process.exit(1);
  }

  const files = walk(webRoot);

  // url -> { loc, lastmod }
  const map = new Map();

  for (const f of files) {
    if (!f.endsWith(".html")) continue;

    const urlPath = toUrlPath(webRoot, f);
    if (!urlPath) continue;
    if (isExcluded(urlPath)) continue;

    // ✅ Systemic: skip noindex pages (prevents invalid slug pages from entering sitemap)
    const html = readFileSafe(f);
    if (isNoindexHtml(html)) continue;

    const loc = `${SITE}${urlPath}`;
    const lastmod = toLastmod(f);

    map.set(loc, { loc, lastmod });
  }

  const entries = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc, "en"));

  const sitemapXml = buildSitemapXml(entries);

  const outPath = path.join(webRoot, "sitemap.xml");
  fs.writeFileSync(outPath, sitemapXml, "utf8");

  console.log(`[postbuild-sitemap] SITE=${SITE}`);
  console.log(`[postbuild-sitemap] Wrote ${entries.length} URLs -> ${outPath}`);
}

main();
