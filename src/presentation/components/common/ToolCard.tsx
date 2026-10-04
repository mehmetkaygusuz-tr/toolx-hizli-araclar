import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  categoryLabel: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  categoryLabel,
  children,
  actions,
}) => {
  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 transition-all duration-200 hover:border-slate-700/60 shadow-sm"
    >
      {/* Header section with icon, title, description, and actions */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800/60 mb-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{categoryLabel}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-500">Tarayıcıda Çalışır (Gizli &amp; Güvenli)</span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </header>

      {/* Main Tool Interactive Area */}
      <div className="w-full">{children}</div>
    </article>
  );
};
