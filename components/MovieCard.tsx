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
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x450/1a3a3a/ffffff?text=No+Poster';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-600 font-bold uppercase text-[10px] sm:text-xs tracking-widest text-center px-2">
              {title}
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
