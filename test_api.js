const fs = require('fs');

async function fetchSamples() {
    try {
        const trendingList = await fetch('https://api.2embed.cc/trending?time_window=week&page=1').then(r => r.json());
        const searchList = await fetch('https://api.2embed.cc/search?q=batman&page=1').then(r => r.json());
        let movieSample = null;

        if (trendingList && trendingList.results && trendingList.results[0]) {
            const id = trendingList.results[0].imdb_id || trendingList.results[0].tmdb_id;
            if (id) {
                movieSample = await fetch(`https://api.2embed.cc/movie?imdb_id=${id}`).then(r => r.json());
            }
        }

        fs.writeFileSync('api_samples.json', JSON.stringify({
            trendingFirst: trendingList?.results?.[0],
            searchFirst: searchList?.results?.[0],
            movieSample: movieSample
        }, null, 2));
        console.log('Done');
    } catch (e) {
        console.error(e);
    }
}

fetchSamples();
