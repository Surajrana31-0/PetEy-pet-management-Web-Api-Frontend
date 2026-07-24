'use server';

import { aiApi } from '../api/ai';
import type { IAiMatchPreferences } from '../types/ai';
import type { IAiPetMatch } from '../types/pet';

export async function aiMatchAction(
  preferences: IAiMatchPreferences,
): Promise<{ success: boolean; matches: IAiPetMatch[]; message?: string }> {
  try {
    const result = await aiApi.match(preferences);
    return {
      success: result.success,
      matches: result.data ?? [],
      message: result.message,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI matching failed';
    return { success: false, matches: [], message };
  }
}
