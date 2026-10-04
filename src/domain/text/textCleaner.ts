/**
 * @file textCleaner.ts
 * Operations for text sanitization, duplicate line removal, whitespace cleanup, and diffing.
 */

export interface TextCleanOptions {
  removeExtraSpaces?: boolean;
  removeEmptyLines?: boolean;
  removeDuplicateLines?: boolean;
  stripHtml?: boolean;
  trimLines?: boolean;
  sortLines?: 'none' | 'asc' | 'desc';
}

export function cleanText(text: string, options: TextCleanOptions): string {
  if (!text) return '';
  let result = text;

  if (options.stripHtml) {
    result = result.replace(/<[^>]*>?/gm, '');
  }

  let lines = result.split(/\r?\n/);

  if (options.trimLines) {
    lines = lines.map(line => line.trim());
  }

  if (options.removeExtraSpaces) {
    lines = lines.map(line => line.replace(/[ \t]+/g, ' '));
  }

  if (options.removeEmptyLines) {
    lines = lines.filter(line => line.trim().length > 0);
  }

  if (options.removeDuplicateLines) {
    const seen = new Set<string>();
    lines = lines.filter(line => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });
  }

  if (options.sortLines === 'asc') {
    lines.sort((a, b) => a.localeCompare(b, 'tr-TR'));
  } else if (options.sortLines === 'desc') {
    lines.sort((a, b) => b.localeCompare(a, 'tr-TR'));
  }

  return lines.join('\n');
}

export interface LineDiff {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumberA?: number;
  lineNumberB?: number;
}

export function computeSimpleLineDiff(original: string, modified: string): LineDiff[] {
  const linesA = original.split(/\r?\n/);
  const linesB = modified.split(/\r?\n/);
  const diffs: LineDiff[] = [];

  const maxLen = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLen; i++) {
    const a = linesA[i];
    const b = linesB[i];

    if (a === undefined && b !== undefined) {
      diffs.push({ type: 'added', text: b, lineNumberB: i + 1 });
    } else if (a !== undefined && b === undefined) {
      diffs.push({ type: 'removed', text: a, lineNumberA: i + 1 });
    } else if (a === b) {
      diffs.push({ type: 'unchanged', text: a, lineNumberA: i + 1, lineNumberB: i + 1 });
    } else {
      diffs.push({ type: 'removed', text: a, lineNumberA: i + 1 });
      diffs.push({ type: 'added', text: b, lineNumberB: i + 1 });
    }
  }

  return diffs;
}
