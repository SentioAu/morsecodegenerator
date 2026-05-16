import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { sourcesForUrl } from "./url-sources.mjs";

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

// File-mtime fallback. Used when git history isn't available (shallow
// clone, no .git directory, etc.) or for files git doesn't know about.
function mtimeLastmod(filePath) {
  try {
    const mtime = fs.statSync(filePath).mtime;
    return new Date(mtime).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

// -------------------------------------------------------------------
// git-based lastmod
//
// For each URL we ask git for the most recent commit that touched any
// of the page's *content* source files — never Layout.astro, because
// a Layout change would otherwise invalidate every URL's lastmod and
// trigger a full IndexNow resubmit of the whole site. Including only
// the URL's own content files gives Google a freshness signal that
// reflects when the URL's content actually changed, not when the build
// happened to run.
//
// The mapping below is conservative: when a URL's source is genuinely
// unknown (deep dynamic routes, generated pages) we fall back to the
// file mtime of the built HTML.
// -------------------------------------------------------------------

// Resolve absolute repo root for `git -C` invocations. Falls back to
// process.cwd() which is correct under `npm run build`.
const REPO_ROOT = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return process.cwd();
  }
})();

function gitLastmod(files) {
  const existing = files
    .map((f) => path.resolve(REPO_ROOT, f))
    .filter((f) => fs.existsSync(f));
  if (existing.length === 0) return "";
  try {
    // %cs is committer date in YYYY-MM-DD (strict ISO short form). -1
    // returns only the newest commit across the listed paths.
    const out = execFileSync(
      "git",
      ["-C", REPO_ROOT, "log", "-1", "--format=%cs", "--", ...existing],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out || "";
  } catch {
    return "";
  }
}

// Map a public URL path to the source files that determine its content.
// URL -> source-file mapping lives in scripts/url-sources.mjs so both
// the sitemap and IndexNow scripts share one source of truth.

function resolveLastmod(urlPath, htmlFilePath) {
  const sources = sourcesForUrl(urlPath);
  if (sources.length > 0) {
    const git = gitLastmod(sources);
    if (git) return git;
  }
  return mtimeLastmod(htmlFilePath);
}

// URL importance heuristics (priority + changefreq)
function classifyUrl(urlPath) {
  // urlPath looks like "/", "/translate/", "/morse-code/a/", etc.
  const p = urlPath.replace(/\/+$/, "/") || "/";

  // Hubs (highest)
  if (p === "/") return { priority: "1.0", changefreq: "weekly" };
  if (p === "/translate/") return { priority: "0.95", changefreq: "weekly" };
  if (p === "/practice/") return { priority: "0.90", changefreq: "weekly" };
  if (p === "/morse-code/") return { priority: "0.90", changefreq: "weekly" };
  if (p === "/phrases/") return { priority: "0.85", changefreq: "weekly" };
  if (p === "/chart/") return { priority: "0.85", changefreq: "monthly" };

  // Reference clusters
  if (/^\/morse-code\/(numbers|punctuation|words)\/$/.test(p)) {
    return { priority: "0.80", changefreq: "monthly" };
  }
  if (/^\/(prosigns|abbreviations|q-codes|history|faq|api|embed)\/$/.test(p)) {
    return { priority: "0.80", changefreq: "monthly" };
  }

  // Per-letter / per-digit pages
  if (/^\/morse-code\/[a-z0-9]\/$/.test(p)) {
    return { priority: "0.70", changefreq: "yearly" };
  }

  // Per-phrase pages
  if (/^\/phrases\/[a-z0-9-]+\/$/.test(p)) {
    return { priority: "0.65", changefreq: "monthly" };
  }

  // SEO word pages /<slug>-in-morse-code/
  if (/^\/[a-z0-9-]+-in-morse-code\/$/.test(p)) {
    return { priority: "0.60", changefreq: "monthly" };
  }

  // About / contact / legal
  if (/^\/(about|contact|privacy|terms)\/$/.test(p)) {
    return { priority: "0.40", changefreq: "yearly" };
  }

  return { priority: "0.50", changefreq: "monthly" };
}

function buildSitemapXml(entries) {
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`);
  lines.push(`        xmlns:xhtml="http://www.w3.org/1999/xhtml"`);
  lines.push(`        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`);

  // Single canonical OG image per page (we ship the same one site-wide).
  const ogImageUrl = `${SITE}/og-image.svg`;
  const ogImageCaption = "MorseCodeGenerator.com — the hub of Morse code";

  for (const e of entries) {
    const loc = escapeXml(e.loc);
    const lastmod = e.lastmod ? escapeXml(e.lastmod) : "";
    const { priority, changefreq } = classifyUrl(e.path || "/");

    lines.push(`  <url>`);
    lines.push(`    <loc>${loc}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);
    // Image entry helps Google Image search index the OG card per URL.
    lines.push(`    <image:image>`);
    lines.push(`      <image:loc>${escapeXml(ogImageUrl)}</image:loc>`);
    lines.push(`      <image:caption>${escapeXml(ogImageCaption)}</image:caption>`);
    lines.push(`    </image:image>`);
    lines.push(`  </url>`);
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
    const lastmod = resolveLastmod(urlPath, f);
    map.set(loc, { loc, lastmod, path: urlPath });
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
