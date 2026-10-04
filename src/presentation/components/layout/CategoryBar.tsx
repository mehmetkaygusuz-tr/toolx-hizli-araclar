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

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <nav
      aria-label="Araç Kategorileri"
      className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full"
    >
      {CATEGORIES.map((cat) => {
        const Icon = ICON_MAP[cat.icon] || Sparkles;
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all border shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850 border-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.nameTr}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
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
