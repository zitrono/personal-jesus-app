"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

const THEME_STORAGE_KEY = 'personal-jesus-theme';
const RELOADING_FLAG_KEY = 'theme-reloading';

/**
 * Hook that forces a page reload when theme changes to ensure clean
 * WebSocket initialization with the correct Hume config
 */
export const useThemeChangeReload = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isInitialMount = useRef(true);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ensure we're on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip during SSR or before mounted
    if (!mounted || typeof window === 'undefined') return;
    
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Store current theme
      if (theme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
      
      // Clear any stale reloading flag
      sessionStorage.removeItem(RELOADING_FLAG_KEY);
      return;
    }

    // Get previous theme from localStorage
    const previousTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Only reload if theme actually changed
    if (theme && previousTheme && theme !== previousTheme) {
      console.log('[ThemeReload] Theme changed from', previousTheme, 'to', theme);
      
      // Clear any pending reload
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      
      // Debounce reload to prevent rapid toggles
      reloadTimeoutRef.current = setTimeout(() => {
        // Set reloading flag for loading state
        sessionStorage.setItem(RELOADING_FLAG_KEY, 'true');
        
        // Update stored theme
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        
        // Force reload
        console.log('[ThemeReload] Reloading page for theme change...');
        window.location.reload();
      }, 100); // Small delay to debounce rapid toggles
    }
    
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
    };
  }, [theme, mounted]);

  // Return whether we're in a post-reload state
  const isReloadingFromThemeChange = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(RELOADING_FLAG_KEY) === 'true';
  };

  const clearReloadingFlag = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(RELOADING_FLAG_KEY);
  };

  return {
    isReloadingFromThemeChange,
    clearReloadingFlag,
  };
};