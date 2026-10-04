import React, { useState } from 'react';
import { Scale, HeartPulse, User, Info } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { calculateBmi } from '../../../domain/math/bmiCalculator';

export const BmiCalculatorTool: React.FC = () => {
  const [height, setHeight] = useState<string>('175');
  const [weight, setWeight] = useState<string>('72');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const result = calculateBmi(parseFloat(height) || 0, parseFloat(weight) || 0);

  // Position on BMI visual scale (range 15 to 40)
  const clampedBmi = Math.max(15, Math.min(40, result.bmi || 22));
  const scalePercent = ((clampedBmi - 15) / (40 - 15)) * 100;

  return (
    <ToolCard
      id="vki-hesaplama"
      title="Vücut Kitle İndeksi & İdeal Kilo"
      description="Dünya Sağlık Örgütü (WHO) standartlarında kilonuzu değerlendirin ve boyunuza uygun ideal kilo aralığınızı keşfedin."
      icon={Scale}
      categoryLabel="Hesaplama & Finans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Cinsiyet</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Erkek
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  gender === 'female'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Kadın
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-300">
              <span className="font-medium">Boy (cm)</span>
              <span className="font-mono text-blue-400 font-bold">{height} cm</span>
            </div>
            <input
              type="number"
              min="100"
              max="240"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-300">
              <span className="font-medium">Kilo (kg)</span>
              <span className="font-mono text-blue-400 font-bold">{weight} kg</span>
            </div>
            <input
              type="number"
              min="30"
              max="250"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Results & Visual Scale */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wider">Vücut Kitle İndeksiniz</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white font-mono">{result.bmi}</span>
                  <span
                    className="text-sm font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${result.categoryColor}20`, color: result.categoryColor }}
                  >
                    {result.categoryLabelTr}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs text-slate-400">İdeal Kilo Aralığınız</span>
                <span className="text-base font-bold text-slate-200 font-mono">
                  {result.idealWeightMin} - {result.idealWeightMax} kg
                </span>
              </div>
            </div>

            {/* Visual Color Scale Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="relative h-3 w-full rounded-full overflow-hidden bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 via-orange-500 to-rose-600">
                {/* Needle Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-md transition-all duration-300 -translate-x-1/2"
                  style={{ left: `${scalePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>18.5 (Zayıf)</span>
                <span>25 (Normal)</span>
                <span>30 (Fazla)</span>
                <span>35+ (Obezite)</span>
              </div>
            </div>

            {/* Health Advice Note */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white mr-1">Değerlendirme:</span>
              {result.healthAdviceTr}
            </div>

            {/* Tıbbi Sorumluluk Reddi (1219 Sayılı Kanun & WHO) */}
            <div className="flex items-start gap-2.5 p-3 bg-sky-950/20 border border-sky-800/40 rounded-xl text-xs text-sky-200/90 leading-relaxed">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sky-300 font-semibold">Tıbbi Bilgilendirme:</strong>{' '}
                Hesaplanan değerler Dünya Sağlık Örgütü (WHO) genel yetişkin standartlarına dayalı matematiksel tahminlerdir. Tıbbi teşhis, tedavi veya klinik diyet önerisi niteliği taşımaz; sağlık kararlarınız için uzman hekime danışınız.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
