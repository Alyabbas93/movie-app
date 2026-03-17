import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    try {
        const targetUrl = `https://api.2embed.cc/${endpoint}`;

        // Add additional query parameters to the target URL
        const targetUrlObj = new URL(targetUrl);
        searchParams.forEach((value, key) => {
            if (key !== 'endpoint') {
                targetUrlObj.searchParams.append(key, value);
            }
        });

        const response = await fetch(targetUrlObj.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[proxy error]', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
