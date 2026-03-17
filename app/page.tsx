'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { MoviesCarousel } from '@/components/MoviesCarousel';
import { StatsPanel } from '@/components/StatsPanel';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { searchMovies, getTrendingMovies, getMovieDetails, Movie } from '@/lib/api';
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
  const [prevMovie, setPrevMovie] = useState<Movie | null>(null);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [popularMovies, setPopularMovies] = useState<SearchMovie[]>([]);
  const [actionMovies, setActionMovies] = useState<SearchMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<SearchMovie[]>([]);
  const [scifiMovies, setScifiMovies] = useState<SearchMovie[]>([]);
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category = searchParams.get('category') || 'All';

  // Load more function
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const loadPopularMovies = async () => {
    if (window.location.pathname !== '/') return;
    setIsLoading(true);
    try {
      console.log('[v0] Loading popular movies...');
      const [popularRes, actionRes, trendingRes, scifiRes] = await Promise.all([
        getTrendingMovies('day', 1),
        getTrendingMovies('week', 1),
        getTrendingMovies('month', 1),
        searchMovies('Sci-Fi')
      ]);

      if (window.location.pathname !== '/') return;

      if (popularRes.Search) setPopularMovies(popularRes.Search.slice(0, 12));
      if (actionRes.Search) setActionMovies(actionRes.Search.slice(0, 12));
      if (trendingRes.Search) setTrendingMovies(trendingRes.Search.slice(0, 12));
      if (scifiRes.Search) setScifiMovies(scifiRes.Search.slice(0, 12));

      const featuredBase = popularRes.Search?.[0] || actionRes.Search?.[0] || trendingRes.Search?.[0];
      if (featuredBase) {
        console.log('[v0] Fetching details for featured movie:', featuredBase.Title);
        const topCandidates = popularRes.Search?.slice(0, 5) || [];
        const detailResults = await Promise.all(
          topCandidates.map((m: SearchMovie) => getMovieDetails(m.imdbID))
        );

        if (window.location.pathname !== '/') return;

        const validFeatured = detailResults.filter(Boolean) as Movie[];
        if (validFeatured.length > 0) {
          setFeaturedMovies(validFeatured);
          setFeaturedMovie(validFeatured[0]);
        }
      }
    } catch (error) {
      console.error('[v0] Failed to load movies:', error);
    } finally {
      if (window.location.pathname === '/') {
        setIsLoading(false);
      }
    }
  };

  const loadCategoryMovies = async (cat: string, page: number = 1) => {
    // CRITICAL: Prevent execution if we've already navigated away
    if (window.location.pathname !== '/') return;

    if (page === 1) setIsLoading(true);
    else setIsMoreLoading(true);

    try {
      console.log(`[v0] Loading category: ${cat}, page: ${page}`);
      if (cat === 'Movies') {
        const [movieRes, seriesRes] = await Promise.all([
          getTrendingMovies('week', page),
          searchMovies('TV Series', page)
        ]);

        // Guard again after async await
        if (window.location.pathname !== '/') return;

        const newResults = [
          ...(movieRes.Search || []),
          ...(seriesRes.Search || [])
        ].filter((item, index, self) =>
          index === self.findIndex((t) => t.imdbID === item.imdbID)
        );

        setPopularMovies(prev => {
          const combined = page === 1 ? newResults : [...prev, ...newResults];
          const seen = new Set();
          return combined.filter(m => {
            if (!m.imdbID || seen.has(m.imdbID)) return false;
            seen.add(m.imdbID);
            return true;
          });
        });

        setHasMore(newResults.length > 0);
        setActionMovies([]);
        setScifiMovies([]);
        setTrendingMovies([]);
      } else if (cat === 'Popular') {
        const [popularRes, new2025, new2026] = await Promise.all([
          getTrendingMovies('day', 1),
          searchMovies('2025'),
          searchMovies('2026')
        ]);

        if (window.location.pathname !== '/') return;

        if (popularRes.Search) setPopularMovies(popularRes.Search.slice(0, 16));
        if (new2025.Search || new2026.Search) {
          setActionMovies([...(new2025.Search || []), ...(new2026.Search || [])].slice(0, 16));
        }
        setScifiMovies([]);
        setTrendingMovies([]);
        setHasMore(false);
      }

      if (page === 1) {
        let featuredCandidate: any = null;
        if (cat === 'Movies') {
          const r = await getTrendingMovies('week', 1);
          featuredCandidate = r.Search?.find(m => m.Type === 'movie') || r.Search?.[0];
        } else if (cat === 'Popular') {
          const r = await getTrendingMovies('day', 1);
          featuredCandidate = r.Search?.[0];
        }
        if (featuredCandidate) {
          const details = await getMovieDetails(featuredCandidate.imdbID);
          if (window.location.pathname === '/') {
            setFeaturedMovie(details || featuredCandidate as Movie);
          }
        }
      }
    } catch (error) {
      console.error(`[v0] Failed to load ${cat}:`, error);
      if (page === 1 && window.location.pathname === '/') {
        setPopularMovies([]);
        setHasMore(false);
      }
    } finally {
      if (window.location.pathname === '/') {
        setIsLoading(false);
        setIsMoreLoading(false);
      }
    }
  };

  useEffect(() => {
    if (pathname !== '/') return;

    if (category === 'All') {
      loadPopularMovies();
      setHasMore(false);
    } else {
      loadCategoryMovies(category, currentPage);
    }
  }, [category, currentPage, pathname]);

  // Reset page when category changes
  useEffect(() => {
    if (pathname !== '/') return;
    setCurrentPage(1);
    setHasMore(true);
  }, [category, pathname]);

  // Animate page in when loaded
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [isLoading]);

  // Auto-rotate banner every 3.5 seconds — conveyor belt style
  useEffect(() => {
    if (featuredMovies.length < 2) return;
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        const nextIndex = (featuredIndex + 1) % featuredMovies.length;
        setFeaturedIndex(nextIndex);
        setFeaturedMovie(featuredMovies[nextIndex]);
        setIsSliding(false);
      }, 850); // wait for animation to finish before swapping
    }, 3500);
    return () => clearInterval(interval);
  }, [featuredMovies, featuredIndex]);

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
    <main ref={containerRef} className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 md:ml-44 pt-0">
        {/* Search Section */}
        <div className="hidden md:flex md:flex-col md:items-start md:p-8 md:gap-4 bg-white dark:bg-[#1a3a3a] border-b border-gray-200 dark:border-white/10 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Discover Movies</h2>
          <SearchBar onSearch={handleSearch} />
        </div>        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 pb-4 pt-0 md:p-8">
          {/* Left Section - Featured and Carousel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Movie — Conveyor Belt Slider */}
            {!hasSearched && category === 'All' && (
              <>
                {isLoading ? (
                  <SkeletonLoader type="featured" />
                ) : featuredMovies.length > 0 ? (() => {
                  const curr = featuredMovies[featuredIndex];
                  const next = featuredMovies[(featuredIndex + 1) % featuredMovies.length];
                  return (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg h-[18rem] md:h-[24rem]">
                      {/* Double-wide flex track — slides left to reveal next */}
                      <div
                        style={{
                          display: 'flex',
                          width: '200%',
                          height: '100%',
                          transform: isSliding ? 'translateX(-50%)' : 'translateX(0)',
                          transition: isSliding
                            ? 'transform 0.85s cubic-bezier(0.77, 0, 0.18, 1)'
                            : 'none',
                        }}
                      >
                        {[curr, next].map((movie, i) => movie && (
                          <div key={`${movie.imdbID}-${i}`} style={{ width: '50%', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            {/* Poster background */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              backgroundColor: '#1a3a3a',
                              backgroundImage: movie.Poster && movie.Poster !== 'N/A' ? `url('${movie.Poster}')` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'brightness(0.38)',
                            }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,58,58,0.95) 0%, transparent 80%)' }} className="md:bg-gradient-to-r md:from-[rgba(26,58,58,0.85)] md:to-transparent" />
                            {/* Content */}
                            <div className="relative z-10 text-white max-w-xl px-6 py-8 md:px-12 md:py-8">
                              <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 leading-tight text-white drop-shadow-lg">{movie.Title}</h1>
                              <div className="flex gap-3 md:gap-4 mb-3 text-xs md:text-sm opacity-90 text-white/90 font-medium">
                                <span className="flex items-center gap-1">⭐ {movie.imdbRating || 'N/A'}</span>
                                <span>{movie.Runtime || ''}</span>
                                <span>{movie.Released ? new Date(movie.Released).getFullYear() : movie.Year || ''}</span>
                              </div>
                              <p className="text-xs md:text-sm opacity-80 line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 text-white/80 max-w-sm">{movie.Plot || ''}</p>
                              {i === 0 && (
                                <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
                                  <Link
                                    href={`/movie/${movie.imdbID}`}
                                    className="px-5 py-2 md:px-6 md:py-2.5 bg-white text-[#1a3a3a] rounded-lg font-bold hover:bg-teal-50 transition-all text-xs md:text-sm shadow-md active:scale-95"
                                  >
                                    ▶ Watch Now
                                  </Link>
                                  <button
                                    onClick={() => addToWatchlist({ imdbID: movie.imdbID, title: movie.Title, poster: movie.Poster, year: movie.Released || movie.Year, type: 'movie' })}
                                    className="px-5 py-2 md:px-6 md:py-2.5 border-2 border-white/50 text-white rounded-lg font-bold hover:bg-white/10 transition-all text-xs md:text-sm backdrop-blur-sm active:scale-95"
                                  >
                                    + Add to List
                                  </button>
                                </div>
                              )}
                              {i === 0 && featuredMovies.length > 1 && (
                                <div className="flex gap-2">
                                  {featuredMovies.map((_, di) => (
                                    <button
                                      key={di}
                                      onClick={(e) => { e.preventDefault(); if (!isSliding) { setFeaturedIndex(di); } }}
                                      style={{ width: di === featuredIndex ? '20px' : '6px', height: '6px', borderRadius: '9999px', background: di === featuredIndex ? 'white' : 'rgba(255,255,255,0.35)', transition: 'all 0.3s ease' }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })() : null}
              </>
            )}

            {/* Search Results or Popular Movies */}
            {hasSearched ? (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">Search Results</h2>
                {isLoading ? (
                  <SkeletonLoader count={8} />
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                {isLoading && popularMovies.length === 0 ? (
                  <SkeletonLoader type="carousel" />
                ) : popularMovies.length > 0 ? (
                  category === 'Movies' ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Available Content</h2>
                        <span className="text-xs text-gray-500">{popularMovies.length} items</span>
                      </div>
                      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {popularMovies.map((movie, idx) => (
                          <div key={`${movie.imdbID}-${idx}`} className="transform hover:scale-105 transition-transform duration-300">
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
                      {hasMore && (
                        <div className="flex justify-center pt-8 pb-12">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadMore();
                            }}
                            disabled={isLoading || isMoreLoading}
                            className={`px-8 py-3 bg-[#1a3a3a] text-white rounded-xl font-bold hover:bg-[#2d5a5a] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-10 flex items-center gap-2`}
                          >
                            {isMoreLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Loading More...
                              </>
                            ) : (
                              'Load More Content'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <MoviesCarousel title={category === 'All' ? "Popular Now" : `${category}`} movies={popularMovies} />
                  )
                ) : null}

                {/* Additional Carousels (Only for All/Popular) */}
                {!isLoading && category !== 'Movies' && (
                  <>
                    {actionMovies.length > 0 && <MoviesCarousel title={category === 'All' ? "Trending This Week" : "More Like This"} movies={actionMovies} />}
                    {scifiMovies.length > 0 && <MoviesCarousel title={category === 'All' ? "Sci-Fi & Fantasy" : "Featured Suggestions"} movies={scifiMovies} />}
                    {trendingMovies.length > 0 && <MoviesCarousel title="Trending This Month" movies={trendingMovies} />}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Section - Stats Panel */}
          <StatsPanel />
        </div>
      </div>
    </main>
  );
}
