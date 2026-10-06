'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { MovieDetails } from '@/components/MovieDetails';
import { getMovieDetails, Movie } from '@/lib/api';
import { animatePageIn } from '@/lib/animations';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Footer } from '@/components/Footer';

interface MoviePageClientProps {
  params: Promise<{ id: string }>;
}

const SERVERS = [
  { id: 'vidsrc', label: 'Server 1 (VidSrc) ⚡' },
  { id: 'vidlink', label: 'Server 2 (VidLink)' },
  { id: 'embed2', label: 'Server 3 (2Embed)' },
  { id: 'autoembed', label: 'Server 4 (AutoEmbed)' },
  { id: 'multiembed', label: 'Server 5 (MultiEmbed)' },
] as const;

type ServerId = typeof SERVERS[number]['id'];

function buildEmbedUrl(serverId: ServerId, imdbId: string, tmdbId: string | undefined, type: string, season: number, episode: number): string {
  const isTV = type === 'series' || type === 'tv';
  const isTmdb = imdbId.startsWith('tmdb-');
  let numericId = imdbId;
  
  if (isTmdb) {
    const parts = imdbId.split('-');
    numericId = parts.length === 3 ? parts[2] : parts[1];
  }

  const finalTmdbId = tmdbId || (isTmdb ? numericId : '');
  const hasImdb = imdbId && imdbId.startsWith('tt');

  switch (serverId) {
    case 'vidsrc':
      // vidsrc.me — active & reliable player supporting both IMDb and TMDb
      if (hasImdb) {
        return isTV
          ? `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
          : `https://vidsrc.me/embed/movie?imdb=${imdbId}`;
      }
      return isTV
        ? `https://vidsrc.me/embed/tv?tmdb=${finalTmdbId || numericId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${finalTmdbId || numericId}`;

    case 'vidlink':
      // vidlink.pro — fast multi-quality stream
      return isTV
        ? `https://vidlink.pro/tv/${finalTmdbId || numericId}/${season}/${episode}`
        : `https://vidlink.pro/movie/${finalTmdbId || numericId}`;

    case 'embed2':
      // 2embed.cc — backup server
      return isTV
        ? `https://www.2embed.cc/embedtv/${isTmdb ? numericId : imdbId}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${isTmdb ? numericId : imdbId}`;

    case 'autoembed':
      // autoembed.co
      return isTV
        ? `https://autoembed.co/tv/${isTmdb ? 'tmdb' : 'imdb'}/${numericId}-${season}-${episode}`
        : `https://autoembed.co/movie/${isTmdb ? 'tmdb' : 'imdb'}/${numericId}`;

    case 'multiembed':
      // multiembed.mov
      if (isTmdb || !hasImdb) {
        return isTV
          ? `https://multiembed.mov/?video_id=${finalTmdbId || numericId}&tmdb=1&s=${season}&e=${episode}`
          : `https://multiembed.mov/?video_id=${finalTmdbId || numericId}&tmdb=1`;
      }
      return isTV
        ? `https://multiembed.mov/?video_id=${imdbId}&s=${season}&e=${episode}`
        : `https://multiembed.mov/?video_id=${imdbId}`;

    default:
      if (hasImdb) {
        return isTV
          ? `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
          : `https://vidsrc.me/embed/movie?imdb=${imdbId}`;
      }
      return isTV
        ? `https://vidsrc.me/embed/tv?tmdb=${finalTmdbId || numericId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${finalTmdbId || numericId}`;
  }
}

export default function MoviePageClient({ params }: MoviePageClientProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState<ServerId>('vidsrc');
  const [playerKey, setPlayerKey] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [playerSlowWarning, setPlayerSlowWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;
    setMovie(null);
    setIsLoading(true);
    setError(null);
    setActiveServer('vidsrc');
    setSeason(1);
    setEpisode(1);
    setPlayerKey(k => k + 1);

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

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [isLoading]);

  useEffect(() => {
    if (id) window.scrollTo(0, 0);
  }, [id]);

  // Start slow-warning timer when playerKey changes (new player loaded)
  useEffect(() => {
    if (isLoading || !movie) return;
    setPlayerSlowWarning(false);
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    slowTimerRef.current = setTimeout(() => {
      setPlayerSlowWarning(true);
    }, 8000);
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, [playerKey, isLoading, movie]);

  const handleServerChange = (serverId: ServerId) => {
    setActiveServer(serverId);
    setPlayerKey(k => k + 1);
    setPlayerSlowWarning(false);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f]">
        <Navbar />
        <div className="flex-1 md:ml-52 pt-16 md:pt-0 flex flex-col min-h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a5a] mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading movie details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f]">
        <Navbar />
        <div className="flex-1 md:ml-52 pt-16 md:pt-0 flex flex-col min-h-screen">
          <div className="flex-1 p-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#2d5a5a] dark:text-teal-400 font-medium mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🎬</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{error || 'Movie not found'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">This title may not be in our database yet.</p>
              <Link href="/" className="mt-6 inline-block px-6 py-2.5 bg-[#2d5a5a] text-white rounded-lg font-bold hover:bg-[#1a3a3a] transition-all">
                Browse other movies
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  const embedUrl = buildEmbedUrl(activeServer, movie.imdbID || id, movie.tmdbID, movie.Type || 'movie', season, episode);

  return (
    <main key={id} ref={containerRef} className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
      <Navbar />
      <div className="flex-1 md:ml-52 pt-0 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#2d5a5a] dark:text-teal-400 hover:text-[#1a3a3a] dark:hover:text-teal-300 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>

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
            type={movie.Type}
          />

          {/* Video Player */}
          <div className="mt-8">
            {/* Series Selectors if applicable */}
            {movie.Type === 'series' && movie.seasons && movie.seasons.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-4 bg-white dark:bg-[#1a3a3a] p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[140px]">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Season</label>
                  <select 
                    value={season}
                    onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); setPlayerKey(k => k + 1); }}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1f1f] text-sm font-semibold border border-gray-200 dark:border-[#2d5a5a]/30 text-gray-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d5a5a] transition-all"
                  >
                    {movie.seasons
                      .filter(s => s.season_number > 0)
                      .map(s => (
                        <option key={s.season_number} value={s.season_number}>
                          Season {s.season_number}
                        </option>
                      ))}
                  </select>
                </div>
                
                {movie.seasons.find(s => s.season_number === season) && (
                  <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[140px]">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Episode</label>
                    <select
                      value={episode}
                      onChange={(e) => { setEpisode(Number(e.target.value)); setPlayerKey(k => k + 1); }}
                      className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1f1f] text-sm font-semibold border border-gray-200 dark:border-[#2d5a5a]/30 text-gray-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d5a5a] transition-all"
                    >
                      {Array.from(
                        { length: movie.seasons.find(s => s.season_number === season)?.episode_count || 1 },
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Episode {i + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Server Selection */}
            <div className="flex flex-wrap items-center gap-3 mb-4 bg-white dark:bg-[#1a3a3a] p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mr-1">Source</span>
              <div className="flex gap-2 flex-wrap">
                {SERVERS.map(server => (
                  <button
                    key={server.id}
                    onClick={() => handleServerChange(server.id)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeServer === server.id
                        ? 'bg-[#2d5a5a] text-white shadow-lg scale-[1.02]'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {server.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPlayerKey(k => k + 1)}
                title="Reload player if it doesn't work"
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-[#2d5a5a] hover:text-white transition-all"
              >
                <RefreshCw size={12} /> Reload
              </button>
            </div>

            {/* Player hint */}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3 text-center">
              If the player shows a blank screen or an error, click <strong>Reload</strong> or try another server.
            </p>

            {/* Slow server warning banner */}
            {playerSlowWarning && (
              <div className="flex items-center justify-between gap-3 mb-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>This server is taking a moment to load. Try <strong>Server 2 (VidLink)</strong> or other servers above if it persists.</span>
                </div>
                <button
                  onClick={() => setPlayerSlowWarning(false)}
                  className="shrink-0 text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Iframe */}
            <div className="bg-black rounded-xl shadow-2xl aspect-video relative ring-1 ring-white/10">
              <iframe
                key={`${id}-${activeServer}-${playerKey}`}
                title={`Watch ${movie.Title} online free — ${activeServer}`}
                allowFullScreen={true}
                allow="autoplay; fullscreen *; picture-in-picture *; encrypted-media; gyroscope; accelerometer; clipboard-write; xr-spatial-tracking; web-share"
                src={embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                className="absolute inset-0 rounded-xl"
              />
            </div>
          </div>

          {/* Additional Info */}
          {(movie.Language !== 'N/A' || movie.Country !== 'N/A') && (
            <div className="mt-8 bg-white dark:bg-[#1a3a3a] rounded-lg p-6 border border-gray-100 dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Language && movie.Language !== 'N/A' && (
                  <div><h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Languages</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Language}</p></div>
                )}
                {movie.Country && movie.Country !== 'N/A' && (
                  <div><h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Country</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Country}</p></div>
                )}
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div><h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Awards</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Awards}</p></div>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
