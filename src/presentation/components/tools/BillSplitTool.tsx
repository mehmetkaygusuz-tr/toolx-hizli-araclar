import React, { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateBillSplit } from '../../../domain/math/billSplitter';
import { CopyButton } from '../common/CopyButton';

export const BillSplitTool: React.FC = () => {
  const [totalAmount, setTotalAmount] = useState<string>('840');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [tipPercent, setTipPercent] = useState<number>(10);

  const result = calculateBillSplit({
    totalAmount: parseFloat(totalAmount) || 0,
    peopleCount,
    tipPercent,
  });

  const formatTL = (val: number) => `₺${val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;

  return (
    <ToolCard
      id="hesap-bolusturucu"
      title="Bahşiş & Hesap Bölüştürücü"
      description="Arkadaş grubuyla yemekte veya kafede adisyonu ve bahşişi kişi sayısına göre adilce bölüştürün."
      icon={Users}
      categoryLabel="Hesaplama & Finans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Toplam Hesap Tutarı (TL)</label>
            <input
              type="number"
              min="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kişi Sayısı</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center font-mono font-bold text-xl text-white py-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
                {peopleCount} Kişi
              </div>
              <button
                type="button"
                onClick={() => setPeopleCount((p) => p + 1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Bahşiş Oranı</span>
              <span className="font-mono text-blue-400 font-bold">%{tipPercent}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 5, 10, 15, 20].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipPercent(t)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    tipPercent === t
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  %{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="block text-xs text-blue-300 font-medium mb-1">Kişi Başı Ödenecek Tutar</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {formatTL(result.perPersonTotal)}
                </span>
                <CopyButton text={String(result.perPersonTotal)} label="Kopyala" />
              </div>
            </div>

            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-xs text-slate-400">Kişi Başı Temel Hesap:</span>
                <span className="font-mono font-medium">{formatTL(result.perPersonBase)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-xs text-slate-400">Kişi Başı Bahşiş Payı:</span>
                <span className="font-mono font-medium text-blue-400">+{formatTL(result.perPersonTip)}</span>
              </div>
              <div className="flex items-center justify-between py-1 text-white font-bold">
                <span>Genel Toplam (Bahşiş Dahil):</span>
                <span className="font-mono">{formatTL(result.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
