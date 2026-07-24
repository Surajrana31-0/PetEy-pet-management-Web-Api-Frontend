import type { IBackendResponse } from '../types/auth';
import type { IAiMatchPreferences, IAiMatchResult } from '../types/ai';
import type { IAiPetMatch } from '../types/pet';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

function normalizeMatches(data: unknown): IAiPetMatch[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as IAiPetMatch[];
  if (typeof data === 'object' && data !== null && 'matches' in data) {
    const matches = (data as { matches: unknown }).matches;
    return Array.isArray(matches) ? (matches as IAiPetMatch[]) : [];
  }
  return [];
}

export const aiApi = {
  match: async (preferences: IAiMatchPreferences): Promise<IBackendResponse<IAiMatchResult>> => {
    const response = await axiosInstance.post<IBackendResponse<IAiMatchResult | { matches: IAiPetMatch[] }>>(
      ENDPOINTS.AI.MATCH,
      preferences,
    );
    const raw = response.data.data;
    return {
      ...response.data,
      data: normalizeMatches(raw),
    };
  },
};
