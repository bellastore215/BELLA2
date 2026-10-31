/*
 * BELLA service worker.
 *
 * Caching policy:
 * - Hashed build assets (/_next/static) and app icons: cache-first (immutable).
 * - Page navigations: always network. On failure, serve the precached offline page.
 * - Everything else — non-GET requests, API, checkout, account, admin, RSC payloads,
 *   and cross-origin requests — is never intercepted or cached, so customer and
 *   order data cannot be stored on the device by the service worker.
 */
const VERSION = "v1";
const STATIC_CACHE = `bella-static-${VERSION}`;
const OFFLINE_CACHE = `bella-offline-${VERSION}`;
const LOCALES = ["ar", "en"];
const DEFAULT_LOCALE = "ar";
const OFFLINE_URLS = LOCALES.map((locale) => `/${locale}/offline`);
const PRIVATE_PREFIXES = ["/api/", "/checkout", "/account", "/admin", "/orders"];

// Precaches the offline pages plus the hashed CSS/JS/fonts they reference, so the fallback is styled.
async function precacheOfflinePages() {
  const offlineCache = await caches.open(OFFLINE_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);
  const assets = new Set();

  await Promise.all(
    OFFLINE_URLS.map(async (url) => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to precache ${url}: ${response.status}`);
      const html = await response.clone().text();
      for (const match of html.matchAll(/\/_next\/static\/[\w\-./~%]+?\.(?:css|js|woff2)(?![\w/])/g)) {
        assets.add(match[0]);
      }
      await offlineCache.put(url, response);
    }),
  );

  await staticCache.addAll([...assets]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheOfflinePages().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  const keep = new Set([STATIC_CACHE, OFFLINE_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isPrivatePath(pathname) {
  const locale = pathname.split("/")[1];
  const unlocalized = LOCALES.includes(locale) ? pathname.slice(locale.length + 1) || "/" : pathname;
  return PRIVATE_PREFIXES.some((prefix) => unlocalized.startsWith(prefix));
}

function offlineUrlFor(pathname) {
  const locale = pathname.split("/")[1];
  return `/${LOCALES.includes(locale) ? locale : DEFAULT_LOCALE}/offline`;
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkWithOfflineFallback(request, pathname) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(OFFLINE_CACHE);
    return (await cache.match(offlineUrlFor(pathname))) ?? Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkWithOfflineFallback(request, url.pathname));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/pwa-icon/")) {
    event.respondWith(cacheFirst(request));
  }
});
