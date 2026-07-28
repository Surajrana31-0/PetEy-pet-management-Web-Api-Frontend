import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { IAiMatchPreferences, IAiMatchResult } from '../types/ai';
import type { IAiPetMatch } from '../types/pet';

export async function matchPets(preferences: IAiMatchPreferences): Promise<IApiResponse<IAiMatchResult>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.MATCH, preferences);
    return response.data;
  } catch (error) {
    throwApiError(error, 'AI match failed');
  }
}

export async function getRecommendations(): Promise<IApiResponse<IAiPetMatch[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AI.RECOMMENDATIONS);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch recommendations');
  }
}

export async function analyzeCompatibility(data: {
  petId: string;
  lifestyle?: string;
  [key: string]: unknown;
}): Promise<IApiResponse<Record<string, unknown>>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.ANALYZE_COMPATIBILITY, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Compatibility analysis failed');
  }
}

export async function sendChat(message: string, sessionId?: string): Promise<IApiResponse<{ message: string; sessionId: string }>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.CHAT, { message, sessionId });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Chat failed');
  }
}

export async function getChatHistory(): Promise<IApiResponse<unknown[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AI.CHAT_HISTORY);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch chat history');
  }
}

export async function generatePetDescription(data: {
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
}): Promise<IApiResponse<{ description: string }>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.GENERATE_DESCRIPTION, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Description generation failed');
  }
}

export const aiApi = {
  match: matchPets,
  recommendations: getRecommendations,
  analyzeCompatibility,
  chat: sendChat,
  chatHistory: getChatHistory,
  generateDescription: generatePetDescription,
};
