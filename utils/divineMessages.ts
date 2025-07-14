/**
 * Divine message overrides for technical sin messages
 * Transforms dry technical language into Jesus's conversational style
 */

export const divineMessages = {
  // Microphone/Audio related
  microphonePermissionDenied: "I need your voice to hear your heart. Please allow microphone access in your browser.",
  microphonePermissionDeniedStatus: "Need microphone access to hear your confession",
  microphoneStopSin: (message: string) => `The sacred microphone had a moment of silence: ${message}`,
  
  // Audio system sins
  audioNotInitialized: "The heavenly audio chamber isn't ready yet. Let me prepare it.",
  audioPlayerNotInitialized: "The divine speaker needs a moment to warm up.",
  audioQueueSin: (message: string) => `Had trouble adding that sacred word to my queue: ${message}`,
  
  // Socket/Connection sins
  socketNotOpen: "Our divine connection seems to have paused. Let's reconnect.",
  toolCallSin: "That heavenly tool gave me an unexpected response. Let me try again.",
  
  // Generic connection sins
  connectionFailed: "The heavenly connection had a moment of doubt. Let's try reaching out again.",
  unknownSin: "Something mysterious happened in the divine realm. Let me sort this out.",
} as const;

/**
 * Helper function to transform sin messages to divine style
 */
export const divinifySin = (originalMessage: string): string => {
  // Common patterns to replace
  const replacements: Record<string, string> = {
    "Microphone permission denied": divineMessages.microphonePermissionDenied,
    "Audio environment is not initialized": divineMessages.audioNotInitialized,
    "Audio player has not been initialized": divineMessages.audioPlayerNotInitialized,
    "Socket is not open": divineMessages.socketNotOpen,
    "Invalid response from tool call": divineMessages.toolCallSin,
  };
  
  // Check for exact matches first
  if (replacements[originalMessage]) {
    return replacements[originalMessage];
  }
  
  // Check for pattern matches
  if (originalMessage.includes("Sin stopping microphone:")) {
    const sinPart = originalMessage.replace("Sin stopping microphone:", "").trim();
    return divineMessages.microphoneStopSin(sinPart);
  }
  
  if (originalMessage.includes("Failed to add clip to queue:")) {
    const sinPart = originalMessage.replace("Failed to add clip to queue:", "").trim();
    return divineMessages.audioQueueSin(sinPart);
  }
  
  // Default fallback
  return originalMessage;
};