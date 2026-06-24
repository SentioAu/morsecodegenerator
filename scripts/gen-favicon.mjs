// gen-favicon.mjs — render public/favicon.svg into a multi-size
// public/favicon.ico (16/32/48 px, PNG-compressed entries).
//
// Why: the SVG favicon covers modern browsers, but a classic favicon.ico
// is still requested by older browsers, some RSS readers, link unfurlers,
// and crawlers. This bakes one from the same source SVG so the two never
// drift. Re-run after changing favicon.svg:  node scripts/gen-favicon.mjs
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ROOT = path.resolve(".");
const SVG = fs.readFileSync(path.join(ROOT, "public/favicon.svg"), "utf8");
const OUT = path.join(ROOT, "public/favicon.ico");
const SIZES = [16, 32, 48];

function pngFor(size) {
  const resvg = new Resvg(SVG, { fitTo: { mode: "width", value: size } });
  return resvg.render().asPng();
}

// Build an ICO that embeds a PNG per size (PNG-in-ICO is supported by all
// current browsers and is far smaller than BMP entries).
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(images.length, 4); // image count

  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  const datas = [];
  images.forEach((img, i) => {
    const b = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 0); // width (0 = 256)
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 1); // height
    dir.writeUInt8(0, b + 2);  // palette colors
    dir.writeUInt8(0, b + 3);  // reserved
    dir.writeUInt16LE(1, b + 4);   // color planes
    dir.writeUInt16LE(32, b + 6);  // bits per pixel
    dir.writeUInt32LE(img.data.length, b + 8);  // size of image data
    dir.writeUInt32LE(offset, b + 12);          // offset of image data
    offset += img.data.length;
    datas.push(img.data);
  });

  return Buffer.concat([header, dir, ...datas]);
}

const images = SIZES.map((size) => ({ size, data: pngFor(size) }));
fs.writeFileSync(OUT, buildIco(images));
console.log(`wrote ${OUT} (${SIZES.join("/")}px, ${fs.statSync(OUT).size} bytes)`);
