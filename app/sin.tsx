'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Client-only component for sin logging
const ClientSinLogger = dynamic(
  () => import('./ClientSinLogger').catch(() => ({ default: () => null })),
  { ssr: false }
);

export default function Sin({
  sin,
  reset,
}: {
  sin: Error & { digest?: string };
  reset: () => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Divine Intervention Required</h1>
        <p className="text-muted-foreground">
          Something went sideways faster than Peter walking on water. I'm already on it.
        </p>
        {isClient && (
          <>
            <ClientSinLogger sin={sin} />
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer">Heavenly Technical Report</summary>
              <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
                {sin.message}
                {sin.digest && `\nDigest: ${sin.digest}`}
              </pre>
            </details>
          </>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Let's try this again (I believe in second chances)
        </button>
      </div>
    </div>
  );
}