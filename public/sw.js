/*
 * MorseCodeGenerator.com service worker
 * ---------------------------------------------------------------
 * Strategy
 *  - "App shell" assets (root, translator, decoder, practice, chart,
 *    morse.json, fonts proxy, brand assets, mcg-tool.js) are
 *    pre-cached on install so the first launch primes everything the
 *    user needs offline.
 *  - For Astro's content-hashed /_astro/* assets we use cache-first.
 *    These URLs are immutable; if they exist in the cache we never
 *    refetch.
 *  - For navigations and any other same-origin GETs we use
 *    stale-while-revalidate: return the cached copy immediately,
 *    refresh the cache in the background. If neither network nor
 *    cache works, fall back to /offline/.
 *  - Cross-origin requests (fonts, ads, analytics) bypass the SW.
 *  - The cache version is bumped on every release so old caches are
 *    purged automatically on activate.
 */
const VERSION = "mcg-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_URLS = [
  "/",
  "/translate/",
  "/decoder/",
  "/practice/",
  "/chart/",
  "/morse-code/",
  "/phrases/",
  "/faq/",
  "/offline/",
  "/morse.json",
  "/mcg-tool.js",
  "/favicon.svg",
  "/og-image.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll is atomic — if any one URL fails, install fails. We use
      // individual put() calls so a single 404 (e.g. a renamed route)
      // doesn't sink the whole install.
      await Promise.all(
        SHELL_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (res.ok) await cache.put(url, res);
          } catch (_) {
            /* ignore individual failures */
          }
        })
      );
      // Activate the new SW immediately so users get fresh logic without
      // waiting for all tabs to close.
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function isHtmlRequest(request) {
  if (request.mode === "navigate") return true;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Bypass: query-string variants of the translator (share links) and
  // anything looking like an admin/diagnostic route.
  if (url.search) return;

  // Astro's hashed asset bundle is immutable — cache-first forever.
  if (url.pathname.startsWith("/_astro/") || url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // /morse.json: network-first so updates propagate fast, but fall
  // back to cache for offline use.
  if (url.pathname === "/morse.json") {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML navigation: stale-while-revalidate with /offline/ fallback.
  if (isHtmlRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, "/offline/"));
    return;
  }

  // Other GETs (svg, json data files, etc.) — stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(request, null));
});

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    return new Response("", { status: 504, statusText: "offline" });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Try shell cache too (install pre-cached /morse.json).
    const shell = await caches.open(SHELL_CACHE);
    return (await shell.match(request)) || new Response("{}", {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }
}

async function staleWhileRevalidate(request, offlineFallback) {
  const cache = await caches.open(RUNTIME_CACHE);
  const shell = await caches.open(SHELL_CACHE);
  const cached = (await cache.match(request)) || (await shell.match(request));
  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone()).catch(() => {});
      return res;
    })
    .catch(() => null);

  if (cached) {
    refresh.catch(() => {});
    return cached;
  }
  const fresh = await refresh;
  if (fresh) return fresh;
  if (offlineFallback) {
    const fb = await shell.match(offlineFallback);
    if (fb) return fb;
  }
  return new Response("Offline. Please reconnect.", {
    status: 503,
    headers: { "content-type": "text/plain" },
  });
}
