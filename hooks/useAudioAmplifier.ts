"use client";

import { useEffect, useRef } from 'react';

interface AudioAmplifierOptions {
  amplificationLevel?: number; // Default 1.5 (50% boost)
  enabled?: boolean;
}

export const useAudioAmplifier = ({ 
  amplificationLevel = 1.5, 
  enabled = true 
}: AudioAmplifierOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const processedElementsRef = useRef<WeakSet<HTMLAudioElement>>(new WeakSet());

  useEffect(() => {
    if (!enabled) return;
    
    // Check if we're in the browser
    if (typeof window === 'undefined' || !window.AudioContext) return;

    // Create audio context on first user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('[AudioAmplifier] Audio context initialized');
      }
    };

    // Process an audio element to amplify its output
    const processAudioElement = (audio: HTMLAudioElement) => {
      // Skip if already processed
      if (processedElementsRef.current.has(audio)) return;
      
      // Mark as processed
      processedElementsRef.current.add(audio);

      // Initialize audio context if needed
      initAudioContext();
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      try {
        // Create a media element source from the audio element
        const source = audioContext.createMediaElementSource(audio);
        
        // Create gain node for amplification
        const gainNode = audioContext.createGain();
        
        // Set amplification level (>1.0 for boost)
        gainNode.gain.value = amplificationLevel;
        
        // Connect: audio -> gain -> speakers
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        console.log(`[AudioAmplifier] Audio element amplified to ${amplificationLevel}x`);
        
        // Add volume control methods to the audio element
        (audio as any).__originalVolume = audio.volume;
        (audio as any).__amplificationLevel = amplificationLevel;
        
      } catch (error) {
        // This can happen if the audio element is already connected to another context
        console.warn('[AudioAmplifier] Could not process audio element:', error);
      }
    };

    // Observer to detect new audio elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Check if it's an audio element
          if (node instanceof HTMLAudioElement) {
            // Wait for the element to be ready
            if (node.readyState >= 1) { // HAVE_METADATA
              processAudioElement(node);
            } else {
              node.addEventListener('loadedmetadata', () => {
                processAudioElement(node);
              }, { once: true });
            }
          }
          
          // Also check for audio elements in subtree
          if (node instanceof Element) {
            const audioElements = node.querySelectorAll('audio');
            audioElements.forEach((audio) => {
              if (audio instanceof HTMLAudioElement) {
                if (audio.readyState >= 1) {
                  processAudioElement(audio);
                } else {
                  audio.addEventListener('loadedmetadata', () => {
                    processAudioElement(audio);
                  }, { once: true });
                }
              }
            });
          }
        });
      });
    });

    // Start observing the document for new audio elements
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Process any existing audio elements
    const existingAudioElements = document.querySelectorAll('audio');
    existingAudioElements.forEach((audio) => {
      if (audio instanceof HTMLAudioElement) {
        if (audio.readyState >= 1) {
          processAudioElement(audio);
        } else {
          audio.addEventListener('loadedmetadata', () => {
            processAudioElement(audio);
          }, { once: true });
        }
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [amplificationLevel, enabled]);

  return {
    setAmplificationLevel: (level: number) => {
      // This would require re-initialization, keeping it simple for now
      console.log(`[AudioAmplifier] Amplification level change to ${level}x requires component remount`);
    }
  };
};