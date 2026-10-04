import React, { useState } from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateDateDifference } from '../../../domain/datetime/dateDifference';
import { CopyButton } from '../common/CopyButton';

export const DateDifferenceTool: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Default end date is end of current year
  const endOfYearStr = `${new Date().getFullYear()}-12-31`;

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(endOfYearStr);

  const diff = calculateDateDifference(startDate, endDate);

  return (
    <ToolCard
      id="tarih-farki"
      title="İki Tarih Arası Gün & İş Günü Sayacı"
      description="İki tarih arasındaki toplam gün, hafta sonu tatilleri hariç iş/mesai günü ve hafta farkını hesaplayın."
      icon={CalendarDays}
      categoryLabel="Tarih & Zaman"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Date Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-400 mt-1">
              {diff.startDateFormattedTr} ({diff.startDayNameTr})
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-400 mt-1">
              {diff.endDateFormattedTr} ({diff.endDayNameTr})
            </span>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="block text-xs font-medium text-slate-400 mb-2">Hızlı Seçenekler</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  setStartDate(d.toISOString().split('T')[0]);
                  d.setDate(d.getDate() + 30);
                  setEndDate(d.toISOString().split('T')[0]);
                }}
                className="py-1.5 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
              >
                +30 Gün Sonra
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate(todayStr);
                  setEndDate(`${new Date().getFullYear()}-12-31`);
                }}
                className="py-1.5 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
              >
                Yılbaşına Kalan
              </button>
            </div>
          </div>
        </div>

        {/* Results Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="space-y-4">
            {/* Primary Highlight */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="block text-xs text-blue-300 font-medium mb-1">Toplam Gün Farkı</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  {Math.abs(diff.totalDays)} Gün
                </span>
                <CopyButton text={`${Math.abs(diff.totalDays)} gün`} />
              </div>
            </div>

            {/* Sub Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-400 mb-1">Mesai / İş Günü</span>
                <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                  {diff.businessDays} Gün
                </span>
                <span className="block text-[10px] text-slate-500">Hafta sonu hariç</span>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-400 mb-1">Hafta Sonu</span>
                <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                  {diff.weekendDays} Gün
                </span>
                <span className="block text-[10px] text-slate-500">Cumartesi &amp; Pazar</span>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-400 mb-1">Tam Hafta</span>
                <span className="text-xl font-bold text-blue-400 font-mono tabular-nums">
                  {diff.weeks} Hafta
                </span>
                <span className="block text-[10px] text-slate-500">+{diff.remainingDaysAfterWeeks} gün</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400">
              Bu süre yaklaşık <span className="text-white font-semibold font-mono">{diff.approxMonths} aya</span> veya{' '}
              <span className="text-white font-semibold font-mono">{diff.approxYears} yıla</span> eşdeğerdir.
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
