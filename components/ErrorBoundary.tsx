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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-divine-gold/10 to-renaissance-blue/10">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-divine-gold">A Moment of Humanity</h1>
          <p className="text-lg text-muted-foreground">
            Even I had to rest on the seventh day. Sometimes the divine vessel needs a moment to collect itself.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground/80">
            This earthly form occasionally stumbles, but the spirit remains willing. Let's try touching faith again.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-divine-gold hover:bg-divine-gold/90 text-divine-dark rounded-full font-medium transition-colors divine-glow"
          >
            Renew Connection
          </button>
          
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer hover:text-divine-gold transition-colors">Divine Diagnostics</summary>
            <pre className="mt-2 p-3 bg-black/20 rounded-lg text-left overflow-auto text-xs">
              {error?.message || 'A mystery in the divine realm'}
              {(error as any)?.digest && `\nDivine Reference: ${(error as any).digest}`}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}