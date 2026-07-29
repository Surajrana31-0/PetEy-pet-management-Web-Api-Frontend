import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { IAiMatchResult } from '../types/ai';
import type { IAiPetMatch } from '../types/pet';

export async function matchPets(): Promise<IApiResponse<IAiMatchResult>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AI.MATCH);
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

export async function analyzeCompatibility(petId: string): Promise<IApiResponse<Record<string, unknown>>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.ANALYZE_COMPATIBILITY, { petId });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Compatibility analysis failed');
  }
}

export async function sendChat(
  message: string,
  sessionId: string,
): Promise<IApiResponse<{ message: string; sessionId: string }>> {
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
  name: string;
  species: 'DOG' | 'CAT';
  breed: string;
  age: number;
  description: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  temperament: string[];
  goodWithKids: boolean;
  goodWithPets: boolean;
  vaccinated: boolean;
  neutered: boolean;
  healthStatus: string;
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
