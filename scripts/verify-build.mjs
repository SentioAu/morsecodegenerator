import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const mustContain = [
  { name: "canonical", re: /<link\s+rel=["']canonical["']/i },
  { name: "h1", re: /<h1[\s>]/i },
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error(`❌ Missing ${DIST}/ — build output directory not created.`);
  process.exit(1);
}

const files = walk(DIST);
if (!files.length) {
  console.error(`❌ No .html files found in ${DIST}/`);
  process.exit(1);
}

let ok = true;

for (const { name, re } of mustContain) {
  const missing = [];
  for (const f of files) {
    const html = fs.readFileSync(f, "utf8");
    if (!re.test(html)) missing.push(f);
  }
  if (missing.length) {
    ok = false;
    console.error(`\n❌ Missing ${name} in ${missing.length} HTML files. Examples:`);
    missing.slice(0, 10).forEach((m) => console.error(` - ${m}`));
  } else {
    console.log(`✅ ${name} found in all HTML files`);
  }
}

process.exit(ok ? 0 : 1);
