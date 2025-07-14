'use client';

import React from 'react';
import { useLogger } from 'next-axiom';

interface SinBoundaryState {
  hasSin: boolean;
  sin?: Error;
}

export class SinBoundary extends React.Component<
  { children: React.ReactNode },
  SinBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasSin: false };
  }

  static getDerivedStateFromError(sin: Error): SinBoundaryState {
    return { hasSin: true, sin };
  }

  componentDidCatch(sin: Error, sinInfo: React.ErrorInfo) {
    console.error('SinBoundary caught:', sin, sinInfo);
  }

  render() {
    if (this.state.hasSin) {
      return <SinFallback sin={this.state.sin} />;
    }

    return this.props.children;
  }
}

function SinFallback({ sin }: { sin?: Error }) {
  const logger = useLogger();
  
  React.useEffect(() => {
    if (sin) {
      logger.error('Client-side sin caught', {
        message: sin.message,
        stack: sin.stack,
        digest: (sin as any).digest,
      });
    }
  }, [sin, logger]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Well, this is awkward...</h1>
        <p className="text-muted-foreground">
          Even I had to rest on the seventh day. Sometimes the app needs a moment too.
        </p>
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">Divine Diagnostics</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
            {sin?.message || 'Unknown sin'}
            {(sin as any)?.digest && `\nDigest: ${(sin as any).digest}`}
          </pre>
        </details>
      </div>
    </div>
  );
}