const CACHE_NAME = 'version-1.0.3'; // Updated version
const ASSETS_TO_CACHE = [
  '/',
  '/meds_icon_192.png',
  '/meds_icon.png',
  '/index.html',
  '/main.html',
  '/history.html',
  '/futuremeds.html',
  '/configuremeds.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Strategy: Network-First for HTML, Stale-While-Revalidate for Assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache, but update cache in background
          fetch(event.request).then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          });
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
  }
});