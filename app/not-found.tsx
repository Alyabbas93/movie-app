import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Movies',
  description: 'The page you are looking for does not exist. Go back to Movies and watch free movies online in HD.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const genres = [
    { label: 'Action Movies', href: '/?q=action' },
    { label: 'Comedy Movies', href: '/?q=comedy' },
    { label: 'Horror Movies', href: '/?q=horror' },
    { label: 'Sci-Fi Movies', href: '/?q=sci-fi' },
    { label: 'Thriller Movies', href: '/?q=thriller' },
    { label: 'Drama Series', href: '/?category=Series&q=drama' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#0d1f1f] px-4 text-center">
      <div className="max-w-lg w-full">

        <div className="w-20 h-20 rounded-2xl bg-[#1a3a3a] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" fill="none" stroke="#2d5a5a" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">404</h1>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The movie or page you are looking for does not exist.
          Head back to <strong>Movies</strong> and watch free movies online in HD — no sign-up required.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5a5a] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg mb-8 text-sm"
        >
          Watch Free Movies
        </Link>

        <div>
          <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-3">Browse Free Movies</p>
          <div className="flex flex-wrap justify-center gap-2">
            {genres.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-[#2d5a5a] hover:text-white hover:border-[#2d5a5a] transition-all"
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
