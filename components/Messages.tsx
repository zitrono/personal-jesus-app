"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef, useEffect, useRef } from "react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      console.log('Scrolling to bottom. Messages count:', messages.length);
      console.log('ScrollHeight:', scrollRef.current.scrollHeight);
      console.log('ClientHeight:', scrollRef.current.clientHeight);
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <motion.div
      className={"grow overflow-auto p-2 pt-safe pb-24 no-scrollbar"}
      ref={scrollRef}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-2 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "glass-effect rounded-xl",
                    msg.type === "user_message" ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div className={"flex items-center justify-between pt-2 px-3"}>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.message.role === "assistant" ? "Personal Jesus" : msg.message.role === "user" ? "Seeking Soul" : msg.message.role}
                    </div>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.receivedAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        second: undefined,
                      })}
                    </div>
                  </div>
                  <div className={"pb-2 px-3"}>{msg.message.content}</div>
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
