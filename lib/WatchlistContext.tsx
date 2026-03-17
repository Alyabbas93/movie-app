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
  currentUserId: string;
  switchUser: (userId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('1'); // Default to user 1
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage whenever user switches or on mount
  useEffect(() => {
    try {
      const storageKey = `watchlist_user_${currentUserId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setWatchlist(JSON.parse(saved));
        console.log(`[v0] Watchlist loaded for user ${currentUserId}:`, JSON.parse(saved).length, 'items');
      } else {
        setWatchlist([]); // Empty for new user
        console.log(`[v0] New watchlist initialized for user ${currentUserId}`);
      }
    } catch (error) {
      console.error('[v0] Failed to load watchlist:', error);
      setWatchlist([]);
    }
    setIsLoaded(true);
  }, [currentUserId]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const storageKey = `watchlist_user_${currentUserId}`;
        localStorage.setItem(storageKey, JSON.stringify(watchlist));
        console.log(`[v0] Watchlist saved for user ${currentUserId}:`, watchlist.length, 'items');
      } catch (error) {
        console.error('[v0] Failed to save watchlist:', error);
      }
    }
  }, [watchlist, isLoaded, currentUserId]);

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
      if (item) {
        console.log('[v0] Removed from watchlist:', item.title);
      }
      return prev.filter((i) => i.imdbID !== imdbID);
    });
  };

  const isInWatchlist = (imdbID: string) => {
    return watchlist.some((i) => i.imdbID === imdbID);
  };

  const switchUser = (userId: string) => {
    console.log('[v0] Switching to user:', userId);
    setIsLoaded(false); // Reset loaded state to trigger reload effect correctly
    setCurrentUserId(userId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        watchlistCount: watchlist.length,
        currentUserId,
        switchUser,
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
