'use client';

import { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { MovieDetails } from '@/components/MovieDetails';
import { getMovieDetails, Movie } from '@/lib/api';
import { animatePageIn } from '@/lib/animations';
import { ArrowLeft, Play, ArrowRight } from 'lucide-react';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState<'server1' | 'server2'>('server1');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch movie details when id changes
  useEffect(() => {
    if (!id) return;

    // Reset everything immediately to avoid showing old data
    setMovie(null);
    setIsLoading(true);
    setError(null);

    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        if (data) {
          setMovie(data);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to load movie');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Helper to determine the best player URL based on ID type
  const getPlayerUrl = () => {
    if (!movie) return '';
    // Prefer real IMDB id; for TMDB-only items we use the tmdb- prefixed id
    const idToUse = movie.imdbID || id;
    if (!idToUse) return '';
    const isTmdb = idToUse.startsWith('tmdb-');
    const numericId = isTmdb ? idToUse.replace('tmdb-', '') : idToUse;
    const type = movie.Type === 'series' || movie.Type === 'tv' ? 'tv' : 'movie';

    if (activeServer === 'server2') {
      // 2embed.stream works well from Vercel
      if (type === 'tv') return `https://www.2embed.stream/embed/tv/${numericId}/1/1`;
      return `https://www.2embed.stream/embed/movie/${numericId}`;
    }

    // Server 1: vidsrc.to (reliable, fast CDN)
    if (type === 'tv') return `https://vidsrc.to/embed/tv/${numericId}`;
    return `https://vidsrc.to/embed/movie/${numericId}`;
  };

  // Animate on load
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [isLoading]);

  // Scroll to top on ID change
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (isLoading) {
    return (
      <main key="loading" className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
        <Navbar />
        <div className="flex-1 md:ml-44 pt-16 md:pt-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a5a] dark:border-teal-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading movie...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main key="error" className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
        <Navbar />
        <div className="flex-1 md:ml-44 pt-16 md:pt-0">
          <div className="p-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#2d5a5a] dark:text-teal-400 hover:text-[#1a3a3a] dark:hover:text-teal-300 font-medium mb-8"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <div className="text-center py-20">
              <p className="text-lg text-gray-600 dark:text-gray-400">{error || 'Movie not found'}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main key={id} ref={containerRef} className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
      <Navbar />
      <div className="flex-1 md:ml-44 pt-0">
        <div className="p-4 md:p-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2d5a5a] dark:text-teal-400 hover:text-[#1a3a3a] dark:hover:text-teal-300 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          {/* Movie Details Component */}
          <MovieDetails
            title={movie.Title}
            poster={movie.Poster}
            plot={movie.Plot}
            rating={movie.Rated}
            runtime={movie.Runtime}
            releaseDate={movie.Released}
            genre={movie.Genre}
            director={movie.Director}
            actors={movie.Actors}
            imdbRating={movie.imdbRating}
            imdbVotes={movie.imdbVotes}
          />

          {/* Video Player Section */}
          <div className="mt-8">
            {/* Server Selection UI */}
            <div className="flex flex-wrap items-center gap-3 mb-6 bg-white dark:bg-[#1a3a3a] p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mr-2">Playback Source</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveServer('server1')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeServer === 'server1'
                    ? 'bg-[#2d5a5a] text-white shadow-teal-900/20 shadow-lg scale-[1.02]'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                >
                  Server 1
                </button>
                <button
                  onClick={() => setActiveServer('server2')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeServer === 'server2'
                    ? 'bg-[#2d5a5a] text-white shadow-teal-900/20 shadow-lg scale-[1.02]'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                >
                  Server 2
                </button>
              </div>
            </div>

            <div className="bg-black rounded-lg overflow-hidden shadow-2xl aspect-video relative ring-1 ring-white/10 group">
              <iframe
                key={`${id}-${activeServer}`}
                title="Movie Player"
                src={getPlayerUrl()}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                className="absolute inset-0"
              />
              {/* Decorative overlay for a more premium feel when iframe isn't active */}
              <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-lg z-10" />
            </div>
          </div>

          {/* Related Info Section */}
          {movie.Language && (
            <div className="mt-8 bg-white dark:bg-[#1a3a3a] rounded-lg p-6 md:p-8 border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Language && movie.Language !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Languages</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Language}</p>
                  </div>
                )}
                {movie.Country && movie.Country !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Country}</p>
                  </div>
                )}
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Awards</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Awards}</p>
                  </div>
                )}
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Metascore</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Metascore}/100</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
