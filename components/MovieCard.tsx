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
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(imdbID));

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
      setInWatchlist(false);
    } else {
      addToWatchlist({
        imdbID,
        title,
        poster,
        year,
        type: 'movie',
      });
      setInWatchlist(true);
    }
  };

  return (
    <Link href={`/movie/${imdbID}`}>
      <div
        ref={cardRef}
        className={`relative rounded-lg overflow-hidden bg-white shadow-md ${styles.movieCardHover}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full aspect-[2/3]">
          {poster && poster !== 'N/A' ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23e0e0e0" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
          >
            <Heart
              size={20}
              className={inWatchlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        </div>
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center cursor-pointer">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-center px-4">
            <p className="font-bold text-sm truncate">{title}</p>
            <p className="text-xs text-gray-200">{year}</p>
            {rating && <p className="text-xs text-yellow-300 mt-2">★ {rating}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};
