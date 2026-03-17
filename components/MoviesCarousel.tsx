'use client';

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { animateCarouselScroll } from '@/lib/animations';

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  imdbRating?: string;
}

interface MoviesCarouselProps {
  title: string;
  movies: Movie[];
}

export const MoviesCarousel: React.FC<MoviesCarouselProps> = ({ title, movies }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      const newPosition = scrollContainerRef.current.scrollLeft + scrollAmount;
      animateCarouselScroll(scrollContainerRef.current, newPosition);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-[#2d5a5a] text-white hover:bg-[#1a3a3a] transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-[#2d5a5a] text-white hover:bg-[#1a3a3a] transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-4 px-1"
        style={{ scrollBehavior: 'auto' }}
      >
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="flex-shrink-0 w-36 sm:w-48 md:w-56"
          >
            <MovieCard
              imdbID={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
              year={movie.Year}
              rating={movie.imdbRating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
