const CACHE_NAME = 'medminder-v1.8.2';

// The list of all files that must be cached for the app to work offline
const ASSETS = [
  './',
  './index.html',
  './main.html',
  './manifest.json',
  './meds_icon.png'
];

// 1. Install Event: Populate the cache with all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Assets');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Event: Clean up old versions of the cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Serve assets from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached file if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});