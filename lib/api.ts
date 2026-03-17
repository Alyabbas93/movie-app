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

// Helper to map 2embed movie to our existing Movie/Search format
const mapToMovie = (item: any) => {
  const id = item.imdb_id || item.tmdb_id?.toString();
  return {
    imdbID: id || '',
    Title: item.title || item.name || '',
    Year: item.year || item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || '',
    Poster: item.poster || 'N/A',
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
    console.log('[v0] Searching for:', query);
    // 2embed has separate endpoints for movie/tv. We'll default to search for movies
    const url = `/api/proxy?endpoint=search&q=${encodeURIComponent(query)}&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const validResults = data.results.filter((item: any) =>
        item.poster && item.poster !== 'N/A' && (item.imdb_id || item.tmdb_id)
      );
      const mappedSearch = {
        Search: validResults.map(mapToMovie),
        totalResults: data.total_results?.toString() || validResults.length.toString(),
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

  try {
    const url = `/api/proxy?endpoint=trending&time_window=${timeWindow}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const validResults = data.results.filter((item: any) =>
        item.poster && item.poster !== 'N/A' && (item.imdb_id || item.tmdb_id)
      );
      const mappedSearch = {
        Search: validResults.map(mapToMovie),
        totalResults: data.total_results?.toString() || validResults.length.toString(),
        Response: 'True'
      };
      cache[cacheKey] = mappedSearch;
      return mappedSearch;
    }
    return { Search: [], totalResults: '0', Response: 'False', Error: 'No trending movies found!' };
  } catch (error) {
    console.error('[v0] Trending error:', error);
    return { Search: [], totalResults: '0', Response: 'False', Error: 'Network error' };
  }
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
    // IMDB IDs usually start with 'tt'
    const isImdb = id.startsWith('tt');
    const param = isImdb ? `imdb_id=${id}` : `tmdb_id=${id}`;

    const response = await fetch(`/api/proxy?endpoint=movie&${param}`);
    if (!response.ok) throw new Error('Failed to fetch details');
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

    return null;
  } catch (error) {
    console.error('[v0] Details fetch error:', error);
    return null;
  }
}
