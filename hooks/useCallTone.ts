import { useCallback, useRef, useState } from 'react';

interface CallToneState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useCallTone = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<CallToneState>({
    isPlaying: false,
    isLoading: false,
    error: null
  });

  // Initialize audio element
  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/personal_jesus_connect_tone.wav');
      audioRef.current.preload = 'auto';
      
      // Set up event listeners
      audioRef.current.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      });
      
      audioRef.current.addEventListener('canplaythrough', () => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
      
      audioRef.current.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      });
      
      audioRef.current.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      audioRef.current.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Call tone audio error:', e);
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          isLoading: false,
          error: 'Failed to load connection tone' 
        }));
      });
    }
    return audioRef.current;
  }, []);

  // Play the connection tone with iOS-compatible priming
  const playTone = useCallback(async (): Promise<void> => {
    const audio = initializeAudio();
    
    try {
      // Critical: Prime audio immediately within user gesture context
      // This is essential for iOS and mobile browsers
      const playPromise = audio.play();
      
      // Handle initial play attempt
      try {
        await playPromise;
        console.log('[useCallTone] Connection tone started successfully');
      } catch (playError) {
        console.log('[useCallTone] Initial play blocked, will retry after mic permission');
        // Don't throw here - we'll retry after microphone permission
      }
    } catch (error) {
      console.error('[useCallTone] Failed to play connection tone:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to play connection tone' 
      }));
    }
  }, [initializeAudio]);

  // Retry playback after microphone permission (for mobile browsers)
  const retryPlayback = useCallback(async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // After microphone permission, audio context should be active
      if (audio.paused) {
        await audio.play();
        console.log('[useCallTone] Connection tone resumed after mic permission');
      }
    } catch (error) {
      console.error('[useCallTone] Failed to retry playback:', error);
      // Don't throw - connection should continue even if tone fails
    }
  }, []);

  // Stop the connection tone
  const stopTone = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      console.log('[useCallTone] Connection tone stopped');
    }
  }, []);

  // Cleanup audio resources
  const cleanup = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audioRef.current = null;
      setState({
        isPlaying: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  return {
    playTone,
    retryPlayback,
    stopTone,
    cleanup,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    error: state.error
  };
};