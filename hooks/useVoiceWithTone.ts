"use client";

import { useVoice } from "@humeai/voice-react";
import { useCallback } from "react";

/**
 * Custom hook that wraps the original useVoice hook to play connection tone
 * at the optimal timing - right after microphone permission is granted
 * but before Hume starts processing audio
 */
export const useVoiceWithTone = () => {
  const originalVoice = useVoice();
  
  // Override the connect method to inject connection tone
  const connect = useCallback(async () => {
    try {
      // For iOS, we need to be very careful about user gesture context
      // Let's try the original approach but with better error handling
      
      // Create audio element immediately to use user gesture
      const audio = new Audio('/personal_jesus_connect_tone.wav');
      
      // Request microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Play the connection tone
      try {
        await audio.play();
        
        // Wait for audio to finish or continue after a short delay
        await new Promise<void>(resolve => {
          audio.addEventListener('ended', () => {
            resolve();
          });
          // Fallback timeout in case audio doesn't play
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      } catch (audioError) {
        console.error('The sacred connection tone is being a little shy today:', audioError);
        // Continue even if tone fails to play
      }
      
      // Clean up the stream we created for permission check
      micStream.getTracks().forEach(track => track.stop());
      
      // Now proceed with the original Hume connection
      await originalVoice.connect();
      
    } catch (error) {
      // Handle permission denied or connection errors
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.error('I need your voice to hear your heart. Please allow microphone access in your browser.');
      } else {
        console.error('Connection failed:', error);
      }
      throw error;
    }
  }, [originalVoice]);

  // Return all original voice properties but with our custom connect method
  return {
    ...originalVoice,
    connect,
  };
};