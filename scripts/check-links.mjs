// check-links.mjs — fail the build if any page in dist/ links to an
// internal path that doesn't exist in dist/.
//
// Scope: same-origin, path-absolute hrefs only ("/foo/"). External URLs,
// fragments, and query-only links are ignored. A target counts as present
// if it exists as a file, as <path>/index.html (trailingSlash:"always"),
// or as <path>.html.
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");

if (!fs.existsSync(DIST)) {
  console.error("[check-links] dist/ not found — run `astro build` first.");
  process.exit(1);
}

const pages = [];
const existing = new Set();

(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else {
      existing.add("/" + path.relative(DIST, full).split(path.sep).join("/"));
      if (name.endsWith(".html")) pages.push(full);
    }
  }
})(DIST);

const HREF_RE = /href="(\/[^"#?]*)/g;
const broken = new Map(); // url -> Set of referencing pages

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  for (const [, url] of html.matchAll(HREF_RE)) {
    if (url.startsWith("//")) continue; // protocol-relative external
    const bare = url.replace(/\/$/, "");
    const candidates = [
      url,
      `${bare}/index.html`,
      `${bare}.html`,
    ];
    if (!candidates.some((c) => existing.has(c))) {
      if (!broken.has(url)) broken.set(url, new Set());
      broken.get(url).add("/" + path.relative(DIST, page).split(path.sep).join("/"));
    }
  }
}

if (broken.size === 0) {
  console.log(`[check-links] ✅ no broken internal links across ${pages.length} pages`);
  process.exit(0);
}

for (const [url, refs] of broken) {
  const sample = [...refs].slice(0, 3).join(", ");
  console.error(`[check-links] ❌ ${url}  (linked from ${refs.size} page(s), e.g. ${sample})`);
}
console.error(`[check-links] ${broken.size} broken internal link target(s).`);
process.exit(1);
