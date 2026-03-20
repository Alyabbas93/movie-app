import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-4 flex flex-col items-center justify-center gap-2 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0a1818]/50 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <span>created by ali abbas</span>
        <a 
          href="https://instagram.com/aly_abbas93" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors transform hover:scale-110 active:scale-95"
          title="Ali Abbas on Instagram (@aly_abbas93)"
        >
          <Instagram size={14} />
        </a>
      </div>
      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}
