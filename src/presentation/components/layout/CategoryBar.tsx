import React from 'react';
import { ToolCategory, CATEGORIES } from '../../../application/registry/toolsRegistry';
import {
  Sparkles,
  Image,
  Calculator,
  Type,
  Clock,
  ArrowLeftRight,
  Wrench,
} from 'lucide-react';

interface CategoryBarProps {
  activeCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  categoryCounts: Record<ToolCategory, number>;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Image,
  Calculator,
  Type,
  Clock,
  ArrowLeftRight,
  Wrench,
};

const CATEGORY_STYLES: Record<ToolCategory, { gradient: string; iconColor: string }> = {
  all: { gradient: 'from-blue-600 to-indigo-600', iconColor: 'text-white' },
  image: { gradient: 'from-purple-600 to-pink-500', iconColor: 'text-white' },
  math: { gradient: 'from-emerald-600 to-teal-500', iconColor: 'text-white' },
  text: { gradient: 'from-amber-500 to-orange-600', iconColor: 'text-white' },
  datetime: { gradient: 'from-rose-500 to-pink-600', iconColor: 'text-white' },
  units: { gradient: 'from-cyan-500 to-blue-600', iconColor: 'text-white' },
  practical: { gradient: 'from-slate-700 to-slate-900', iconColor: 'text-white' },
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <nav
      aria-label="Araç Kategorileri"
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full"
    >
      {CATEGORIES.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || Sparkles;
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;
        const style = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.all;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              isActive
                ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* App-icon matching squircle container */}
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${style.gradient} flex items-center justify-center border border-white/20 shadow-sm relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />
              <Icon className={`w-3.5 h-3.5 ${style.iconColor} relative z-10 drop-shadow`} />
            </div>

            <span className="text-xs font-semibold">{cat.nameTr}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-lg ${
                isActive ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
