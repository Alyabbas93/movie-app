'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Play } from 'lucide-react';
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

import { Suspense } from 'react';

function HomeContent() {
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
  const queryParam = searchParams.get('q');

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
      // Use different time windows to get varied content for each carousel row
      const [popularRes, actionRes, trendingRes, scifiRes] = await Promise.all([
        getTrendingMovies('day', 1),
        getTrendingMovies('week', 2), // page 2 for variety
        getTrendingMovies('month', 1),
        getTrendingMovies('week', 3), // page 3 for variety
      ]);

      if (window.location.pathname !== '/') return;

      if (popularRes.Search && popularRes.Search.length > 0) setPopularMovies(popularRes.Search.slice(0, 12));
      if (actionRes.Search && actionRes.Search.length > 0) setActionMovies(actionRes.Search.slice(0, 12));
      if (trendingRes.Search && trendingRes.Search.length > 0) setTrendingMovies(trendingRes.Search.slice(0, 12));
      if (scifiRes.Search && scifiRes.Search.length > 0) setScifiMovies(scifiRes.Search.slice(0, 12));

      const featuredBase = popularRes.Search?.[0] || actionRes.Search?.[0];
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
      } else {
        const res = await searchMovies(cat, page);

        if (window.location.pathname !== '/') return;

        if (res.Search) {
          setPopularMovies(prev => page === 1 ? res.Search : [...prev, ...res.Search]);
          setHasMore(res.Search.length > 0);
        }
        setActionMovies([]);
        setScifiMovies([]);
        setTrendingMovies([]);
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
      setHasSearched(false);
      setSearchResults([]);
      loadPopularMovies();
      setHasMore(false);
    } else {
      loadCategoryMovies(category, currentPage);
    }
  }, [category, currentPage, pathname]);

  // Handle URL query parameter search
  useEffect(() => {
    if (pathname !== '/') return;
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [queryParam, pathname]);

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

  // Listen for reset-home event from Navbar
  useEffect(() => {
    const handleReset = () => {
      setHasSearched(false);
      setSearchResults([]);
      setPopularMovies([]);
      loadPopularMovies();
    };
    window.addEventListener('reset-home', handleReset);
    return () => window.removeEventListener('reset-home', handleReset);
  }, []);

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
                              filter: 'brightness(0.6)',
                            }} />

                            {/* Info overlay */}
                            <div className="relative z-10 p-6 md:p-12 w-full">
                              <div className="flex flex-col gap-2 md:gap-4 max-w-2xl">
                                <div className="flex items-center gap-2">
                                  <span className="bg-[#2d5a5a] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                                    Featured
                                  </span>
                                  <span className="text-xs text-white/70 font-medium">
                                    {movie.Year} • {movie.Runtime}
                                  </span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                                  {movie.Title}
                                </h1>
                                <p className="text-white/80 text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl">
                                  {movie.Plot}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                                  <Link
                                    href={`/movie/${movie.imdbID}`}
                                    className="px-4 py-2 md:px-6 md:py-2.5 bg-white text-[#1a3a3a] rounded-lg font-bold flex items-center gap-2 hover:bg-[#2d5a5a] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg text-xs md:text-sm"
                                  >
                                    <Play size={16} fill="currentColor" />
                                    Watch Now
                                  </Link>
                                  <button
                                    onClick={() => addToWatchlist({
                                      imdbID: movie.imdbID,
                                      title: movie.Title,
                                      poster: movie.Poster,
                                      year: movie.Year,
                                      type: 'movie'
                                    })}
                                    className="px-4 py-2 md:px-6 md:py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm"
                                  >
                                    + Watchlist
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Manual index dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {featuredMovies.map((_, i) => (
                          <button
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === featuredIndex ? 'bg-white w-6' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })() : null}
              </>
            )}

            {/* Search Results Grid */}
            {hasSearched ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Search Results</h2>
                  <button
                    onClick={() => { setHasSearched(false); setSearchResults([]); }}
                    className="text-sm text-[#2d5a5a] hover:text-[#1a3a3a] font-medium"
                  >
                    Clear Results
                  </button>
                </div>
                {isLoading ? (
                  <SkeletonLoader type="card" count={8} />
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {searchResults.map((movie) => (
                      <div key={movie.imdbID} className="transform hover:scale-105 transition-transform duration-300">
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
                  <div className="text-center py-20 bg-white dark:bg-[#1a3a3a] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No results found. Try a different search term.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
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
          <StatsPanel className="hidden lg:flex w-72" />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a5a] dark:border-teal-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Initializing App...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
