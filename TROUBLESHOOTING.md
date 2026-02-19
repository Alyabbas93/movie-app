# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to fetch" Error

**Symptoms:**
- Movies not loading
- Search doesn't return results
- Console shows "Failed to fetch"

**Causes:**
- Browser extension interfering with requests
- CORS issues
- Network connectivity problem
- Invalid API key

**Solutions:**

1. **Disable Browser Extensions**
   - This is the most common cause
   - Disable ad blockers, privacy extensions, etc.
   - Try in Incognito/Private mode
   - Re-enable extensions one by one to find the culprit

2. **Check API Key**
   ```bash
   # Verify .env.local has your key:
   cat .env.local
   ```
   - Get free key from: https://www.omdbapi.com/
   - Restart dev server after adding key

3. **Check Network Connection**
   - Open DevTools → Network tab
   - Try to search for a movie
   - Look for API calls to `www.omdbapi.com`
   - Check response status and body

4. **Clear Cache & Hard Refresh**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or `Ctrl+Shift+Delete` to open cache clear dialog

### Issue 2: Hydration Mismatch Error

**Symptoms:**
- Console warnings about hydration
- Buttons/text flickering
- `fdprocessedid` attributes in HTML

**Causes:**
- Browser extensions modifying DOM
- Server-rendered content differs from client
- Client-side randomization

**Solutions:**

1. **Disable Extensions** (most common)
   - Same as Issue 1

2. **Clear ServiceWorker**
   - DevTools → Application → Service Workers
   - Click "Unregister"
   - Hard refresh page

3. **Check React DevTools**
   - Extensions modifying React tree
   - Disable React DevTools extension
   - Try again

### Issue 3: Movies Not Showing (Empty Results)

**Symptoms:**
- Search returns no results
- Popular movies not loading
- "No search results received" in console

**Causes:**
- API key missing or invalid
- API rate limit exceeded
- Search query returning no results
- Network blocked

**Solutions:**

1. **Test API Directly**
   ```bash
   # Test in browser console:
   fetch('http://www.omdbapi.com/?apikey=YOUR_KEY&s=Batman')
     .then(r => r.json())
     .then(data => console.log(data))
   ```

2. **Check API Limits**
   - OMDb API free tier: 1000 requests/day
   - Paid tier available for more requests
   - Check: https://www.omdbapi.com/

3. **Verify Search Query**
   - Try common movie titles: "Batman", "Avatar", "Inception"
   - Some queries may have no results
   - Try different search terms

4. **Check .env.local**
   ```bash
   # Must contain:
   NEXT_PUBLIC_OMDB_API_KEY=your_actual_key
   
   # Not:
   NEXT_PUBLIC_OMDB_API_KEY=your_key_here  # Wrong!
   OMDB_API_KEY=...  # Wrong prefix!
   ```

### Issue 4: Images Not Loading

**Symptoms:**
- Movie posters show as blank/gray
- Placeholder text showing instead of images
- Images fail to load for some movies

**Causes:**
- Movie doesn't have poster on OMDb
- Image URL is invalid (N/A)
- CORS blocking image

**Solutions:**

1. **Check Network Tab**
   - DevTools → Network tab
   - Filter by Images
   - See which images failed

2. **Verify Poster URLs**
   - Open OMDb API in browser
   - Check JSON response for "Poster" field
   - Some movies show "N/A" if no poster

3. **Accept Missing Posters**
   - App shows placeholder for missing images
   - This is expected behavior
   - No fix needed

### Issue 5: Watchlist Not Persisting

**Symptoms:**
- Watchlist clears on page refresh
- Heart doesn't stay filled
- Changes not saved

**Causes:**
- localStorage disabled
- Private/Incognito mode
- Browser settings blocking storage

**Solutions:**

1. **Enable localStorage**
   - DevTools → Application → Storage
   - Check localStorage is available
   - Some browsers disable in private mode

2. **Try Regular Mode**
   - Incognito/Private mode has limited storage
   - Use regular browser window
   - Try different browser

3. **Check Storage Quota**
   - Each domain has limited storage
   - Clear old data to free space
   - DevTools → Application → Storage

4. **Verify Console**
   - Look for localStorage errors
   - Check browser console for warnings

### Issue 6: Offline Page Not Working

**Symptoms:**
- Offline page doesn't show
- Regular page shows error
- Service Worker not registered

**Causes:**
- Service Worker not registered
- Browser doesn't support SW
- HTTPS required (localhost OK)

**Solutions:**

1. **Check Service Worker**
   - DevTools → Application → Service Workers
   - Should show "Service Worker registered"
   - If not, hard refresh

2. **Verify Registration**
   - Console should show: `[v0] Service Worker registered`
   - If not, check `/public/sw.js` exists
   - Restart dev server

3. **Test Offline**
   - DevTools → Network tab
   - Check "Offline" checkbox
   - Page should show offline page
   - Or Throttle to "offline"

4. **Browser Support**
   - Service Workers need HTTPS (or localhost)
   - Not supported in very old browsers
   - Works in: Chrome, Firefox, Edge, Safari

### Issue 7: Buttons Not Responding

**Symptoms:**
- Click buttons, nothing happens
- No console logs
- No feedback on click

**Causes:**
- Event listeners not attached
- JavaScript not loaded
- Component not rendering

**Solutions:**

1. **Check Console Logs**
   - Open DevTools Console
   - Click button
   - Should see `[v0] ...clicked` message
   - If not, JS not running

2. **Hard Refresh**
   - Clear browser cache
   - `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Reload page

3. **Check Dependencies**
   - Verify all npm packages installed
   - Run `npm install` or `pnpm install`
   - Restart dev server

### Issue 8: Search Not Working

**Symptoms:**
- Can't type in search bar
- Search doesn't execute
- Results always empty

**Causes:**
- Search bar component not loading
- API calls failing
- State not updating

**Solutions:**

1. **Check Search Bar Renders**
   - Look for search input in page
   - Should be visible on desktop
   - Mobile has different placement

2. **Test Search Manually**
   - Open DevTools Console
   - Paste: `fetch('http://www.omdbapi.com/?apikey=YOUR_KEY&s=test')`
   - Check response

3. **Verify Import**
   - Check `SearchBar` component imported
   - Check `onSearch` handler connected
   - Look for errors in console

### Issue 9: Featured Movie Not Showing

**Symptoms:**
- No featured movie hero section
- "No featured movie" message
- Loading skeleton never disappears

**Causes:**
- Popular movies not loading
- Featured movie not set
- Loading state stuck

**Solutions:**

1. **Check Popular Movies**
   - Console should show: `[v0] Popular movies loaded: X`
   - If 0, API not working (see Issue 3)

2. **Check State**
   - DevTools React DevTools
   - Find Home component
   - Check `featuredMovie` state
   - Should have data once loaded

3. **Wait for Load**
   - First load takes time
   - Skeleton shows while loading
   - Wait 5 seconds, then refresh

### Issue 10: Mobile Layout Broken

**Symptoms:**
- Layout looks wrong on mobile
- Text too small/large
- Buttons hard to click
- Horizontal scrolling

**Causes:**
- Viewport not set correctly
- CSS media queries not working
- Touch targets too small

**Solutions:**

1. **Check Viewport**
   - DevTools → Device toolbar (Ctrl+Shift+M)
   - Try different device sizes
   - Verify layout at each breakpoint

2. **Clear Cache**
   - Mobile cache may be old
   - Hard refresh with Ctrl+Shift+R
   - Clear app cache in settings

3. **Check CSS**
   - Tailwind responsive classes working?
   - md: (768px), lg: (1024px)
   - Reload to apply changes

## Debug Checklist

Use this when troubleshooting:

- [ ] API key set in `.env.local`
- [ ] Dev server restarted after env change
- [ ] Browser extensions disabled
- [ ] Hard refresh done (Ctrl+Shift+R)
- [ ] Console checked for errors
- [ ] Network tab checked for API calls
- [ ] localStorage enabled
- [ ] Service Worker registered
- [ ] Private/Incognito mode disabled
- [ ] Different browser tried
- [ ] Cache cleared

## Console Commands

Helpful debugging in DevTools Console:

```javascript
// Check API key
console.log(process.env.NEXT_PUBLIC_OMDB_API_KEY)

// Test search
fetch('http://www.omdbapi.com/?apikey=YOUR_KEY&s=Batman')
  .then(r => r.json())
  .then(d => console.log(d))

// Check watchlist
console.log(JSON.parse(localStorage.getItem('watchlist')))

// Clear watchlist
localStorage.removeItem('watchlist')

// Check service worker
navigator.serviceWorker.getRegistrations()

// Unregister service worker
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})
```

## Getting Help

If you're stuck:

1. Check this document first
2. Look at console errors
3. Check Network tab in DevTools
4. Try in Incognito mode
5. Try different browser
6. Clear cache and restart
7. Check OMDb API docs: https://www.omdbapi.com/

## Performance Tips

- Reduce browser extensions
- Clear old cache data
- Limit search results display
- Use network throttling to simulate slow connection
- Monitor DevTools Performance tab

## Still Stuck?

Check if:
- API key is valid (test on OMDb site)
- Internet connection working
- Browser is up to date
- Localhost:3000 accessible
- No firewall blocking requests
