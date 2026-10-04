/**
 * @file turkishCaseConverter.ts
 * Turkish-compliant string casing algorithms (correctly handling İ/i and I/ı pairs).
 */

export function toTurkishUpperCase(str: string): string {
  if (!str) return '';
  return str.toLocaleUpperCase('tr-TR');
}

export function toTurkishLowerCase(str: string): string {
  if (!str) return '';
  return str.toLocaleLowerCase('tr-TR');
}

/**
 * Capitalizes the first letter of each word according to Turkish rules.
 */
export function toTurkishTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .split(/(\s+)/)
    .map(part => {
      if (/^\s+$/.test(part) || part.length === 0) return part;
      const firstChar = part.charAt(0).toLocaleUpperCase('tr-TR');
      const rest = part.slice(1);
      return firstChar + rest;
    })
    .join('');
}

/**
 * Capitalizes the first letter of each sentence.
 */
export function toTurkishSentenceCase(str: string): string {
  if (!str) return '';
  const lower = str.toLocaleLowerCase('tr-TR');
  // Match sentence start after punctuation or start of string
  return lower.replace(/(^\s*|[.!?]\s+)([a-zçğıöşü])/gi, (match, separator, char) => {
    return separator + char.toLocaleUpperCase('tr-TR');
  });
}

/**
 * Inverts casing for each character.
 */
export function toInvertCase(str: string): string {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const upper = char.toLocaleUpperCase('tr-TR');
    const lower = char.toLocaleLowerCase('tr-TR');
    if (char === upper && char !== lower) {
      result += lower;
    } else if (char === lower && char !== upper) {
      result += upper;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Generates an SEO & web friendly slug from Turkish text.
 */
export function toTurkishSlug(str: string): string {
  if (!str) return '';
  const map: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i', 'i': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };

  let cleaned = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    cleaned += map[char] !== undefined ? map[char] : char;
  }

  return cleaned
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
