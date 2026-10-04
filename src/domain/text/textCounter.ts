/**
 * @file textCounter.ts
 * Real-time text statistics: characters, words, sentences, paragraphs, reading/speaking times.
 */

export interface TextStatistics {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function analyzeText(text: string): TextStatistics {
  if (!text || text.length === 0) {
    return {
      characterCount: 0,
      characterCountNoSpaces: 0,
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s+/g, '').length;

  // Split by whitespace and filter out empty tokens
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Sentences split by . ! ?
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const sentenceCount = sentences.length;

  // Paragraphs split by newlines
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  const paragraphCount = paragraphs.length;

  // Average reading speed: 200 words per minute
  // Average speaking speed: 130 words per minute
  const readingTimeMinutes = Math.ceil((wordCount / 200) * 10) / 10;
  const speakingTimeMinutes = Math.ceil((wordCount / 130) * 10) / 10;

  return {
    characterCount,
    characterCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}
