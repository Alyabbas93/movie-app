// Service Worker for offline support
const CACHE_NAME = 'movies-app-v1';
const urlsToCache = [
  '/',
  '/offline.tsx',
  '/app/globals.css',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache opened');
      return cache.addAll(urlsToCache).catch((error) => {
        console.log('[SW] Cache.addAll error:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For API calls, use network first strategy
  if (event.request.url.includes('omdbapi.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache API responses
          return response;
        })
        .catch(() => {
          // Return offline page if network fails
          return caches.match('/offline') || new Response('Offline');
        })
    );
    return;
  }

  // For other requests, use cache first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Return offline page if network fails and no cache
        if (event.request.mode === 'navigate') {
          return caches.match('/offline') || new Response('Offline');
        }
      });
    })
  );
});
