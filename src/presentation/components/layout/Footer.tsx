import React, { useState } from 'react';
import { LegalModal, LegalTab } from './LegalModal';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [initialLegalTab, setInitialLegalTab] = useState<LegalTab>('privacy');

  const openLegalModal = (tab: LegalTab) => {
    setInitialLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="mt-16 border-t border-slate-900/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Brand Info */}
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
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500/80 inline" /> %100 İstemci Taraflı & Gizlilik Odaklı
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => openLegalModal('privacy')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Gizlilik & KVKK
            </button>
            <span className="text-slate-800">•</span>
            <button
              type="button"
              onClick={() => openLegalModal('terms')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Kullanım Koşulları & Yasal Uyarı
            </button>
            <span className="text-slate-800">•</span>
            <button
              type="button"
              onClick={() => openLegalModal('imprint')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Künye & İletişim
            </button>
          </div>

          {/* Domain & Copyright */}
          <div className="text-slate-500 text-[11px] font-mono">
            © 2026 toolx.com.tr
          </div>
        </div>
      </footer>

      {/* Legal Dialog Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={initialLegalTab}
      />
    </>
  );
};

