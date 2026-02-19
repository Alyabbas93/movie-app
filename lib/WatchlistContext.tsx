'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WatchlistItem {
  imdbID: string;
  title: string;
  poster: string;
  year: string;
  type: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (imdbID: string) => void;
  isInWatchlist: (imdbID: string) => boolean;
  watchlistCount: number;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
        console.log('[v0] Watchlist loaded from localStorage:', JSON.parse(saved).length, 'items');
      }
    } catch (error) {
      console.error('[v0] Failed to load watchlist:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log('[v0] Watchlist saved to localStorage:', watchlist.length, 'items');
      } catch (error) {
        console.error('[v0] Failed to save watchlist:', error);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.imdbID === item.imdbID)) {
        console.log('[v0] Item already in watchlist:', item.title);
        return prev;
      }
      console.log('[v0] Added to watchlist:', item.title);
      return [...prev, item];
    });
  };

  const removeFromWatchlist = (imdbID: string) => {
    setWatchlist((prev) => {
      const item = prev.find((i) => i.imdbID === imdbID);
      console.log('[v0] Removed from watchlist:', item?.title);
      return prev.filter((i) => i.imdbID !== imdbID);
    });
  };

  const isInWatchlist = (imdbID: string) => {
    return watchlist.some((i) => i.imdbID === imdbID);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        watchlistCount: watchlist.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
};
