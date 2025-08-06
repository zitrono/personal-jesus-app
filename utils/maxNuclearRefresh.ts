/**
 * Maximum Nuclear PWA Refresh
 * 
 * Clears everything possible except localStorage to give the PWA a completely fresh start.
 * Designed for iOS PWA stuck states and integration with service worker updates.
 * 
 * Preserves: localStorage only (handled separately by "Forget My Sins" button)
 * Destroys: Everything else - session storage, IndexedDB, caches, service workers, cookies
 */

// Type augmentations for browser APIs that might not be in standard TypeScript
declare global {
  interface Window {
    gc?: () => void;
    openDatabase?: (name: string, version: string, displayName: string, estimatedSize: number) => any;
  }
  
  interface Navigator {
    standalone?: boolean;
  }
}

export async function maxNuclearRefresh(): Promise<void> {
  console.log('[Nuclear] Beginning maximum refresh sequence...');

  try {
    // 1. SESSION STORAGE OBLITERATION
    console.log('[Nuclear] Clearing session storage...');
    sessionStorage.clear();

    // 2. INDEXEDDB DESTRUCTION
    console.log('[Nuclear] Destroying IndexedDB databases...');
    if ('indexedDB' in window) {
      try {
        // Get all databases and delete them
        const databases = await indexedDB.databases?.() || [];
        const deletePromises = databases.map(db => {
          if (db.name) {
            return new Promise<void>((resolve) => {
              const deleteReq = indexedDB.deleteDatabase(db.name!);
              deleteReq.onsuccess = () => {
                console.log(`[Nuclear] Deleted IndexedDB: ${db.name}`);
                resolve();
              };
              deleteReq.onerror = () => {
                console.warn(`[Nuclear] Failed to delete IndexedDB: ${db.name}`);
                resolve(); // Continue anyway
              };
              deleteReq.onblocked = () => {
                console.warn(`[Nuclear] Blocked deleting IndexedDB: ${db.name}`);
                resolve(); // Continue anyway
              };
            });
          }
          return Promise.resolve();
        });
        await Promise.all(deletePromises);
      } catch (error) {
        console.warn('[Nuclear] IndexedDB cleanup failed:', error);
      }
    }

    // 3. CACHE STORAGE ANNIHILATION
    console.log('[Nuclear] Obliterating cache storage...');
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log(`[Nuclear] Found ${cacheNames.length} caches to delete`);
        const cacheDeletePromises = cacheNames.map(async (name) => {
          const deleted = await caches.delete(name);
          console.log(`[Nuclear] Cache ${name}: ${deleted ? 'deleted' : 'failed'}`);
          return deleted;
        });
        await Promise.all(cacheDeletePromises);
      } catch (error) {
        console.warn('[Nuclear] Cache cleanup failed:', error);
      }
    }

    // 4. SERVICE WORKER ELIMINATION
    console.log('[Nuclear] Unregistering service workers...');
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`[Nuclear] Found ${registrations.length} service workers to unregister`);
        const unregisterPromises = registrations.map(async (registration) => {
          const unregistered = await registration.unregister();
          console.log(`[Nuclear] Service worker ${registration.scope}: ${unregistered ? 'unregistered' : 'failed'}`);
          return unregistered;
        });
        await Promise.all(unregisterPromises);
      } catch (error) {
        console.warn('[Nuclear] Service worker cleanup failed:', error);
      }
    }

    // 5. COOKIE DESTRUCTION (domain-specific)
    console.log('[Nuclear] Clearing cookies...');
    try {
      const cookies = document.cookie.split(";");
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          // Clear for root path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          // Clear for current path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${window.location.pathname}`;
          // Clear for domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${window.location.hostname}`;
          console.log(`[Nuclear] Cleared cookie: ${name}`);
        }
      });
    } catch (error) {
      console.warn('[Nuclear] Cookie cleanup failed:', error);
    }

    // 6. WEBSQL CLEANUP (legacy browsers)
    console.log('[Nuclear] Clearing WebSQL (if supported)...');
    if ('openDatabase' in window) {
      try {
        // WebSQL is mostly deprecated, but clear it if it exists
        console.log('[Nuclear] WebSQL detected but cleanup not implemented (deprecated)');
      } catch (error) {
        console.warn('[Nuclear] WebSQL cleanup failed:', error);
      }
    }

    // 7. MEMORY PRESSURE (force garbage collection if available)
    console.log('[Nuclear] Forcing garbage collection...');
    if (window.gc) {
      try {
        window.gc();
        console.log('[Nuclear] Garbage collection triggered');
      } catch (error) {
        console.warn('[Nuclear] Garbage collection failed:', error);
      }
    }

    console.log('[Nuclear] Nuclear refresh sequence completed successfully');

  } catch (error) {
    console.error('[Nuclear] Nuclear refresh sequence failed:', error);
    throw error;
  }
}

/**
 * Maximum Nuclear Refresh with Immediate Page Reload
 * 
 * Performs nuclear refresh then immediately triggers multiple iOS-specific
 * refresh strategies for maximum effectiveness.
 */
export async function maxNuclearRefreshWithReload(): Promise<void> {
  console.log('[Nuclear] Beginning nuclear refresh with immediate reload...');
  
  try {
    // Perform nuclear cleanup first
    await maxNuclearRefresh();
    
    // 8. MAXIMUM iOS REFRESH STRATEGIES (execute simultaneously)
    console.log('[Nuclear] Executing iOS refresh strategies...');
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Strategy A: Meta refresh injection (for stubborn iOS cases)
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = '0';
    document.head.appendChild(meta);
    console.log('[Nuclear] Meta refresh injected');
    
    // Strategy B: Multiple window location methods with staggered timing
    // This creates a cascade of refresh attempts to overcome iOS PWA caching
    
    setTimeout(() => {
      console.log('[Nuclear] Executing cache-busted href redirect...');
      window.location.href = `${baseUrl}?nuclear=${timestamp}&r=${random}`;
    }, 50);
    
    setTimeout(() => {
      console.log('[Nuclear] Executing hard reload...');
      window.location.reload();
    }, 100);
    
    setTimeout(() => {
      console.log('[Nuclear] Executing location replace...');
      window.location.replace(`${window.location.href}?bust=${timestamp}`);
    }, 150);
    
    // Strategy C: Ultimate fallback
    setTimeout(() => {
      console.log('[Nuclear] Executing ultimate fallback...');
      window.location.assign('/');
    }, 200);
    
  } catch (error) {
    console.error('[Nuclear] Nuclear refresh with reload failed:', error);
    // Even if nuclear cleanup fails, try to refresh anyway
    window.location.reload();
  }
}

/**
 * Detect if running on iOS
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Detect if running as iOS PWA
 */
export function isiOSPWA(): boolean {
  return isIOS() && navigator.standalone === true;
}

/**
 * Nuclear refresh optimized for current platform
 */
export async function platformOptimizedNuclearRefresh(): Promise<void> {
  console.log(`[Nuclear] Platform: ${isIOS() ? 'iOS' : 'Other'}, PWA: ${isiOSPWA()}`);
  
  if (isiOSPWA()) {
    // iOS PWA needs the most aggressive approach
    await maxNuclearRefreshWithReload();
  } else if (isIOS()) {
    // iOS Safari - still needs aggressive but not PWA-specific
    await maxNuclearRefreshWithReload();
  } else {
    // Other platforms - standard nuclear refresh
    await maxNuclearRefresh();
    window.location.reload();
  }
}