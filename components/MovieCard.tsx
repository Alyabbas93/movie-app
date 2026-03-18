'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { animateCardHover, animateCardHoverOut } from '@/lib/animations';
import styles from '@/styles/animations.module.css';
import { useWatchlist } from '@/lib/WatchlistContext';

interface MovieCardProps {
  imdbID: string;
  title: string;
  poster: string;
  year: string;
  rating?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ imdbID, title, poster, year, rating }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(imdbID);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      animateCardHover(cardRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      animateCardHoverOut(cardRef.current);
    }
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(imdbID);
    } else {
      addToWatchlist({
        imdbID,
        title,
        poster,
        year,
        type: 'movie',
      });
    }
  };

  return (
    <Link href={`/movie/${imdbID}`} className="block h-full no-underline">
      <div
        ref={cardRef}
        className={`relative h-full rounded-xl overflow-hidden bg-white dark:bg-[#1a3a3a] shadow-lg group transition-all duration-300 cursor-pointer border border-gray-100 dark:border-white/5 active:scale-95 ${styles.movieCardHover}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full aspect-[2/3] sm:aspect-[2/3]">
          {poster && poster !== 'N/A' ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              draggable={false}
              onError={(e) => {
                // Replace broken image with a styled no-poster div (no external dependency)
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full flex flex-col items-center justify-center gap-2 bg-[#1a3a3a] text-white/40 text-[10px] font-bold uppercase tracking-widest text-center px-2';
                  placeholder.innerHTML = `<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg><span>${title.substring(0, 20)}</span>`;
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#1a3a3a] flex flex-col items-center justify-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest text-center px-2">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
              <span>{title.substring(0, 20)}</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 sm:opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistToggle}
            className="absolute top-2 right-2 p-2 sm:p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-red-500 hover:border-red-500 active:bg-red-600 transition-all z-30"
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Heart
              size={16}
              sm-size={18}
              strokeWidth={3}
              className={inWatchlist ? 'fill-white text-white' : 'text-white'}
            />
          </button>

          {/* Info on hover/base */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 transition-all duration-300">
            <h3 className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2 mb-1 group-hover:drop-shadow-md">{title}</h3>
            <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              <span>{year}</span>
              {rating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="text-yellow-400">★ {rating}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
