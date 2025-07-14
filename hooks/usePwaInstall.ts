"use client";

import { useState, useEffect } from "react";

interface PwaInstallState {
  isIos: boolean;
  isStandalone: boolean;
  showPrompt: boolean;
  dismissPrompt: () => void;
  permanentlyDismiss: () => void;
}

const STORAGE_KEY = "pwa-install-prompt";
const PROMPT_INTERVAL_DAYS = 90;

export function usePwaInstall(): PwaInstallState {
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // SSR Guard: Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const checkIfIos = () => {
      try {
        // Enable for all browsers during testing
        return typeof navigator !== 'undefined';
        
        // Production iOS detection (commented out for testing):
        // return typeof navigator !== 'undefined' && 
        //        /iPad|iPhone|iPod/.test(navigator.userAgent) && 
        //        !(window as any).MSStream;
      } catch {
        return false;
      }
    };

    const checkIfStandalone = () => {
      try {
        return (typeof window !== 'undefined' && window.matchMedia && 
               window.matchMedia('(display-mode: standalone)').matches) ||
               (typeof window !== 'undefined' && window.navigator && 
               (window.navigator as any).standalone === true);
      } catch {
        return false;
      }
    };

    const shouldShowPrompt = () => {
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          return false;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) {
          return true;
        }

        const data = JSON.parse(stored);
        
        if (data.permanentlyDismissed) {
          return false;
        }

        if (!data.lastDismissed) {
          return true;
        }

        const daysSinceLastDismiss = Math.floor(
          (Date.now() - data.lastDismissed) / (1000 * 60 * 60 * 24)
        );

        return daysSinceLastDismiss >= PROMPT_INTERVAL_DAYS;
      } catch {
        return false;
      }
    };

    const ios = checkIfIos();
    const standalone = checkIfStandalone();
    
    setIsIos(ios);
    setIsStandalone(standalone);
    
    if (ios && !standalone && shouldShowPrompt()) {
      setTimeout(() => setShowPrompt(true), 2000);
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    
    // SSR Guard: Only access localStorage in browser
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let data: any = {};
      
      try {
        data = stored ? JSON.parse(stored) : {};
      } catch {
        data = {};
      }
      
      data.lastDismissed = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  const permanentlyDismiss = () => {
    setShowPrompt(false);
    
    // SSR Guard: Only access localStorage in browser
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const data = {
        permanentlyDismissed: true,
        lastDismissed: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  return {
    isIos,
    isStandalone,
    showPrompt,
    dismissPrompt,
    permanentlyDismiss
  };
}