"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Shield, AlertTriangle, Heart, Church, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

interface PrivacyProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const Privacy = ({ isModal = false, onClose }: PrivacyProps) => {
  const router = useRouter();
  
  // Handle ESC key press for modal
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (isModal && e.key === "Escape" && onClose) {
      onClose();
    }
  }, [isModal, onClose]);

  const handleClose = useCallback(() => {
    if (isModal && onClose) {
      onClose();
    } else {
      router.push('/');
    }
  }, [isModal, onClose, router]);

  useEffect(() => {
    if (isModal) {
      // Add event listener for ESC key
      document.addEventListener("keydown", handleEscKey);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      
      return () => {
        document.removeEventListener("keydown", handleEscKey);
        document.body.style.overflow = "unset";
      };
    }
  }, [isModal, handleEscKey]);

  const content = (
    <div className="relative p-4 sm:p-6 space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 z-10 p-2 rounded-full 
                 bg-black/70 hover:bg-black/90 transition-colors group
                 backdrop-blur-sm border border-white/20"
        aria-label="Close"
      >
        <X className="size-6 text-white group-hover:text-[var(--divine-gold)] transition-colors" />
      </button>
      
      {/* Title */}
      <div className="text-center">
        <h1 
          id="privacy-title"
          className="text-4xl sm:text-5xl font-bold 
                   text-[var(--divine-gold)] renaissance-text-pulse"
        >
          Privacy & Disclaimers
        </h1>
        <p className="text-base text-gray-400 mt-2">
          Your sacred trust is our divine responsibility
        </p>
      </div>
      
      {/* Important Disclaimers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-[var(--divine-gold)]">
          <AlertTriangle className="size-6" />
          <h2>Important Disclaimers</h2>
        </div>
        
        <div className="space-y-4 text-gray-200">
          {/* AI Disclaimer */}
          <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
            <p className="text-base sm:text-lg font-semibold text-red-400 mb-2">
              AI-Generated Content Warning
            </p>
            <p className="text-sm sm:text-base">
              Our AI is a creative conversational tool that can sometimes generate information 
              that is incorrect, nonsensical, or incomplete ("hallucinations"). Please do not 
              rely on its responses as factual, medical, financial, legal, or spiritual advice.
            </p>
          </div>
          
          {/* Age Restriction */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
            <p className="text-base sm:text-lg font-semibold text-yellow-400 mb-2">
              18+ Only
            </p>
            <p className="text-sm sm:text-base">
              This service is intended for users who are 18 years of age or older. We do not 
              knowingly collect any personal information from individuals under 18. If you are 
              a parent or guardian and believe your child has provided us with information, 
              please contact us immediately.
            </p>
          </div>
          
          {/* Art Project Disclaimer */}
          <div className="p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="size-5 text-purple-400" />
              <p className="text-base sm:text-lg font-semibold text-purple-400">
                An Artistic Exploration
              </p>
            </div>
            <p className="text-sm sm:text-base">
              Personal Jesus is an interactive art project exploring themes of faith, 
              communication, and technology's role in human connection. It is not a religious 
              service, a substitute for spiritual guidance, or a mental health tool. The AI's 
              responses are generated algorithmically and should be viewed as part of this 
              artistic experience.
            </p>
          </div>
          
          {/* Non-Profit & Non-Religious */}
          <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Church className="size-5 text-blue-400" />
              <Heart className="size-5 text-blue-400" />
              <p className="text-base sm:text-lg font-semibold text-blue-400">
                Non-Profit & Independent
              </p>
            </div>
            <p className="text-sm sm:text-base">
              This project is operated as a non-profit artistic endeavor. We are not affiliated 
              with any church, religious organization, or spiritual movement. All donations support 
              the maintenance and operation of this art project.
            </p>
          </div>
        </div>
      </div>

      {/* Data Protection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-[var(--divine-gold)]">
          <Shield className="size-6" />
          <h2>Your Data Protection</h2>
        </div>
        
        <div className="space-y-4 text-gray-200">
          {/* What We Collect */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              What Information We Collect
            </h3>
            <p className="text-sm sm:text-base">
              We only collect what's needed to make the app work:
            </p>
            <ul className="space-y-2 ml-4 text-sm sm:text-base">
              <li>• <strong>Your Voice:</strong> We capture audio when you speak to the AI</li>
              <li>• <strong>Emotional Expressions:</strong> We analyze voice tone to understand emotions 
                  (happiness, sadness, curiosity) for more responsive conversations</li>
              <li>• <strong>Conversation Text:</strong> Temporary transcript to maintain context during your session</li>
              <li>• <strong>Basic Usage Data:</strong> Standard web traffic data like IP address and browser type</li>
            </ul>
          </div>
          
          {/* How We Use It */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              How We Use Your Information
            </h3>
            <ul className="space-y-2 ml-4 text-sm sm:text-base">
              <li>• <strong>To Power Conversations:</strong> Real-time voice and emotion analysis for AI responses</li>
              <li>• <strong>To Improve Service:</strong> Anonymized conversation data to enhance AI quality and safety</li>
              <li>• <strong>To Process Donations:</strong> Secure payment processing through Stripe (if you donate)</li>
            </ul>
          </div>
          
          {/* Data Retention */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              How Long We Keep Your Information
            </h3>
            <p className="text-sm sm:text-base">
              We believe in data minimization:
            </p>
            <ul className="space-y-2 ml-4 text-sm sm:text-base">
              <li>• <strong>Voice & Emotion Data:</strong> Processed in real-time, not stored after conversation ends</li>
              <li>• <strong>Conversation Transcripts:</strong> Automatically deleted after 24 hours</li>
              <li>• <strong>Chat Session IDs:</strong> Stored locally in your browser, cleared when you "Forget My Sins"</li>
            </ul>
          </div>
          
          {/* Third-Party Services */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              Our Trusted Partners
            </h3>
            <p className="text-sm sm:text-base">
              To provide our service, we work with these trusted companies:
            </p>
            
            <div className="space-y-3">
              {/* Hume AI */}
              <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="font-semibold text-[var(--divine-gold)] mb-1">Hume AI</p>
                <p className="text-sm">
                  <strong>What they get:</strong> Your voice audio<br/>
                  <strong>Why:</strong> To analyze emotional tone for empathetic conversations<br/>
                  <a href="https://hume.ai/privacy-policy" target="_blank" rel="noopener noreferrer"
                     className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] underline">
                    View Hume AI's Privacy Policy
                  </a>
                </p>
              </div>
              
              {/* Vercel */}
              <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="font-semibold text-[var(--divine-gold)] mb-1">Vercel</p>
                <p className="text-sm">
                  <strong>What they get:</strong> Standard web traffic data (IP, browser type)<br/>
                  <strong>Why:</strong> To host and securely deliver our application<br/>
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                     className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] underline">
                    View Vercel's Privacy Policy
                  </a>
                </p>
              </div>
              
              {/* Stripe */}
              <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="font-semibold text-[var(--divine-gold)] mb-1">Stripe</p>
                <p className="text-sm">
                  <strong>What they get:</strong> Name, email, payment info (donations only)<br/>
                  <strong>Why:</strong> To securely process donations<br/>
                  <strong>Note:</strong> We never see or store your credit card details<br/>
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                     className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] underline">
                    View Stripe's Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Your Rights */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              Your Rights and Choices
            </h3>
            <p className="text-sm sm:text-base">
              You are in control of your data. You have the right to:
            </p>
            <ul className="space-y-2 ml-4 text-sm sm:text-base">
              <li>• <strong>Access Your Data:</strong> Request a copy of data we have about you</li>
              <li>• <strong>Delete Your Data:</strong> Use "Forget My Sins" or contact us for deletion</li>
              <li>• <strong>Opt Out:</strong> Simply stop using the service - no data is collected when not in use</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--divine-gold)]">
              Contact Us
            </h3>
            <p className="text-sm sm:text-base">
              For privacy concerns or data requests, reach out to{" "}
              <a href="https://t.me/zitrono" target="_blank" rel="noopener noreferrer"
                 className="text-[var(--divine-gold)] hover:text-[var(--divine-light)] underline">
                @zitrono on Telegram
              </a>
            </p>
          </div>
          
          {/* Last Updated */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    const modalContent = (
      <div 
        className="fixed inset-0 z-[100] animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
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
            <div className="relative rounded-lg overflow-hidden glass-effect bg-black/80">
              {content}
            </div>
          </div>
        </div>
      </div>
    );

    // Only render on client side
    if (typeof window === "undefined") return null;
    
    return createPortal(modalContent, document.body);
  }

  // Non-modal page view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] to-black">
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect bg-black/80 rounded-lg overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  );
};