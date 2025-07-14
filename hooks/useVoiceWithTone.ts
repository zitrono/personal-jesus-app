"use client";

import { useVoice } from "@humeai/voice-react";
import { useCallback } from "react";
import { divineMessages } from "@/utils/divineMessages";

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
      // Create audio element and prime it immediately within user gesture context
      // This is critical for mobile browsers (iOS/Android) which require audio
      // to be initiated synchronously within a user gesture
      const audio = new Audio('/personal_jesus_connect_tone.wav');
      
      // Prime the audio by calling play() immediately
      // On mobile, this associates the audio with the user gesture
      const audioPlayPromise = audio.play().catch(() => {
        // Silently catch if autoplay is blocked
        // The audio will still be primed for later playback
      });
      
      // Request microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Now that we have mic permission, the audio context is active
      // If the audio was primed but blocked, try playing again
      try {
        // Wait for the initial play attempt to settle
        await audioPlayPromise;
        
        // If audio is not playing yet, try again now that we have mic permission
        if (audio.paused) {
          await audio.play();
        }
        
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
        console.error(divineMessages.microphonePermissionDenied);
      } else {
        console.error(divineMessages.connectionFailed, error);
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