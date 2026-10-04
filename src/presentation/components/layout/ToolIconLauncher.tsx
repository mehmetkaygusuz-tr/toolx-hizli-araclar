import React, { useState } from 'react';
import { ToolItem } from '../../../application/registry/toolsRegistry';
import {
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
  Pin,
  ArrowRight,
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

interface ToolIconLauncherProps {
  tool: ToolItem;
  isPinned: boolean;
  onSelect: (tool: ToolItem) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
}

export const ToolIconLauncher: React.FC<ToolIconLauncherProps> = ({
  tool,
  isPinned,
  onSelect,
  onTogglePin,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[tool.iconName] || ImageDown;

  return (
    <div
      className="group relative flex flex-col items-center select-none w-20 sm:w-24 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(tool)}
    >
      {/* 1. MOBILE OS STYLE APP SQUIRCLE ICON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(tool);
        }}
        aria-label={tool.name}
        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl sm:rounded-[22px] bg-gradient-to-tr p-0.5 transition-all duration-200 transform group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25 shrink-0"
      >
        <div
          className={`w-full h-full rounded-[14px] sm:rounded-[20px] bg-gradient-to-tr ${tool.gradient} flex items-center justify-center border border-white/20 shadow-inner relative overflow-hidden`}
        >
          {/* Glossy glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

          {/* Icon */}
          <IconComponent
            className={`w-8 h-8 sm:w-9 sm:h-9 ${tool.iconColor} drop-shadow-md relative z-10`}
            strokeWidth={2.2}
          />

          {/* Pin marker indicator */}
          {isPinned && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-400 shadow-sm" />
          )}
        </div>
      </button>

      {/* 2. APP NAME DIRECTLY UNDERNEATH (Mobile OS style: iOS / Android / Launchpad) */}
      <span className="mt-2 text-[11px] sm:text-xs font-medium text-slate-300 group-hover:text-white text-center leading-tight line-clamp-2 w-full px-0.5 transition-colors">
        {tool.name}
      </span>

      {/* 3. HOVER PREVIEW CARD: Smoothly expands centered over the icon */}
      {isHovered && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool);
          }}
          className="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 p-4 rounded-3xl bg-[#0d1322]/95 backdrop-blur-2xl border border-blue-500/50 shadow-2xl shadow-black/95 flex flex-col items-center text-center cursor-pointer animate-in fade-in zoom-in-90 duration-200 pointer-events-auto"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/15 via-transparent to-transparent pointer-events-none"
          />

          {/* Top Bar: Category, Pin & Badge */}
          <div className="w-full flex items-center justify-between mb-2 z-10">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400">
              {tool.category === 'image'
                ? 'Görsel & Medya'
                : tool.category === 'math'
                ? 'Hesaplama'
                : tool.category === 'text'
                ? 'Metin & Yazı'
                : tool.category === 'datetime'
                ? 'Tarih & Zaman'
                : tool.category === 'units'
                ? 'Ölçü Birimleri'
                : 'Pratik Günlük'}
            </span>

            <div className="flex items-center gap-1.5">
              {tool.badge && (
                <span className="text-[9px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  {tool.badge}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(tool.id, e);
                }}
                title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                className={`p-1 rounded-md transition-colors ${
                  isPinned
                    ? 'text-blue-400 bg-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: Scaled Squircle Icon */}
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center shadow-md border border-white/20 mb-2.5 relative z-10 shrink-0`}
          >
            <IconComponent
              className={`w-6 h-6 ${tool.iconColor} drop-shadow`}
              strokeWidth={2.2}
            />
          </div>

          {/* Tool Title */}
          <h4 className="text-sm font-bold text-white leading-snug mb-1 z-10">
            {tool.name}
          </h4>

          {/* Tool Description */}
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3 z-10 px-1">
            {tool.shortDesc}
          </p>

          {/* Action Button */}
          <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 z-10">
            <span>Aracı Başlat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};
