'use client';

import React from 'react';
import { useLogger } from 'next-axiom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const logger = useLogger();
  
  React.useEffect(() => {
    if (error) {
      logger.error('Client-side error caught', {
        message: error.message,
        stack: error.stack,
        digest: (error as any).digest,
      });
    }
  }, [error, logger]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-muted-foreground">
          An error occurred while rendering this page.
        </p>
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
            {error?.message || 'Unknown error'}
            {(error as any)?.digest && `\nDigest: ${(error as any).digest}`}
          </pre>
        </details>
      </div>
    </div>
  );
}