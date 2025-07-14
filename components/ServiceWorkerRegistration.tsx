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

    // Service worker registration now handled by useSWUpdate hook
    console.log('[PWA] ServiceWorkerRegistration component loaded');

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