/**
 * IndexNow auto-ping
 * ----------------------------------------------------------------
 * Reads the freshly-built sitemap and POSTs every URL to the
 * IndexNow API endpoint. Bing, Yandex, Naver, Seznam, and Yep all
 * share IndexNow submissions, so a single ping reaches all of them.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * Behavior
 * - Discovers the active IndexNow key by scanning public/ for a
 *   `<key>.txt` file whose content equals its filename stem. (The
 *   protocol requires this file to be served at the site root.)
 * - Skips the ping entirely if:
 *     a) we can't find a key file, or
 *     b) SITE_URL points to a non-production host (preview branches
 *        on Cloudflare Pages — they would tell Bing "morsecodegenerator
 *        is now at <hash>.morsecodegenerator.pages.dev" which is wrong),
 *     c) env var INDEXNOW_DISABLE is set.
 * - Pings the canonical endpoint api.indexnow.org. If it fails the
 *   build still succeeds — we don't want a flaky search engine taking
 *   down a deploy.
 */
import fs from "node:fs";
import path from "node:path";

const SITE = String(
  process.env.SITE_URL || "https://morsecodegenerator.com"
).replace(/\/$/, "");

const PROD_HOST = "morsecodegenerator.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10000; // IndexNow per-request cap

function log(...args) {
  console.log("[indexnow-ping]", ...args);
}

function findKeyFile() {
  const dir = path.resolve("public");
  if (!fs.existsSync(dir)) return null;
  for (const f of fs.readdirSync(dir)) {
    if (!/^[a-f0-9]{8,128}\.txt$/i.test(f)) continue;
    const full = path.join(dir, f);
    try {
      const content = fs.readFileSync(full, "utf8").trim();
      const stem = f.replace(/\.txt$/, "");
      if (content === stem) return { stem, file: f };
    } catch {
      /* ignore */
    }
  }
  return null;
}

function extractUrlsFromSitemap() {
  // Prefer the freshly built dist sitemap.
  const candidates = [
    path.resolve("dist/sitemap.xml"),
    path.resolve("dist/public/sitemap.xml"),
  ];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) return [];
  const xml = fs.readFileSync(file, "utf8");
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
}

async function ping(host, key, keyLocation, urlList) {
  const body = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      accept: "application/json",
    },
    body,
  });
  return { status: res.status, ok: res.ok, statusText: res.statusText };
}

async function main() {
  if (process.env.INDEXNOW_DISABLE) {
    log("INDEXNOW_DISABLE set — skipping ping.");
    return;
  }

  const host = new URL(SITE).host;
  if (host !== PROD_HOST) {
    log(`SITE_URL host (${host}) is not the canonical production host (${PROD_HOST}); skipping ping.`);
    return;
  }

  // Cloudflare Pages exposes CF_PAGES=1 and CF_PAGES_BRANCH=<branch>. Only
  // ping when we're building from the production branch (main). Preview
  // branches share the same SITE_URL default, so without this guard every
  // PR preview would tell Bing the site moved.
  if (process.env.CF_PAGES === "1" && process.env.CF_PAGES_BRANCH !== "main") {
    log(
      `Cloudflare Pages preview build (branch=${process.env.CF_PAGES_BRANCH}); skipping ping.`
    );
    return;
  }

  const keyInfo = findKeyFile();
  if (!keyInfo) {
    log("No IndexNow key file found in public/ (expected <hex>.txt with matching content). Skipping ping.");
    return;
  }
  const key = keyInfo.stem;
  const keyLocation = `${SITE}/${keyInfo.file}`;

  const urls = extractUrlsFromSitemap();
  if (!urls.length) {
    log("Sitemap has no URLs to submit. Skipping ping.");
    return;
  }

  // Chunk if we ever go over the spec'd cap.
  const chunks = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    chunks.push(urls.slice(i, i + MAX_URLS_PER_REQUEST));
  }

  log(`Pinging IndexNow for ${urls.length} URLs in ${chunks.length} request(s)…`);
  for (const [i, batch] of chunks.entries()) {
    try {
      const r = await ping(host, key, keyLocation, batch);
      log(`  batch ${i + 1}/${chunks.length}: ${r.status} ${r.statusText || ""}`.trim());
    } catch (e) {
      log(`  batch ${i + 1}/${chunks.length}: error — ${e?.message || e}`);
    }
  }
  log("Done. (Build succeeds regardless of IndexNow response.)");
}

main().catch((e) => {
  log("Fatal:", e?.message || e);
  // Don't fail the build for an external service hiccup.
  process.exit(0);
});
