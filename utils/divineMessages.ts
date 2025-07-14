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
  
  // Network and connectivity
  networkError: "The divine signals seem to be traveling slowly today. Let's try again.",
  timeoutError: "Heaven's response took a bit longer than expected. Let's reach out again.",
  
  // Browser/Device related
  browserNotSupported: "This sacred vessel (browser) needs an update to carry our divine conversation.",
  deviceError: "Your earthly device had a small moment of confusion. Let's try again.",
  
  // General user-facing errors
  loadingFailed: "Had trouble preparing our sacred space. Let me try setting things up again.",
  configurationError: "Something in the divine configuration needs adjustment. Let me sort this out.",
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
    "Network error": divineMessages.networkError,
    "Connection timeout": divineMessages.timeoutError,
    "Browser not supported": divineMessages.browserNotSupported,
    "Failed to load": divineMessages.loadingFailed,
    "Configuration error": divineMessages.configurationError,
    "We could not connect to the voice. Please try again.": divineMessages.connectionFailed,
    "We could not connect to audio. Please try again.": divineMessages.audioNotInitialized,
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
  
  // Network/timeout related patterns
  if (originalMessage.toLowerCase().includes("timeout") || originalMessage.toLowerCase().includes("timed out")) {
    return divineMessages.timeoutError;
  }
  
  if (originalMessage.toLowerCase().includes("network") || originalMessage.toLowerCase().includes("connection")) {
    return divineMessages.networkError;
  }
  
  if (originalMessage.toLowerCase().includes("device") || originalMessage.toLowerCase().includes("hardware")) {
    return divineMessages.deviceError;
  }
  
  // Default fallback
  return originalMessage;
};