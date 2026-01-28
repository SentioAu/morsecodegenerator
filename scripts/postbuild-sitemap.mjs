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

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(urls) {
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  // ✅ Correct namespace must be http (spec)
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
  for (const u of urls) {
    lines.push(`  <url><loc>${escapeXml(u)}</loc></url>`);
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

  const urlSet = new Set();

  for (const f of files) {
    if (!f.endsWith(".html")) continue;

    const p = toUrlPath(webRoot, f);
    if (!p) continue;
    if (isExcluded(p)) continue;

    urlSet.add(`${SITE}${p}`);
  }

  const urls = Array.from(urlSet).sort((a, b) => a.localeCompare(b, "en"));

  const sitemapXml = buildSitemapXml(urls);

  const outPath = path.join(webRoot, "sitemap.xml");
  fs.writeFileSync(outPath, sitemapXml, "utf8");

  console.log(`[postbuild-sitemap] SITE=${SITE}`);
  console.log(`[postbuild-sitemap] Wrote ${urls.length} URLs -> ${outPath}`);
}

main();
