import { describe, it, expect } from 'vitest';
import { calculateBmi } from '../../src/domain/math/bmiCalculator';
import { calculateDiscount, calculateProfitMargin } from '../../src/domain/math/discountCalculator';
import { calculatePercentOfNumber, calculatePercentageChange } from '../../src/domain/math/percentageCalculator';

describe('BMI & Ideal Weight Calculator', () => {
  it('correctly calculates normal BMI', () => {
    // 175 cm, 70 kg -> 70 / (1.75 * 1.75) = 22.86
    const res = calculateBmi(175, 70);
    expect(res.bmi).toBe(22.86);
    expect(res.category).toBe('normal');
    expect(res.categoryLabelTr).toBe('İdeal / Normal Kilo');
  });

  it('detects underweight and overweight categories', () => {
    const under = calculateBmi(180, 50);
    expect(under.category).toBe('underweight');

    const over = calculateBmi(170, 85);
    expect(over.category).toBe('overweight');
  });

  it('handles invalid inputs gracefully', () => {
    const invalid = calculateBmi(0, -10);
    expect(invalid.bmi).toBe(0);
    expect(invalid.categoryLabelTr).toBe('Değer girilmedi');
  });
});

describe('Discount & Profit Margin Calculator', () => {
  it('calculates 25% discount on 1000 TL', () => {
    const res = calculateDiscount({ originalPrice: 1000, discountRate: 25 });
    expect(res.discountAmount).toBe(250);
    expect(res.discountedPrice).toBe(750);
  });

  it('calculates profit margin and markup correctly', () => {
    // Cost: 200, Sell: 300 -> Profit: 100
    // Margin: 100 / 300 = 33.33%
    // Markup: 100 / 200 = 50%
    const res = calculateProfitMargin({ costPrice: 200, sellPrice: 300 });
    expect(res.profitAmount).toBe(100);
    expect(res.marginPercent).toBe(33.33);
    expect(res.markupPercent).toBe(50);
  });
});

describe('Percentage Calculations', () => {
  it('calculates percentage of number', () => {
    expect(calculatePercentOfNumber(200, 15)).toBe(30);
  });

  it('calculates percentage increase and decrease', () => {
    const inc = calculatePercentageChange(100, 125);
    expect(inc.percentChange).toBe(25);
    expect(inc.type).toBe('increase');

    const dec = calculatePercentageChange(100, 80);
    expect(dec.percentChange).toBe(20);
    expect(dec.type).toBe('decrease');
  });
});
