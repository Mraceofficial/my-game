export type GameMode = 'home' | 'alphabet' | 'numbers' | 'number_words' | 'words' | 'sentences' | 'custom_manager' | 'settings' | 'help';

export type GameSpeed = 'super_slow' | 'very_slow' | 'slow' | 'normal' | 'fast';

export interface SpeedConfig {
  id: GameSpeed;
  label: string;
  emoji: string;
  speedMultiplier: number;
  fallDurationSeconds: number;
}

export interface NumberItem {
  id: string;
  num: number;
  word: string;
  emoji: string;
  level: number; // 1: 1-10, 2: 11-20, 3: 21-50, 4: 51-100
}

export interface WordItem {
  id: string;
  word: string;
  hint: string;
  emoji: string;
  level: number; // 1: 3-letter, 2: 4-letter, 3: 5-letter
}

export interface SentenceItem {
  id: string;
  sentence: string;
  words: string[];
  emoji: string;
  level: number; // 1: 2-3 words, 2: 4-5 words, 3: 5-6 words
}

export interface CustomWordItem {
  id: string;
  word: string;
  hint: string;
  emoji: string;
  createdAt: number;
}

export interface CustomSentenceItem {
  id: string;
  sentence: string;
  words: string[];
  emoji: string;
  createdAt: number;
}

export interface UserProgress {
  score: number;
  stars: number;
  alphabetLevel: number;
  numbersLevel: number;
  numberWordsLevel: number;
  wordsLevel: number;
  sentencesLevel: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechEnabled: boolean;
  animationsEnabled: boolean;
  speed: GameSpeed;
  questionsPerSession?: number;
}

export interface FallingItem {
  id: string;
  charOrWord: string;
  xPercent: number; // 10% to 85%
  isTarget: boolean;
}
