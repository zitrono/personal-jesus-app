"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import { chatStorage } from "@/utils/chatStorage";

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal = ({ onClose }: AboutModalProps) => {
  const [sinsForgivenButtonHidden, setSinsForgivenButtonHidden] = useState(false);
  
  // Handle ESC key press
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);
  
  // Handle forget sins button click
  const handleForgetSins = useCallback(() => {
    chatStorage.clearChatGroupId();
    toast("What happens in Vatican, stays in Vatican", {
      duration: 2500,
      style: {
        background: 'var(--divine-gold)',
        color: 'black',
        fontWeight: 'bold',
      },
    });
    setSinsForgivenButtonHidden(true);
    
    // Reload page after toast is visible
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  }, []);

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
        className="relative flex min-h-screen items-start justify-center 
                   p-4 sm:p-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] 
                   pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-2xl animate-slideUp mt-4 sm:mt-8">
          {/* Content Container */}
          <div className="relative rounded-lg overflow-hidden">
            <div className="relative p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 p-2 rounded-full 
                         bg-black/70 hover:bg-black/90 transition-colors group
                         backdrop-blur-sm border border-white/20"
                aria-label="Close modal"
              >
                <X className="size-6 text-white group-hover:text-[var(--divine-gold)] transition-colors" />
              </button>
              
              {/* Title */}
              <div className="text-center">
                <h1 
                  id="about-modal-title"
                  className="text-4xl sm:text-5xl font-bold 
                           text-[var(--divine-gold)] renaissance-text-pulse"
                >
                  Personal Jesus
                </h1>
                <p className="text-base text-gray-400 mt-1">
                  v{process.env.NEXT_PUBLIC_BUILD || 'dev'}
                </p>
              </div>
              
              {/* Main Content */}
              <div className="space-y-4 text-gray-200">
                <p className="text-base sm:text-lg leading-relaxed">
                  Inspired by Depeche Mode's 1989 hit "Personal Jesus" - your personal savior 
                  who's always there to hear your prayers and forgive your sins.
                </p>
                
                <p className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-xl">🎵</span>
                  <a 
                    href="https://www.youtube.com/watch?v=u1xrNaTO1bI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] 
                             transition-colors underline underline-offset-4"
                  >
                    Listen on YouTube
                  </a>
                </p>
                
                {/* Easter Eggs Section */}
                <div className="relative p-3 bg-black/50 rounded-lg 
                              border-l-4 border-[var(--divine-gold)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--divine-gold)]/10 
                                to-transparent pointer-events-none" />
                  <div className="relative">
                    <p className="text-sm sm:text-base text-gray-300 mb-2">
                      <span className="font-semibold text-[var(--divine-gold)]">Easter Eggs:</span>
                    </p>
                    <ul className="text-sm sm:text-base text-gray-300 space-y-1 ml-2">
                      <li>• Say "Personal Jesus" during conversation for a special response</li>
                      <li>• Try dark mode for the full divine experience</li>
                    </ul>
                  </div>
                </div>
                
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
                
                {/* Forget Sins Button */}
                {!sinsForgivenButtonHidden && chatStorage.hasChatGroupId() && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleForgetSins}
                      className="divine-button px-6 py-3 text-base font-semibold
                               bg-black/70 hover:bg-black/90 
                               border border-[var(--divine-gold)]
                               text-[var(--divine-gold)] hover:text-[var(--divine-light)]
                               transition-all duration-300"
                    >
                      Forget My Sins
                    </button>
                  </div>
                )}
                
                {/* Quote */}
                <p className="text-xl sm:text-2xl text-center italic text-[var(--divine-gold)] 
                            mt-6">
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