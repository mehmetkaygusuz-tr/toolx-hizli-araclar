/**
 * @file unitConverter.ts
 * Multi-category unit conversion (Length, Mass, Temperature, Speed, Data Storage, Fuel).
 */

export type UnitCategory = 'length' | 'mass' | 'temperature' | 'speed' | 'data' | 'fuel';

export interface UnitDefinition {
  id: string;
  nameTr: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

export const LENGTH_UNITS: Record<string, UnitDefinition> = {
  mm: { id: 'mm', nameTr: 'Milimetre', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
  cm: { id: 'cm', nameTr: 'Santimetre', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
  m: { id: 'm', nameTr: 'Metre', symbol: 'm', toBase: v => v, fromBase: v => v },
  km: { id: 'km', nameTr: 'Kilometre', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
  inch: { id: 'inch', nameTr: 'İnç', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  foot: { id: 'foot', nameTr: 'Fit (Feet)', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  yard: { id: 'yard', nameTr: 'Yarda', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  mile: { id: 'mile', nameTr: 'Kara Mili', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
};

export const MASS_UNITS: Record<string, UnitDefinition> = {
  mg: { id: 'mg', nameTr: 'Miligram', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
  g: { id: 'g', nameTr: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
  kg: { id: 'kg', nameTr: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
  ton: { id: 'ton', nameTr: 'Metrik Ton', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
  oz: { id: 'oz', nameTr: 'Ons (Ounce)', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  lb: { id: 'lb', nameTr: 'Pound (Libre)', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
};

export const SPEED_UNITS: Record<string, UnitDefinition> = {
  kmh: { id: 'kmh', nameTr: 'Kilometre / Saat', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
  ms: { id: 'ms', nameTr: 'Metre / Saniye', symbol: 'm/s', toBase: v => v, fromBase: v => v },
  mph: { id: 'mph', nameTr: 'Mil / Saat', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
  knot: { id: 'knot', nameTr: 'Deniz Mili (Knot)', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
};

export const DATA_UNITS: Record<string, UnitDefinition> = {
  b: { id: 'b', nameTr: 'Bayt (Byte)', symbol: 'B', toBase: v => v, fromBase: v => v },
  kb: { id: 'kb', nameTr: 'Kilobayt', symbol: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
  mb: { id: 'mb', nameTr: 'Megabayt', symbol: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
  gb: { id: 'gb', nameTr: 'Gigabayt', symbol: 'GB', toBase: v => v * Math.pow(1024, 3), fromBase: v => v / Math.pow(1024, 3) },
  tb: { id: 'tb', nameTr: 'Terabayt', symbol: 'TB', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
};

export function convertUnits(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  unitMap: Record<string, UnitDefinition>
): number {
  if (isNaN(value)) return 0;
  const fromUnit = unitMap[fromUnitId];
  const toUnit = unitMap[toUnitId];
  if (!fromUnit || !toUnit) return 0;
  if (fromUnitId === toUnitId) return value;

  const baseValue = fromUnit.toBase(value);
  const result = toUnit.fromBase(baseValue);
  // Round to max 6 significant digits for clean display
  return Math.round((result + Number.EPSILON) * 1000000) / 1000000;
}

export function convertTemperature(value: number, from: 'celsius' | 'fahrenheit' | 'kelvin', to: 'celsius' | 'fahrenheit' | 'kelvin'): number {
  if (isNaN(value)) return 0;
  if (from === to) return value;

  // Convert from -> Celsius
  let celsius = value;
  if (from === 'fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'kelvin') {
    celsius = value - 273.15;
  }

  // Convert Celsius -> to
  let target = celsius;
  if (to === 'fahrenheit') {
    target = celsius * (9 / 5) + 32;
  } else if (to === 'kelvin') {
    target = celsius + 273.15;
  }

  return Math.round((target + Number.EPSILON) * 100) / 100;
}
