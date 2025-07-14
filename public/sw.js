// Battle-tested iOS PWA Service Worker with Deferred Activation
// Static asset caching only - NO network interception

const VERSION = self.registration.scope.split('#')[1] || self.__BUILD__ || '2025-07-14-dev';
const CORE = [
  '/',
  '/manifest.json',
  '/back2.png',
  '/back-dark.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// ① install ─ cache the shell only
self.addEventListener('install', evt => {
  console.log('[SW] Install event, build:', VERSION);
  evt.waitUntil(
    caches.open(`core-${VERSION}`).then(c => c.addAll(CORE))
  );
  // DO NOT call self.skipWaiting() – wait for user approval
});

// ② activate ─ clean old caches, then take control
self.addEventListener('activate', evt => {
  console.log('[SW] Activate event, cache:', `core-${VERSION}`);
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !k.endsWith(VERSION)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Static asset fetch handling only
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls, WebSockets, and external services - NO INTERCEPTION
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('hume.ai') ||
    url.hostname.includes('axiom.co') ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:' ||
    request.url.includes('chrome-extension')
  ) {
    return; // Let browser handle normally
  }

  // Cache-first strategy for static assets only
  event.respondWith(
    (async () => {
      try {
        // Try cache first
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }

        // Network fallback for static assets
        const response = await fetch(request);
        
        // Cache successful responses for static assets
        if (response.status === 200 && response.type === 'basic') {
          const cache = await caches.open(`core-${VERSION}`);
          cache.put(request, response.clone());
        }
        
        return response;
      } catch (error) {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          const cached = await caches.match('/');
          if (cached) return cached;
        }
        throw error;
      }
    })()
  );
});

// ③ listen for the app's "please activate" message
self.addEventListener('message', evt => {
  if (evt.data === 'SKIP_WAITING') self.skipWaiting();
});