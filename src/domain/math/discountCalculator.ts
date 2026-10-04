/**
 * @file discountCalculator.ts
 * Clean Domain Logic for Discount, Savings, Markup, and Profit Margin.
 */

import { roundToTwoDecimals } from './vatCalculator';

export interface DiscountCalculationInput {
  originalPrice: number;
  discountRate: number; // e.g. 25 for 25%
}

export interface DiscountCalculationResult {
  originalPrice: number;
  discountRate: number;
  discountAmount: number;    // İndirim Tutarı (Kazanılan tasarruf)
  discountedPrice: number;   // Ödenecek İndirimli Fiyat
}

export function calculateDiscount(input: DiscountCalculationInput): DiscountCalculationResult {
  const original = Math.max(0, isNaN(input.originalPrice) ? 0 : input.originalPrice);
  const rate = Math.min(100, Math.max(0, isNaN(input.discountRate) ? 0 : input.discountRate));

  const discountAmount = (original * rate) / 100;
  const discountedPrice = original - discountAmount;

  return {
    originalPrice: roundToTwoDecimals(original),
    discountRate: roundToTwoDecimals(rate),
    discountAmount: roundToTwoDecimals(discountAmount),
    discountedPrice: roundToTwoDecimals(discountedPrice),
  };
}

export interface ProfitMarginInput {
  costPrice: number;  // Alış / Maliyet Fiyatı
  sellPrice: number;  // Satış Fiyatı
}

export interface ProfitMarginResult {
  costPrice: number;
  sellPrice: number;
  profitAmount: number;   // Net Kar Tutarı
  marginPercent: number;  // Kar Marjı (% cinsinden: kar / satış)
  markupPercent: number;  // Kar Oranı / Fiyat Artışı (% cinsinden: kar / maliyet)
}

export function calculateProfitMargin(input: ProfitMarginInput): ProfitMarginResult {
  const cost = Math.max(0, isNaN(input.costPrice) ? 0 : input.costPrice);
  const sell = Math.max(0, isNaN(input.sellPrice) ? 0 : input.sellPrice);

  const profit = sell - cost;
  const margin = sell > 0 ? (profit / sell) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return {
    costPrice: roundToTwoDecimals(cost),
    sellPrice: roundToTwoDecimals(sell),
    profitAmount: roundToTwoDecimals(profit),
    marginPercent: roundToTwoDecimals(margin),
    markupPercent: roundToTwoDecimals(markup),
  };
}
