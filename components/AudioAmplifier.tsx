"use client";

import { useAudioAmplifier } from "@/hooks/useAudioAmplifier";

export function AudioAmplifier() {
  // Apply audio amplification to boost Hume voice output
  // 2.0 = double volume, adjust as needed
  useAudioAmplifier({ 
    amplificationLevel: 2.0, // Boost volume by 2x
    enabled: true
  });
  
  return null; // This component doesn't render anything
}