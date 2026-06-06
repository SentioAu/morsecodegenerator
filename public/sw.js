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
 *  - For HTML navigations we use **network-first with a 2.5 s
 *    timeout** and an /offline/ fallback. This is the critical
 *    freshness setting: an active content site updates daily, and
 *    stale-while-revalidate (the previous strategy) showed every
 *    returning visitor yesterday's content first, then refreshed in
 *    the background. Network-first guarantees the freshest HTML
 *    whenever the network is healthy, with cache as a fallback for
 *    slow networks and offline mode.
 *  - /morse.json is also network-first so data updates propagate fast.
 *  - Cross-origin requests (fonts, ads, analytics) bypass the SW.
 *  - The cache version is bumped on every release so old caches are
 *    purged automatically on activate. Bumping the VERSION constant
 *    is also the canonical way to flush stale HTML for existing
 *    visitors after a logic change like the freshness fix above.
 */
const VERSION = "mcg-v4";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// HTML navigations get this long to win the race against the cache
// before we serve the (possibly older) cached entry. 2.5 s is enough
// to survive a 4G/3G hop on a cold cache; longer than that and the
// user would notice the delay.
const HTML_NETWORK_TIMEOUT_MS = 2500;

const SHELL_URLS = [
  "/",
  "/translate/",
  "/decoder/",
  "/practice/",
  "/flashcards/",
  "/timing-calculator/",
  "/chart/",
  "/cheat-sheet/",
  "/morse-code/",
  "/phrases/",
  "/faq/",
  "/disclosure/",
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

  // HTML navigations: network-first with a 2.5 s timeout and an
  // /offline/ fallback. This is the freshness contract — an active
  // content site that updates daily can't serve cached HTML first or
  // returning visitors always see yesterday's pageview-before-last.
  // The previous stale-while-revalidate path is preserved (renamed)
  // for non-HTML same-origin GETs further down.
  if (isHtmlRequest(request)) {
    event.respondWith(networkFirstNav(request));
    return;
  }

  // Non-HTML same-origin GETs with query strings: bypass to avoid the
  // cache filling up with one entry per query permutation (analytics
  // pixels, etc.).
  if (url.search) return;

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

/**
 * Network-first HTML navigation handler.
 *
 * The browser tries the network with a HTML_NETWORK_TIMEOUT_MS budget.
 * On success we update the runtime cache (keyed by bare URL so query
 * permutations share one entry) and return the fresh response.
 * On failure (timeout or network error) we fall back to:
 *   1. the runtime cache (last fresh fetch of this URL)
 *   2. the install-time shell cache
 *   3. the pre-cached /offline/ page
 *   4. a plain-text 503
 */
async function networkFirstNav(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const shell = await caches.open(SHELL_CACHE);

  const url = new URL(request.url);
  const cacheKey = url.origin + url.pathname; // ignore query/hash

  const networkPromise = fetch(request).then((res) => {
    if (res && res.ok) {
      cache.put(cacheKey, res.clone()).catch(() => {});
    }
    return res;
  });

  // Race the network against the timeout. A null timeout resolution
  // means "fall back to cache now" — we still let networkPromise run
  // to completion so the cache eventually gets updated.
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(null), HTML_NETWORK_TIMEOUT_MS);
  });

  try {
    const fresh = await Promise.race([networkPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    if (fresh && fresh.ok) return fresh;
  } catch (_) {
    clearTimeout(timeoutId);
    // network errored — fall through to cache lookup
  }

  // Cache fallback (runtime cache first, then install shell).
  const cached =
    (await cache.match(request, { ignoreSearch: true })) ||
    (await shell.match(request, { ignoreSearch: true }));
  if (cached) return cached;

  // Offline fallback page (pre-cached at install).
  const offline = await shell.match("/offline/");
  if (offline) return offline;

  return new Response("Offline. Please reconnect.", {
    status: 503,
    headers: { "content-type": "text/plain" },
  });
}

async function staleWhileRevalidate(request, offlineFallback) {
  const cache = await caches.open(RUNTIME_CACHE);
  const shell = await caches.open(SHELL_CACHE);

  // For HTML navigations we want all query-string variants (PWA start_url,
  // share links) to share a single cached app shell entry. Match by path
  // (ignoreSearch) and, on refresh, normalize the cache key to the bare
  // URL so the cache doesn't fill up with permutations.
  const isHtml =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html");

  const matchOpts = isHtml ? { ignoreSearch: true } : undefined;
  const cached =
    (await cache.match(request, matchOpts)) ||
    (await shell.match(request, matchOpts));

  const refresh = fetch(request)
    .then((res) => {
      if (res.ok) {
        let key = request;
        if (isHtml) {
          const u = new URL(request.url);
          key = u.origin + u.pathname; // strip search + hash for the cache key
        }
        cache.put(key, res.clone()).catch(() => {});
      }
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
