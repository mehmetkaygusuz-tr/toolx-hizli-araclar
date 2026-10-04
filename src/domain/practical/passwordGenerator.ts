/**
 * @file passwordGenerator.ts
 * Strong Password and PIN generator with entropy and strength estimation.
 */

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g., i, l, 1, L, o, 0, O
  mode: 'random' | 'pin' | 'readable';
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = /[il1Lo0O]/g;

const READABLE_WORDS = [
  'yildiz', 'deniz', 'ruzgar', 'gunes', 'orman', 'daglar', 'bulut', 'nehir',
  'marti', 'kartal', 'aslan', 'kaplan', 'dunya', 'pusula', 'kristal', 'yagmur',
  'simsek', 'gece', 'safak', 'ates', 'toprak', 'liman', 'bahar', 'gokyuzu'
];

export interface PasswordStrength {
  score: 1 | 2 | 3 | 4 | 5; // 1 (Very Weak) to 5 (Very Strong)
  labelTr: string;
  color: string;
  crackTimeEstimateTr: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 1, labelTr: 'Çok Zayıf', color: '#ef4444', crackTimeEstimateTr: 'Anında' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = password.length * (Math.log2(Math.max(2, poolSize)));

  if (entropy < 28 || password.length < 6) {
    return { score: 1, labelTr: 'Çok Zayıf', color: '#ef4444', crackTimeEstimateTr: 'Birkaç saniye' };
  } else if (entropy < 40) {
    return { score: 2, labelTr: 'Zayıf', color: '#f97316', crackTimeEstimateTr: 'Birkaç dakika' };
  } else if (entropy < 55) {
    return { score: 3, labelTr: 'Orta', color: '#eab308', crackTimeEstimateTr: 'Birkaç ay' };
  } else if (entropy < 75) {
    return { score: 4, labelTr: 'Güçlü', color: '#10b981', crackTimeEstimateTr: 'Yüzyıllar' };
  } else {
    return { score: 5, labelTr: 'Çok Güçlü', color: '#06b6d4', crackTimeEstimateTr: 'Milyonlarca yıl' };
  }
}

export function generatePassword(options: PasswordGeneratorOptions): string {
  if (options.mode === 'pin') {
    let pin = '';
    const pinLen = Math.max(4, Math.min(12, options.length));
    for (let i = 0; i < pinLen; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }
    return pin;
  }

  if (options.mode === 'readable') {
    const word1 = READABLE_WORDS[Math.floor(Math.random() * READABLE_WORDS.length)];
    const word2 = READABLE_WORDS[Math.floor(Math.random() * READABLE_WORDS.length)];
    const num = Math.floor(10 + Math.random() * 90);
    const sym = ['!', '#', '-', '@', '*'][Math.floor(Math.random() * 5)];
    return `${word1.charAt(0).toUpperCase() + word1.slice(1)}${sym}${word2}${num}`;
  }

  let charPool = '';
  if (options.includeUppercase) charPool += UPPERCASE;
  if (options.includeLowercase) charPool += LOWERCASE;
  if (options.includeNumbers) charPool += NUMBERS;
  if (options.includeSymbols) charPool += SYMBOLS;

  if (options.excludeSimilar) {
    charPool = charPool.replace(SIMILAR_CHARS, '');
  }

  if (charPool.length === 0) {
    charPool = LOWERCASE + NUMBERS;
  }

  const length = Math.max(6, Math.min(64, options.length));
  let result = '';

  // Use crypto.getRandomValues if available in modern browsers
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint32Array(length);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < length; i++) {
      result += charPool[randomBytes[i] % charPool.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charPool[Math.floor(Math.random() * charPool.length)];
    }
  }

  return result;
}
