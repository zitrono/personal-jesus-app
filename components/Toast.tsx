"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const toastColors = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-blue-400",
};

export function Toast({ id, message, type = "info", duration = 4000, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  return (
    <div
      className={cn(
        "floating-sacred-panel min-w-[300px] max-w-[500px] px-5 py-4 flex items-center gap-3 rounded-2xl",
        "transform transition-all duration-300 ease-out",
        isLeaving ? "toast-exit" : "toast-enter"
      )}
      role="alert"
    >
      <Icon className={cn("size-5 flex-shrink-0", toastColors[type])} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={handleDismiss}
        className="size-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
  }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-20 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}