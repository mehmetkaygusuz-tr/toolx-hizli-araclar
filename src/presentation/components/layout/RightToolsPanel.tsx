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

  // Filter tools based on search query only (categories removed as requested)
  const filteredTools = TOOLS.filter((t) => {
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
    <div className="w-full h-full flex flex-col bg-[#090d16] text-slate-100 select-none">
      {/* Panel Top Header - Standard Clean */}
      <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide uppercase">Hızlı Araçlar</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {TOOLS.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          title="Paneli Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Internal Fast Search Input (No category filter here - categories on home page) */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={panelSearch}
            onChange={(e) => setPanelSearch(e.target.value)}
            placeholder="Araçlarda ara..."
            className="w-full bg-slate-800/90 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tools List - Standard comfortable size with full readable titles */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {filteredTools.map((tool) => {
          const Icon = ICON_MAP[tool.iconName] || ImageDown;
          const isActive = tool.id === activeToolId;
          const isPinned = pinnedToolIds.includes(tool.id);

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500/60 text-white shadow-sm ring-1 ring-blue-500/40'
                  : 'bg-slate-900/40 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Standard Squircle Icon */}
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${tool.gradient} flex items-center justify-center shrink-0 shadow-sm border border-white/10`}
                >
                  <Icon className={`w-4 h-4 ${tool.iconColor}`} strokeWidth={2.2} />
                </div>

                {/* Name */}
                <span className="text-xs font-semibold truncate text-slate-200 group-hover:text-white transition-colors">
                  {tool.name}
                </span>
              </div>

              {/* Actions: Pin toggle & subtle indicator */}
              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                <button
                  type="button"
                  onClick={(e) => onTogglePin(tool.id, e)}
                  title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                  className={`p-1 rounded-md hover:bg-slate-800 text-xs transition-colors ${
                    isPinned
                      ? 'text-blue-400 opacity-100'
                      : 'text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                </button>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-sm" />
                )}
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
    </div>
  );

  // If used as slide-over drawer on mobile from RIGHT side
  if (variant === 'drawer') {
    if (!isOpen) return null;
    return (
      <>
        {/* Mobile dismiss overlay */}
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 transition-opacity animate-in fade-in duration-150"
        />

        {/* Right Drawer container for mobile - flush to right edge */}
        <div className="fixed right-0 top-0 bottom-0 z-50 w-64 sm:w-72 h-full shadow-2xl transition-transform duration-200 animate-in slide-in-from-right border-l border-slate-800">
          {content}
        </div>
      </>
    );
  }

  // If used as embedded desktop sidebar - flush to right edge
  return <div className="w-full h-full border-l border-slate-800/80">{content}</div>;
};
