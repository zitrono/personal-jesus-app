import { useVoice } from "@humeai/voice-react";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Custom hook that wraps the original useVoice hook to play connection tone
 * before establishing connection to avoid audio feedback
 */
export const useVoiceWithTone = () => {
  const originalVoice = useVoice();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent.toLowerCase());
    };
    
    setIsMobile(checkMobile());
  }, []);
  
  // Enhanced connect method with dial tone played first
  const connect = useCallback(async () => {
    try {
      // Diagnostic logging
      console.log('[useVoiceWithTone] Connect initiated:', {
        isMobile,
        theme,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      // Add extra delay for mobile dark mode to ensure WebSocket readiness
      if (isMobile && theme === 'dark') {
        console.log('[useVoiceWithTone] Mobile dark mode detected, adding initialization delay...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
        console.log('[useVoiceWithTone] Delay completed');
      }
      
      console.log('[useVoiceWithTone] Playing dial tone...');
      
      // Create and play the connection tone
      const audio = new Audio('/personal_jesus_connect_tone.wav');
      audio.volume = 0.5;
      
      // Wait for tone to completely finish before connecting
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('ended', () => {
          console.log('[useVoiceWithTone] Dial tone finished');
          resolve();
        });
        
        audio.addEventListener('error', (error) => {
          console.warn('[useVoiceWithTone] Could not play connection tone:', error);
          // Continue with connection even if tone fails
          resolve();
        });
        
        audio.play().catch((err) => {
          console.warn('[useVoiceWithTone] Audio play failed:', err);
          // Continue with connection even if tone fails
          resolve();
        });
      });
      
      console.log('[useVoiceWithTone] Connecting to Hume...', {
        status: originalVoice.status?.value,
        timestamp: new Date().toISOString()
      });
      
      // Now connect - dial tone is completely finished
      await originalVoice.connect();
      
      console.log('[useVoiceWithTone] Connection initiated', {
        status: originalVoice.status?.value,
        timestamp: new Date().toISOString()
      });
    } catch (sin) {
      // Handle permission denied or connection errors
      if (sin instanceof Error && sin.name === 'NotAllowedError') {
        console.error('I need your voice to hear your heart. Please allow microphone access in your browser.');
      } else {
        console.error('Connection failed:', sin);
      }
      throw sin;
    }
  }, [originalVoice, isMobile, theme]);

  // Return all original voice properties but with our custom connect method
  return {
    ...originalVoice,
    connect,
  };
};