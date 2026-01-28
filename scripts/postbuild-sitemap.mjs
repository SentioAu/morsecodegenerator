import fs from "node:fs";
import path from "node:path";

const SITE = String(process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

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

  if (rel === "index.html") return "/";
  if (!rel.endsWith("/index.html")) return null;

  const dir = rel.replace(/\/index\.html$/, "");
  return `/${dir}/`;
}

function isExcluded(urlPath) {
  if (!urlPath) return true;

  if (urlPath === "/404/" || urlPath === "/404.html") return true;
  if (urlPath.startsWith("/assets/")) return true;
  if (urlPath.startsWith("/_astro/")) return true;

  if (urlPath === "/sitemap.xml") return true;
  if (urlPath === "/sitemap-index.xml") return true;
  if (urlPath === "/sitemap-0.xml") return true;

  if (/^\/[a-z]-in-morse-code\/$/i.test(urlPath)) return true;
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

  return (
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html) ||
    /<meta\s+[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["'][^>]*>/i.test(html)
  );
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
    return new Date(mtime).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function buildSitemapXml(entries) {
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  for (const e of entries) {
    const loc = escapeXml(e.loc);
    const lastmod = e.lastmod ? escapeXml(e.lastmod) : "";
    if (lastmod) lines.push(`  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`);
    else lines.push(`  <url><loc>${loc}</loc></url>`);
  }

  lines.push(`</urlset>`);
  return lines.join("\n") + "\n";
}

function writeIfPossible(outPath, xml) {
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, xml, "utf8");
    return true;
  } catch {
    return false;
  }
}

function main() {
  const dist = path.resolve("dist");
  if (!fs.existsSync(dist)) {
    console.error(`[postbuild-sitemap] dist not found: ${dist}`);
    process.exit(1);
  }

  // Always build entries from dist (Cloudflare Pages serves dist/)
  const files = walk(dist);

  const map = new Map();

  for (const f of files) {
    if (!f.endsWith(".html")) continue;

    const urlPath = toUrlPath(dist, f);
    if (!urlPath) continue;
    if (isExcluded(urlPath)) continue;

    const html = readFileSafe(f);
    if (isNoindexHtml(html)) continue;

    const loc = `${SITE}${urlPath}`;
    const lastmod = toLastmod(f);
    map.set(loc, { loc, lastmod });
  }

  const entries = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc, "en"));
  const sitemapXml = buildSitemapXml(entries);

  const outA = path.join(dist, "sitemap.xml");
  const okA = writeIfPossible(outA, sitemapXml);

  // Also write to dist/public if it exists (some setups create it)
  const distPublic = path.join(dist, "public");
  const outB = path.join(distPublic, "sitemap.xml");
  const okB = fs.existsSync(distPublic) ? writeIfPossible(outB, sitemapXml) : false;

  console.log(`[postbuild-sitemap] SITE=${SITE}`);
  console.log(`[postbuild-sitemap] URLs=${entries.length}`);
  console.log(`[postbuild-sitemap] Wrote: ${okA ? outA : "(failed)"}${okB ? ` and ${outB}` : ""}`);
}

main();
