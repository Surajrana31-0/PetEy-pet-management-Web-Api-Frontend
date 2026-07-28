export type PetSpecies = 'DOG' | 'CAT';
export type PetStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED';
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type PetGender = 'MALE' | 'FEMALE';
export type ActivityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji: string;
  status: PetStatus;
  size: PetSize;
  gender: PetGender;
  location: string | null;
  adoption_fee: number;
  good_with_kids: boolean;
  good_with_pets: boolean;
  vaccinated: boolean;
  neutered: boolean;
  images: string[];
  health_status: string;
  temperament: string[];
  activity_level: ActivityLevel;
  created_at: string;
  updated_at: string;
}

export type AdoptionStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface ApplicationData {
  livingSpace: 'apartment' | 'house' | 'farm';
  hasYard: boolean;
  householdMembers: number;
  hasChildren: boolean;
  childrenAges?: number[];
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'expert';
  workSchedule: string;
  reasonForAdoption: string;
  veterinarianInfo?: string;
  references?: string[];
}

export interface AdoptionApplication {
  id: string;
  user_id: string;
  pet_id: string;
  status: AdoptionStatus;
  application_data: ApplicationData;
  ai_match_score: number | null;
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  pet?: Pet;
}

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  phone_number: string | null;
  profile_image: string | null;
  address: string | null;
  location: string | null;
  role: 'USER' | 'ADMIN';
  preferences: UserPreferences;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  petType: string[];
  size: PetSize[];
  age: string | null;
  activityLevel: ActivityLevel | null;
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED' | null;
  hasChildren: boolean;
  hasOtherPets: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  pet_id: string;
  created_at: string;
  pet?: Pet;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  created_at: string;
}

export interface AIMatchResult {
  petId: string;
  matchScore: number;
  reasons: string[];
  concerns: string[];
}

export interface PetRecommendation {
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  image?: string;
  matchScore: number;
  recommendation: string;
  reasons: string[];
  concerns: string[];
}
