'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if we're online on mount
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Optionally redirect to home page when back online
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e8f5f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            <svg
              className="w-full h-full text-[#2d5a5a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
              <line x1="3" y1="3" x2="21" y2="21" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-[#1a3a3a] mb-3 text-balance">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-lg text-[#556f6f] mb-8 leading-relaxed">
          It looks like your internet connection is offline. Please check your connection and try again.
        </p>

        {/* Offline Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#2d5a5a]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[#1a3a3a] font-semibold">No Connection</span>
          </div>
          <p className="text-sm text-[#556f6f]">
            We can't load movies or posters right now. Your connection will be restored automatically.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-[#e8f5f5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#1a3a3a] mb-4">Troubleshooting Tips</h2>
          <ul className="text-left space-y-3 text-sm text-[#556f6f]">
            <li className="flex gap-3">
              <span className="text-[#2d5a5a] font-bold">1.</span>
              <span>Check your WiFi or mobile data connection</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#2d5a5a] font-bold">2.</span>
              <span>Restart your router or device</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#2d5a5a] font-bold">3.</span>
              <span>Try opening another website to verify connectivity</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#2d5a5a] font-bold">4.</span>
              <span>Contact your internet service provider if issues persist</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-[#1a3a3a] text-white rounded-lg font-semibold hover:bg-[#2d5a5a] transition-colors"
          >
            Retry Connection
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 border-2 border-[#2d5a5a] text-[#1a3a3a] rounded-lg font-semibold hover:bg-[#e8f5f5] transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-xs text-[#556f6f]">
          You'll be redirected to the home page when your connection is restored.
        </p>
      </div>
    </main>
  );
}
