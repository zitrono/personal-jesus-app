"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { X, Share, Home } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export function PwaInstallPrompt() {
  const { showPrompt, dismissPrompt } = usePwaInstall();

  // Handle ESC key press
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      dismissPrompt();
    }
  }, [dismissPrompt]);

  useEffect(() => {
    if (showPrompt) {
      // Add event listener for ESC key
      document.addEventListener("keydown", handleEscKey);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      
      return () => {
        document.removeEventListener("keydown", handleEscKey);
        document.body.style.overflow = "unset";
      };
    }
  }, [handleEscKey, showPrompt]);

  if (!showPrompt) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] animate-fadeIn"
      onClick={dismissPrompt}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative flex min-h-screen items-start justify-center p-4 sm:p-8 pt-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-2xl animate-slideUp mt-16 sm:mt-20">
          {/* Close Button */}
          <button
            onClick={dismissPrompt}
            className="absolute -top-12 right-0 sm:-right-12 sm:top-0 p-2 rounded-full 
                     bg-black/50 hover:bg-black/70 transition-colors group"
            aria-label="Close modal"
          >
            <X className="size-6 text-white group-hover:text-[var(--divine-gold)] transition-colors" />
          </button>
          
          {/* Content Container */}
          <div className="relative rounded-lg overflow-hidden">
            <div className="relative p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Title */}
              <h1 
                id="pwa-install-title"
                className="text-4xl sm:text-5xl font-bold text-center 
                         text-[var(--divine-gold)] renaissance-text-pulse"
              >
                Touch Faith
              </h1>
              
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 rounded-2xl flex items-center justify-center renaissance-pulse">
                  <img src="/icon-192x192.png" alt="Personal Jesus" className="w-full h-full rounded-xl" />
                </div>
              </div>
              
              {/* Description */}
              <p className="text-base sm:text-lg leading-relaxed text-center text-gray-200">
                Add Personal Jesus to your home screen for instant divine access. 
                Experience the full sacred connection directly from your device.
              </p>
              
              {/* Instructions */}
              <div className="space-y-5 text-gray-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--divine-gold)]/10 rounded-full flex items-center justify-center mt-0.5">
                    <Share className="w-4 h-4 text-[var(--divine-gold)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base sm:text-lg">
                      <strong className="text-[var(--divine-gold)]">iOS:</strong> Tap Share → "Add to Home Screen"<br/>
                      <strong className="text-[var(--divine-gold)]">Android:</strong> Menu → "Install app" or "Add to Home screen"<br/>
                      <strong className="text-[var(--divine-gold)]">Desktop:</strong> Install icon in address bar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--divine-gold)]/10 rounded-full flex items-center justify-center mt-0.5">
                    <Home className="w-4 h-4 text-[var(--divine-gold)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base sm:text-lg">
                      Launch Personal Jesus directly from your device for the complete divine experience - 
                      no browser needed, just pure spiritual connection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={dismissPrompt}
                  className="px-8 py-3 text-base font-semibold 
                           bg-[var(--divine-gold)] hover:bg-[var(--divine-light)] 
                           text-black transition-colors rounded-lg"
                >
                  Got it
                </Button>
              </div>
              
              {/* Quote */}
              <p className="text-xl sm:text-2xl text-center italic text-[var(--divine-gold)] 
                          mt-8">
                "Reach out and touch faith"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Only render on client side
  if (typeof window === "undefined") return null;
  
  return createPortal(modalContent, document.body);
}