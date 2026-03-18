'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Bell, User, Settings as SettingsIcon, Heart, Award } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { StatsPanel } from './StatsPanel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const categories = ['All', 'Movies', 'Popular'];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setIsOpen(false);
    if (category === 'All') {
      router.push('/');
      window.dispatchEvent(new CustomEvent('reset-home'));
    } else {
      router.push(`/?category=${category}`);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-44 flex-col bg-[#1a3a3a] text-white p-6">
        <div className="mb-8">
          <Link 
            href="/" 
            className="block"
            onClick={() => {
              setActiveCategory('All');
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('reset-home'));
            }}
          >
            <h1 className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
              <span className="text-[#2d5a5a]">m</span>ovies
            </h1>
          </Link>
        </div>

        <div className="flex-1 space-y-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === category
                ? 'bg-[#2d5a5a] text-white'
                : 'hover:bg-[#2d5a5a] text-white/80'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="border-t border-[#2d5a5a] pt-4 space-y-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2d5a5a] transition-colors text-sm font-medium text-white/80 hover:text-white"
          >
            <SettingsIcon size={18} />
            Settings
          </button>
          <button
            onClick={() => console.log('[v0] Profile clicked')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2d5a5a] transition-colors text-sm font-medium text-white/80 hover:text-white"
          >
            <User size={18} />
            Profile
          </button>
        </div>
      </nav>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a3a3a] border-b border-gray-200 dark:border-white/10 h-16 transition-colors">
        <div className="h-full flex items-center justify-between px-4">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 dark:text-white transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link 
            href="/" 
            className="font-bold text-lg dark:text-white transition-colors"
            onClick={() => {
              setActiveCategory('All');
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('reset-home'));
            }}
          >
            <span className="text-[#2d5a5a]">m</span>ovies
          </Link>

          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <Award size={20} className="text-[#2d5a5a] dark:text-teal-400" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 border-l dark:border-white/10 w-full sm:max-w-md bg-transparent">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin & Statistics</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#0d1f1f]">
                  <StatsPanel className="min-h-full" />
                </div>
              </SheetContent>
            </Sheet>

            <button 
              className="p-2 dark:text-white"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#1a3a3a] border-b border-gray-200 dark:border-white/10 p-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === category
                  ? 'bg-[#2d5a5a] text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-bold text-gray-800 dark:text-gray-300 flex items-center gap-3 transition-colors"
            >
              <SettingsIcon size={18} />
              Settings
            </button>
            <div className="pt-2 border-t border-gray-100 dark:border-white/10 mt-2">
              <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-black text-gray-400">My Workspace</p>
              <button
                onClick={() => {
                   setIsOpen(false);
                   // Navigate to a dedicated watchlist page or open a modal in the future
                   // For now, let's at least show it's recognized
                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold text-red-500 flex items-center gap-3 transition-colors"
              >
                <Heart size={18} className="fill-red-500" />
                My Watchlist
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar - Mobile only */}
      <div className="md:hidden mt-16 px-4 py-3 bg-gray-50 dark:bg-[#0d1f1f] transition-colors">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d5a5a] transition-all"
          />
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </>
  );
};
