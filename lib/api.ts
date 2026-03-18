const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string; }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  Response: string;
}

export interface SearchResult {
  Search: Array<{
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
  }>;
  totalResults: string;
  Response: string;
  Error?: string;
}

// Cache to minimize API calls
const cache: { [key: string]: any } = {};

// Helper: build poster URL from TMDB path
const getPosterUrl = (path: string | null | undefined): string => {
  if (!path) return 'N/A';
  if (path.startsWith('http')) return path; // already full URL (e.g. OMDb)
  return `${TMDB_IMAGE_BASE}${path}`;
};

// Map a TMDB multi-search/trending result to our format
const mapTmdbItem = (item: any) => {
  const isMovie = item.media_type === 'movie' || item.title;
  return {
    imdbID: item.external_ids?.imdb_id || item.imdb_id || `tmdb-${item.id}`,
    Title: item.title || item.name || '',
    Year: (item.release_date || item.first_air_date || '').substring(0, 4),
    Poster: getPosterUrl(item.poster_path),
    Type: isMovie ? 'movie' : 'series',
    _tmdbId: item.id,
  };
};

export async function searchMovies(query: string, page: number = 1): Promise<SearchResult> {
  const cacheKey = `search-${query}-${page}`;
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    console.log('[v0] Hybrid searching for:', query);

    const [tmdbRes, omdbRes] = await Promise.allSettled([
      fetch(`/api/proxy?endpoint=search&q=${encodeURIComponent(query)}&page=${page}&remote=tmdb`).then(r => r.json()),
      API_KEY ? fetch(`/api/proxy?remote=omdb&apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`).then(r => r.json()) : Promise.resolve(null)
    ]);

    let combined: any[] = [];
    let total = 0;

    if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.results) {
      const items = tmdbRes.value.results
        .filter((i: any) => i.media_type !== 'person' && i.poster_path)
        .map(mapTmdbItem);
      combined.push(...items);
      total += tmdbRes.value.total_results || 0;
    }

    if (omdbRes.status === 'fulfilled' && omdbRes.value?.Search) {
      combined.push(...omdbRes.value.Search);
      total += parseInt(omdbRes.value.totalResults || '0');
    }

    // Deduplicate
    const seen = new Set<string>();
    const deduped = combined.filter(item => {
      const key = item.imdbID || item.Title;
      if (seen.has(key)) return false;
      seen.add(key);
      return item.Poster && item.Poster !== 'N/A' && item.imdbID;
    });

    const result: SearchResult = {
      Search: deduped,
      totalResults: total.toString(),
      Response: deduped.length > 0 ? 'True' : 'False',
      Error: deduped.length === 0 ? 'Movie not found!' : undefined
    };
    cache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error('[v0] Search error:', error);
    return { Search: [], totalResults: '0', Response: 'False', Error: 'Search failed' };
  }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' | 'month' = 'week', page: number = 1): Promise<SearchResult> {
  // TMDB only has day/week trending — map month to week
  const tw = timeWindow === 'month' ? 'week' : timeWindow;
  const cacheKey = `trending-${tw}-${page}`;
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    console.log(`[v0] Fetching trending (${tw})...`);
    const res = await fetch(`/api/proxy?endpoint=trending&time_window=${tw}&page=${page}&remote=tmdb`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.results?.length > 0) {
      const items = data.results
        .filter((i: any) => i.media_type !== 'person' && i.poster_path)
        .map(mapTmdbItem);

      const result: SearchResult = {
        Search: items,
        totalResults: data.total_results?.toString() || items.length.toString(),
        Response: 'True'
      };
      cache[cacheKey] = result;
      return result;
    }
    return { Search: [], totalResults: '0', Response: 'False', Error: 'No trending movies found' };
  } catch (error) {
    console.error('[v0] Trending error:', error);
    return { Search: [], totalResults: '0', Response: 'False', Error: 'Network error' };
  }
}

export async function getMovieDetails(id: string): Promise<Movie | null> {
  const cacheKey = `movie-${id}`;
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    console.log('[v0] Fetching details for:', id);
    const isImdb = id.startsWith('tt');
    const isTmdbFake = id.startsWith('tmdb-');

    let data: any = null;

    if (isImdb) {
      // Try TMDB find by IMDB ID
      const res = await fetch(`/api/proxy?endpoint=movie&imdb_id=${id}&remote=tmdb`);
      if (res.ok) {
        const json = await res.json();
        if (json && (json.title || json.name)) data = json;
      }

      // Fallback to OMDb
      if (!data && API_KEY) {
        console.log('[v0] TMDB failed, falling back to OMDb for:', id);
        const omdbRes = await fetch(`/api/proxy?remote=omdb&apikey=${API_KEY}&i=${id}&plot=full`);
        if (omdbRes.ok) {
          const omdbData = await omdbRes.json();
          if (omdbData.Response === 'True') {
            cache[cacheKey] = omdbData;
            return omdbData as Movie;
          }
        }
      }
    } else if (isTmdbFake) {
      // Numeric TMDB id stored as "tmdb-{id}"
      const tmdbId = id.replace('tmdb-', '');
      const res = await fetch(`/api/proxy?endpoint=movie&tmdb_id=${tmdbId}&remote=tmdb`);
      if (res.ok) {
        const json = await res.json();
        if (json && (json.title || json.name)) data = json;
      }
    }

    if (data) {
      const isTV = data._type === 'tv' || data.name;
      const imdbId = data._imdb_id || data.external_ids?.imdb_id || data.imdb_id || id;
      const genres = data.genres?.map((g: any) => g.name).join(', ') || 'N/A';
      const director = data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A';
      const actors = data.credits?.cast?.slice(0, 4).map((c: any) => c.name).join(', ') || 'N/A';

      const mapped: Movie = {
        imdbID: imdbId,
        Title: data.title || data.name || 'N/A',
        Year: (data.release_date || data.first_air_date || '').substring(0, 4) || 'N/A',
        Rated: data.adult ? 'R' : 'N/A',
        Released: data.release_date || data.first_air_date || 'N/A',
        Runtime: data.runtime ? `${data.runtime} min` : (data.episode_run_time?.[0] ? `${data.episode_run_time[0]} min` : 'N/A'),
        Genre: genres,
        Director: director,
        Writer: 'N/A',
        Actors: actors,
        Plot: data.overview || 'N/A',
        Language: data.original_language?.toUpperCase() || 'N/A',
        Country: data.production_countries?.map((c: any) => c.name).join(', ') || 'N/A',
        Awards: 'N/A',
        Poster: getPosterUrl(data.poster_path),
        Ratings: [{ Source: 'TMDB', Value: `${data.vote_average?.toFixed(1)}/10` }],
        Metascore: 'N/A',
        imdbRating: data.vote_average?.toFixed(1) || 'N/A',
        imdbVotes: data.vote_count?.toString() || 'N/A',
        Type: isTV ? 'series' : 'movie',
        Response: 'True'
      };
      cache[cacheKey] = mapped;
      return mapped;
    }

    console.warn('[v0] All detail sources failed for:', id);
    return null;
  } catch (error) {
    console.error('[v0] Details fetch error:', error);
    return null;
  }
}
