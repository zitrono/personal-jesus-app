"use client";

import { Button } from "./ui/button";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { AboutModal } from "./AboutModal";
import { ShareButton } from "./ShareButton";
import { useSWUpdate } from "@/hooks/useSWUpdate";

export const Nav = () => {
  const { theme, setTheme } = useTheme();
  const { updateReady, activate } = useSWUpdate();
  const [mounted, setMounted] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleUpdate = () => {
    activate();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        className={"fixed top-0 right-0 left-0 pt-safe px-4 pb-2 flex justify-between items-center z-50"}
      >
        <div className={"flex items-center gap-1"}>
          <ShareButton />
        </div>
        <div className={"flex items-center gap-1"}>
          <Button
            onClick={() => setShowAboutModal(true)}
            variant={"ghost"}
            className={"flex items-center gap-1.5 rounded-full glass-effect"}
          >
            <span className="text-lg">🎵</span>
            <span>About</span>
          </Button>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant={"ghost"}
            className={"flex items-center gap-1.5 rounded-full glass-effect"}
          >
            <span>
              {!mounted ? (
                <div className="size-4 rounded-full bg-current opacity-20 animate-pulse" />
              ) : theme === "dark" ? (
                <Sun className={"size-4"} />
              ) : (
                <Moon className={"size-4"} />
              )}
            </span>
            <span>{!mounted ? "Theme" : theme === 'dark' ? "Light" : "Dark"} Mode</span>
          </Button>
        </div>
      </div>
    {showAboutModal && (
      <AboutModal onClose={() => setShowAboutModal(false)} />
    )}
    
    {/* Update Available Button - positioned like call button */}
    {updateReady && (
      <div className="fixed inset-0 p-4 flex items-end justify-center pointer-events-none z-40">
        <div className="pointer-events-auto">
          <Button
            onClick={handleUpdate}
            className="flex items-center gap-1.5 rounded-full backdrop-blur-md shadow-2xl divine-glow renaissance-pulse"
          >
            <span className="text-lg">🔄</span>
            <span>Update Available</span>
          </Button>
        </div>
      </div>
    )}
  </>
  );
};
