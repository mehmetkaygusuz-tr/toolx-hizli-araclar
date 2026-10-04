import React, { useState } from 'react';
import { CaseSensitive, Check, Copy } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import {
  toTurkishUpperCase,
  toTurkishLowerCase,
  toTurkishTitleCase,
  toTurkishSentenceCase,
  toInvertCase,
  toTurkishSlug,
} from '../../../domain/text/turkishCaseConverter';
import { CopyButton } from '../common/CopyButton';

export const TurkishCaseConverterTool: React.FC = () => {
  const [text, setText] = useState<string>('İstanbul ve Iğdır illerinde yaşayan değerli vatandaşlarımız.');

  const handleUpper = () => setText(toTurkishUpperCase(text));
  const handleLower = () => setText(toTurkishLowerCase(text));
  const handleTitle = () => setText(toTurkishTitleCase(text));
  const handleSentence = () => setText(toTurkishSentenceCase(text));
  const handleInvert = () => setText(toInvertCase(text));
  const handleSlug = () => setText(toTurkishSlug(text));

  return (
    <ToolCard
      id="turkce-harf-donusturucu"
      title="Türkçe Büyük/Küçük Harf Düzenleyici"
      description="Türkçe 'i' ve 'ı' harfi hatalarına düşmeden metinlerinizi anında BÜYÜK, küçük, Başlık veya Cümle düzenine dönüştürün."
      icon={CaseSensitive}
      categoryLabel="Metin & Yazı"
    >
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUpper}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            BÜYÜK HARF
          </button>
          <button
            type="button"
            onClick={handleLower}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            küçük harf
          </button>
          <button
            type="button"
            onClick={handleTitle}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Başlık Düzeni
          </button>
          <button
            type="button"
            onClick={handleSentence}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Cümle düzeni.
          </button>
          <button
            type="button"
            onClick={handleInvert}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            tOGGLE cASE
          </button>
          <button
            type="button"
            onClick={handleSlug}
            className="py-2 px-3.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/30 transition-colors"
          >
            seo-uyumlu-link
          </button>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dönüştürmek istediğiniz metni buraya girin..."
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-blue-500 rounded-xl p-4 text-white text-sm focus:outline-none resize-y leading-relaxed"
          />
          <div className="absolute right-3 bottom-4">
            <CopyButton text={text} label="Sonucu Kopyala" />
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
