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
    console.log('Connect method called'); // Debug log
    alert('Connect method called - iOS Debug'); // Visible debug for iOS
    
    try {
      // For iOS, we need to be very careful about user gesture context
      // Let's try the original approach but with better error handling
      
      // Create audio element immediately to use user gesture
      const audio = new Audio('/personal_jesus_connect_tone.wav');
      
      console.log('About to request microphone permission'); // Debug log
      
      // Request microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      console.log('Microphone permission granted'); // Debug log
      
      // Play the connection tone
      try {
        console.log('About to play connection tone'); // Debug log
        await audio.play();
        console.log('Connection tone started playing'); // Debug log
        
        // Wait for audio to finish or continue after a short delay
        await new Promise<void>(resolve => {
          audio.addEventListener('ended', () => {
            console.log('Connection tone ended'); // Debug log
            resolve();
          });
          // Fallback timeout in case audio doesn't play
          setTimeout(() => {
            console.log('Connection tone timeout'); // Debug log
            resolve();
          }, 2000);
        });
      } catch (audioError) {
        console.error('The sacred connection tone is being a little shy today:', audioError);
        // Continue even if tone fails to play
      }
      
      // Clean up the stream we created for permission check
      micStream.getTracks().forEach(track => track.stop());
      console.log('Cleaned up permission check stream'); // Debug log
      
      // Now proceed with the original Hume connection
      console.log('About to connect to Hume'); // Debug log
      await originalVoice.connect();
      console.log('Hume connection successful'); // Debug log
      
    } catch (error) {
      console.error('Error in connect method:', error); // Debug log
      
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