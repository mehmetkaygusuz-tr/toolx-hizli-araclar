/**
 * @file percentageCalculator.ts
 * Multi-scenario percentage calculator for everyday questions.
 */

import { roundToTwoDecimals } from './vatCalculator';

export function calculatePercentOfNumber(base: number, percent: number): number {
  if (isNaN(base) || isNaN(percent)) return 0;
  return roundToTwoDecimals((base * percent) / 100);
}

export function calculateWhatPercentOf(value: number, total: number): number {
  if (isNaN(value) || isNaN(total) || total === 0) return 0;
  return roundToTwoDecimals((value / total) * 100);
}

export interface PercentageChangeResult {
  difference: number;
  percentChange: number;
  type: 'increase' | 'decrease' | 'no_change';
}

export function calculatePercentageChange(fromValue: number, toValue: number): PercentageChangeResult {
  if (isNaN(fromValue) || isNaN(toValue)) {
    return { difference: 0, percentChange: 0, type: 'no_change' };
  }
  const difference = toValue - fromValue;
  if (fromValue === 0) {
    return {
      difference: roundToTwoDecimals(difference),
      percentChange: toValue > 0 ? 100 : 0,
      type: toValue > 0 ? 'increase' : 'no_change',
    };
  }
  const percentChange = (difference / Math.abs(fromValue)) * 100;
  return {
    difference: roundToTwoDecimals(difference),
    percentChange: roundToTwoDecimals(Math.abs(percentChange)),
    type: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'no_change',
  };
}
