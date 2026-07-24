import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const matchPets = async (preferences: {
  lifestyle?: string;
  housingType?: string;
  hasChildren?: boolean;
  hasOtherPets?: boolean;
  activityLevel?: string;
  preferredSize?: string;
  preferredSpecies?: string;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.MATCH, preferences);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'AI match failed');
  }
};

export const getRecommendations = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AI.RECOMMENDATIONS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch recommendations');
  }
};

export const analyzeCompatibility = async (data: {
  petId: string;
  lifestyle?: string;
  [key: string]: unknown;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.ANALYZE_COMPATIBILITY, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Compatibility analysis failed');
  }
};

export const sendChat = async (message: string, sessionId?: string) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.CHAT, { message, sessionId });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Chat failed');
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AI.CHAT_HISTORY);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch chat history');
  }
};

// Admin only
export const generatePetDescription = async (data: {
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AI.GENERATE_DESCRIPTION, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Description generation failed');
  }
};

export const aiApi = {
  match: matchPets,
  recommendations: getRecommendations,
  analyzeCompatibility,
  chat: sendChat,
  chatHistory: getChatHistory,
  generateDescription: generatePetDescription,
};