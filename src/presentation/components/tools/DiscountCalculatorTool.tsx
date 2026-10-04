import React, { useState } from 'react';
import { BadgePercent, TrendingUp, Sparkles } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateDiscount, calculateProfitMargin } from '../../../domain/math/discountCalculator';
import { CopyButton } from '../common/CopyButton';

export const DiscountCalculatorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discount' | 'margin'>('discount');

  // Discount state
  const [originalPrice, setOriginalPrice] = useState<string>('500');
  const [discountRate, setDiscountRate] = useState<number>(25);

  // Profit Margin state
  const [costPrice, setCostPrice] = useState<string>('200');
  const [sellPrice, setSellPrice] = useState<string>('300');

  const discountRes = calculateDiscount({
    originalPrice: parseFloat(originalPrice) || 0,
    discountRate,
  });

  const marginRes = calculateProfitMargin({
    costPrice: parseFloat(costPrice) || 0,
    sellPrice: parseFloat(sellPrice) || 0,
  });

  const formatTL = (val: number) => `₺${val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;

  return (
    <ToolCard
      id="indirim-kar"
      title="İndirim & Kar Marjı Hesaplayıcı"
      description="Mağaza indirimleri, kampanyalardaki tasarruflarınız veya ürün satış kar marjınızı saniyeler içinde hesaplayın."
      icon={BadgePercent}
      categoryLabel="Hesaplama & Finans"
    >
      <div className="space-y-5">
        {/* Sub-tab selection */}
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('discount')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'discount' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alışveriş İndirimi
          </button>
          <button
            onClick={() => setActiveTab('margin')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'margin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satış &amp; Kar Marjı
          </button>
        </div>

        {activeTab === 'discount' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Normal Etiket Fiyatı (TL)</label>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>İndirim Yüzdesi</span>
                  <span className="font-mono text-blue-400 font-bold">%{discountRate}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {[10, 20, 30, 50, 70].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setDiscountRate(preset)}
                      className={`py-1 text-xs rounded border transition-colors ${
                        discountRate === preset
                          ? 'bg-blue-600/30 text-blue-400 border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      %{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="block text-xs text-emerald-400 font-medium mb-1">Ödeyeceğiniz İndirimli Fiyat</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white font-mono">
                      {formatTL(discountRes.discountedPrice)}
                    </span>
                    <CopyButton text={String(discountRes.discountedPrice)} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="block text-xs text-blue-300 font-medium mb-1">Cebinizde Kalan Net Tasarruf</span>
                  <span className="text-2xl font-bold text-blue-400 font-mono">
                    {formatTL(discountRes.discountAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Alış / Maliyet Fiyatı (TL)</label>
                <input
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Satış Fiyatı (TL)</label>
                <input
                  type="number"
                  min="0"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="block text-xs text-blue-300 font-medium mb-1">Elde Edilen Net Kar</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    {formatTL(marginRes.profitAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="block text-xs text-slate-400 mb-1">Kar Marjı</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      %{marginRes.marginPercent}
                    </span>
                    <span className="block text-[11px] text-slate-500">Satış üzerinden pay</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="block text-xs text-slate-400 mb-1">Fiyat Artışı (Markup)</span>
                    <span className="text-lg font-bold text-blue-400 font-mono">
                      %{marginRes.markupPercent}
                    </span>
                    <span className="block text-[11px] text-slate-500">Maliyete eklenen pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
