import React from 'react';
import { StickyNote, Download, Trash2 } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { useLocalStorage } from '../../../application/hooks/useLocalStorage';
import { CopyButton } from '../common/CopyButton';

export const QuickScratchpadTool: React.FC = () => {
  const [note, setNote] = useLocalStorage<string>(
    'toolx_scratchpad',
    'Buraya hızlı notlarınızı, telefon numaralarını veya aklınıza gelen fikirleri yazabilirsiniz. Tarayıcıyı kapatsanız bile silinmez.'
  );

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
  const charCount = note.length;

  const handleDownload = () => {
    const blob = new Blob([note], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `toolx-not-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolCard
      id="hizli-not"
      title="Hızlı Not & Karalama Defteri"
      description="Tarayıcınızda yerel olarak saklanan, hiçbir sunucuya iletilmeyen ve sayfayı yenileseniz bile asla silinmeyen pratik karalama defteri."
      icon={StickyNote}
      categoryLabel="Pratik Günlük"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT İndir</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Notu tamamen temizlemek istediğinize emin misiniz?')) {
                setNote('');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <textarea
          rows={7}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Hemen yazmaya başlayın..."
          className="w-full bg-slate-800/60 border border-slate-700/80 focus:border-blue-500 rounded-xl p-4 text-white text-sm focus:outline-none resize-y leading-relaxed"
        />

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-3">
            <span>
              Karakter: <strong className="text-white font-mono">{charCount}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>
              Kelime: <strong className="text-white font-mono">{wordCount}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-medium">Otomatik kaydedildi</span>
          </div>
          <CopyButton text={note} label="Notu Kopyala" />
        </div>
      </div>
    </ToolCard>
  );
};
