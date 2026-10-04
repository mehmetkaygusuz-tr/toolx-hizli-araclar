import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import {
  calculatePercentOfNumber,
  calculateWhatPercentOf,
  calculatePercentageChange,
} from '../../../domain/math/percentageCalculator';
import { CopyButton } from '../common/CopyButton';

export const PercentageCalculatorTool: React.FC = () => {
  // Scenario 1: A'nın %B'si kaçtır?
  const [base1, setBase1] = useState<string>('250');
  const [percent1, setPercent1] = useState<string>('15');

  // Scenario 2: A, B'nin yüzde kaçıdır?
  const [val2, setVal2] = useState<string>('45');
  const [total2, setTotal2] = useState<string>('180');

  // Scenario 3: A'dan B'ye yüzde kaç değişim var?
  const [from3, setFrom3] = useState<string>('100');
  const [to3, setTo3] = useState<string>('125');

  const res1 = calculatePercentOfNumber(parseFloat(base1) || 0, parseFloat(percent1) || 0);
  const res2 = calculateWhatPercentOf(parseFloat(val2) || 0, parseFloat(total2) || 0);
  const res3 = calculatePercentageChange(parseFloat(from3) || 0, parseFloat(to3) || 0);

  return (
    <ToolCard
      id="yuzde-hesaplama"
      title="Hızlı Yüzde Hesaplayıcı"
      description="Yüzde hesaplama sorularını 3 pratik formülle tek ekranda anında çözün."
      icon={Percent}
      categoryLabel="Hesaplama & Finans"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Scenario 1 */}
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              1. Sayının Yüzdesini Bulma
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Sayı</label>
                <input
                  type="number"
                  value={base1}
                  onChange={(e) => setBase1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Yüzde (%)</label>
                <input
                  type="number"
                  value={percent1}
                  onChange={(e) => setPercent1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <span className="block text-[11px] text-blue-300">
              {base1 || 0} sayısının %{percent1 || 0}&apos;si:
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-white font-mono">{res1}</span>
              <CopyButton text={String(res1)} iconOnly />
            </div>
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              2. Oransal Pay (Yüzde Kaçı?)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Parça Sayı</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Toplam Sayı</label>
                <input
                  type="number"
                  value={total2}
                  onChange={(e) => setTotal2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <span className="block text-[11px] text-blue-300">
              {val2 || 0}, {total2 || 0} sayısının yüzde:
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-white font-mono">%{res2}</span>
              <CopyButton text={`%${res2}`} iconOnly />
            </div>
          </div>
        </div>

        {/* Scenario 3 */}
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              3. Değişim &amp; Artış Oranı
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">İlk Değer</label>
                <input
                  type="number"
                  value={from3}
                  onChange={(e) => setFrom3(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Son Değer</label>
                <input
                  type="number"
                  value={to3}
                  onChange={(e) => setTo3(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <span className="block text-[11px] text-blue-300">
              {res3.type === 'increase' ? 'Artış Oranı:' : res3.type === 'decrease' ? 'Azalış Oranı:' : 'Değişim Yok'}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span
                className={`text-xl font-bold font-mono ${
                  res3.type === 'increase'
                    ? 'text-emerald-400'
                    : res3.type === 'decrease'
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {res3.type === 'increase' ? '+' : res3.type === 'decrease' ? '-' : ''}%{res3.percentChange}
              </span>
              <CopyButton text={`%${res3.percentChange}`} iconOnly />
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
