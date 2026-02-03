'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="text-center px-4">
        <h2 className="text-2xl font-display text-white mb-4">Something went wrong</h2>
        <p className="text-brand-light mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-primary/80 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
