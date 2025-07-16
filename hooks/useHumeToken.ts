"use client";

import { useState, useEffect, useCallback } from "react";

interface UseHumeTokenReturn {
  token: string | null;
  loading: boolean;
}

export function useHumeToken(): UseHumeTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hume-token");
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json();
      setToken(data.accessToken);
    } catch (error) {
      console.error("Error fetching Hume token:", error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch token on mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      fetchToken();
    }
  }, [fetchToken]);

  // Refresh token when app becomes visible (iOS PWA fix)
  useEffect(() => {
    // Only add listener in browser environment
    if (typeof window === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchToken();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchToken]);

  return { token, loading };
}