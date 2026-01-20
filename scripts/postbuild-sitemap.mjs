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

// Ensure dist/robots.txt has the correct Sitemap line (keep existing rules)
try {
  let robots = exists(robotsPath)
    ? readText(robotsPath)
    : `User-agent: *\nAllow: /\n`;

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
