import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';

interface CityClock {
  nameTr: string;
  countryTr: string;
  timeZone: string;
  diffFromTr: string;
}

const CITIES: CityClock[] = [
  { nameTr: 'İstanbul', countryTr: 'Türkiye', timeZone: 'Europe/Istanbul', diffFromTr: 'Yerel Saat (Referans)' },
  { nameTr: 'Londra', countryTr: 'Birleşik Krallık', timeZone: 'Europe/London', diffFromTr: '3 saat geride' },
  { nameTr: 'New York', countryTr: 'Amerika Birleşik Devletleri', timeZone: 'America/New_York', diffFromTr: '7-8 saat geride' },
  { nameTr: 'Tokyo', countryTr: 'Japonya', timeZone: 'Asia/Tokyo', diffFromTr: '6 saat ileride' },
  { nameTr: 'Dubai', countryTr: 'Birleşik Arap Emirlikleri', timeZone: 'Asia/Dubai', diffFromTr: '1 saat ileride' },
  { nameTr: 'Sidney', countryTr: 'Avustralya', timeZone: 'Australia/Sydney', diffFromTr: '7-8 saat ileride' },
];

export const WorldClockTool: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('tr-TR', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
    } catch {
      return '--:--:--';
    }
  };

  const formatCityDate = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('tr-TR', {
        timeZone,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(now);
    } catch {
      return '';
    }
  };

  return (
    <ToolCard
      id="dunya-saatleri"
      title="Dünya Saatleri & Zaman Dilimi"
      description="İstanbul ve dünyanın önde gelen şehirlerindeki canlı saatleri, tarihleri ve Türkiye'ye göre zaman farkını anında görün."
      icon={Globe}
      categoryLabel="Tarih & Zaman"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map((city) => (
          <div
            key={city.nameTr}
            className={`p-4 rounded-xl border transition-all ${
              city.nameTr === 'İstanbul'
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  {city.nameTr}
                  {city.nameTr === 'İstanbul' && (
                    <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-normal">
                      Buradasınız
                    </span>
                  )}
                </h3>
                <span className="text-xs text-slate-400">{city.countryTr}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{formatCityDate(city.timeZone)}</span>
            </div>

            <div className="text-3xl font-extrabold text-white font-mono tracking-wider tabular-nums my-2">
              {formatCityTime(city.timeZone)}
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Fark:</span>
              <span className="text-slate-300 font-medium">{city.diffFromTr}</span>
            </div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
};
