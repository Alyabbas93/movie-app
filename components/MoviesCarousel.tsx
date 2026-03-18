'use client';

import React from 'react';
import { MovieCard } from './MovieCard';

interface SearchMovie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  imdbRating?: string;
}

interface MoviesCarouselProps {
  title: string;
  movies: SearchMovie[];
}

export const MoviesCarousel: React.FC<MoviesCarouselProps> = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          {title}
        </h2>
        <div className="h-[2px] flex-1 mx-6 bg-gradient-to-r from-[#2d5a5a] to-transparent opacity-20 hidden md:block" />
      </div>

      <div className="relative group">
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 scrollbar-hide snap-x cursor-grab active:cursor-grabbing">
          {movies.map((movie) => (
            <div 
              key={movie.imdbID} 
              className="flex-shrink-0 w-[160px] xs:w-[180px] md:w-[220px] snap-start transform hover:scale-[1.02] transition-all duration-300"
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
        
        {/* Subtle fade effect on the right for desktop */}
        <div className="hidden md:block absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-50 dark:from-[#0d1f1f] to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};
