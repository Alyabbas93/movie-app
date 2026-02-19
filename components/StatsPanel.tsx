'use client';

import { Heart, MessageCircle, Award, Settings } from 'lucide-react';
import Image from 'next/image';

interface StatsPanelProps {
  watchTime?: string;
  wishList?: number;
  subscription?: string;
  comments?: number;
  users?: Array<{ id: string; name: string; avatar: string }>;
  watchlist?: Array<{ id: string; title: string; poster: string }>;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  watchTime = '130',
  wishList = 15,
  subscription = 'Pro',
  comments = 12,
  users = [],
  watchlist = [],
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white rounded-lg p-6 space-y-8">
      {/* Stats Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <Award size={18} className="text-[#2d5a5a]" />
          Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-800">{watchTime}</p>
            <p className="text-xs text-gray-500">Watch time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{wishList}</p>
            <p className="text-xs text-gray-500">Wish list</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d5a5a]">{subscription}</p>
            <p className="text-xs text-gray-500">Subscription</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{comments}</p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
        </div>
      </div>

      {/* Users Section */}
      {users.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Users</h3>
          <div className="flex items-center gap-3">
            {users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden"
              >
                {user.avatar && (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
            {users.length > 3 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                +{users.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Heart size={18} className="text-red-500" />
              Watchlist
            </h3>
            <a href="#" className="text-xs text-[#2d5a5a] hover:underline">
              View more
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {watchlist.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden">
                {item.poster && (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    width={120}
                    height={180}
                    className="w-full h-32 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Icons */}
      <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => console.log('[v0] Favorites clicked')}
          className="p-2 rounded-full bg-[#e8f5f5] text-[#2d5a5a] hover:bg-[#2d5a5a] hover:text-white transition-colors"
          title="Favorites"
        >
          <Heart size={20} />
        </button>
        <button 
          onClick={() => console.log('[v0] Comments clicked')}
          className="p-2 rounded-full bg-[#e8f5f5] text-[#2d5a5a] hover:bg-[#2d5a5a] hover:text-white transition-colors"
          title="Comments"
        >
          <MessageCircle size={20} />
        </button>
        <button 
          onClick={() => console.log('[v0] Awards clicked')}
          className="p-2 rounded-full bg-[#e8f5f5] text-[#2d5a5a] hover:bg-[#2d5a5a] hover:text-white transition-colors"
          title="Awards"
        >
          <Award size={20} />
        </button>
        <button 
          onClick={() => console.log('[v0] Settings clicked')}
          className="p-2 rounded-full bg-[#e8f5f5] text-[#2d5a5a] hover:bg-[#2d5a5a] hover:text-white transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};
