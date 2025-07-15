'use client';

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={false}
      visibleToasts={5}
      gap={8}
      toastOptions={{
        className: "sonner-floating-sacred",
        duration: 4000,
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
        },
      }}
      style={
        {
          "--normal-bg": "transparent",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "rgba(255, 215, 0, 0.3)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
