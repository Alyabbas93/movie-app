'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { MovieDetails } from '@/components/MovieDetails';
import { getMovieDetails, Movie } from '@/lib/api';
import { animatePageIn } from '@/lib/animations';
import { ArrowLeft, Play } from 'lucide-react';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<string | null>(null);

  // Handle async params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        if (resolved && resolved.id) {
          setId(resolved.id);
        }
      } catch (err) {
        console.error('Failed to resolve params:', err);
        setError('Invalid movie link');
        setIsLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  // Fetch movie details
  useEffect(() => {
    if (!id) return;

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

  // Animate on load
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
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
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
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
    <main ref={containerRef} className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
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
          <div className="mt-8 bg-black rounded-lg overflow-hidden shadow-xl aspect-video relative ring-1 ring-white/10">
            <iframe
              title="Movie Player"
              src={`https://www.2embed.cc/embed/${movie.imdbID}`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              className="absolute inset-0"
            />
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
