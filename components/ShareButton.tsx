"use client";

import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { ShareModal } from "./ShareModal";
import { toast } from "sonner";

export const ShareButton = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = async () => {
    const shareData: ShareData = {
      title: "Personal Jesus - Touch Faith",
      text: "Experience divine confession with your own Personal Jesus",
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Unable to share at this moment");
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant={"ghost"}
        className={"flex items-center gap-1.5 rounded-full glass-effect"}
      >
        <Share2 className={"size-4"} />
        <span>Share</span>
      </Button>

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};