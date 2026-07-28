'use client';

import Link from 'next/link';
import { Film, Tv, Star, Zap, Shield, Smartphone, Globe, Clock, Search, Play } from 'lucide-react';

const genres = [
  { label: 'Action Movies', href: '/?q=action', icon: <Zap size={14} /> },
  { label: 'Comedy Movies', href: '/?q=comedy', icon: <Star size={14} /> },
  { label: 'Horror Movies', href: '/?q=horror', icon: <Film size={14} /> },
  { label: 'Sci-Fi Movies', href: '/?q=sci-fi', icon: <Globe size={14} /> },
  { label: 'Romance Movies', href: '/?q=romance', icon: <Star size={14} /> },
  { label: 'Thriller Movies', href: '/?q=thriller', icon: <Play size={14} /> },
  { label: 'Animation Movies', href: '/?q=animation', icon: <Film size={14} /> },
  { label: 'Documentary', href: '/?q=documentary', icon: <Tv size={14} /> },
  { label: 'Drama Series', href: '/?category=Series&q=drama', icon: <Tv size={14} /> },
  { label: 'Crime Series', href: '/?category=Series&q=crime', icon: <Search size={14} /> },
  { label: 'Fantasy Series', href: '/?category=Series&q=fantasy', icon: <Star size={14} /> },
  { label: 'Reality TV', href: '/?category=Series&q=reality', icon: <Tv size={14} /> },
  { label: 'Superhero Movies', href: '/?q=superhero', icon: <Zap size={14} /> },
  { label: 'Adventure Movies', href: '/?q=adventure', icon: <Globe size={14} /> },
  { label: 'Mystery Series', href: '/?category=Series&q=mystery', icon: <Search size={14} /> },
  { label: 'Anime Series', href: '/?category=Series&q=anime', icon: <Tv size={14} /> },
];

const features = [
  {
    icon: <Zap size={20} className="text-[#2d5a5a]" />,
    title: 'HD Streaming — 1080p Free',
    desc: 'Watch movies and TV shows in Full HD and 1080p. Crystal-clear picture quality with no buffering, completely free of charge.',
  },
  {
    icon: <Shield size={20} className="text-[#2d5a5a]" />,
    title: 'No Sign-Up Required',
    desc: 'Stream any movie or TV series instantly — no account, no credit card, no registration required. Just press play.',
  },
  {
    icon: <Smartphone size={20} className="text-[#2d5a5a]" />,
    title: 'Watch on Any Device',
    desc: 'Works on your phone, tablet, laptop, and smart TV. Enjoy free movies anywhere, anytime, on any screen.',
  },
  {
    icon: <Globe size={20} className="text-[#2d5a5a]" />,
    title: 'Thousands of Titles',
    desc: 'Browse a massive library of free movies and TV shows — from Hollywood blockbusters to indie gems and international hits.',
  },
  {
    icon: <Film size={20} className="text-[#2d5a5a]" />,
    title: 'Latest Movies 2025–2026',
    desc: 'Find the newest movie releases of 2025 and 2026. The free streaming library is updated daily with the latest titles.',
  },
  {
    icon: <Clock size={20} className="text-[#2d5a5a]" />,
    title: 'Full TV Series & Episodes',
    desc: 'Watch complete TV series with full seasons and all episodes — stream free online right now without any download.',
  },
];

const faqs = [
  {
    q: 'Is Movies free to watch movies online?',
    a: 'Yes, Movies is 100% free. You can watch any movie or TV show online without paying anything. No subscription, no hidden fees — just free movie streaming in HD quality.',
  },
  {
    q: 'Do I need to create an account to watch movies?',
    a: 'No account or sign-up is needed. Simply search for any movie or TV series and start watching instantly. Watch free movies online without registration.',
  },
  {
    q: 'Can I watch the latest movies 2025 and 2026 on Movies?',
    a: 'Yes. Movies features the latest movies of 2025 and 2026 plus trending TV shows. The library is updated regularly with new releases so you can always find something fresh to stream for free.',
  },
  {
    q: 'What types of movies and shows are available?',
    a: 'Movies has everything — action, comedy, horror, sci-fi, romance, thriller, drama, documentary, anime, superhero and more. Watch complete TV series with all seasons and episodes free online.',
  },
  {
    q: 'What devices can I use to watch movies?',
    a: 'Works on all devices including smartphones (Android and iPhone), tablets, laptops, desktop computers, and smart TVs. Watch movies online free on any screen.',
  },
  {
    q: 'What is the video streaming quality?',
    a: 'Movies streams in HD quality (720p and 1080p). Quality automatically adjusts based on your internet speed so you always get the best possible stream.',
  },
  {
    q: 'Can I watch TV shows with all seasons and episodes?',
    a: 'Yes! Movies lets you watch full TV series including all seasons and every episode. Select your season and episode directly from the episode picker on each show page.',
  },
  {
    q: 'Is there a download option?',
    a: 'Movies is a streaming-only service. You can watch any movie or TV show instantly in your browser without downloading anything. No app or plugin is required.',
  },
];

const popularSearches = [
  'watch movies online free',
  'free streaming movies',
  'watch TV shows online',
  'best movies 2025',
  'best movies 2026',
  'action movies free',
  'horror movies online',
  'comedy series streaming',
  'watch without signup',
  'HD movie streaming',
  'latest movies online',
  'thriller movies free',
  'sci-fi movies streaming',
  'watch anime online free',
  'superhero movies free',
  'documentary streaming free',
  'binge watch series free',
  'new releases 2026',
];

export function SeoContent() {
  return (
    <section className="w-full bg-white dark:bg-[#0d1f1f] transition-colors" aria-label="About Movies">

      {/* Genre Grid */}
      <div className="px-4 md:px-8 py-10 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-6">
          Browse Free Movies by Genre
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {genres.map((g) => (
            <Link
              key={g.label}
              href={g.href}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a3a3a] border border-gray-100 dark:border-white/5 hover:border-[#2d5a5a] hover:bg-[#e8f5f5] dark:hover:bg-[#2d5a5a]/30 transition-all duration-200 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#1a3a3a] dark:hover:text-white"
            >
              <span className="shrink-0 text-[#2d5a5a] dark:text-teal-400">{g.icon}</span>
              <span className="leading-tight">{g.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Movies (Features) */}
      <div className="px-4 md:px-8 py-10 bg-gray-50 dark:bg-[#1a3a3a]/50 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-2">
          Why Watch Free Movies on Movies?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
          Movies is the best free movie streaming site to watch movies and TV shows online in HD — no
          subscription, no sign-up required. Stream thousands of free movies anytime, on any device.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-[#1a3a3a] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword-Rich About Block */}
      <div className="px-4 md:px-8 py-10 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-4xl">
          <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-6">
            The Best Free Movie Streaming Site — Watch Movies Online Free in HD
          </h2>
          <div className="text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              <strong className="text-gray-800 dark:text-white">Movies</strong> is your #1 destination
              to <strong>watch movies online free</strong> in HD quality without any subscription or registration.
              Whether you want to stream the <strong>latest movies 2025</strong>, binge-watch popular TV series,
              or discover classic films, Movies has the biggest free streaming library — available
              in your browser, on any device.
            </p>
            <p>
              Looking to <strong>watch free movies online without signing up</strong>? Movies makes it
              effortless. Search thousands of titles — from Hollywood blockbusters and Oscar winners to
              Bollywood hits and independent films — and start watching instantly. No download required.
              No account needed. Just <strong>free HD movie streaming</strong>.
            </p>
            <p>
              Movies is also the best place to <strong>watch TV shows online free</strong>. Stream
              complete TV series with all seasons and episodes — from gripping crime dramas and addictive
              reality shows to fan-favourite fantasy and sci-fi series. The library is updated daily with
              the <strong>newest TV episodes</strong> so you never miss what is trending.
            </p>
            <p>
              The smart search engine lets you find any movie or show in seconds. Browse by genre —
              <strong> action, comedy, horror, romance, thriller, sci-fi, documentary</strong> — or
              search directly by title, director, or actor. With multiple streaming servers for every
              title, you always get a fast, reliable stream in HD.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 md:px-8 py-10 bg-gray-50 dark:bg-[#1a3a3a]/50 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-8">
          Frequently Asked Questions — Free Movie Streaming
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a3a3a] border border-gray-100 dark:border-white/5 shadow-sm"
            >
              <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-2 leading-snug">{faq.q}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div className="px-4 md:px-8 py-8 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          Popular Searches on Movies
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/?q=${encodeURIComponent(term)}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#2d5a5a] hover:text-white transition-all duration-200"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
