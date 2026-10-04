import { describe, it, expect } from 'vitest';
import { convertUnits, convertTemperature, LENGTH_UNITS, MASS_UNITS, DATA_UNITS } from '../../src/domain/units/unitConverter';
import { generatePassword, evaluatePasswordStrength } from '../../src/domain/practical/passwordGenerator';
import { calculateDateDifference } from '../../src/domain/datetime/dateDifference';

describe('Unit Converters', () => {
  it('converts 100 cm to inches correctly', () => {
    // 100 cm = 39.370079 inches
    const result = convertUnits(100, 'cm', 'inch', LENGTH_UNITS);
    expect(result).toBeCloseTo(39.37, 1);
  });

  it('converts 1 kg to grams and pounds', () => {
    expect(convertUnits(1, 'kg', 'g', MASS_UNITS)).toBe(1000);
    const pounds = convertUnits(1, 'kg', 'lb', MASS_UNITS);
    expect(pounds).toBeCloseTo(2.204, 2);
  });

  it('converts temperature between Celsius, Fahrenheit, and Kelvin', () => {
    expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
    expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15);
  });

  it('converts data units accurately (binary 1024 basis)', () => {
    expect(convertUnits(1, 'gb', 'mb', DATA_UNITS)).toBe(1024);
  });
});

describe('Password Generator & Strength', () => {
  it('generates password with requested length', () => {
    const pwd = generatePassword({
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      mode: 'random',
    });
    expect(pwd.length).toBe(20);
  });

  it('generates purely numeric PIN in pin mode', () => {
    const pin = generatePassword({
      length: 6,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSymbols: false,
      excludeSimilar: false,
      mode: 'pin',
    });
    expect(pin.length).toBe(6);
    expect(/^\d+$/.test(pin)).toBe(true);
  });

  it('evaluates strong vs weak passwords', () => {
    const weak = evaluatePasswordStrength('1234');
    expect(weak.score).toBe(1);

    const strong = evaluatePasswordStrength('K!8#xL9$wQ2@mZ');
    expect(strong.score).toBeGreaterThanOrEqual(4);
  });
});

describe('Date Difference Calculator', () => {
  it('calculates exact day difference and business days', () => {
    // 2026-06-01 is Monday, 2026-06-08 is Monday (7 days, 5 business days, 2 weekend days)
    const diff = calculateDateDifference('2026-06-01', '2026-06-08');
    expect(diff.totalDays).toBe(7);
    expect(diff.businessDays).toBe(5);
    expect(diff.weekendDays).toBe(2);
    expect(diff.weeks).toBe(1);
  });
});
