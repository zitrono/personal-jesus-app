'use client';

import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { chatStorage } from "@/utils/chatStorage";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";

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

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Select config based on theme
  const selectedConfigId = useMemo(() => {
    if (!mounted) {
      console.log('[StartCall] Using light config during SSR');
      return lightConfigId;
    }
    
    const configId = theme === 'dark' ? darkConfigId : lightConfigId;
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
                onClick={() => {
                  // Using vanilla auth pattern - passing auth in connect() method
                  // Read saved chat group ID for conversation continuity
                  const savedChatGroupId = chatStorage.getChatGroupId();
                  
                  console.log('[StartCall] Connecting with:', { 
                    hasAuth: !!accessToken, 
                    configId: selectedConfigId,
                    theme: mounted ? theme : 'not-mounted',
                    authType: 'accessToken',
                    resumedChatGroupId: savedChatGroupId || 'none (new chat)'
                  });
                  
                  connect({
                    auth: { type: "accessToken", value: accessToken },
                    configId: selectedConfigId,
                    resumedChatGroupId: savedChatGroupId || undefined
                  })
                    .then(() => {
                      console.log('[StartCall] Connection successful');
                    })
                    .catch((error) => {
                      console.error('[StartCall] Connection failed:', error);
                    })
                    .finally(() => {});
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
