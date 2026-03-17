'use client';

import React, { useState } from 'react';
import { X, Moon, Sun, Monitor, Globe, Shield, User } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useWatchlist } from '@/lib/WatchlistContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { currentUserId, switchUser } = useWatchlist();
  const [adultFilter, setAdultFilter] = useState(false);
  const [language, setLanguage] = useState('English');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 md:pt-24 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1a3a3a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Appearance Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Appearance</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'system', icon: Monitor, label: 'System' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === t.id 
                      ? 'border-[#2d5a5a] bg-[#2d5a5a]/5 text-[#2d5a5a] dark:text-white dark:border-white dark:bg-white/10' 
                      : 'border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/20'
                  }`}
                >
                  <t.icon size={20} />
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Account/Profile */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Profile</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2d5a5a] flex items-center justify-center text-white font-bold">
                  {currentUserId}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">User {currentUserId}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Active Profile</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const nextId = currentUserId === '1' ? '2' : currentUserId === '2' ? '3' : '1';
                  switchUser(nextId);
                }}
                className="text-xs font-bold text-[#2d5a5a] dark:text-teal-400 hover:underline"
              >
                Switch
              </button>
            </div>
          </section>

          {/* Content & Language */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Preferences</h3>
            
            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Globe size={18} />
                <span className="text-sm font-medium">App Language</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#2d5a5a] dark:text-teal-400 outline-none"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
              </select>
            </div>

            {/* Adult Filter Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Shield size={18} />
                <span className="text-sm font-medium">Safe Search</span>
              </div>
              <button 
                onClick={() => setAdultFilter(!adultFilter)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  adultFilter ? 'bg-[#2d5a5a]' : 'bg-gray-200 dark:bg-white/20'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  adultFilter ? 'translate-x-4' : ''
                }`} />
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#1a3a3a] dark:bg-white text-white dark:text-[#1a3a3a] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
