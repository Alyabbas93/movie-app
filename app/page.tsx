'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';

  // Load initial popular movies on mount
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        console.log('[v0] Loading popular movies...');
        const [popularRes, actionRes, trendingRes, scifiRes] = await Promise.all([
          getTrendingMovies('day', 1),
          getTrendingMovies('week', 1),
          getTrendingMovies('month', 1),
          searchMovies('Sci-Fi')
        ]);

        if (popularRes.Search) setPopularMovies(popularRes.Search.slice(0, 12));
        if (actionRes.Search) setActionMovies(actionRes.Search.slice(0, 12));
        if (trendingRes.Search) setTrendingMovies(trendingRes.Search.slice(0, 12));
        if (scifiRes.Search) setScifiMovies(scifiRes.Search.slice(0, 12));

        const featuredBase = popularRes.Search?.[0] || actionRes.Search?.[0] || trendingRes.Search?.[0];
        if (featuredBase) {
          console.log('[v0] Fetching details for featured movie:', featuredBase.Title);
          // Fetch details for top 5 in parallel for the rotating banner
          const topCandidates = popularRes.Search?.slice(0, 5) || [];
          const detailResults = await Promise.all(
            topCandidates.map((m: SearchMovie) => getMovieDetails(m.imdbID))
          );
          const validFeatured = detailResults.filter(Boolean) as Movie[];
          if (validFeatured.length > 0) {
            setFeaturedMovies(validFeatured);
            setFeaturedMovie(validFeatured[0]);
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

    const loadCategoryMovies = async (cat: string) => {
      setIsLoading(true);
      try {
        console.log(`[v0] Loading category: ${cat}`);
        if (cat === 'Movies') {
          // Fetch multiple pages of movies to show "everything available"
          const [page1, page2, page3] = await Promise.all([
            getTrendingMovies('week', 1),
            getTrendingMovies('week', 2),
            getTrendingMovies('week', 3)
          ]);

          const allMovies = [
            ...(page1.Search || []),
            ...(page2.Search || []),
            ...(page3.Search || [])
          ].filter(m => m.Type === 'movie');

          setPopularMovies(allMovies);
          setActionMovies([]);
          setScifiMovies([]);
          setTrendingMovies([]);
        } else if (cat === 'Popular') {
          const [popularRes, new2025, new2026] = await Promise.all([
            getTrendingMovies('day', 1),
            searchMovies('2025'),
            searchMovies('2026')
          ]);
          if (popularRes.Search) setPopularMovies(popularRes.Search.slice(0, 16));
          if (new2025.Search || new2026.Search) {
            setActionMovies([...(new2025.Search || []), ...(new2026.Search || [])].slice(0, 16));
          }
          setScifiMovies([]);
          setTrendingMovies([]);
        }

        // Pick featured movie for category page (use fresh results not stale state)
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
          setFeaturedMovie(details || featuredCandidate as Movie);
        }
      } catch (error) {
        console.error(`[v0] Failed to load ${cat}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (category === 'All') {
      loadPopularMovies();
    } else {
      loadCategoryMovies(category);
    }
  }, [category]);

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
            {/* Featured Movie — Conveyor Belt Slider */}
            {!hasSearched && category === 'All' && (
              <>
                {isLoading ? (
                  <SkeletonLoader type="featured" />
                ) : featuredMovies.length > 0 ? (() => {
                  const curr = featuredMovies[featuredIndex];
                  const next = featuredMovies[(featuredIndex + 1) % featuredMovies.length];
                  return (
                    <div className="relative rounded-2xl overflow-hidden" style={{ height: '24rem' }}>
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
                            {movie.Poster && movie.Poster !== 'N/A' && (
                              <div style={{
                                position: 'absolute', inset: 0,
                                backgroundImage: `url('${movie.Poster}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.38)',
                              }} />
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,58,58,0.85) 0%, transparent 60%)' }} />
                            {/* Content */}
                            <div className="relative z-10 text-white max-w-xl" style={{ padding: '2rem 3rem' }}>
                              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{movie.Title}</h1>
                              <div className="flex gap-4 mb-3 text-sm opacity-90">
                                <span>⭐ {movie.imdbRating || 'N/A'}</span>
                                <span>{movie.Runtime || ''}</span>
                                <span>{movie.Released ? new Date(movie.Released).getFullYear() : movie.Year || ''}</span>
                              </div>
                              <p className="text-sm leading-relaxed mb-5 line-clamp-2 opacity-75">{movie.Plot}</p>
                              {i === 0 && (
                                <div className="flex flex-wrap gap-3 mb-4">
                                  <Link href={`/movie/${movie.imdbID}`} className="px-6 py-2.5 bg-white text-[#1a3a3a] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">▶ Watch Now</Link>
                                  <button onClick={() => addToWatchlist({ imdbID: movie.imdbID, title: movie.Title, poster: movie.Poster, year: movie.Released || movie.Year, type: 'movie' })} className="px-6 py-2.5 border-2 border-white/70 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm">+ Add to List</button>
                                </div>
                              )}
                              {i === 0 && featuredMovies.length > 1 && (
                                <div className="flex gap-2">
                                  {featuredMovies.map((_, di) => (
                                    <button
                                      key={di}
                                      onClick={() => { if (!isSliding) { setFeaturedIndex(di); } }}
                                      style={{ width: di === featuredIndex ? '24px' : '8px', height: '8px', borderRadius: '9999px', background: di === featuredIndex ? 'white' : 'rgba(255,255,255,0.35)', transition: 'all 0.3s ease' }}
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
                  category === 'Movies' ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">Available Movies</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {popularMovies.map((movie) => (
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
          <StatsPanel
            watchTime={`${Math.max(12, watchlist.length * 2.5)}h`}
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
