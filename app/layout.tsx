import type { Metadata, Viewport } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { WatchlistProvider } from '@/lib/WatchlistContext'
import { ThemeProvider } from '@/lib/ThemeContext'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2d5a5a' },
    { media: '(prefers-color-scheme: dark)', color: '#1a3a3a' },
  ],
}

export const metadata: Metadata = {
  // ─── Core ────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Movies — Watch Movies & TV Shows Free Online',
    template: '%s | Movies',
  },
  description:
    'Watch movies and TV shows online free in HD. Browse trending films, top-rated series, action, sci-fi, comedy and more. Free movie streaming with no sign-up required.',
  keywords: [
    'watch movies online free',
    'free movie streaming',
    'watch TV shows online free',
    'stream movies HD',
    'free online movies',
    'watch series free',
    'movie streaming site',
    'best free movies 2025',
    'watch films without signup',
    'trending movies 2025',
    'popular TV shows free',
    'watch action movies online',
    'sci-fi movies streaming free',
    'horror movies online free',
    'comedy movies stream free',
    'free HD movie streaming',
    'watch movies no registration',
    'free streaming no subscription',
  ],
  authors: [{ name: 'Movies', url: BASE_URL }],
  creator: 'Movies',
  publisher: 'Movies',
  category: 'Entertainment',

  // ─── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ─── Canonical ───────────────────────────────────────────────────────────
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },

  // ─── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Movies',
    title: 'Movies — Watch Movies & TV Shows Free Online',
    description:
      'Watch movies and TV shows online free in HD. Browse trending films, top-rated series, action, sci-fi, comedy and more. Free streaming, no sign-up required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Movies — Free Movie & TV Streaming Online',
        type: 'image/png',
      },
    ],
  },

  // ─── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Movies — Watch Movies & TV Shows Free Online',
    description:
      'Watch movies and TV shows online free in HD. No sign-up required. Free movie streaming.',
    images: ['/og-image.png'],
  },

  // ─── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },

  // ─── Manifest ────────────────────────────────────────────────────────────
  manifest: '/manifest.json',

  // ─── Verification (add your codes after Search Console / Bing Webmaster setup) ─
  // verification: {
  //   google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  //   yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  //   bing: 'YOUR_BING_WEBMASTER_VERIFICATION_CODE',
  // },
}

// ─── JSON-LD Structured Data (WebSite + SearchAction) ───────────────────────
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Movies',
  alternateName: ['Movies — Free Streaming', 'Watch Movies Online Free', 'Free Movie Streaming Site'],
  url: BASE_URL,
  description:
    'Watch movies and TV shows online free in HD quality. No sign-up required. Free movie streaming.',
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Movies',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/icon.svg`,
  },
  sameAs: [],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Movies free to watch movies online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Movies is 100% free. You can watch any movie or TV show online without paying anything. No subscription, no hidden fees — just free movie streaming in HD.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to watch movies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account or sign-up is needed. Simply search for any movie or TV series and start watching instantly. Watch free movies online without registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I watch the latest movies 2025 on Movies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Movies features the latest movies of 2025 and trending TV shows. The library is updated regularly with new releases so you can always find something fresh to stream for free.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of movies and TV shows are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Movies has everything — action, comedy, horror, sci-fi, romance, thriller, drama, documentary, and more. Watch complete TV series with all seasons and episodes free online.',
      },
    },
    {
      '@type': 'Question',
      name: 'What devices can I use to watch free movies online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Works on all devices including smartphones (Android and iPhone), tablets, laptops, desktop computers, and smart TVs. Watch free movies online on any screen.',
      },
    },
  ],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* Preconnect to external image CDNs for faster LCP */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://m.media-amazon.com" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
      </head>
      <body className={`${outfit.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <WatchlistProvider>
            {children}
            <Analytics />
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
