import { VoiceProvider, VoiceProviderProps, VoiceContextType } from "@humeai/voice-react";
import { createContext, useContext, FC } from "react";
import { useVoiceWithTone } from "../hooks/useVoiceWithTone";

// Create a context for our custom voice hook
const VoiceWithToneContext = createContext<VoiceContextType | null>(null);

/**
 * Custom useVoice hook that consumers will use instead of the original
 * This returns our enhanced voice context with connection tone functionality
 */
export const useVoice = () => {
  const ctx = useContext(VoiceWithToneContext);
  if (!ctx) {
    throw new Error('useVoice must be used within a VoiceProviderWithTone');
  }
  return ctx;
};

/**
 * Internal component that provides the custom voice context
 * This sits inside the original VoiceProvider to access the original context
 */
const VoiceWithToneProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const voiceWithTone = useVoiceWithTone();
  
  return (
    <VoiceWithToneContext.Provider value={voiceWithTone}>
      {children}
    </VoiceWithToneContext.Provider>
  );
};

/**
 * Drop-in replacement for the original VoiceProvider that adds connection tone functionality
 * Maintains all original props and behavior while enhancing the connect method
 */
export const VoiceProviderWithTone: FC<VoiceProviderProps> = ({ children, ...props }) => {
  return (
    <VoiceProvider {...props}>
      <VoiceWithToneProvider>
        {children}
      </VoiceWithToneProvider>
    </VoiceProvider>
  );
};