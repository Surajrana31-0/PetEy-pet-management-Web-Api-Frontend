import { z } from 'zod';
import { PetSpecies, PetStatus } from '@/lib/types/pet';

export const petFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  age: z.string().trim().min(1, 'Age is required'),
  breed: z.string().trim().min(2, 'Breed is required'),
  species: z.nativeEnum(PetSpecies, { message: 'Select a valid species' }),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  emoji: z.string().trim().optional(),
  status: z.nativeEnum(PetStatus).optional(),
});

export type PetFormInput = z.infer<typeof petFormSchema>;
