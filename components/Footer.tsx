import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-4 flex flex-col items-center justify-center gap-4 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0a1818]/50 backdrop-blur-md transition-colors">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 tracking-wide uppercase">
          Created by Ali Abbas
        </p>
        <a 
          href="https://instagram.com/aly_abbas93" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-pink-500/25"
        >
          <Instagram size={18} className="group-hover:-rotate-12 transition-transform duration-300" />
          @aly_abbas93
        </a>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}
