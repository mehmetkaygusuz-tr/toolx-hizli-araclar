/**
 * @file billSplitter.ts
 * Bill Split & Tip Calculator for restaurants, events, and group expenses.
 */

import { roundToTwoDecimals } from './vatCalculator';

export interface BillSplitInput {
  totalAmount: number;
  peopleCount: number;
  tipPercent: number; // e.g. 10 for 10%
  customTipAmount?: number;
}

export interface BillSplitResult {
  totalAmount: number;
  peopleCount: number;
  tipAmount: number;
  grandTotal: number;
  perPersonBase: number;
  perPersonTip: number;
  perPersonTotal: number;
}

export function calculateBillSplit(input: BillSplitInput): BillSplitResult {
  const total = Math.max(0, isNaN(input.totalAmount) ? 0 : input.totalAmount);
  const people = Math.max(1, Math.floor(isNaN(input.peopleCount) ? 1 : input.peopleCount));
  
  let tip = 0;
  if (input.customTipAmount !== undefined && input.customTipAmount > 0) {
    tip = input.customTipAmount;
  } else {
    const tipPercent = Math.max(0, isNaN(input.tipPercent) ? 0 : input.tipPercent);
    tip = (total * tipPercent) / 100;
  }

  const grandTotal = total + tip;
  const perPersonBase = total / people;
  const perPersonTip = tip / people;
  const perPersonTotal = grandTotal / people;

  return {
    totalAmount: roundToTwoDecimals(total),
    peopleCount: people,
    tipAmount: roundToTwoDecimals(tip),
    grandTotal: roundToTwoDecimals(grandTotal),
    perPersonBase: roundToTwoDecimals(perPersonBase),
    perPersonTip: roundToTwoDecimals(perPersonTip),
    perPersonTotal: roundToTwoDecimals(perPersonTotal),
  };
}
