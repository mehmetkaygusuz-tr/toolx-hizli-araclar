import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  ImageDown,
  Palette,
  Receipt,
  BadgePercent,
  Percent,
  Scale,
  Users,
  FileText,
  CaseSensitive,
  ListFilter,
  CalendarDays,
  CalendarCheck,
  Timer,
  Globe,
  ArrowLeftRight,
  Thermometer,
  QrCode,
  KeyRound,
  Shuffle,
  PenTool,
  StickyNote,
  LucideIcon,
} from 'lucide-react';
import { TOOLS, ToolItem } from '../../../application/registry/toolsRegistry';

const ICON_MAP: Record<string, LucideIcon> = {
  ImageDown,
  Palette,
  Receipt,
  BadgePercent,
  Percent,
  Scale,
  Users,
  FileText,
  CaseSensitive,
  ListFilter,
  CalendarDays,
  CalendarCheck,
  Timer,
  Globe,
  ArrowLeftRight,
  Thermometer,
  QrCode,
  KeyRound,
  Shuffle,
  PenTool,
  StickyNote,
};

interface HeaderProps {
  onGoHome: () => void;
  onSelectTool: (tool: ToolItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onSelectTool,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter tools for the search panel popup
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // If empty query, show first 6 featured tools
      return TOOLS.slice(0, 6);
    }
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Click outside to close search panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation inside search popup
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsSearchOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, searchResults.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        handleSelectTool(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSelectTool = (tool: ToolItem) => {
    onSelectTool(tool);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080c14]/90 border-b border-slate-800/80 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Logo Mark ONLY (Pinned to far top-left) */}
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

        {/* Zone 2: Search Bar with Dedicated Dropdown Search Panel (Does NOT change active page while typing) */}
        <div ref={searchContainerRef} className="flex-1 max-w-lg mx-auto relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Araç ara... (Örn: kdv, resim, yüzde, qr, şifre)"
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 text-xs sm:text-sm text-white rounded-xl pl-9 pr-9 py-2 focus:outline-none placeholder:text-slate-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* DEDICATED SEARCH PANEL: Floats directly beneath search bar */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0d1322]/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 max-h-[400px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-800/80 mb-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {searchQuery.trim() ? `Sonuçlar (${searchResults.length})` : 'Öne Çıkan Araçlar'}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <span>ESC ile kapat</span>
                </span>
              </div>

              <div className="space-y-1">
                {searchResults.map((tool, index) => {
                  const Icon = ICON_MAP[tool.iconName] || ImageDown;
                  const isSelected = index === selectedIndex;

                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleSelectTool(tool)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                          : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* App Icon Squircle */}
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${tool.gradient} flex items-center justify-center shrink-0 shadow-sm border border-white/10`}
                        >
                          <Icon className={`w-4 h-4 ${tool.iconColor}`} strokeWidth={2.2} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white truncate">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className="text-[9px] px-1 py-0.2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded font-medium">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {tool.shortDesc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isSelected && (
                          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            <span>Aç</span>
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}

                {searchResults.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    &quot;{searchQuery}&quot; ile eşleşen araç bulunamadı.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Empty spacer so the search bar stays centered cleanly */}
        <div className="w-10 shrink-0 hidden sm:block" />
      </div>
    </header>
  );
};
