'use client';

import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { chatStorage } from "@/utils/chatStorage";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { useCallTone } from "@/hooks/useCallTone";

export default function StartCall({ 
  accessToken, 
  lightConfigId, 
  darkConfigId 
}: { 
  accessToken: string; 
  lightConfigId?: string;
  darkConfigId?: string;
}) {
  const { status, connect } = useVoice();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { playTone, retryPlayback, stopTone, cleanup } = useCallTone();

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stop tone when connection is established
  useEffect(() => {
    if (status.value === "connected") {
      stopTone();
    }
  }, [status.value, stopTone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Select config based on theme
  const selectedConfigId = useMemo(() => {
    if (!mounted) {
      console.log('[StartCall] Using light config during SSR');
      return lightConfigId?.trim();
    }
    
    const configId = (theme === 'dark' ? darkConfigId : lightConfigId)?.trim();
    console.log('[StartCall] Theme-based config selection:', {
      theme,
      selectedConfig: theme === 'dark' ? 'dark' : 'light',
      configId
    });
    return configId;
  }, [mounted, theme, lightConfigId, darkConfigId]);

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5 rounded-full backdrop-blur-md shadow-2xl divine-glow renaissance-pulse"}
                onClick={async () => {
                  // Using vanilla auth pattern - passing auth in connect() method
                  // Read saved chat group ID for conversation continuity
                  const savedChatGroupId = chatStorage.getChatGroupId();
                  
                  console.log('[StartCall] Starting connection flow with:', { 
                    hasAuth: !!accessToken, 
                    configId: selectedConfigId,
                    theme: mounted ? theme : 'not-mounted',
                    authType: 'accessToken',
                    resumedChatGroupId: savedChatGroupId || 'none (new chat)'
                  });
                  
                  try {
                    // Step 1: Prime the connection tone immediately within user gesture
                    // This is critical for iOS and mobile browsers
                    await playTone();
                    
                    // Step 2: Request microphone permission to activate audio context
                    // This also prepares the audio environment for Hume
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      console.log('[StartCall] Microphone permission granted');
                      
                      // Step 3: Retry tone playback now that audio context is active
                      await retryPlayback();
                      
                      // Clean up the permission stream (Hume will create its own)
                      stream.getTracks().forEach(track => track.stop());
                      
                    } catch (micError) {
                      console.warn('[StartCall] Microphone permission denied or failed:', micError);
                      // Continue with connection even if mic permission fails
                      // Hume will handle its own mic permission request
                    }
                    
                    // Step 4: Connect to Hume (tone will be stopped when status becomes "connected")
                    await connect({
                      auth: { type: "accessToken", value: accessToken },
                      configId: selectedConfigId,
                      resumedChatGroupId: savedChatGroupId || undefined
                    });
                    
                    console.log('[StartCall] Connection successful');
                    
                  } catch (error) {
                    console.error('[StartCall] Connection failed:', error);
                    // Stop tone on error
                    stopTone();
                  }
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-70 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>Touch Faith</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
