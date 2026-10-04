import React, { useState } from 'react';
import { ListFilter, GitCompare, Sparkles } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { cleanText, computeSimpleLineDiff } from '../../../domain/text/textCleaner';
import { CopyButton } from '../common/CopyButton';

export const TextCleanerDiffTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cleaner' | 'diff'>('cleaner');

  // Cleaner state
  const [cleanerText, setCleanerText] = useState<string>(
    `Elma\nArmut\n\nElma\nMuz\n  Çilek  \n<b>Kiraz</b>\nArmut`
  );
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState(true);
  const [stripHtml, setStripHtml] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [sortOption, setSortOption] = useState<'none' | 'asc' | 'desc'>('asc');

  // Diff state
  const [diffTextA, setDiffTextA] = useState<string>(`Pazartesi\nSalı\nÇarşamba\nCuma`);
  const [diffTextB, setDiffTextB] = useState<string>(`Pazartesi\nSalı\nÇarşamba\nPerşembe\nCuma`);

  const cleaned = cleanText(cleanerText, {
    removeExtraSpaces,
    removeEmptyLines,
    removeDuplicateLines,
    stripHtml,
    trimLines,
    sortLines: sortOption,
  });

  const diffResult = computeSimpleLineDiff(diffTextA, diffTextB);

  return (
    <ToolCard
      id="metin-temizleyici"
      title="Metin Temizleyici & Satır Farkı Bulucu"
      description="Listelerinizdeki çift satırları ayıklayın, gereksiz boşlukları ve HTML etiketlerini temizleyin veya iki metin arasındaki farkları bulun."
      icon={ListFilter}
      categoryLabel="Metin & Yazı"
    >
      <div className="space-y-5">
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('cleaner')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'cleaner' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metin &amp; Liste Temizleyici
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'diff' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            İki Metni Karşılaştır
          </button>
        </div>

        {activeTab === 'cleaner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                Temizleme Seçenekleri
              </span>

              <div className="space-y-2.5 text-xs text-slate-300">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeDuplicateLines}
                    onChange={(e) => setRemoveDuplicateLines(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>Yinelenen (Çift) Satırları Sil</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeEmptyLines}
                    onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>Boş Satırları Temizle</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeExtraSpaces}
                    onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>Fazla Boşlukları Tek Boşluğa İndir</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripHtml}
                    onChange={(e) => setStripHtml(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>HTML Etiketlerini Kaldır</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trimLines}
                    onChange={(e) => setTrimLines(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>Satır Baş/Son Boşluklarını Kırp</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sıralama Düzeni</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Sıralama Yok' },
                    { id: 'asc', label: 'A - Z' },
                    { id: 'desc', label: 'Z - A' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortOption(s.id as typeof sortOption)}
                      className={`py-1.5 text-xs rounded-lg border transition-colors ${
                        sortOption === s.id
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-1">Giriş Metni / Listesi</span>
                  <textarea
                    rows={8}
                    value={cleanerText}
                    onChange={(e) => setCleanerText(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-emerald-400">Temizlenmiş Sonuç</span>
                    <CopyButton text={cleaned} label="Kopyala" />
                  </div>
                  <textarea
                    readOnly
                    rows={8}
                    value={cleaned}
                    className="w-full bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Text Diff View */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Orijinal Metin (A)</label>
                <textarea
                  rows={5}
                  value={diffTextA}
                  onChange={(e) => setDiffTextA(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Değiştirilmiş Metin (B)</label>
                <textarea
                  rows={5}
                  value={diffTextB}
                  onChange={(e) => setDiffTextB(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Fark Analizi (Satır Satır)
              </span>
              <div className="space-y-1 font-mono text-xs max-h-60 overflow-y-auto">
                {diffResult.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-1.5 rounded flex items-center gap-2 ${
                      diff.type === 'added'
                        ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500'
                        : diff.type === 'removed'
                        ? 'bg-rose-500/10 text-rose-300 border-l-2 border-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-5 text-center font-bold">
                      {diff.type === 'added' ? '+' : diff.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="truncate">{diff.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
