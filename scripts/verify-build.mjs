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

function main() {
  const webRoot = detectWebRoot();

  mustExist(webRoot, "build output directory");
  mustExist(path.join(webRoot, "index.html"), "homepage (index.html)");
  mustExist(path.join(webRoot, "robots.txt"), "robots.txt");
  mustExist(path.join(webRoot, "sitemap.xml"), "sitemap.xml"); // ✅ enforce

  // sanity: robots should reference sitemap.xml
  const robots = fs.readFileSync(path.join(webRoot, "robots.txt"), "utf8");
  if (!robots.includes("Sitemap:") || !robots.includes("/sitemap.xml")) {
    console.error("❌ robots.txt does not reference /sitemap.xml");
    process.exit(1);
  }
  console.log("✅ robots.txt references /sitemap.xml");
}

main();
