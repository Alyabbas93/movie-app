import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8'; // public fallback key for TMDB
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, backoff = 800): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok && response.status >= 500 && i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
                continue;
            }
            return response;
        } catch (error: any) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
        }
    }
    throw new Error('All retry attempts failed');
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const remote = searchParams.get('remote') || 'tmdb';

    // Whitelist
    const remoteMap: { [key: string]: string } = {
        'tmdb': TMDB_BASE,
        'omdb': 'https://www.omdbapi.com',
    };

    const baseUrl = remoteMap[remote];
    if (!baseUrl) {
        return NextResponse.json({ error: 'Invalid remote source' }, { status: 400 });
    }

    try {
        let targetUrl: string;

        if (remote === 'omdb') {
            targetUrl = baseUrl;
            const omdbParams = new URL(targetUrl);
            searchParams.forEach((value, key) => {
                if (key !== 'endpoint' && key !== 'remote') {
                    omdbParams.searchParams.append(key, value);
                }
            });
            const response = await fetchWithRetry(omdbParams.toString(), {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                return NextResponse.json({ error: `OMDb error: ${response.status}` }, { status: response.status });
            }
            const data = await response.json();
            return NextResponse.json(data);
        }

        // --- TMDB routing ---
        if (remote === 'tmdb') {
            const q = searchParams.get('q');
            const imdb_id = searchParams.get('imdb_id');
            const tmdb_id = searchParams.get('tmdb_id');
            const time_window = searchParams.get('time_window') || 'week';
            const page = searchParams.get('page') || '1';

            if (endpoint === 'search' && q) {
                // Multi-search
                const url = `${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}&include_adult=false`;
                const res = await fetchWithRetry(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
                return NextResponse.json(data);
            }

            if (endpoint === 'trending') {
                const url = `${TMDB_BASE}/trending/all/${time_window}?api_key=${TMDB_API_KEY}&page=${page}`;
                const res = await fetchWithRetry(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
                return NextResponse.json(data);
            }

            if (endpoint === 'movie') {
                if (imdb_id) {
                    // Find by IMDB id
                    const findUrl = `${TMDB_BASE}/find/${imdb_id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                    const findRes = await fetchWithRetry(findUrl, { headers: { 'Accept': 'application/json' } });
                    const findData = await findRes.json();
                    const item = findData.movie_results?.[0] || findData.tv_results?.[0];
                    if (item) {
                        // Get full details
                        const type = findData.movie_results?.[0] ? 'movie' : 'tv';
                        const detailUrl = `${TMDB_BASE}/${type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,external_ids`;
                        const detailRes = await fetchWithRetry(detailUrl, { headers: { 'Accept': 'application/json' } });
                        const detail = await detailRes.json();
                        return NextResponse.json({ ...detail, _type: type, _imdb_id: imdb_id });
                    }
                    return NextResponse.json({ error: 'Not found' }, { status: 404 });
                }
                if (tmdb_id) {
                    const type = searchParams.get('type') || 'movie';
                    const detailUrl = `${TMDB_BASE}/${type}/${tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=credits,external_ids`;
                    const detailRes = await fetchWithRetry(detailUrl, { headers: { 'Accept': 'application/json' } });
                    const detail = await detailRes.json();
                    return NextResponse.json({ ...detail, _type: type });
                }
                return NextResponse.json({ error: 'Missing id' }, { status: 400 });
            }
        }

        return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
    } catch (error: any) {
        const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');
        return NextResponse.json(
            { error: isTimeout ? 'Timeout fetching data' : 'Failed to fetch data', details: error.message },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
