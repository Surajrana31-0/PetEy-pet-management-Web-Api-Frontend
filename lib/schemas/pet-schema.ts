import { z } from 'zod';

export const petSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  age: z.string().min(1, 'Age is required').max(30, 'Age is too long'),
  breed: z.string().min(1, 'Breed is required').max(80, 'Breed is too long'),
  species: z.enum(['DOG', 'CAT'], { errorMap: () => ({ message: 'Select a species' }) }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description is too long'),
  emoji: z.string().max(10).optional(),
  status: z.enum(['AVAILABLE', 'PENDING', 'ADOPTED']).default('AVAILABLE'),
});

export type PetFormValues = z.infer<typeof petSchema>;
