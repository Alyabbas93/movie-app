import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SeoContent } from '@/components/SeoContent';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Movies — #1 Free Movie Streaming Site Online',
  description:
    'Movies is the best free movie streaming site. Watch movies online free in HD, stream TV shows without sign-up. Thousands of free movies — action, comedy, horror, sci-fi and more.',
  keywords: [
    'watch movies online free','free movie streaming','stream movies HD','watch TV shows online free',
    'free streaming site','watch movies without signup','latest movies 2025','free HD movies',
    'best free movie site','stream TV series free','watch films online','free movies no registration',
    'online movie streaming','watch action movies free','free horror movies online','comedy movies streaming',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Movies — #1 Free Movie Streaming Site',
    description: 'Watch movies and TV shows online free in HD on Movies. No account needed. Thousands of titles.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
      <Navbar />
      <div className="flex-1 md:ml-52 pt-16 md:pt-0 flex flex-col min-h-screen">

        {/* Page Header */}
        <div className="hidden md:flex md:flex-col md:items-start md:p-8 md:gap-2 bg-white dark:bg-[#1a3a3a] border-b border-gray-200 dark:border-white/10 transition-colors">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#2d5a5a] dark:text-teal-400 font-semibold mb-1 hover:opacity-80 transition-opacity">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">About Movies</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">The best free movie streaming site — watch movies &amp; TV shows online in HD</p>
        </div>

        {/* Mobile title */}
        <div className="md:hidden px-4 pt-4 pb-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#2d5a5a] dark:text-teal-400 font-semibold mb-3 hover:opacity-80 transition-opacity">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">About Movies</h1>
        </div>

        {/* ── Full SEO Text Block ─────────────────────────────────────────── */}
        <article className="px-4 md:px-10 py-8 max-w-5xl space-y-8 text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">
              Watch Movies Online Free in HD — Movies
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              <strong>Movies</strong> is the #1 free movie streaming site where you can <strong>watch movies online free</strong> in
              full HD quality without any subscription, registration, or credit card. Whether you want to stream the
              <strong> latest movies 2025</strong>, catch up on trending TV series, or rediscover classic films,
              Movies gives you instant access to thousands of titles — all completely free.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              Our platform is the best place to <strong>watch free movies online without signing up</strong>.
              Just open your browser, search for any movie or TV show, and start streaming in HD immediately.
              No download, no account, no fees — just pure, unlimited <strong>free online movie streaming</strong>.
            </p>
            <p className="text-sm leading-relaxed">
              Movies is also the ultimate destination to <strong>watch TV shows online free</strong>. From
              gripping drama series and action-packed thrillers to hilarious comedies and spine-chilling horror — stream
              complete seasons and all episodes of your favourite TV series for free, right now.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">
              Free Movie Streaming — Every Genre, Every Device
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Looking for <strong>free action movies online</strong>? Or maybe you want to stream a
              <strong> free comedy movie</strong>, a <strong>free horror film</strong>, or the latest
              <strong> free sci-fi movies</strong>? Movies has it all. Our library covers every major genre:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside mb-3 columns-2">
              {[
                'Action Movies Online Free','Comedy Movies Streaming Free','Horror Movies Watch Free',
                'Sci-Fi Movies Stream Online','Romance Movies Online','Thriller Films Free HD',
                'Documentary Movies Free','Animation Movies Online','Drama Series Free',
                'Crime TV Shows Streaming','Fantasy Series Online Free','Reality TV Free Stream',
              ].map(g => (
                <li key={g}><Link href={`/?q=${g.split(' ')[0].toLowerCase()}`} className="text-[#2d5a5a] dark:text-teal-400 hover:underline">{g}</Link></li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed">
              Movies works on every device — smartphones, tablets, laptops, desktops, and smart TVs.
              <strong> Watch free HD movies</strong> anywhere, anytime, on any screen with no app installation required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">
              Why Movies Is the Best Free Movie Site
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: '100% Free — No Subscription', desc: 'Watch unlimited movies and TV shows online free. Zero cost, no hidden fees, no premium tiers.' },
                { title: 'HD Quality Streaming', desc: 'Stream free movies in 720p and 1080p HD. Best picture quality with adaptive bitrate streaming.' },
                { title: 'No Sign-Up Required', desc: 'Watch movies free without registration. No email, no account, no personal info — instant streaming.' },
                { title: 'Thousands of Titles', desc: 'Massive free movie library updated daily. Latest movies 2025, classic films, full TV series seasons.' },
                { title: 'Multiple Streaming Servers', desc: 'If one server fails, switch instantly. Always a working stream for every free movie on the site.' },
                { title: 'All Genres Covered', desc: 'Action, horror, comedy, sci-fi, romance, thriller, documentary, animation — free movies for everyone.' },
              ].map(f => (
                <div key={f.title} className="p-4 rounded-xl bg-white dark:bg-[#1a3a3a] border border-gray-100 dark:border-white/5 shadow-sm">
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">
              Latest Movies 2025 — Stream Free Online
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Movies is updated every day with the <strong>newest movie releases of 2025</strong>. Find the
              <strong> best movies 2025</strong>, hottest new TV episodes, and the most talked-about streaming releases —
              all available to <strong>watch online free in HD</strong> without waiting.
            </p>
            <p className="text-sm leading-relaxed">
              Trending right now: stream the latest <strong>Hollywood blockbusters free</strong>, binge-watch
              <strong> top-rated TV series online</strong>, and discover critically acclaimed indie films. Our
              curated sections for Popular, Trending This Week, and Sci-Fi &amp; Fantasy make it easy to find
              your next favourite film or series to stream for free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">
              Frequently Asked Questions — Free Movie Streaming
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Is Movies really free to watch movies?', a: 'Yes — 100% free. Watch any movie or TV show online without paying anything. No subscription, no trial, no credit card.' },
                { q: 'Do I need to create an account to watch movies?', a: 'No account needed. Just search any movie and press play. Movies lets you watch movies free without registration or email.' },
                { q: 'Can I watch the latest movies 2025 on Movies?', a: 'Yes! Movies adds the latest movies 2025 and newest TV episodes daily. You will always find fresh content to stream for free.' },
                { q: 'What movie genres are available for free streaming?', a: 'All genres — action, comedy, horror, sci-fi, romance, thriller, drama, documentary, animation, and more. Full TV series too.' },
                { q: 'What streaming quality does Movies offer?', a: 'Movies streams in HD (720p/1080p). Video quality auto-adjusts to your internet speed for the best free streaming experience.' },
                { q: 'Can I watch TV shows and series on Movies?', a: 'Yes! Watch complete TV series free online with all seasons and episodes. New episodes added as soon as they air.' },
                { q: 'Does Movies work on mobile phones?', a: 'Yes. Movies works on Android, iPhone, iPad, laptops, PCs, and smart TVs. Watch free movies on any device, anywhere.' },
                { q: 'Is there a limit to how many movies I can watch free?', a: 'No limit. Watch unlimited movies and TV shows online free on Movies. Stream as much as you want, whenever you want.' },
              ].map(faq => (
                <div key={faq.q} className="p-4 rounded-xl bg-white dark:bg-[#1a3a3a] border border-gray-100 dark:border-white/5">
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{faq.q}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-3">Popular Free Movie Searches</h2>
            <div className="flex flex-wrap gap-2">
              {[
                'watch movies online free','free movie streaming','stream HD movies','watch TV shows free',
                'movies without signup','latest movies 2025','free action movies','horror movies online',
                'comedy series streaming','best free streaming site','watch films HD','free sci-fi movies',
                'romantic movies free','thriller films online','documentary streaming free','anime free online',
                'watch oscar movies free','free Bollywood movies','hollywood movies streaming','free family movies',
              ].map(tag => (
                <Link key={tag} href={`/?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#2d5a5a] hover:text-white dark:hover:text-white transition-all">
                  {tag}
                </Link>
              ))}
            </div>
          </section>

        </article>

        {/* SeoContent component (genre grid, features) */}
        <SeoContent />
        <Footer />
      </div>
    </main>
  );
}
