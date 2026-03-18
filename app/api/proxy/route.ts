import { NextResponse } from 'next/server';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // If it's a server error (5xx), try again
            if (!response.ok && response.status >= 500 && i < retries - 1) {
                console.log(`[proxy] Retrying due to server error ${response.status} (attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
                continue;
            }

            return response;
        } catch (error: any) {
            if (i === retries - 1) throw error;

            const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');
            console.log(`[proxy] Retrying due to ${isTimeout ? 'timeout' : 'network error'} (attempt ${i + 1}/${retries})`);

            // Wait before next attempt (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
        }
    }
    throw new Error('All retry attempts failed');
}

export async function GET(request: Request) {
    const urlObj = new URL(request.url);
    const searchParams = urlObj.searchParams;
    const endpoint = searchParams.get('endpoint');
    const remote = searchParams.get('remote') || '2embed';

    // Whitelist allowed domains for security
    const remoteMap: { [key: string]: string } = {
        '2embed': 'https://www.2embed.cc', // Updated to www
        '2embedapi': 'https://api.2embed.cc',
        'omdb': 'https://www.omdbapi.com',
        'multiembed': 'https://multiembed.mov'
    };

    const baseUrl = remoteMap[remote];
    if (!baseUrl) {
        console.error(`[proxy] Blocked invalid remote: ${remote}`);
        return NextResponse.json({ error: 'Invalid remote source' }, { status: 400 });
    }

    try {
        let targetUrl = `${baseUrl}/${endpoint || ''}`;
        
        // Handle OMDb which uses params instead of endpoints usually
        if (remote === 'omdb') {
            targetUrl = baseUrl;
        }

        const targetUrlObj = new URL(targetUrl);
        searchParams.forEach((value, key) => {
            if (key !== 'endpoint' && key !== 'remote') {
                targetUrlObj.searchParams.append(key, value);
            }
        });

        console.log(`[proxy] Routing ${remote} -> ${targetUrlObj.host}${targetUrlObj.pathname}`);

        const response = await fetchWithRetry(targetUrlObj.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour on Vercel
        });

        if (!response.ok) {
            console.error(`[proxy] Upstream error ${response.status} from ${remote}`);
            return NextResponse.json(
                { error: `Upstream API error: ${response.status} from ${remote}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`[proxy error from ${remote}]`, error.message);

        const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');

        return NextResponse.json(
            {
                error: isTimeout ? 'The movie database is taking too long to respond.' : 'Failed to fetch data from the movie database.',
                details: error.message,
                remote: remote
            },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
