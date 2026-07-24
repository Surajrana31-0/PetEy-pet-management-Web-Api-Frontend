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
