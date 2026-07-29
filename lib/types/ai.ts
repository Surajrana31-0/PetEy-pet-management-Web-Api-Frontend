import type { IAiPetMatch } from './pet';

export interface IAiMatchPreferences {
  lifestyle?: string;
  housingType?: string;
  hasChildren?: boolean;
  hasOtherPets?: boolean;
  activityLevel?: string;
  preferredSpecies?: string;
  preferences?: string;
  [key: string]: unknown;
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
