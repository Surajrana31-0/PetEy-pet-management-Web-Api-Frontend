import type { IAiPetMatch } from './pet';

export interface IAiMatchPreferences {
  lifestyle: string;
  housingType: string;
  hasChildren: boolean;
  hasOtherPets: boolean;
  activityLevel: string;
  preferences: string;
}

export type IAiMatchResult = IAiPetMatch[];

export interface IAiChatMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp?: string;
}

export interface IAiCompatibilityResult {
  score: number;
  factors: string[];
  summary: string;
}
