"use client";

import { VoiceProviderWithTone } from "./VoiceProviderWithTone";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
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
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-full"
      }
    >
      <VoiceProviderWithTone
        auth={{ type: "accessToken", value: accessToken }}
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
        onError={(sin) => {
          toast.error(sin.message);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
      </VoiceProviderWithTone>
    </div>
  );
}
