import fs from "node:fs";
import path from "node:path";

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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const root = process.cwd();
const dist = path.join(root, "dist");
const out = path.join(dist, "sitemap.xml");

if (!exists(dist)) {
  console.log("[postbuild-sitemap] dist/ not found — skipping");
  process.exit(0);
}

// Astro sitemap plugin may output:
// - sitemap.xml
// - sitemap-index.xml (with sitemap-0.xml, etc.)
// We want a stable public URL: /sitemap.xml
const candidates = [
  path.join(dist, "sitemap.xml"),
  path.join(dist, "sitemap-index.xml"),
  path.join(dist, "sitemap-0.xml"),
];

let picked = candidates.find(exists);

// If not found by expected names, pick the first file that looks like a sitemap.
if (!picked) {
  const files = fs.readdirSync(dist).filter((f) => f.toLowerCase().includes("sitemap"));
  const prefer = ["sitemap.xml", "sitemap-index.xml", "sitemap-0.xml"];
  const best = prefer.map((n) => files.find((f) => f === n)).find(Boolean);
  picked = best ? path.join(dist, best) : files[0] ? path.join(dist, files[0]) : null;
}

if (!picked) {
  console.log("[postbuild-sitemap] No sitemap files found in dist/ — skipping");
  process.exit(0);
}

// If sitemap.xml already exists, we're done.
if (path.basename(picked) === "sitemap.xml") {
  console.log("[postbuild-sitemap] sitemap.xml already present — OK");
  process.exit(0);
}

// Copy the picked file to dist/sitemap.xml
copyFile(picked, out);
console.log(`[postbuild-sitemap] Copied ${path.basename(picked)} -> sitemap.xml`);

// If we copied sitemap-index.xml, make sure its internal URLs still point to correct paths.
// (Usually they do, but this is a safety step if plugin ever outputs relative URLs.)
if (path.basename(picked) === "sitemap-index.xml") {
  const xml = readText(out);
  // No heavy rewriting — just ensure it contains "<sitemapindex" so we know it's index.
  if (!xml.includes("<sitemapindex")) {
    console.log("[postbuild-sitemap] Warning: copied file is not a sitemap index.");
  }
}

// Ensure robots.txt exists? (We won't create it here to avoid unintended behavior.)
