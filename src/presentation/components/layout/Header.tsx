import React from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080c14]/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Logo Mark ONLY (Strictly adhering to user instruction: no text next to logo) */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl cursor-pointer"
          title="ToolX Ana Sayfa"
          aria-label="ToolX Ana Sayfa"
        >
          <img
            src="/logo-icon.png"
            alt="ToolX Logo"
            className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-200"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </button>

        {/* Zone 2: Fast Search Input */}
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Araç ara... (Örn: kdv, resim, yüzde, qr, şifre)"
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 text-xs sm:text-sm text-white rounded-xl pl-9 pr-9 py-2 focus:outline-none placeholder:text-slate-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Empty spacer so the search bar stays centered cleanly */}
        <div className="w-10 shrink-0 hidden sm:block" />
      </div>
    </header>
  );
};
