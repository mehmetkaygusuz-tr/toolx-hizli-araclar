/**
 * @file randomPicker.ts
 * Random selector, dice roller, coin flipper, and range picker.
 */

export function pickRandomItem<T>(items: T[]): T | null {
  if (!items || items.length === 0) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function pickRandomNItems<T>(items: T[], count: number, allowDuplicates = false): T[] {
  if (!items || items.length === 0 || count <= 0) return [];

  if (allowDuplicates) {
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(items[Math.floor(Math.random() * items.length)]);
    }
    return result;
  }

  // Without duplicates: Fisher-Yates shuffle slice
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone.slice(0, Math.min(count, clone.length));
}

export function flipCoin(): 'Yazı' | 'Tura' {
  return Math.random() < 0.5 ? 'Yazı' : 'Tura';
}

export function rollDice(sides = 6, count = 1): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

export function generateRandomNumber(min: number, max: number): number {
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  return Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
}
