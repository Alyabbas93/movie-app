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
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const remote = searchParams.get('remote') || '2embed'; // Default to 2embed

    if (!endpoint && remote !== 'omdb') {
        return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    // Whitelist allowed domains for security
    const remoteMap: { [key: string]: string } = {
        '2embed': 'https://api.2embed.cc',
        'omdb': 'https://www.omdbapi.com'
    };

    const baseUrl = remoteMap[remote];
    if (!baseUrl) {
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

        console.log(`[proxy] Fetching from ${remote}: ${targetUrlObj.toString()}`);

        const response = await fetchWithRetry(targetUrlObj.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[proxy] Upstream error ${response.status}:`, errorText);
            return NextResponse.json(
                { error: `Upstream API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[proxy error]', error);

        const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');

        return NextResponse.json(
            {
                error: isTimeout ? 'The movie database is taking too long to respond. Please try again.' : 'Failed to fetch data from the movie database.',
                details: error.message
            },
            { status: isTimeout ? 504 : 500 }
        );
    }
}
