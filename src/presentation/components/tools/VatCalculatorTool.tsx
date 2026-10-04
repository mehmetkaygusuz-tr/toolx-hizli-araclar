import React, { useState } from 'react';
import { Receipt, ArrowRightLeft, Info } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateVat, VatDirection, WithholdingFraction } from '../../../domain/math/vatCalculator';
import { CopyButton } from '../common/CopyButton';

export const VatCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState<string>('1000');
  const [rate, setRate] = useState<number>(20);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<string>('18');
  const [direction, setDirection] = useState<VatDirection>('exclusive_to_inclusive');
  const [withholding, setWithholding] = useState<WithholdingFraction>('none');

  const activeRate = isCustomRate ? parseFloat(customRate) || 0 : rate;
  const numAmount = parseFloat(amount) || 0;

  const result = calculateVat({
    amount: numAmount,
    rate: activeRate,
    direction,
    withholding,
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <ToolCard
      id="kdv-hesaplama"
      title="KDV & Tevkifat Hesaplayıcı"
      description="2026 güncel Türkiye KDV oranları (%1, %10, %20) ile KDV Dahil, KDV Hariç ve Tevkifat tutarlarını anında hesaplayın."
      icon={Receipt}
      categoryLabel="Hesaplama & Finans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-6 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          {/* Direction Segmented Switch */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Hesaplama Yönü</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setDirection('exclusive_to_inclusive')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                  direction === 'exclusive_to_inclusive'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                KDV Hariçten → Dahile
              </button>
              <button
                type="button"
                onClick={() => setDirection('inclusive_to_exclusive')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                  direction === 'inclusive_to_exclusive'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                KDV Dahilden → Harice
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {direction === 'exclusive_to_inclusive' ? 'KDV Hariç Tutar' : 'KDV Dahil Toplam Tutar'} (TL)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Örn: 1000"
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 px-4 text-white text-base font-mono focus:outline-none"
              />
              <span className="absolute right-4 top-3 text-xs text-slate-400 font-mono">₺ TRY</span>
            </div>
          </div>

          {/* Rate Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">KDV Oranı</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 10, 20].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRate(r);
                    setIsCustomRate(false);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                    !isCustomRate && rate === r
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  %{r}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomRate(true)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  isCustomRate
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Özel %
              </button>
            </div>

            {isCustomRate && (
              <div className="mt-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="Örn: 18"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            )}
          </div>

          {/* Withholding (Tevkifat) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">KDV Tevkifatı (Opsiyonel)</label>
            <select
              value={withholding}
              onChange={(e) => setWithholding(e.target.value as WithholdingFraction)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="none">Tevkifat Yok</option>
              <option value="2/10">2/10 Tevkifat</option>
              <option value="3/10">3/10 Tevkifat</option>
              <option value="5/10">5/10 Tevkifat (Yarı Yarıya)</option>
              <option value="7/10">7/10 Tevkifat</option>
              <option value="9/10">9/10 Tevkifat</option>
              <option value="10/10">10/10 Tevkifat (Tam Tevkifat)</option>
            </select>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="space-y-4">
            <span className="block text-sm font-semibold text-white">Hesaplama Özeti</span>

            {/* Main Total Highlight */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="block text-xs text-blue-300 font-medium mb-1">
                {direction === 'exclusive_to_inclusive' ? 'KDV Dahil Toplam Tutar' : 'KDV Hariç Net Tutar'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                  {formatCurrency(direction === 'exclusive_to_inclusive' ? result.totalAmount : result.baseAmount)}
                </span>
                <CopyButton
                  text={String(direction === 'exclusive_to_inclusive' ? result.totalAmount : result.baseAmount)}
                  label="Tutarı Kopyala"
                />
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800 text-slate-300">
                <span className="text-xs text-slate-400">KDV Hariç Tutar:</span>
                <span className="font-mono font-medium">{formatCurrency(result.baseAmount)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800 text-slate-300">
                <span className="text-xs text-slate-400">Hesaplanan KDV (%{activeRate}):</span>
                <span className="font-mono font-medium text-blue-400">+{formatCurrency(result.vatAmount)}</span>
              </div>
              {withholding !== 'none' && (
                <>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800 text-amber-300">
                    <span className="text-xs text-slate-400">Tevkif Edilen KDV ({withholding}):</span>
                    <span className="font-mono font-medium">-{formatCurrency(result.withholdingAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800 text-emerald-300 font-semibold">
                    <span className="text-xs text-slate-400">Alıcının Satıcıya Ödeyeceği:</span>
                    <span className="font-mono">{formatCurrency(result.payableTotal)}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between py-1.5 text-white font-bold text-base">
                <span>KDV Dahil Genel Toplam:</span>
                <span className="font-mono">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>

            {/* Mali Mevzuat Yasal Bilgilendirme */}
            <div className="flex items-start gap-2.5 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300 font-semibold">Mali Bilgilendirme:</strong>{' '}
                Hesaplanan tutarlar ve tevkifat kesintileri Türkiye Cumhuriyeti güncel vergi mevzuatına göre bilgilendirme amaçlıdır. Resmi fatura, muhasebe kaydı veya vergi beyannamesi yerine geçmez; nihai işlemleriniz için mali müşavirinize başvurunuz.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
