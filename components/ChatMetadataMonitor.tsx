"use client";

import { useEffect } from "react";
import { useVoice } from "@humeai/voice-react";
import { chatStorage } from "@/utils/chatStorage";

export function ChatMetadataMonitor() {
  const { chatMetadata } = useVoice();

  useEffect(() => {
    if (chatMetadata?.chatGroupId) {
      console.log('[ChatMetadataMonitor] Chat metadata received:', {
        chatGroupId: chatMetadata.chatGroupId,
        chatId: chatMetadata.chatId,
        timestamp: new Date().toISOString()
      });
      chatStorage.saveChatGroupId(chatMetadata.chatGroupId);
    }
  }, [chatMetadata]);

  return null;
}