import { NextResponse } from 'next/server';

export async function GET() {
  const buildStamp = process.env.NEXT_PUBLIC_BUILD || '2025-07-14-dev';
  
  const serviceWorkerCode = `
// Battle-tested iOS PWA Service Worker
// Static asset caching only - NO network interception

const BUILD = '${buildStamp}';
const CACHE = 'pwa-' + BUILD;

// Core static assets to pre-cache
const coreAssets = [
  '/',
  '/manifest.json',
  '/back2.png',
  '/back-dark.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// Fast-lane install: cache assets and skip waiting
self.addEventListener('install', event => {
  console.log('[SW] Install event, build:', BUILD);
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(coreAssets);
      await self.skipWaiting(); // Enter waiting → activate immediately
    })()
  );
});

// Fast-lane activate: clean old caches and take control
self.addEventListener('activate', event => {
  console.log('[SW] Activate event, cache:', CACHE);
  event.waitUntil(
    (async () => {
      // Delete all old caches
      for (const name of await caches.keys()) {
        if (name !== CACHE) {
          console.log('[SW] Deleting old cache:', name);
          await caches.delete(name);
        }
      }
      await self.clients.claim(); // Take control immediately
    })()
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
          const cache = await caches.open(CACHE);
          cache.put(request, response.clone());
        }
        
        return response;
      } catch (sin) {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          const cached = await caches.match('/');
          if (cached) return cached;
        }
        throw sin;
      }
    })()
  );
});

// Message handling for debug/manual updates
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

  return new NextResponse(serviceWorkerCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}