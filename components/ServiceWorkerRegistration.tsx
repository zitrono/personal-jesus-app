'use client';

import { useEffect } from 'react';

// Extend Window interface for dev reset function
declare global {
  interface Window {
    __DEV_RESET_CACHE__?: () => Promise<void>;
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production to avoid hot-reload collisions
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    // iOS PWA update checking
    async function checkUpdates() {
      try {
        const reg = await navigator.serviceWorker.ready;
        
        // Call update to check for new SW version (iOS-specific)
        reg.update();

        // Handle silent updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] Silent update applied, new version available on next load');
                // Could optionally show a subtle indicator here
              }
            });
          }
        });
      } catch (sin) {
        console.error('[PWA] Update check failed:', sin);
      }
    }

    // Register service worker
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] SW registered:', registration.scope);
        // Initial update check
        checkUpdates();
      })
      .catch((sin) => {
        console.error('[PWA] SW registration failed:', sin);
      });

    // Check for updates when page becomes visible (iOS background return)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkUpdates();
      }
    });

    // Check for updates on page load
    window.addEventListener('load', checkUpdates);

  }, []);

  // Dev-only hard reset function
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      window.__DEV_RESET_CACHE__ = async () => {
        console.log('[DEV] Performing hard cache reset...');
        
        // Unregister all service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
        
        // Delete all caches
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        console.log('[DEV] Cache reset complete, reloading...');
        location.reload();
      };
      
      console.log('[DEV] Hard reset available: window.__DEV_RESET_CACHE__()');
    }
  }, []);

  return null;
}