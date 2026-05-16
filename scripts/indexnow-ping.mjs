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
import { execFileSync } from "node:child_process";
import { sourcesForUrl } from "./url-sources.mjs";

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

// --------------------------------------------------------------------
// Granular ping selection
//
// IndexNow doesn't penalise re-submitting unchanged URLs but it consumes
// the daily quota and feels noisy to log readers. We only ping URLs
// whose underlying source files were touched by the HEAD commit — i.e.
// the URLs that actually changed in this deploy.
//
// Behaviour:
//   - If the previous commit (HEAD~1) can't be determined (first commit,
//     shallow clone, no .git), we treat every URL as "fresh" and ping
//     the whole sitemap. Safer than silently skipping submissions.
//   - INDEXNOW_FULL=1 forces the legacy behaviour (ping everything)
//     for manual full-resubmits.
// --------------------------------------------------------------------

function repoRoot() {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return process.cwd();
  }
}

function previousCommitTime(root) {
  try {
    return execFileSync(
      "git",
      ["-C", root, "log", "-1", "--format=%cI", "HEAD~1"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
  } catch {
    return null;
  }
}

function lastTouchedAt(root, files) {
  const existing = files
    .map((f) => path.resolve(root, f))
    .filter((f) => fs.existsSync(f));
  if (existing.length === 0) return null;
  try {
    const out = execFileSync(
      "git",
      ["-C", root, "log", "-1", "--format=%cI", "--", ...existing],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

// Returns the subset of `urls` whose sources were touched after `since`.
// URLs with no known source mapping are passed through (we default to
// "ping it" because the alternative is dropping URLs silently).
function filterToChangedUrls(urls, since, root) {
  if (!since) return urls; // first commit or no history -> ping all

  // Compare as epoch milliseconds, not raw `%cI` strings. Different
  // commits often carry different timezone offsets ("+00:00" vs
  // "+03:00") so lexicographic ordering of the ISO strings can flip
  // the wrong way and drop URLs that genuinely changed in this deploy.
  const sinceMs = Date.parse(since);
  if (Number.isNaN(sinceMs)) return urls; // unparseable cutoff -> safe default

  return urls.filter((u) => {
    let pathOnly;
    try {
      pathOnly = new URL(u).pathname;
    } catch {
      return true;
    }
    const sources = sourcesForUrl(pathOnly);
    if (sources.length === 0) return true; // unknown source -> safe default
    const lastTouched = lastTouchedAt(root, sources);
    if (!lastTouched) return true; // git lookup failed -> safe default
    const lastTouchedMs = Date.parse(lastTouched);
    if (Number.isNaN(lastTouchedMs)) return true; // unparseable -> safe default
    return lastTouchedMs > sinceMs;
  });
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

  // Default-deny: only ping when we have an explicit production signal.
  // Acceptable signals are:
  //   1) Cloudflare Pages production deploy:
  //        CF_PAGES === "1" && CF_PAGES_BRANCH === "main"
  //   2) Manual maintainer opt-in:
  //        INDEXNOW_FORCE === "1"
  // Any local `npm run build` (no env vars set) will therefore *not*
  // ping IndexNow, which is the safe default — avoids developer or CI
  // builds spamming IndexNow with submissions of the prod URL.
  const isProdCloudflareDeploy =
    process.env.CF_PAGES === "1" && process.env.CF_PAGES_BRANCH === "main";
  const isManualOptIn = process.env.INDEXNOW_FORCE === "1";

  if (!isProdCloudflareDeploy && !isManualOptIn) {
    if (process.env.CF_PAGES === "1") {
      log(
        `Cloudflare Pages preview build (branch=${process.env.CF_PAGES_BRANCH}); skipping ping.`
      );
    } else {
      log(
        "Non-production environment (no CF_PAGES=1+main, no INDEXNOW_FORCE=1); skipping ping. " +
          "Set INDEXNOW_FORCE=1 to submit from a maintainer machine."
      );
    }
    return;
  }

  const host = new URL(SITE).host;
  if (host !== PROD_HOST) {
    log(
      `SITE_URL host (${host}) is not the canonical production host (${PROD_HOST}); skipping ping.`
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

  const allUrls = extractUrlsFromSitemap();
  if (!allUrls.length) {
    log("Sitemap has no URLs to submit. Skipping ping.");
    return;
  }

  // Granular selection: ping only URLs whose source files were touched
  // since the previous commit. INDEXNOW_FULL=1 forces a full resubmit.
  let urls;
  if (process.env.INDEXNOW_FULL === "1") {
    log(`INDEXNOW_FULL=1 — submitting all ${allUrls.length} URLs.`);
    urls = allUrls;
  } else {
    const root = repoRoot();
    const since = previousCommitTime(root);
    if (!since) {
      log(`No HEAD~1 (first commit or shallow clone) — submitting all ${allUrls.length} URLs.`);
      urls = allUrls;
    } else {
      urls = filterToChangedUrls(allUrls, since, root);
      log(`Changed URLs since ${since}: ${urls.length} of ${allUrls.length}.`);
    }
  }

  if (!urls.length) {
    log("No URLs changed this deploy. Skipping ping.");
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
