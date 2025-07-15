import { useEffect, useState, useRef } from 'react';

export function useSWUpdate() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const userInteracted = useRef(false);
  const autoUpdateApplied = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    // For testing in dev, uncomment the next line to simulate update ready:
    // setWaiting({ postMessage: () => {}, addEventListener: () => {} } as any);
    
    if (process.env.NODE_ENV !== 'production') return;

    // Track user interaction to avoid disrupting active sessions
    const markUserInteraction = () => {
      userInteracted.current = true;
      window.removeEventListener('mousedown', markUserInteraction);
      window.removeEventListener('touchstart', markUserInteraction);
      window.removeEventListener('keydown', markUserInteraction);
    };
    
    window.addEventListener('mousedown', markUserInteraction);
    window.addEventListener('touchstart', markUserInteraction);
    window.addEventListener('keydown', markUserInteraction);

    // Register service worker as per guide pattern
    const buildStamp = process.env.NEXT_PUBLIC_BUILD || `dev-${Date.now()}`;
    navigator.serviceWorker.register(`/sw.js#${buildStamp}`).then(reg => {
      // Check at start-up
      if (reg.waiting) {
        setWaiting(reg.waiting);
        
        // Auto-update on fresh page load (no user interaction yet)
        if (!userInteracted.current && !autoUpdateApplied.current) {
          autoUpdateApplied.current = true;
          console.log('[useSWUpdate] Auto-updating on fresh page load');
          setTimeout(() => {
            if (!userInteracted.current && reg.waiting) {
              reg.waiting.postMessage('SKIP_WAITING');
              navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
            }
          }, 100); // Small delay to ensure page is ready
        }
      }

      // Listen for new workers landing
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(nw);
            
            // Only auto-update if user hasn't interacted yet
            if (!userInteracted.current && !autoUpdateApplied.current) {
              autoUpdateApplied.current = true;
              console.log('[useSWUpdate] Auto-updating newly found update');
              setTimeout(() => {
                if (!userInteracted.current) {
                  nw.postMessage('SKIP_WAITING');
                  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
                }
              }, 100);
            }
          }
        });
      });
    });

    // Fresh check whenever the PWA returns to the foreground
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[useSWUpdate] Page visible, checking for updates');
        navigator.serviceWorker.ready.then(r => r.update());
      }
    });

    return () => {
      window.removeEventListener('mousedown', markUserInteraction);
      window.removeEventListener('touchstart', markUserInteraction);
      window.removeEventListener('keydown', markUserInteraction);
    };
  }, []);

  const activate = () => {
    if (!waiting) return;
    waiting.postMessage('SKIP_WAITING');
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  };

  return { updateReady: !!waiting && userInteracted.current, activate };
}