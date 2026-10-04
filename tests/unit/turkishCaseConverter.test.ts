import { describe, it, expect } from 'vitest';
import {
  toTurkishUpperCase,
  toTurkishLowerCase,
  toTurkishTitleCase,
  toTurkishSentenceCase,
  toTurkishSlug,
} from '../../src/domain/text/turkishCaseConverter';

describe('Turkish Case Converter', () => {
  it('correctly converts lowercase i to capital İ (not I)', () => {
    expect(toTurkishUpperCase('istanbul')).toBe('İSTANBUL');
    expect(toTurkishUpperCase('ılık')).toBe('ILIK');
  });

  it('correctly converts capital I to lowercase ı (not i)', () => {
    expect(toTurkishLowerCase('IĞDIR')).toBe('ığdır');
    expect(toTurkishLowerCase('İZMİR')).toBe('izmir');
  });

  it('formats Turkish title case properly', () => {
    expect(toTurkishTitleCase('türkçe hızlı araçlar')).toBe('Türkçe Hızlı Araçlar');
    expect(toTurkishTitleCase('istanbul boğazı')).toBe('İstanbul Boğazı');
    expect(toTurkishTitleCase('ılık süt')).toBe('Ilık Süt');
  });

  it('formats sentence case properly', () => {
    expect(toTurkishSentenceCase('merhaba dünya. nasılsın?')).toBe('Merhaba dünya. Nasılsın?');
  });

  it('generates clean SEO-friendly slug from Turkish string', () => {
    expect(toTurkishSlug('Hızlı ve Güçlü Araçlar')).toBe('hizli-ve-guclu-araclar');
    expect(toTurkishSlug('Şekerli Çay & Kahve')).toBe('sekerli-cay-kahve');
    expect(toTurkishSlug('İstanbul')).toBe('istanbul');
  });
});
