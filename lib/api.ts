const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com';
const POSTER_URL = 'http://img.omdbapi.com';

if (!API_KEY) {
  console.error('[v0] OMDb API key is not configured. Please add NEXT_PUBLIC_OMDB_API_KEY to your environment.');
}

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

export async function searchMovies(query: string): Promise<SearchResult> {
  if (!API_KEY) {
    console.error('[v0] Cannot search: API key not configured');
    return { Search: [], totalResults: '0', Response: 'False', Error: 'API key not configured' };
  }

  const cacheKey = `search-${query}`;
  
  if (cache[cacheKey]) {
    console.log('[v0] Using cached results for:', query);
    return cache[cacheKey];
  }

  try {
    console.log('[v0] Searching for:', query);
    const url = `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
    console.log('[v0] API URL:', url.replace(API_KEY, '[REDACTED]'));
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('[v0] API Response:', { response: data.Response, results: data.Search?.length || 0 });
    
    if (data.Response === 'True' && data.Search) {
      cache[cacheKey] = data;
      return data;
    } else {
      console.error('[v0] API Error:', data.Error);
      return { Search: [], totalResults: '0', Response: 'False', Error: data.Error };
    }
  } catch (error) {
    console.error('[v0] Search error:', error);
    return { Search: [], totalResults: '0', Response: 'False', Error: 'Network error' };
  }
}

export async function getMovieDetails(imdbID: string): Promise<Movie | null> {
  if (!API_KEY) {
    console.error('[v0] Cannot fetch details: API key not configured');
    return null;
  }

  const cacheKey = `movie-${imdbID}`;
  
  if (cache[cacheKey]) {
    console.log('[v0] Using cached details for:', imdbID);
    return cache[cacheKey];
  }

  try {
    console.log('[v0] Fetching details for:', imdbID);
    const response = await fetch(
      `${BASE_URL}/?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    
    console.log('[v0] Details response:', data.Response);
    
    if (data.Response === 'True') {
      cache[cacheKey] = data;
      return data;
    } else {
      console.error('[v0] Details error:', data.Error);
      return null;
    }
  } catch (error) {
    console.error('[v0] Details fetch error:', error);
    return null;
  }
}
