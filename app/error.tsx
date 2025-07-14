'use client';

import { useEffect } from 'react';
import { useLogger } from 'next-axiom';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const logger = useLogger();

  useEffect(() => {
    // Log the error to Axiom
    logger.error('Global error handler caught error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
    });
  }, [error, logger]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Our team has been notified.
        </p>
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">Technical details</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}