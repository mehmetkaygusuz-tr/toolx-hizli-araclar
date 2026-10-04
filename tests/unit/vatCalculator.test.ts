import { describe, it, expect } from 'vitest';
import { calculateVat, parseWithholdingFraction } from '../../src/domain/math/vatCalculator';

describe('VAT & Withholding Calculator (KDV & Tevkifat)', () => {
  it('correctly calculates 20% VAT from exclusive to inclusive', () => {
    const result = calculateVat({
      amount: 1000,
      rate: 20,
      direction: 'exclusive_to_inclusive',
    });

    expect(result.baseAmount).toBe(1000);
    expect(result.vatAmount).toBe(200);
    expect(result.totalAmount).toBe(1200);
    expect(result.withholdingAmount).toBe(0);
    expect(result.payableTotal).toBe(1200);
  });

  it('correctly calculates 10% VAT from inclusive to exclusive', () => {
    const result = calculateVat({
      amount: 110,
      rate: 10,
      direction: 'inclusive_to_exclusive',
    });

    expect(result.totalAmount).toBe(110);
    expect(result.baseAmount).toBe(100);
    expect(result.vatAmount).toBe(10);
  });

  it('correctly applies 5/10 withholding tax (tevkifat)', () => {
    const result = calculateVat({
      amount: 1000,
      rate: 20,
      direction: 'exclusive_to_inclusive',
      withholding: '5/10',
    });

    expect(result.baseAmount).toBe(1000);
    expect(result.vatAmount).toBe(200);
    expect(result.withholdingAmount).toBe(100); // 200 * 0.5
    expect(result.sellerVatAmount).toBe(100);
    expect(result.payableTotal).toBe(1100);
  });

  it('handles zero and negative amounts safely', () => {
    const zeroResult = calculateVat({
      amount: 0,
      rate: 20,
      direction: 'exclusive_to_inclusive',
    });
    expect(zeroResult.baseAmount).toBe(0);
    expect(zeroResult.totalAmount).toBe(0);

    const negResult = calculateVat({
      amount: -500,
      rate: 20,
      direction: 'exclusive_to_inclusive',
    });
    expect(negResult.baseAmount).toBe(0);
  });

  it('parses withholding fractions accurately', () => {
    expect(parseWithholdingFraction('2/10')).toBeCloseTo(0.2);
    expect(parseWithholdingFraction('7/10')).toBeCloseTo(0.7);
    expect(parseWithholdingFraction('none')).toBe(0);
  });
});
