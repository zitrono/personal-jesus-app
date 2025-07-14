"use client";

import { VoiceProvider, VoiceProviderProps, VoiceContextType } from "@humeai/voice-react";
import { createContext, useContext, FC, useEffect, useState, useMemo } from "react";
import { useVoiceWithTone } from "../hooks/useVoiceWithTone";
import { useTheme } from "next-themes";

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
 * Now includes theme-based config selection
 */
export const VoiceProviderWithTone: FC<VoiceProviderProps> = ({ children, ...props }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure we're on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  
  // Use key to force provider recreation only when config changes
  // This ensures the correct config is used for new connections
  return (
    <VoiceProvider {...props} configId={themeConfigId} key={`voice-${themeConfigId}`}>
      <VoiceWithToneProvider>
        {children}
      </VoiceWithToneProvider>
    </VoiceProvider>
  );
};