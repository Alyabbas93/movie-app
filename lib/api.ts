const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY; // Kept to avoid env errors, but unused internally
const BASE_URL = 'https://api.2embed.cc';

// No OMDB key block warning anymore since 2embed doesn't require it

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
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
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

// Helper to map 2embed/TMDB movie to our existing Movie/Search format
const mapToMovie = (item: any) => {
  const id = item.imdb_id || item.tmdb_id?.toString() || item.id?.toString();
  // 2embed API returns `poster`, TMDB raw API returns `poster_path` with a base URL
  const poster = item.poster
    || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null)
    || 'N/A';
  return {
    imdbID: id || '',
    Title: item.title || item.name || '',
    Year: item.year || item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || '',
    Poster: poster,
    Type: item.title ? 'movie' : 'series',
  };
};

export async function searchMovies(query: string, page: number = 1): Promise<SearchResult> {
  const cacheKey = `search-${query}-${page}`;

  if (cache[cacheKey]) {
    console.log('[v0] Using cached results for:', query);
    return cache[cacheKey];
  }

  try {
    console.log('[v0] Hybrid searching for:', query);
    
    // Fetch from both sources in parallel
    const [tmdbRes, omdbRes] = await Promise.allSettled([
      fetch(`/api/proxy?endpoint=search&q=${encodeURIComponent(query)}&page=${page}&remote=2embed`).then(r => r.json()),
      fetch(`/api/proxy?remote=omdb&apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`).then(r => r.json())
    ]);

    let combinedResults: any[] = [];
    let totalResults = 0;

    // Process TMDB results
    if (tmdbRes.status === 'fulfilled' && tmdbRes.value.results) {
      combinedResults.push(...tmdbRes.value.results.map(mapToMovie));
      totalResults += parseInt(tmdbRes.value.total_results || '0');
    }

    // Process OMDb results
    if (omdbRes.status === 'fulfilled' && omdbRes.value.Search) {
      combinedResults.push(...omdbRes.value.Search);
      totalResults += parseInt(omdbRes.value.totalResults || '0');
    }

    // Deduplicate and filter
    if (combinedResults.length > 0) {
      const seen = new Set();
      const deduplicated = combinedResults.filter(item => {
        // Primary key: imdbID
        const idKey = item.imdbID;
        // Secondary key: Normalized Title + Year (for fuzzy matching when IDs differ)
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const fuzzyKey = `${normalize(item.Title)}-${item.Year}`;

        if (idKey && idKey !== 'N/A' && seen.has(idKey)) return false;
        if (seen.has(fuzzyKey)) return false;

        if (idKey && idKey !== 'N/A') seen.add(idKey);
        seen.add(fuzzyKey);
        
        // Filter out items without posters or valid IDs
        return item.Poster && item.Poster !== 'N/A' && item.imdbID;
      });

      const mappedSearch = {
        Search: deduplicated,
        totalResults: totalResults.toString(),
        Response: 'True'
      };
      cache[cacheKey] = mappedSearch;
      return mappedSearch;
    } else {
      return { Search: [], totalResults: '0', Response: 'False', Error: 'Movie not found!' };
    }
  } catch (error) {
    console.error('[v0] Search error:', error);
    return { Search: [], totalResults: '0', Response: 'False', Error: 'Network error' };
  }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' | 'month' = 'week', page: number = 1): Promise<SearchResult> {
  const cacheKey = `trending-${timeWindow}-${page}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Try multiple remote endpoints for trending to ensure robustness on Vercel
  const remotes = ['2embedapi', '2embed'];
  
  for (const remote of remotes) {
    try {
      console.log(`[v0] Fetching trending from ${remote}...`);
      const url = `/api/proxy?endpoint=trending&time_window=${timeWindow}&page=${page}&remote=${remote}`;
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const validResults = data.results.filter((item: any) =>
          (item.poster || item.poster_path) && (item.imdb_id || item.tmdb_id || item.id)
        );
        const mappedSearch = {
          Search: validResults.map(mapToMovie),
          totalResults: data.total_results?.toString() || validResults.length.toString(),
          Response: 'True'
        };
        cache[cacheKey] = mappedSearch;
        return mappedSearch;
      }
    } catch (err) {
      console.warn(`[v0] Trending fetch failed for ${remote}:`, err);
    }
  }

  return { Search: [], totalResults: '0', Response: 'False', Error: 'No trending movies found!' };
}

export async function getMovieDetails(id: string): Promise<Movie | null> {
  const cacheKey = `movie-${id}`;

  if (cache[cacheKey]) {
    console.log('[v0] Using cached details for:', id);
    return cache[cacheKey];
  }

  try {
    console.log('[v0] Fetching details for:', id);

    // Determine if it's an IMDB ID or TMDB ID
    const isImdb = id.startsWith('tt');
    const param = isImdb ? `imdb_id=${id}` : `tmdb_id=${id}`;

    // Try primary source (2embed/TMDB)
    const response = await fetch(`/api/proxy?endpoint=movie&${param}&remote=2embedapi`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        const mappedMovie: Movie = {
          imdbID: data.imdb_id || data.tmdb_id?.toString() || id,
          Title: data.title,
          Year: data.year || data.release_date?.substring(0, 4) || 'N/A',
          Rated: data.certification || 'N/A',
          Released: data.release_date || 'N/A',
          Runtime: data.runtime ? `${data.runtime} min` : 'N/A',
          Genre: data.genres?.join(', ') || 'N/A',
          Director: data.cast_crew?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A',
          Writer: data.cast_crew?.crew?.find((c: any) => c.department === 'Writing')?.name || 'N/A',
          Actors: data.cast_crew?.cast?.slice(0, 4).map((c: any) => c.name).join(', ') || 'N/A',
          Plot: data.plot || data.overview || 'N/A',
          Language: data.original_language || 'N/A',
          Country: data.production_countries?.join(', ') || 'N/A',
          Awards: 'N/A',
          Poster: data.poster && data.poster !== 'N/A' ? data.poster : 'N/A',
          Ratings: [{ Source: 'TMDB', Value: `${data.vote_average}/10` }],
          Metascore: 'N/A',
          imdbRating: data.vote_average?.toString() || 'N/A',
          imdbVotes: data.vote_count?.toString() || 'N/A',
          Type: 'movie',
          Response: 'True'
        };
        cache[cacheKey] = mappedMovie;
        return mappedMovie;
      }
    }

    // Fallback to OMDb if primary fails and we have an IMDB ID
    if (isImdb && API_KEY) {
      console.log('[v0] TMDB failed, falling back to OMDb for:', id);
      const omdbResponse = await fetch(`/api/proxy?remote=omdb&apikey=${API_KEY}&i=${id}&plot=full`);
      if (omdbResponse.ok) {
        const omdbData = await omdbResponse.json();
        if (omdbData.Response === 'True') {
          cache[cacheKey] = omdbData;
          return omdbData as Movie;
        }
      }
    }

    console.warn('[v0] All detail sources failed for:', id);
    return null;
  } catch (error) {
    console.error('[v0] Details fetch error:', error);
    return null;
  }
}
