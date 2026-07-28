import type { Pet, UserProfile, UserPreferences, AIMatchResult, PetRecommendation } from '@/types';

interface CompatibilityResult {
  score: number;
  reasons: string[];
  concerns: string[];
}

export function analyzeCompatibility(
  pet: Pet,
  preferences: UserPreferences
): CompatibilityResult {
  let score = 50;
  const reasons: string[] = [];
  const concerns: string[] = [];

  if (preferences.petType.length > 0) {
    const speciesMatch = preferences.petType.includes(pet.species);
    if (speciesMatch) {
      score += 15;
      reasons.push(`${pet.species === 'DOG' ? 'Dog' : 'Cat'} matches your preferred pet type`);
    } else {
      score -= 10;
      concerns.push(`${pet.species === 'DOG' ? 'Dog' : 'Cat'} is not in your preferred pet types`);
    }
  }

  if (preferences.size.length > 0) {
    const sizeMatch = preferences.size.includes(pet.size);
    if (sizeMatch) {
      score += 10;
      reasons.push(`${pet.size.toLowerCase()} size fits your preference`);
    } else {
      score -= 8;
      concerns.push(`Pet size (${pet.size.toLowerCase()}) may not match your preference`);
    }
  }

  if (preferences.activityLevel) {
    const activityMap: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    const userActivity = activityMap[preferences.activityLevel] ?? 2;
    const petActivity = activityMap[pet.activity_level] ?? 2;
    const diff = Math.abs(userActivity - petActivity);
    if (diff === 0) {
      score += 12;
      reasons.push(`Activity level (${pet.activity_level.toLowerCase()}) perfectly matches your lifestyle`);
    } else if (diff === 1) {
      score += 5;
      reasons.push(`Activity level is a reasonable match for your lifestyle`);
    } else {
      score -= 8;
      concerns.push(`Pet's activity level (${pet.activity_level.toLowerCase()}) may not suit your lifestyle`);
    }
  }

  if (preferences.hasChildren) {
    if (pet.good_with_kids) {
      score += 15;
      reasons.push('Great with children');
    } else {
      score -= 15;
      concerns.push('May not be ideal for households with children');
    }
  }

  if (preferences.hasOtherPets) {
    if (pet.good_with_pets) {
      score += 12;
      reasons.push('Gets along well with other pets');
    } else {
      score -= 10;
      concerns.push('May not get along with other pets in your home');
    }
  }

  if (preferences.experience) {
    if (preferences.experience === 'BEGINNER') {
      if (pet.activity_level === 'LOW' || pet.activity_level === 'MEDIUM') {
        score += 5;
        reasons.push('Suitable for first-time pet owners');
      }
      if (pet.activity_level === 'HIGH' && pet.species === 'DOG') {
        score -= 5;
        concerns.push('High-energy pet may be challenging for beginners');
      }
    } else if (preferences.experience === 'EXPERIENCED') {
      if (pet.activity_level === 'HIGH') {
        score += 8;
        reasons.push('An experienced owner can handle this active pet');
      }
    }
  }

  if (pet.vaccinated) {
    score += 3;
    reasons.push('Fully vaccinated');
  }
  if (pet.neutered) {
    score += 3;
    reasons.push('Spayed/neutered');
  }

  score = Math.max(0, Math.min(100, score));
  if (reasons.length === 0) reasons.push('A potentially good match based on available information');
  return { score, reasons, concerns };
}

export function matchPetsForUser(pets: Pet[], preferences: UserPreferences): AIMatchResult[] {
  return pets.map((pet) => {
    const result = analyzeCompatibility(pet, preferences);
    return { petId: pet.id, matchScore: result.score, reasons: result.reasons, concerns: result.concerns };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}

export function getRecommendations(pets: Pet[], preferences: UserPreferences): PetRecommendation[] {
  return pets.map((pet) => {
    const result = analyzeCompatibility(pet, preferences);
    let recommendation = '';
    if (result.score >= 80) recommendation = 'Excellent match — this pet aligns great with your lifestyle!';n    else if (result.score >= 65) recommendation = 'Good match — this pet could be a great companion for you.';
    else if (result.score >= 50) recommendation = 'Fair match — consider your lifestyle before adopting.';
    else recommendation = 'May not be the best fit — review the concerns below.';
    return { petId: pet.id, name: pet.name, species: pet.species, breed: pet.breed, age: pet.age, image: pet.images?.[0], matchScore: result.score, recommendation, reasons: result.reasons, concerns: result.concerns };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
