/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // ─── Image Optimization ──────────────────────────────────────────────────
  images: {
    unoptimized: false, // Enable Next.js image optimization for better LCP scores
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // Cache images for 24h
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'ia.media-imdb.com' },
    ],
  },

  // ─── Compression ─────────────────────────────────────────────────────────
  compress: true,

  // ─── Power Optimizations (Core Web Vitals) ───────────────────────────────
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // ─── Security + Performance HTTP Headers (ranking signal) ───────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevents MIME-type sniffing (security signal)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Prevents clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Controls referrer info sent with requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restricts browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // XSS protection (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      // Long-cache for static assets (improves repeat-visit performance)
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ─── Redirects (avoid duplicate content) ────────────────────────────────
  async redirects() {
    return [
      // Force trailing-slash consistency
      {
        source: '/movie',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
