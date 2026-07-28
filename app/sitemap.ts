import { MetadataRoute } from 'next';

// Replace with your actual production domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourmoviesite.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // NOTE: Query-param URLs (?category=...) are NOT included as they may cause
  // duplicate content issues. Google will discover category pages via internal links.
  // Static pages only — movie pages are too numerous to enumerate statically.

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'hourly',  // trending movies update often
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return staticPages;
}
