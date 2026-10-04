import React, { useState } from 'react';
import { ToolItem, TOOLS, CATEGORIES, ToolCategory } from '../../../application/registry/toolsRegistry';
import {
  X,
  Search,
  ChevronRight,
  Pin,
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
  Sparkles,
} from 'lucide-react';

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

interface RightToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeToolId: string | null;
  onSelectTool: (tool: ToolItem) => void;
  pinnedToolIds: string[];
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  variant?: 'drawer' | 'sidebar';
}

export const RightToolsPanel: React.FC<RightToolsPanelProps> = ({
  isOpen,
  onClose,
  activeToolId,
  onSelectTool,
  pinnedToolIds,
  onTogglePin,
  variant = 'drawer',
}) => {
  const [panelSearch, setPanelSearch] = useState('');
  const [panelCategory, setPanelCategory] = useState<ToolCategory>('all');

  const filteredTools = TOOLS.filter((t) => {
    if (panelCategory !== 'all' && t.category !== panelCategory) return false;
    if (panelSearch.trim().length > 0) {
      const q = panelSearch.toLowerCase().trim();
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const content = (
    <aside className="w-full h-full flex flex-col bg-[#090d16] border-l border-slate-800 text-slate-100 select-none">
      {/* Panel Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Hızlı Araçlar Menüsü</h3>
            <span className="text-[11px] text-slate-400">Geçiş yapmak için araca tıklayın</span>
          </div>
        </div>

        {variant === 'drawer' && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title="Paneli Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Internal Search & Category Filter */}
      <div className="p-3 border-b border-slate-800/60 space-y-2 bg-slate-900/30">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={panelSearch}
            onChange={(e) => setPanelSearch(e.target.value)}
            placeholder="Panelde ara..."
            className="w-full bg-slate-800/90 border border-slate-700/80 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Categories scrollable row */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setPanelCategory(cat.id)}
              className={`px-2 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors border ${
                panelCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border-slate-700/60'
              }`}
            >
              {cat.nameTr}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {filteredTools.map((tool) => {
          const Icon = ICON_MAP[tool.iconName] || ImageDown;
          const isActive = tool.id === activeToolId;
          const isPinned = pinnedToolIds.includes(tool.id);

          return (
            <div
              key={tool.id}
              onClick={() => {
                onSelectTool(tool);
                if (variant === 'drawer' && window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                isActive
                  ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm'
                  : 'bg-slate-900/40 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon Squircle */}
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center shrink-0 shadow-sm border border-white/10`}
                >
                  <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate text-white group-hover:text-blue-300 transition-colors">
                      {tool.name}
                    </span>
                    {tool.badge && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded font-medium">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {tool.shortDesc}
                  </span>
                </div>
              </div>

              {/* Actions: Pin toggle & Right chevron */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={(e) => onTogglePin(tool.id, e)}
                  title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                  className={`p-1 rounded hover:bg-slate-800 text-xs transition-colors ${
                    isPinned ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">
            Aramaya uygun araç bulunamadı.
          </div>
        )}
      </div>
    </aside>
  );

  // If used as slide-over drawer
  if (variant === 'drawer') {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
        />

        {/* Drawer container */}
        <div className="relative z-10 w-full sm:w-96 md:w-[420px] h-full shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
          {content}
        </div>
      </div>
    );
  }

  // If used as embedded sidebar
  return <div className="w-80 lg:w-96 h-full shrink-0">{content}</div>;
};
