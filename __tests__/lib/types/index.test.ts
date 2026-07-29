import { UserRole } from '@/lib/types';
import type { Pet, PetSpecies, PetStatus, JWTPayload } from '@/lib/types';

describe('Re-exports from types/index', () => {
  it('should re-export UserRole enum', () => {
    expect(UserRole.USER).toBe('USER');
    expect(UserRole.ADMIN).toBe('ADMIN');
  });

  it('should define PetSpecies as DOG or CAT', () => {
    const dog: PetSpecies = 'DOG';
    const cat: PetSpecies = 'CAT';
    expect(dog).toBe('DOG');
    expect(cat).toBe('CAT');
  });

  it('should define PetStatus as AVAILABLE, PENDING, or ADOPTED', () => {
    const statuses: PetStatus[] = ['AVAILABLE', 'PENDING', 'ADOPTED'];
    expect(statuses).toHaveLength(3);
  });

  it('should define a Pet interface with required fields', () => {
    const pet: Pet = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Buddy',
      age: 3,
      breed: 'Labrador',
      species: 'DOG',
      description: 'A friendly dog',
      status: 'AVAILABLE',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    expect(pet.name).toBe('Buddy');
    expect(pet.species).toBe('DOG');
    expect(pet.status).toBe('AVAILABLE');
  });

  it('should define JWTPayload with id, email, and role', () => {
    const payload: JWTPayload = {
      id: 'user123',
      email: 'user@example.com',
      role: UserRole.USER,
    };
    expect(payload.id).toBe('user123');
    expect(payload.role).toBe(UserRole.USER);
  });

  it('should define NotificationType union', () => {
    const types = [
      'adoption_submitted',
      'adoption_approved',
      'adoption_rejected',
      'adoption_completed',
      'blog_published',
      'system',
    ];
    expect(types).toContain('adoption_submitted');
    expect(types).toContain('system');
  });
});
