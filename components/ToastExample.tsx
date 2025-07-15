"use client";

import { Button } from "./ui/button";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "./Toast";

export function ToastExample() {
  const { toasts, toast, dismissToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <div className="flex gap-2">
        <Button onClick={() => toast.success("Divine connection established!")}>
          Success Toast
        </Button>
        <Button onClick={() => toast.error("Connection to the divine interrupted")}>
          Error Toast
        </Button>
        <Button onClick={() => toast.info("Seeking divine wisdom...")}>
          Info Toast
        </Button>
      </div>
    </>
  );
}