export type ChallengeType = 
  | 'pattern'
  | 'grid'
  | 'color'
  | 'emoji'
  | 'question';

export interface Challenge {
  id: ChallengeType;
  name: string;
  description: string;
  icon: string;
  required?: boolean;
}

export interface PatternConfig {
  gridSize?: 4 | 6;
  pattern?: number[];
  requiredLength?: number;
}

export interface GridConfig {
  selectedCells?: number[];
  orderMatters?: boolean;
  requiredCount?: number;
}

export interface ColorConfig {
  colorCount?: 4 | 5;
  sequence?: string[];
  requiredLength?: number;
}

export interface EmojiConfig {
  selectedEmoji?: string;
  emojiSet?: string[];
}

export interface QuestionConfig {
  question?: string;
  answer?: string;
}

export interface UserChallenges {
  pattern?: PatternConfig;
  grid?: GridConfig;
  color?: ColorConfig;
  emoji?: EmojiConfig;
  question?: QuestionConfig;
}

export interface RegistrationData {
  username: string;
  selectedChallenges: ChallengeType[];
  challengeConfigs: UserChallenges;
}

export interface VerifyAttempts {
  pattern?: number[];
  grid?: { selectedCells: number[]; orderMatters?: boolean } | number[];
  color?: string[];
  emoji?: string;
  question?: { answer: string } | string;
}

export type AuthStep = 
  | 'username'
  | 'select-challenges'
  | 'configure-challenges'
  | 'complete';

export type LoginStep =
  | 'username'
  | 'load-challenges'
  | 'solve-challenges'
  | 'success';
