/**
 * Divine message overrides for technical error messages
 * Transforms dry technical language into Jesus's conversational style
 */

export const divineMessages = {
  // Microphone/Audio related
  microphonePermissionDenied: "I need your voice to hear your heart. Please allow microphone access in your browser.",
  microphonePermissionDeniedStatus: "Need microphone access to hear your confession",
  microphoneStopError: (message: string) => `The sacred microphone had a moment of silence: ${message}`,
  
  // Audio system errors
  audioNotInitialized: "The heavenly audio chamber isn't ready yet. Let me prepare it.",
  audioPlayerNotInitialized: "The divine speaker needs a moment to warm up.",
  audioQueueError: (message: string) => `Had trouble adding that sacred word to my queue: ${message}`,
  
  // Socket/Connection errors
  socketNotOpen: "Our divine connection seems to have paused. Let's reconnect.",
  toolCallError: "That heavenly tool gave me an unexpected response. Let me try again.",
  
  // Generic connection errors
  connectionFailed: "The heavenly connection had a moment of doubt. Let's try reaching out again.",
  unknownError: "Something mysterious happened in the divine realm. Let me sort this out.",
} as const;

/**
 * Helper function to transform error messages to divine style
 */
export const divinifyError = (originalMessage: string): string => {
  // Common patterns to replace
  const replacements: Record<string, string> = {
    "Microphone permission denied": divineMessages.microphonePermissionDenied,
    "Audio environment is not initialized": divineMessages.audioNotInitialized,
    "Audio player has not been initialized": divineMessages.audioPlayerNotInitialized,
    "Socket is not open": divineMessages.socketNotOpen,
    "Invalid response from tool call": divineMessages.toolCallError,
  };
  
  // Check for exact matches first
  if (replacements[originalMessage]) {
    return replacements[originalMessage];
  }
  
  // Check for pattern matches
  if (originalMessage.includes("Error stopping microphone:")) {
    const errorPart = originalMessage.replace("Error stopping microphone:", "").trim();
    return divineMessages.microphoneStopError(errorPart);
  }
  
  if (originalMessage.includes("Failed to add clip to queue:")) {
    const errorPart = originalMessage.replace("Failed to add clip to queue:", "").trim();
    return divineMessages.audioQueueError(errorPart);
  }
  
  // Default fallback
  return originalMessage;
};