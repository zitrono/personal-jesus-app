"use client";

// import { VoiceProviderWithTone } from "./VoiceProviderWithTone";
import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ChatMetadataMonitor } from "./ChatMetadataMonitor";
import { ComponentRef, useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { divinifyError } from "@/utils/divineMessages";
import { chatStorage } from "@/utils/chatStorage";
import { MediaSessionManager } from "./MediaSessionManager";
import { useTheme } from "next-themes";
import { useHumeToken } from "@/hooks/useHumeToken";
import { platformOptimizedNuclearRefresh } from "@/utils/maxNuclearRefresh";
import dynamic from 'next/dynamic';

// Load AudioAmplifier only on client side to avoid SSR issues
const AudioAmplifier = dynamic(() => import('./AudioAmplifier').then(mod => mod.AudioAmplifier), {
  ssr: false
});

// Internal component that monitors theme changes and disconnects on switch
function ThemeChangeMonitor() {
  const { theme } = useTheme();
  const { status, disconnect } = useVoice();
  const [mounted, setMounted] = useState(false);
  const [initialTheme, setInitialTheme] = useState<string | undefined>();

  useEffect(() => {
    setMounted(true);
    if (theme) {
      setInitialTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // Only disconnect if:
    // 1. Component is mounted (not initial SSR)
    // 2. We have an initial theme set
    // 3. Theme has actually changed
    // 4. Call is currently active
    if (mounted && initialTheme && theme !== initialTheme && status.value === "connected") {
      console.log('[ThemeChangeMonitor] Theme changed during call, disconnecting:', {
        from: initialTheme,
        to: theme,
        callStatus: status.value
      });
      disconnect();
      setInitialTheme(theme); // Update initial theme for next change
    }
  }, [theme, initialTheme, status.value, disconnect, mounted]);

  return null;
}

export default function ClientComponent({
  lightConfigId,
  darkConfigId,
}: {
  lightConfigId?: string;
  darkConfigId?: string;
}) {
  const { token: accessToken, loading } = useHumeToken();
  const [isClient, setIsClient] = useState(false);
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Ensure we're in client-side environment
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !accessToken) {
    return (
      <div className="relative grow flex flex-col mx-auto w-full h-full min-h-0 items-center justify-center">
        <div className="text-divine-light dark:text-divine-gold">Preparing divine connection...</div>
      </div>
    );
  }

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full h-full min-h-0"
      }
    >
      <VoiceProvider
        onMessage={() => {
          // Auto-scroll is now handled by Messages component useEffect
        }}
        onError={(error) => {
          // Log the full error object with all metadata
          console.error('[Chat Error] Full error details:', {
            error: error,
            message: error.message,
            type: error.type,
            // Additional properties that might exist
            code: (error as any).code,
            metadata: (error as any).metadata,
            stack: (error as any).stack,
            timestamp: new Date().toISOString(),
            hasResumedChatGroupId: !!chatStorage.getChatGroupId(),
            resumedChatGroupId: chatStorage.getChatGroupId()
          });
          
          const errorMessage = error.message || '';
          
          // Check for billing/credit errors
          if (errorMessage.includes('Exhausted credit balance') || 
              errorMessage.includes('credit') || 
              errorMessage.includes('billing')) {
            console.log('[Chat Error] Detected billing/credit error');
            toast.error("Divine funds depleted");
            return; // Don't show generic error or reload
          }
          
          // Handle stuck WebSocket connections with nuclear refresh
          if (errorMessage.includes('A websocket connection could not be established') && 
              errorMessage.includes('Max retries (0) reached')) {
            console.log('[Chat Error] Detected stuck WebSocket connection, triggering nuclear refresh');
            toast.info("Connection stuck - performing deep refresh...");
            
            setTimeout(async () => {
              try {
                console.log('[Chat Error] Performing nuclear refresh for stuck WebSocket');
                await platformOptimizedNuclearRefresh();
              } catch (error) {
                console.error('[Chat Error] Nuclear refresh failed for WebSocket error, falling back:', error);
                window.location.reload();
              }
            }, 1000);
            return;
          }
          
          // Check for specific chat group ID error codes
          if (errorMessage.includes('E0708') || 
              errorMessage.includes('chat group does not exist') ||
              errorMessage.includes('E0710') || 
              errorMessage.includes('E0717')) {
            
            console.log('[Chat Error] Detected chat group ID error, clearing stored ID');
            
            // Clear the invalid chat group ID
            chatStorage.clearChatGroupId();
            
            // Show user-friendly message based on error type
            if (errorMessage.includes('E0708')) {
              toast.info("Starting fresh conversation - previous session not found");
            } else if (errorMessage.includes('E0710')) {
              toast.info("Starting fresh conversation - configuration has changed");
            } else if (errorMessage.includes('E0717')) {
              toast.info("Chat session is already active elsewhere");
            }
            
            // Force nuclear refresh to completely reset the VoiceProvider and clear stuck states
            setTimeout(async () => {
              try {
                console.log('[Chat Error] Triggering nuclear refresh for chat group error');
                await platformOptimizedNuclearRefresh();
              } catch (error) {
                console.error('[Chat Error] Nuclear refresh failed, falling back to normal reload:', error);
                window.location.reload();
              }
            }, 1500);
          } else {
            // Show the normal error message for other errors
            toast.error(divinifyError(error.message));
          }
        }}
      >
        <AudioAmplifier />
        <ChatMetadataMonitor />
        <MediaSessionManager />
        <ThemeChangeMonitor />
        <Messages ref={ref} />
        <Controls />
        <StartCall accessToken={accessToken!} lightConfigId={lightConfigId} darkConfigId={darkConfigId} isLoading={loading} />
      </VoiceProvider>
    </div>
  );
}
