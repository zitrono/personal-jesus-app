"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal = ({ onClose }: AboutModalProps) => {
  // Handle ESC key press
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // Add event listener for ESC key
    document.addEventListener("keydown", handleEscKey);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [handleEscKey]);

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative flex min-h-screen items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-2xl animate-slideUp">
          {/* Close Button */}
          <button
            onClick={onClose}
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
                id="about-modal-title"
                className="text-4xl sm:text-5xl font-bold text-center 
                         text-[var(--divine-gold)] renaissance-text-pulse"
              >
                About Personal Jesus
              </h1>
              
              {/* Main Content */}
              <div className="space-y-5 text-gray-200">
                <p className="text-base sm:text-lg leading-relaxed">
                  This app is inspired by Depeche Mode's iconic 1989 hit "Personal Jesus" - 
                  a song about being someone's personal savior, their confidant who's always 
                  there to hear their prayers and forgive their sins. The track's hypnotic 
                  blues riff and provocative lyrics explore themes of faith, intimacy, and 
                  the human need for absolution.
                </p>
                
                <p className="flex items-center gap-3 text-base sm:text-lg">
                  <span className="text-xl">🎵</span>
                  <a 
                    href="https://www.youtube.com/watch?v=u1xrNaTO1bI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] 
                             transition-colors underline underline-offset-4"
                  >
                    Listen to "Personal Jesus" on YouTube
                  </a>
                </p>
                
                <p className="text-base sm:text-lg">
                  Built by{" "}
                  <a 
                    href="https://t.me/zitrono" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] 
                             transition-colors underline underline-offset-4"
                  >
                    @zitrono
                  </a>
                  {" "}for his 50th birthday <span className="text-xl">🎂</span>
                </p>
                
                {/* Easter Egg Section */}
                <div className="relative mt-6 p-4 bg-black/50 rounded-lg 
                              border-l-4 border-[var(--divine-gold)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--divine-gold)]/10 
                                to-transparent pointer-events-none" />
                  <div className="relative">
                    <p className="text-sm sm:text-base text-gray-300">
                      <span className="font-semibold text-[var(--divine-gold)]">Easter Egg:</span> Say "Personal Jesus" during your conversation for a special response.
                    </p>
                  </div>
                </div>
                
                {/* Contact Section */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-[var(--divine-gold)]">
                    Contact
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300">
                    Telegram:{" "}
                    <a 
                      href="https://t.me/zitrono" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] 
                               transition-colors underline underline-offset-4"
                    >
                      @zitrono
                    </a>
                    {" • "}
                    Feedback? →{" "}
                    <a 
                      href="https://t.me/zitrono" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] 
                               transition-colors underline underline-offset-4"
                    >
                      zitrono
                    </a>
                  </p>
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
    </div>
  );

  // Only render on client side
  if (typeof window === "undefined") return null;
  
  return createPortal(modalContent, document.body);
};