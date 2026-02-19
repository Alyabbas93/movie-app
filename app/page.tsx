'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { MoviesCarousel } from '@/components/MoviesCarousel';
import { StatsPanel } from '@/components/StatsPanel';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { searchMovies, Movie } from '@/lib/api';
import { animatePageIn, animateCardsStagger } from '@/lib/animations';
import { useWatchlist } from '@/lib/WatchlistContext';

interface SearchMovie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  imdbRating?: string;
}

export default function Home() {
  const { watchlist, addToWatchlist } = useWatchlist();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<SearchMovie[]>([]);
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load initial popular movies on mount
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        console.log('[v0] Loading popular movies...');
        // Fetch popular movies
        const results = await searchMovies('Batman');
        console.log('[v0] Popular movies loaded:', results.Search?.length || 0);
        if (results.Search && results.Search.length > 0) {
          setPopularMovies(results.Search.slice(0, 8));
          // Set the first movie as featured
          if (results.Search[0]) {
            console.log('[v0] Setting featured movie:', results.Search[0].Title);
            setFeaturedMovie({
              imdbID: results.Search[0].imdbID,
              Title: results.Search[0].Title,
              Year: results.Search[0].Year,
              Poster: results.Search[0].Poster,
              imdbRating: '8.0',
              Runtime: '2h 5m',
              Released: results.Search[0].Year,
              Rated: 'PG-13',
              Genre: 'Action, Crime, Drama',
              Director: 'Christopher Nolan',
              Writer: 'Jonathan Nolan',
              Actors: 'Christian Bale, Michael Caine',
              Plot: 'A vigilante with a mission to clean up crime-ridden streets.',
              Language: 'English',
              Country: 'USA',
              Awards: 'Multiple Awards',
              Ratings: [{ Source: 'IMDb', Value: '8.0/10' }],
              Metascore: '82',
              imdbVotes: '2,500,000',
              Type: 'movie',
              Response: 'True',
            } as Movie);
          }
        } else {
          console.error('[v0] No search results received');
        }
      } catch (error) {
        console.error('[v0] Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  // Animate page in when loaded
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [isLoading]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchMovies(query);
      if (results.Search) {
        setSearchResults(results.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main ref={containerRef} className="flex min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 md:ml-44 pt-16 md:pt-0">
        {/* Search Section */}
        <div className="hidden md:flex md:flex-col md:items-start md:p-8 md:gap-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Discover Movies</h2>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-8">
          {/* Left Section - Featured and Carousel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Movie */}
            {!hasSearched && (
              <>
                {isLoading ? (
                  <SkeletonLoader type="featured" />
                ) : featuredMovie ? (
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a3a3a] to-[#2d5a5a] text-white h-96 md:h-96 flex items-center">
                    {featuredMovie.Poster && featuredMovie.Poster !== 'N/A' && (
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: `url('${featuredMovie.Poster}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}
                    <div className="relative z-10 max-w-xl p-6 md:p-12">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{featuredMovie.Title}</h1>
                      <div className="flex flex-wrap gap-4 mb-6 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-yellow-300">★</span>
                          {featuredMovie.imdbRating || 'N/A'}
                        </span>
                        <span>{featuredMovie.Runtime || 'N/A'}</span>
                        <span>{featuredMovie.Released ? new Date(featuredMovie.Released).getFullYear() : 'N/A'}</span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed mb-6 line-clamp-3">{featuredMovie.Plot}</p>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => console.log('[v0] Watch Now clicked for:', featuredMovie.Title)}
                          className="px-6 py-3 bg-white text-[#1a3a3a] rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Watch Now
                        </button>
                        <button 
                          onClick={() => {
                            addToWatchlist({
                              imdbID: featuredMovie.imdbID,
                              title: featuredMovie.Title,
                              poster: featuredMovie.Poster,
                              year: featuredMovie.Released || featuredMovie.Year,
                              type: 'movie',
                            });
                            console.log('[v0] Added to watchlist:', featuredMovie.Title);
                          }}
                          className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                          Add to List
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {/* Search Results or Popular Movies */}
            {hasSearched ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
                {isLoading ? (
                  <SkeletonLoader count={8} />
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {searchResults.map((movie) => (
                      <div key={movie.imdbID}>
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No results found. Try a different search.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Popular Movies Carousel */}
                {isLoading ? (
                  <SkeletonLoader type="carousel" />
                ) : popularMovies.length > 0 ? (
                  <MoviesCarousel title="Popular Movies" movies={popularMovies} />
                ) : null}

                {/* Additional Carousels */}
                {!isLoading && popularMovies.length > 0 && (
                  <>
                    <MoviesCarousel title="Action Movies" movies={popularMovies.slice(0, 6)} />
                    <MoviesCarousel title="Trending Now" movies={[...popularMovies].reverse().slice(0, 6)} />
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Section - Stats Panel */}
          <StatsPanel
            watchTime="130"
            wishList={watchlist.length}
            subscription="Pro"
            comments={12}
            users={[
              { id: '1', name: 'User 1', avatar: '' },
              { id: '2', name: 'User 2', avatar: '' },
              { id: '3', name: 'User 3', avatar: '' },
            ]}
            watchlist={watchlist.map((item) => ({
              id: item.imdbID,
              title: item.title,
              poster: item.poster,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
