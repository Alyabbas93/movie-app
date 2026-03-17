'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Bell, User } from 'lucide-react';

const categories = ['All', 'Movies', 'Popular'];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setIsOpen(false);
    if (category === 'All') {
      router.push('/');
    } else {
      router.push(`/?category=${category}`);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-44 flex-col bg-[#1a3a3a] text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[#2d5a5a]">m</span>ovies
          </h1>
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

        <div className="border-t border-[#2d5a5a] pt-4">
          <button
            onClick={() => console.log('[v0] Settings clicked')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#2d5a5a] transition-colors text-sm font-medium"
          >
            Settings
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
        <div className="h-full flex items-center justify-between px-4">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="font-bold text-lg">
            <span className="text-[#2d5a5a]">m</span>ovies
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2">
              <Bell size={20} />
            </button>
            <button className="p-2">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === category
                  ? 'bg-[#2d5a5a] text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Search Bar - Mobile only */}
      <div className="md:hidden mt-16 px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d5a5a]"
          />
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </>
  );
};
