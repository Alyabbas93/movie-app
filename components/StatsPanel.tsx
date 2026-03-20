import { Heart, Activity, TrendingUp, X, Film, Zap } from 'lucide-react';
import Image from 'next/image';
import { useWatchlist } from '@/lib/WatchlistContext';

interface StatsPanelProps {
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  className = '',
}) => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const trendingGenres = [
    { name: 'Action', color: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400' },
    { name: 'Sci-Fi', color: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400' },
    { name: 'Horror', color: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400' },
    { name: 'Comedy', color: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400' },
  ];

  return (
    <aside className={`flex flex-col bg-white dark:bg-[#1a3a3a] rounded-2xl p-6 space-y-8 border-none flex-none shadow-none drop-shadow-none ring-0 outline-none hover:shadow-none hover:ring-0 transition-all duration-300 ${className}`}>
      {/* Cinema Insights Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Activity size={18} className="text-[#2d5a5a] dark:text-teal-400" />
          Cinema Insights
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0d1f1f] border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-1">
              <Film size={14} className="text-gray-400" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Movies Served</p>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">1.8M<span className="text-[#2d5a5a] dark:text-teal-400">+</span></p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0d1f1f] border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-1">
              <Zap size={14} className="text-amber-500" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Active Watchers</p>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">5,241</p>
          </div>
        </div>
      </div>

      {/* Trending Genres Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2">
          <TrendingUp size={14} />
          Trending Genres
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingGenres.map((genre) => (
            <span
              key={genre.name}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${genre.color.split(' ')[0]} ${genre.color.split(' ')[1]}`}
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Heart size={18} className="text-red-500 fill-red-500/10" />
            Watchlist
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full">
            {watchlist.length}
          </span>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {watchlist.slice(0, 4).map((item) => (
              <div key={item.imdbID} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-100 dark:bg-white/5 shadow-sm">
                {item.poster && item.poster !== 'N/A' ? (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 150px"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 p-2 text-center uppercase font-bold">
                    {item.title}
                  </div>
                )}
                {/* Remove button - Always visible on mobile, hover on desktop */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWatchlist(item.imdbID);
                  }}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 text-white rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 z-10"
                  title="Remove from watchlist"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Watchlist is empty</p>
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">Start adding movies!</p>
          </div>
        )}
      </div>
    </aside>
  );
};
