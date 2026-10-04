import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-900/80 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          <img
            src="./logo-icon.png"
            alt="ToolX Logo"
            className="w-5 h-5 object-contain opacity-75"
            width={20}
            height={20}
            loading="lazy"
          />
          <span className="text-slate-400 font-medium">ToolX Hızlı Araçlar</span>
        </div>

        <div className="text-slate-500 text-[11px] font-mono">
          toolx.com.tr
        </div>
      </div>
    </footer>
  );
};


