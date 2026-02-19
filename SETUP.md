# Movie App - Setup Guide

## Quick Start

### 1. API Key Configuration

The app uses the **OMDb API** to fetch movies and posters. Your API key is already configured, but if you need to add or change it:

**Environment Variable:**
```
NEXT_PUBLIC_OMDB_API_KEY=ce4738ca
```

### 2. Running the App

```bash
# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## API Information

### OMDb API Endpoints

**Data Endpoint:**
```
http://www.omdbapi.com/?apikey=[YOUR_KEY]&s=[SEARCH_QUERY]
```

**Poster Endpoint:**
```
http://img.omdbapi.com/?apikey=[YOUR_KEY]&i=[IMDB_ID]
```

### API Key

- Current Key: `ce4738ca`
- Get a free key: https://www.omdbapi.com/apikey.aspx
- Free tier allows: 1,000 requests/day

## Features

✅ **Movie Search** - Search for movies by title
✅ **Poster Display** - Load movie posters from OMDb
✅ **Movie Details** - View full movie information
✅ **Offline Support** - Offline page with service worker
✅ **Responsive Design** - Works on desktop and mobile
✅ **Dark Teal Theme** - Professional color scheme
✅ **GSAP Animations** - Smooth page transitions and interactions

## Troubleshooting

### Movies Not Loading

1. **Check the console logs** - Look for `[v0]` debug messages
2. **Verify API Key** - Make sure `NEXT_PUBLIC_OMDB_API_KEY` is set in `.env.local`
3. **Check Network** - Open browser DevTools > Network tab
4. **API Rate Limit** - Free tier has 1,000 requests/day limit

### Posters Not Showing

- Posters are loaded directly from OMDb: `http://img.omdbapi.com/?apikey=[KEY]&i=[IMDB_ID]`
- Some movies may have `Poster: 'N/A'` - this is normal
- The app shows a placeholder when posters are unavailable

### Offline Page Not Showing

- Service Worker needs HTTPS or localhost to work
- Clear browser cache if service worker doesn't update
- Check browser console for service worker errors

## Debug Tips

Look for these console messages to debug issues:

```
[v0] Loading popular movies...
[v0] Searching for: [query]
[v0] API Response: { response: 'True', results: X }
[v0] Setting featured movie: [title]
[v0] Service Worker registered: [registration]
```

## File Structure

```
/app
  /movie/[id]/page.tsx    - Movie detail page
  /offline.tsx             - Offline fallback page
  page.tsx                 - Home page
  layout.tsx               - Root layout

/components
  MovieCard.tsx            - Individual movie card
  MovieDetails.tsx         - Movie detail display
  Navbar.tsx              - Navigation sidebar
  SearchBar.tsx           - Search input
  MoviesCarousel.tsx      - Movie carousel slider
  StatsPanel.tsx          - Stats display

/lib
  api.ts                  - OMDb API service
  animations.ts           - GSAP animation utilities

/public
  sw.js                   - Service worker for offline support

/styles
  animations.module.css   - CSS animations
```

## Next Steps

1. Open the app at `http://localhost:3000`
2. Search for movies using the search bar
3. Click on a movie to see details
4. Disconnect internet to see the offline page
5. Check browser console for debug logs

## Support

If you encounter issues:
1. Check the console logs (Ctrl+Shift+J)
2. Look for `[v0]` debug messages
3. Verify API key is configured
4. Clear browser cache and reload
5. Check OMDb API status: https://www.omdbapi.com/
