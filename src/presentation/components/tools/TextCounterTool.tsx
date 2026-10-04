import React, { useState } from 'react';
import { FileText, Trash2, BookOpen } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { analyzeText } from '../../../domain/text/textCounter';
import { CopyButton } from '../common/CopyButton';

const SAMPLE_TEXT = `Teknoloji hayatımızı kolaylaştıran en önemli araçlardan biridir. Günlük işlerimizi hızlandırır, zamandan tasarruf etmemizi sağlar ve karmaşık işlemleri herkes için erişilebilir kılar. ToolX Hızlı Araçlar ile tek ekranda ihtiyacınız olan tüm pratik çözümlere anında ulaşabilirsiniz.`;

export const TextCounterTool: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const stats = analyzeText(text);

  return (
    <ToolCard
      id="kelime-sayaci"
      title="Kelime, Karakter & Süre Sayacı"
      description="Ödev, makale veya sosyal medya metinlerinizin karakter, kelime, cümle sayısı ile tahmini okuma ve konuşma süresini hesaplayın."
      icon={FileText}
      categoryLabel="Metin & Yazı"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setText(SAMPLE_TEXT)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Örnek Metin</span>
          </button>
          <button
            type="button"
            onClick={() => setText('')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Karakter (Toplam)</span>
            <span className="text-xl font-bold text-white font-mono tabular-nums">{stats.characterCount}</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Boşluksuz Karakter</span>
            <span className="text-xl font-bold text-white font-mono tabular-nums">{stats.characterCountNoSpaces}</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Kelime Sayısı</span>
            <span className="text-xl font-bold text-blue-400 font-mono tabular-nums">{stats.wordCount}</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Cümle Sayısı</span>
            <span className="text-xl font-bold text-white font-mono tabular-nums">{stats.sentenceCount}</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Okuma Süresi</span>
            <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">~{stats.readingTimeMinutes} dk</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Konuşma Süresi</span>
            <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">~{stats.speakingTimeMinutes} dk</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Metninizi buraya yapıştırın veya yazmaya başlayın..."
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-blue-500 rounded-xl p-4 text-white text-sm focus:outline-none resize-y leading-relaxed"
          />
          <div className="absolute right-3 bottom-4">
            <CopyButton text={text} label="Metni Kopyala" />
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
