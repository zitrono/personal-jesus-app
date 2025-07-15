"use client";

// import { VoiceProviderWithTone } from "./VoiceProviderWithTone";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ChatMetadataMonitor } from "./ChatMetadataMonitor";
import { ComponentRef, useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { divinifyError } from "@/utils/divineMessages";
import { chatStorage } from "@/utils/chatStorage";
import { MediaSessionManager } from "./MediaSessionManager";

export default function ClientComponent({
  accessToken,
  lightConfigId,
  darkConfigId,
}: {
  accessToken: string;
  lightConfigId?: string;
  darkConfigId?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Ensure we're in client-side environment
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        onMessage={() => {
          if (!isClient) return;
          
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
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
            
            // Force a page reload to reset the VoiceProvider
            setTimeout(() => window.location.reload(), 1500);
          } else {
            // Show the normal error message for other errors
            toast.error(divinifyError(error.message));
          }
        }}
      >
        <ChatMetadataMonitor />
        <MediaSessionManager />
        <Messages ref={ref} />
        <Controls />
        <StartCall accessToken={accessToken} lightConfigId={lightConfigId} darkConfigId={darkConfigId} />
      </VoiceProvider>
    </div>
  );
}
