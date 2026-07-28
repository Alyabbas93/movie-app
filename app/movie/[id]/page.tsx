import type { Metadata } from 'next';
import { getMovieDetails } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourmoviesite.com';

// ─── Dynamic Metadata for each movie ────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const movie = await getMovieDetails(id);

    if (!movie) {
      return {
        title: 'Movie Not Found',
        description: 'This movie could not be found in our database.',
        robots: { index: false, follow: false },
      };
    }

    const title = `Watch ${movie.Title} (${movie.Year}) Free Online in HD`;
    const description = movie.Plot && movie.Plot !== 'N/A'
      ? `Watch ${movie.Title} free online. ${movie.Plot.slice(0, 130)}...`
      : `Watch ${movie.Title} online for free in HD. Directed by ${movie.Director}. Starring ${movie.Actors}.`;

    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : `${BASE_URL}/og-image.png`;
    const canonicalUrl = `${BASE_URL}/movie/${id}`;

    return {
      title,
      description,
      keywords: [
        `watch ${movie.Title} online free`,
        `${movie.Title} streaming`,
        `${movie.Title} ${movie.Year}`,
        `${movie.Title} full movie free`,
        `watch ${movie.Title} HD`,
        `${movie.Title} free online`,
        `stream ${movie.Title}`,
        `${movie.Title} no signup`,
        ...(movie.Genre ? movie.Genre.split(', ').map((g: string) => `${g} movies free`) : []),
        ...(movie.Director && movie.Director !== 'N/A' ? [`${movie.Director} movies`, `movies by ${movie.Director}`] : []),
        ...(movie.Actors && movie.Actors !== 'N/A' ? movie.Actors.split(', ').slice(0, 3).map((a: string) => `${a} movies`) : []),
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'video.movie',
        url: canonicalUrl,
        siteName: 'Movies',
        title,
        description,
        images: [
          {
            url: poster,
            width: 500,
            height: 750,
            alt: `Watch ${movie.Title} (${movie.Year}) online free — movie poster`,
          },
        ],
        releaseDate: movie.Released !== 'N/A' ? movie.Released : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [poster],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
    };
  } catch {
    return {
      title: 'Watch Movie Online Free | Movies',
      description: 'Stream this movie for free on Movies in HD quality. No sign-up required.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: The actual page component is defined below.
// We keep this file as the metadata exporter and re-export the client component.
// Because Next.js requires metadata to be in a Server Component, we split:
//   • This file (Server Component) → exports generateMetadata + JSON-LD
//   • MoviePageClient.tsx          → 'use client' component with all interactivity
// ─────────────────────────────────────────────────────────────────────────────

import MoviePageClient from './MoviePageClient';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  // Fetch movie ONCE server-side for JSON-LD (SEO bots see real data)
  // Reuse same fetch — do not double-call getMovieDetails
  let movie = null;
  try {
    movie = await getMovieDetails(id);
  } catch {
    // silently fail — client component will still load
  }

  let movieJsonLd: object | null = null;
  let breadcrumbJsonLd: object | null = null;

  if (movie) {
    movieJsonLd = {
      '@context': 'https://schema.org',
      '@type': movie.Type === 'series' ? 'TVSeries' : 'Movie',
      name: movie.Title,
      description: movie.Plot !== 'N/A' ? movie.Plot : undefined,
      image: movie.Poster !== 'N/A' ? movie.Poster : undefined,
      datePublished: movie.Released !== 'N/A' ? movie.Released : undefined,
      duration: movie.Runtime !== 'N/A' ? `PT${movie.Runtime?.replace(' min', 'M')}` : undefined,
      contentRating: movie.Rated !== 'N/A' ? movie.Rated : undefined,
      genre: movie.Genre !== 'N/A' ? movie.Genre?.split(', ') : undefined,
      director: movie.Director && movie.Director !== 'N/A'
        ? { '@type': 'Person', name: movie.Director }
        : undefined,
      actor: movie.Actors && movie.Actors !== 'N/A'
        ? movie.Actors.split(', ').map((name: string) => ({ '@type': 'Person', name }))
        : undefined,
      aggregateRating: movie.imdbRating && movie.imdbRating !== 'N/A'
        ? {
            '@type': 'AggregateRating',
            ratingValue: movie.imdbRating,
            bestRating: '10',
            worstRating: '1',
            ratingCount: movie.imdbVotes?.replace(/,/g, '') || '0',
          }
        : undefined,
      url: `${BASE_URL}/movie/${id}`,
      potentialAction: {
        '@type': 'WatchAction',
        target: `${BASE_URL}/movie/${id}`,
      },
    };

    breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Movies',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: movie.Type === 'series' ? 'TV Series' : 'Movies',
          item: `${BASE_URL}/?category=${movie.Type === 'series' ? 'Series' : 'Movies'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: movie.Title,
          item: `${BASE_URL}/movie/${id}`,
        },
      ],
    };
  }

  return (
    <>
      {movieJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <MoviePageClient params={params} />
    </>
  );
}
