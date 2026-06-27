const CACHE = "shearin-farm-manager-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=11",
  "./script.js?v=11",
  "./config.js?v=11",
  "./manifest.webmanifest?v=11",
  "./icon.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => undefined)
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: "no-store" });
      if (response && response.ok && new URL(request.url).origin === self.location.origin) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") return caches.match("./index.html");
      throw error;
    }
  })());
});
