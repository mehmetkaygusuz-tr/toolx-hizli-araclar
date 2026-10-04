import React, { useState } from 'react';
import { ArrowLeftRight, ArrowRight } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import {
  LENGTH_UNITS,
  MASS_UNITS,
  DATA_UNITS,
  SPEED_UNITS,
  convertUnits,
  UnitCategory,
} from '../../../domain/units/unitConverter';
import { CopyButton } from '../common/CopyButton';

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('100');

  // Length defaults: cm -> inch
  const [fromUnit, setFromUnit] = useState<string>('cm');
  const [toUnit, setToUnit] = useState<string>('inch');

  const getUnitMap = (cat: UnitCategory) => {
    switch (cat) {
      case 'mass':
        return MASS_UNITS;
      case 'data':
        return DATA_UNITS;
      case 'speed':
        return SPEED_UNITS;
      case 'length':
      default:
        return LENGTH_UNITS;
    }
  };

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const map = getUnitMap(newCat);
    const keys = Object.keys(map);
    setFromUnit(keys[0] || '');
    setToUnit(keys[1] || keys[0] || '');
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const currentMap = getUnitMap(category);
  const numVal = parseFloat(inputValue) || 0;
  const converted = convertUnits(numVal, fromUnit, toUnit, currentMap);

  return (
    <ToolCard
      id="birim-donusturucu"
      title="Ölçü Birimleri Çevirici"
      description="Uzunluk (metre, inç, mil), ağırlık (kg, gram, pound), veri saklama (MB, GB, TB) ve hız birimlerini anında dönüştürün."
      icon={ArrowLeftRight}
      categoryLabel="Ölçü Birimleri"
    >
      <div className="space-y-5">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
          {[
            { id: 'length', label: 'Uzunluk & Mesafe' },
            { id: 'mass', label: 'Ağırlık & Kütle' },
            { id: 'data', label: 'Veri & Depolama' },
            { id: 'speed', label: 'Hız' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as UnitCategory)}
              className={`py-1.5 px-3.5 text-xs font-medium rounded-lg transition-all ${
                category === cat.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Converter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          {/* Source Value & Unit */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Kaynak Değer &amp; Birim</label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-base focus:border-blue-500 focus:outline-none"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
            >
              {Object.values(currentMap).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameTr} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center py-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-xl transition-transform hover:rotate-180 duration-200"
              title="Birimleri Değiştir"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Target Unit & Result */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-emerald-400">Hedef Sonuç</label>
              <CopyButton text={String(converted)} iconOnly />
            </div>
            <div className="w-full bg-slate-900/80 border border-emerald-500/30 rounded-xl p-2.5 text-white font-mono text-base font-bold truncate">
              {converted} {currentMap[toUnit]?.symbol}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
            >
              {Object.values(currentMap).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameTr} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
