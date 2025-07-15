'use client';

import { useVoice } from "./VoiceProviderWithTone";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function StartCall() {
  const { status, connect } = useVoice();
  const [toastIndex, setToastIndex] = useState(0);

  const testToasts = [
    () => toast.success(`Divine connection established! ${Date.now()}`),
    () => toast.error(`Connection to the divine interrupted ${Date.now()}`),
    () => toast.info(`Seeking divine wisdom... ${Date.now()}`),
  ];

  const handleTestToast = () => {
    testToasts[toastIndex]();
    setToastIndex((prev) => (prev + 1) % testToasts.length);
  };

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center flex-col gap-4"}
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
                  // Connection tone now plays automatically after microphone permission
                  connect()
                    .then(() => {})
                    .catch(() => {})
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="glass-effect"
              onClick={handleTestToast}
            >
              Test Toaster
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
