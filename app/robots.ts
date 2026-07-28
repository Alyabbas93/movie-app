import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourmoviesite.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Default: all bots ────────────────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/*.json$',
        ],
      },
      // ─── Google ───────────────────────────────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
      },
      // ─── Bing ─────────────────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
        crawlDelay: 1,
      },
      // ─── DuckDuckGo ───────────────────────────────────────────────────────
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      // ─── Yandex ───────────────────────────────────────────────────────────
      {
        userAgent: 'YandexBot',
        allow: '/',
        crawlDelay: 2,
      },
      // ─── Apple ────────────────────────────────────────────────────────────
      {
        userAgent: 'Applebot',
        allow: '/',
      },
      // ─── Yahoo Slurp ──────────────────────────────────────────────────────
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 2,
      },
      // ─── Baidu ────────────────────────────────────────────────────────────
      {
        userAgent: 'Baiduspider',
        allow: '/',
        crawlDelay: 2,
      },
      // ─── Meta / Facebook ──────────────────────────────────────────────────
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      // ─── Twitter ──────────────────────────────────────────────────────────
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
