import React, { useState } from 'react';
import { CalendarCheck, Sparkles, Gift } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateAge } from '../../../domain/datetime/ageZodiac';
import { CopyButton } from '../common/CopyButton';

export const AgeZodiacTool: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const result = calculateAge(birthDate);

  return (
    <ToolCard
      id="yas-burc"
      title="Detaylı Yaş & Burç Hesaplayıcı"
      description="Dünyada geçirdiğiniz tam yıl, ay, gün ve saatleri öğrenin; sonraki doğum gününüze kalan süreyi ve burcunuzu keşfedin."
      icon={CalendarCheck}
      categoryLabel="Tarih & Zaman"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input */}
        <div className="lg:col-span-5 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Doğum Tarihiniz</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
            />
          </div>

          {result && (
            <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{result.zodiac.symbol}</span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {result.zodiac.nameTr} Burcu
                    <span className="text-xs font-normal text-indigo-400">({result.zodiac.elementTr} Elementi)</span>
                  </h3>
                  <span className="text-xs text-slate-400">{result.zodiac.dateRangeTr}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {result.zodiac.descriptionTr}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          {result ? (
            <div className="space-y-4">
              {/* Primary Age */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="block text-xs text-blue-300 font-medium mb-1">Şu Anki Tam Yaşınız</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
                    {result.years} Yaşında
                  </span>
                  <span className="text-sm text-slate-300">
                    ({result.months} ay, {result.days} gün)
                  </span>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="block text-xs text-slate-400 mb-1">Toplam Yaşanan Gün</span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {result.totalDaysLived.toLocaleString('tr-TR')} Gün
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="block text-xs text-slate-400 mb-1">Toplam Saat</span>
                  <span className="text-lg font-bold text-blue-400 font-mono tabular-nums">
                    {result.totalHoursLived.toLocaleString('tr-TR')} Saat
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="block text-xs text-slate-400 mb-1">Sonraki Doğum Günü</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                    {result.daysUntilNextBirthday} Gün
                  </span>
                  <span className="block text-[10px] text-slate-500">{result.nextBirthdayDayNameTr} günü</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm">
              Lütfen geçerli bir doğum tarihi seçiniz.
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
};
