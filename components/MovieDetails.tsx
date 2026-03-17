'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Star, Calendar, Plus, Share2, Bookmark } from 'lucide-react';

interface MovieDetailsProps {
  title: string;
  poster: string;
  plot: string;
  rating: string;
  runtime: string;
  releaseDate: string;
  genre: string;
  director: string;
  actors: string;
  imdbRating?: string;
  imdbVotes?: string;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  title,
  poster,
  plot,
  rating,
  runtime,
  releaseDate,
  genre,
  director,
  actors,
  imdbRating,
  imdbVotes,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'cast'>('about');

  return (
    <div className="w-full bg-white dark:bg-[#1a3a3a] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
        {/* Poster Image */}
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-full max-w-xs aspect-[2/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            {poster && poster !== 'N/A' ? (
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a3a3a] to-[#2d5a5a] flex items-center justify-center">
                <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest text-center px-4">{title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Title and Quick Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{runtime}</span>
                </div>
              )}
              {imdbRating && (
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>{imdbRating}</span>
                </div>
              )}
              {releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{releaseDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Genre and Rating */}
          {(genre || rating) && (
            <div className="flex flex-wrap gap-2">
              {genre && (
                <div className="inline-block px-3 py-1 bg-[#e8f5f5] dark:bg-white/5 text-[#1a3a3a] dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  {genre}
                </div>
              )}
              {rating && (
                <div className="inline-block px-3 py-1 bg-[#e8f5f5] dark:bg-white/5 text-[#1a3a3a] dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  {rating}
                </div>
              )}
            </div>
          )}

          {/* Plot */}
          {plot && plot !== 'N/A' && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{plot}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#2d5a5a] dark:bg-white text-white dark:text-[#1a3a3a] rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-md">
              <Plus size={18} />
              Add to Watchlist
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-[#2d5a5a] dark:border-white/20 text-[#2d5a5a] dark:text-white rounded-xl hover:bg-[#e8f5f5] dark:hover:bg-white/5 transition-all font-bold text-sm">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-[#2d5a5a] dark:border-white/20 text-[#2d5a5a] dark:text-white rounded-xl hover:bg-[#e8f5f5] dark:hover:bg-white/5 transition-all font-bold text-sm">
              <Bookmark size={18} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-gray-100 dark:border-white/10">
        <div className="flex border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/5">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-6 py-4 font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === 'about'
                ? 'text-[#2d5a5a] dark:text-teal-400 bg-white dark:bg-[#1a3a3a] border-b-2 border-[#2d5a5a] dark:border-teal-400'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`flex-1 px-6 py-4 font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === 'cast'
                ? 'text-[#2d5a5a] dark:text-teal-400 bg-white dark:bg-[#1a3a3a] border-b-2 border-[#2d5a5a] dark:border-teal-400'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Cast
          </button>
        </div>

        <div className="p-6 md:p-8 bg-white dark:bg-[#1a3a3a] transition-colors">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {director && director !== 'N/A' && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-2">Director</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{director}</p>
                </div>
              )}
              {genre && genre !== 'N/A' && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-2">Genre</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{genre}</p>
                </div>
              )}
              {imdbVotes && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-2">IMDb Votes</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{imdbVotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="space-y-6">
              {actors && actors !== 'N/A' ? (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-2">Main Cast</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{actors}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Cast information not available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
