'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Crashed:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-900 p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-200">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <div className="bg-rose-100 p-4 rounded-lg overflow-auto mb-6 text-sm font-mono whitespace-pre-wrap">
          {error.message || 'Unknown rendering error'}
          {'\n\n'}
          {error.stack}
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
