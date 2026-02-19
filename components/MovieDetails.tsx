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
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
        {/* Poster Image */}
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-full max-w-xs aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
            {poster && poster !== 'N/A' ? (
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Title and Quick Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{runtime}</span>
                </div>
              )}
              {imdbRating && (
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" />
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
                <div className="inline-block px-3 py-1 bg-[#e8f5f5] text-[#1a3a3a] rounded-full text-xs font-medium">
                  {genre}
                </div>
              )}
              {rating && (
                <div className="inline-block px-3 py-1 bg-[#e8f5f5] text-[#1a3a3a] rounded-full text-xs font-medium">
                  {rating}
                </div>
              )}
            </div>
          )}

          {/* Plot */}
          {plot && plot !== 'N/A' && (
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">{plot}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2d5a5a] text-white rounded-lg hover:bg-[#1a3a3a] transition-colors font-medium">
              <Plus size={18} />
              Add to Watchlist
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#2d5a5a] text-[#2d5a5a] rounded-lg hover:bg-[#e8f5f5] transition-colors font-medium">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#2d5a5a] text-[#2d5a5a] rounded-lg hover:bg-[#e8f5f5] transition-colors font-medium">
              <Bookmark size={18} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-[#2d5a5a] border-b-2 border-[#2d5a5a]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'cast'
                ? 'text-[#2d5a5a] border-b-2 border-[#2d5a5a]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cast
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'about' && (
            <div className="space-y-4">
              {director && director !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Director</h3>
                  <p className="text-gray-700">{director}</p>
                </div>
              )}
              {genre && genre !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Genre</h3>
                  <p className="text-gray-700">{genre}</p>
                </div>
              )}
              {imdbVotes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">IMDb Votes</h3>
                  <p className="text-gray-700">{imdbVotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="space-y-4">
              {actors && actors !== 'N/A' ? (
                <>
                  <h3 className="font-semibold text-gray-800 mb-2">Main Cast</h3>
                  <p className="text-gray-700">{actors}</p>
                </>
              ) : (
                <p className="text-gray-500">Cast information not available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
