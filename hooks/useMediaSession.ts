"use client";

import { useEffect } from 'react';
import { useVoice } from '@/components/VoiceProviderWithTone';

export const useMediaSession = () => {
  const { status } = useVoice();
  
  useEffect(() => {
    // Only set MediaSession when connected
    if (status.value === 'connected' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Personal Jesus',
        artist: 'Divine Confessor',
        album: 'Touch Faith',
        artwork: [
          { src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      
      // Set up action handlers
      navigator.mediaSession.setActionHandler('play', () => {
        // Hume handles its own audio, this is just for display
        console.log('Media session play action');
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        // Hume handles its own audio, this is just for display
        console.log('Media session pause action');
      });
    }
    
    // Clean up when disconnected
    if (status.value === 'disconnected' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
    }
  }, [status.value]);
};