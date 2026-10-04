/**
 * @file vatCalculator.ts
 * Clean Domain Logic for VAT (KDV) & Withholding (Tevkifat) calculations.
 * Supports standard Turkish tax regulations (%1, %10, %20 and custom rates).
 */

export type VatDirection = 'exclusive_to_inclusive' | 'inclusive_to_exclusive';

export type WithholdingFraction = 'none' | '2/10' | '3/10' | '4/10' | '5/10' | '7/10' | '9/10' | '10/10';

export interface VatCalculationInput {
  amount: number;
  rate: number; // e.g. 20 for 20%
  direction: VatDirection;
  withholding?: WithholdingFraction;
}

export interface VatCalculationResult {
  baseAmount: number;        // KDV Hariç Tutar
  vatAmount: number;         // Toplam KDV Tutarı
  totalAmount: number;       // KDV Dahil Toplam Tutar
  withholdingAmount: number; // Tevkif Edilen KDV (Alıcının devlete ödeyeceği)
  sellerVatAmount: number;   // Satıcıya Ödenen KDV
  payableTotal: number;      // Alıcının Satıcıya Ödeyeceği Toplam Tutar
  rate: number;
  effectiveRate: number;
}

export function parseWithholdingFraction(fraction: WithholdingFraction): number {
  if (!fraction || fraction === 'none') return 0;
  const parts = fraction.split('/');
  if (parts.length === 2) {
    const num = Number(parts[0]);
    const den = Number(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den > 0) {
      return num / den;
    }
  }
  return 0;
}

export function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateVat(input: VatCalculationInput): VatCalculationResult {
  const { amount, rate, direction, withholding = 'none' } = input;
  const validAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const validRate = Math.max(0, isNaN(rate) ? 0 : rate);
  const withholdingRatio = parseWithholdingFraction(withholding);

  let baseAmount = 0;
  let vatAmount = 0;
  let totalAmount = 0;

  if (direction === 'exclusive_to_inclusive') {
    // KDV Hariç -> KDV Dahil
    baseAmount = validAmount;
    vatAmount = (baseAmount * validRate) / 100;
    totalAmount = baseAmount + vatAmount;
  } else {
    // KDV Dahil -> KDV Hariç
    totalAmount = validAmount;
    baseAmount = validAmount / (1 + validRate / 100);
    vatAmount = totalAmount - baseAmount;
  }

  const withholdingAmount = vatAmount * withholdingRatio;
  const sellerVatAmount = vatAmount - withholdingAmount;
  const payableTotal = baseAmount + sellerVatAmount;

  return {
    baseAmount: roundToTwoDecimals(baseAmount),
    vatAmount: roundToTwoDecimals(vatAmount),
    totalAmount: roundToTwoDecimals(totalAmount),
    withholdingAmount: roundToTwoDecimals(withholdingAmount),
    sellerVatAmount: roundToTwoDecimals(sellerVatAmount),
    payableTotal: roundToTwoDecimals(payableTotal),
    rate: validRate,
    effectiveRate: totalAmount > 0 ? roundToTwoDecimals((vatAmount / (baseAmount || 1)) * 100) : validRate,
  };
}
