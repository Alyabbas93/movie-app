'use client';

import { Heart, MessageCircle, Award, Settings as SettingsIcon, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useWatchlist } from '@/lib/WatchlistContext';

interface StatsPanelProps {
  watchTime?: string;
  subscription?: string;
  comments?: number;
  users?: Array<{ id: string; name: string; avatar: string }>;
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  watchTime = '130',
  subscription = 'Pro',
  comments = 12,
  users = [
    { id: '1', name: 'User 1', avatar: '' },
    { id: '2', name: 'User 2', avatar: '' },
    { id: '3', name: 'User 3', avatar: '' },
  ],
  className = '',
}) => {
  const { watchlist, removeFromWatchlist, currentUserId, switchUser } = useWatchlist();

  // For visual variety, let's make stats "user-specific" placeholders
  const getStats = (userId: string) => {
    const seed = parseInt(userId) || 1;
    return {
      time: `${seed * 45 + watchlist.length * 2}h`,
      points: seed * 150 + watchlist.length * 10,
      sub: seed % 2 === 0 ? 'Basic' : 'Pro',
      comm: seed * 5 + 2
    };
  };

  const userStats = getStats(currentUserId);

  return (
    <aside className={`flex flex-col bg-white dark:bg-[#1a3a3a] rounded-2xl p-6 space-y-8 border-none flex-none shadow-none drop-shadow-none ring-0 outline-none hover:shadow-none hover:ring-0 ${className}`}>
      {/* Stats Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <Award size={18} className="text-[#2d5a5a] dark:text-teal-400" />
          My Activity (User {currentUserId})
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{userStats.time}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Watch time</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{watchlist.length}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Watchlist</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-black text-[#2d5a5a] dark:text-teal-400">{userStats.sub}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Membership</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{userStats.comm}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Comments</p>
          </div>
        </div>
      </div>

      {/* Profile Switching Section */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-4">Switch Profile</h3>
        <div className="flex items-center gap-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => switchUser(user.id)}
              className={`relative w-11 h-11 rounded-full border-2 transition-all p-0.5 overflow-hidden ${currentUserId === user.id ? 'border-[#2d5a5a] dark:border-teal-400 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
            >
              <div className={`w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white ${user.id === '1' ? 'from-indigo-500 to-purple-500' :
                  user.id === '2' ? 'from-emerald-500 to-teal-500' :
                    'from-orange-500 to-red-500'
                }`}>
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-full h-full object-cover" />
                ) : user.name[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div>
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
                {/* Remove button */}
                <button
                  onClick={() => removeFromWatchlist(item.imdbID)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
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

      {/* Quick Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-white/10">
        {[
          { icon: Heart, label: 'Favs', color: 'text-red-500' },
          { icon: MessageCircle, label: 'Chat', color: 'text-blue-500' },
          { icon: Award, label: 'Win', color: 'text-amber-500' },
          { icon: SettingsIcon, label: 'Set', color: 'text-gray-500' }
        ].map((item, i) => (
          <button
            key={i}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#2d5a5a]/10 group-hover:text-[#2d5a5a] dark:group-hover:text-teal-400 transition-all">
              <item.icon size={18} />
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
