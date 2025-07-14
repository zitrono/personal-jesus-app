"use client";

import { VoiceProvider, VoiceProviderProps, VoiceContextType } from "@humeai/voice-react";
import { createContext, useContext, FC, useEffect, useState, useMemo } from "react";
import { useVoiceWithTone } from "../hooks/useVoiceWithTone";
import { useTheme } from "next-themes";
import { useThemeChangeReload } from "../hooks/useThemeChangeReload";

// Create a context for our custom voice hook
const VoiceWithToneContext = createContext<VoiceContextType | null>(null);

/**
 * Custom useVoice hook that consumers will use instead of the original
 * This returns our enhanced voice context with connection tone functionality
 */
export const useVoice = () => {
  const ctx = useContext(VoiceWithToneContext);
  if (!ctx) {
    throw new Error('useVoice must be used within a VoiceProviderWithTone');
  }
  return ctx;
};

/**
 * Internal component that provides the custom voice context
 * This sits inside the original VoiceProvider to access the original context
 */
const VoiceWithToneProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const voiceWithTone = useVoiceWithTone();
  
  return (
    <VoiceWithToneContext.Provider value={voiceWithTone}>
      {children}
    </VoiceWithToneContext.Provider>
  );
};

/**
 * Drop-in replacement for the original VoiceProvider that adds connection tone functionality
 * Maintains all original props and behavior while enhancing the connect method
 * Now includes theme-based config selection with page reload for clean initialization
 */
export const VoiceProviderWithTone: FC<VoiceProviderProps> = ({ children, configId, ...props }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { isReloadingFromThemeChange, clearReloadingFlag } = useThemeChangeReload();
  
  // Ensure we're on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle post-reload state
  useEffect(() => {
    if (mounted) {
      const isReloading = isReloadingFromThemeChange();
      if (isReloading) {
        setShowLoading(true);
        // Clear flag and hide loading after brief delay
        const timer = setTimeout(() => {
          clearReloadingFlag();
          setShowLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [mounted, isReloadingFromThemeChange, clearReloadingFlag]);
  
  // Select config based on theme
  const themeConfigId = useMemo(() => {
    if (!mounted || !theme) {
      // Default to light config during SSR
      return process.env.NEXT_PUBLIC_HUME_CONFIG_ID?.trim();
    }
    
    if (theme === 'dark') {
      const darkConfig = process.env.NEXT_PUBLIC_HUME_CONFIG_ID_DARK?.trim();
      console.log('[VoiceProvider] Using dark mode config:', {
        configId: darkConfig,
        theme,
        mounted,
        timestamp: new Date().toISOString()
      });
      return darkConfig;
    }
    const lightConfig = process.env.NEXT_PUBLIC_HUME_CONFIG_ID?.trim();
    console.log('[VoiceProvider] Using light mode config:', {
      configId: lightConfig,
      theme,
      mounted,
      timestamp: new Date().toISOString()
    });
    return lightConfig;
  }, [mounted, theme]);
  
  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }
  
  // Show loading state if we just reloaded from theme change
  if (showLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground animate-pulse">
          Applying divine theme...
        </div>
      </div>
    );
  }
  
  // Simple, clean VoiceProvider without any complex initialization
  return (
    <VoiceProvider {...props} configId={themeConfigId}>
      <VoiceWithToneProvider>
        {children}
      </VoiceWithToneProvider>
    </VoiceProvider>
  );
};