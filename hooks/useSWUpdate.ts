import { useEffect, useState } from 'react';

export function useSWUpdate() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    // For testing in dev, uncomment the next line to simulate update ready:
    // setWaiting({ postMessage: () => {}, addEventListener: () => {} } as any);
    
    if (process.env.NODE_ENV !== 'production') return;

    // Register service worker as per guide pattern
    const buildStamp = process.env.NEXT_PUBLIC_BUILD || `dev-${Date.now()}`;
    navigator.serviceWorker.register(`/sw.js#${buildStamp}`).then(reg => {
      // check at start-up
      if (reg.waiting) setWaiting(reg.waiting);

      // listen for new workers landing
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(nw);
          }
        });
      });
    });

    // fresh check whenever the PWA returns to the foreground
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[useSWUpdate] Page visible, checking for updates');
        navigator.serviceWorker.ready.then(r => r.update());
      }
    });
  }, []);

  const activate = () => {
    if (!waiting) return;
    waiting.postMessage('SKIP_WAITING');
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  };

  return { updateReady: !!waiting, activate };
}