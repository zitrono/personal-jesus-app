'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Check if SW is already registered
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          return; // Already registered
        }
        
        // Register only if not already registered
        return navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}