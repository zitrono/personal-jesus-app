'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-divine-gold/10 to-renaissance-blue/10">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-divine-gold">Even I Need a Moment</h1>
            <p className="text-lg text-muted-foreground">
              The divine realm experienced a small tremor. Let me gather myself and we can continue our conversation.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground/80">
              Fear not - this is just the earthly vessel having a moment. The spirit is willing, but sometimes the code is weak.
            </p>
            
            <button 
              onClick={() => reset()}
              className="px-6 py-3 bg-divine-gold hover:bg-divine-gold/90 text-divine-dark rounded-full font-medium transition-colors divine-glow"
            >
              Return to Grace
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}