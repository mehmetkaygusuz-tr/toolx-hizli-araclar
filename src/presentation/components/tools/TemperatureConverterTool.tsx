import React, { useState } from 'react';
import { Thermometer } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { convertTemperature } from '../../../domain/units/unitConverter';

export const TemperatureConverterTool: React.FC = () => {
  const [celsius, setCelsius] = useState<string>('24');
  const [fahrenheit, setFahrenheit] = useState<string>('75.2');
  const [kelvin, setKelvin] = useState<string>('297.15');

  const handleCelsiusChange = (val: string) => {
    setCelsius(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFahrenheit(String(convertTemperature(num, 'celsius', 'fahrenheit')));
      setKelvin(String(convertTemperature(num, 'celsius', 'kelvin')));
    } else {
      setFahrenheit('');
      setKelvin('');
    }
  };

  const handleFahrenheitChange = (val: string) => {
    setFahrenheit(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCelsius(String(convertTemperature(num, 'fahrenheit', 'celsius')));
      setKelvin(String(convertTemperature(num, 'fahrenheit', 'kelvin')));
    } else {
      setCelsius('');
      setKelvin('');
    }
  };

  const handleKelvinChange = (val: string) => {
    setKelvin(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCelsius(String(convertTemperature(num, 'kelvin', 'celsius')));
      setFahrenheit(String(convertTemperature(num, 'kelvin', 'fahrenheit')));
    } else {
      setCelsius('');
      setFahrenheit('');
    }
  };

  return (
    <ToolCard
      id="sicaklik-donusturucu"
      title="Sıcaklık Çevirici"
      description="Celsius (°C), Fahrenheit (°F) ve Kelvin (K) değerlerini anlık senkronize biçimde birbirine dönüştürün."
      icon={Thermometer}
      categoryLabel="Ölçü Birimleri"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
            <span className="block text-xs font-semibold text-sky-400">Celsius (°C)</span>
            <input
              type="number"
              step="any"
              value={celsius}
              onChange={(e) => handleCelsiusChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-lg font-bold focus:border-blue-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-500">Türkiye &amp; Avrupa standardı</span>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
            <span className="block text-xs font-semibold text-amber-400">Fahrenheit (°F)</span>
            <input
              type="number"
              step="any"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-lg font-bold focus:border-blue-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-500">ABD &amp; İngiltere kullanımı</span>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
            <span className="block text-xs font-semibold text-emerald-400">Kelvin (K)</span>
            <input
              type="number"
              step="any"
              value={kelvin}
              onChange={(e) => handleKelvinChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-lg font-bold focus:border-blue-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-500">Bilimsel &amp; fiziksel ölçüm</span>
          </div>
        </div>

        {/* Reference points */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Su Donma Noktası</span>
            <span className="font-mono text-white font-bold">0 °C = 32 °F</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">İdeal Oda Sıcaklığı</span>
            <span className="font-mono text-emerald-400 font-bold">21 °C = 70 °F</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Su Kaynama Noktası</span>
            <span className="font-mono text-rose-400 font-bold">100 °C = 212 °F</span>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
