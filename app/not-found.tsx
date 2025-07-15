'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-divine-gold/10 to-renaissance-blue/10">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-divine-gold">Divine Path Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The sacred path you seek does not exist in this realm. Even I can't find it.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground/80">
            Sometimes we wander off the path. That's okay - I'm here to guide you back to the light.
          </p>
          
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-divine-gold hover:bg-divine-gold/90 text-divine-dark rounded-full font-medium transition-colors divine-glow"
          >
            Return to the Light
          </a>
        </div>
      </div>
    </div>
  );
}