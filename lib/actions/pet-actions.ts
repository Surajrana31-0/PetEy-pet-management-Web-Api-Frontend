'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { petsApi } from '@/lib/api/pets';
import type { CreatePetInput, UpdatePetInput, PetStatus, PetSpecies } from '@/lib/types';

export interface PetFormState {
  error: string | null;
  success: boolean;
}

export async function createPetAction(
  _prev: PetFormState,
  formData: FormData
): Promise<PetFormState> {
  const name = formData.get('name')?.toString().trim();
  const age = formData.get('age')?.toString().trim();
  const breed = formData.get('breed')?.toString().trim();
  const species = formData.get('species')?.toString() as PetSpecies | undefined;
  const description = formData.get('description')?.toString().trim();
  const emoji = formData.get('emoji')?.toString().trim() || undefined;
  const status = (formData.get('status')?.toString() as PetStatus) || 'AVAILABLE';

  if (!name || !age || !breed || !species || !description) {
    return { error: 'All required fields must be filled.', success: false };
  }
  if (description.length < 10) {
    return { error: 'Description must be at least 10 characters.', success: false };
  }

  const body: CreatePetInput = { name, age, breed, species, description, emoji, status };
  const res = await petsApi.create(body);
  if (res.error) return { error: res.error, success: false };

  revalidatePath('/dashboard/admin/pets');
  redirect('/dashboard/admin/pets');
}

export async function updatePetAction(
  _prev: PetFormState,
  formData: FormData
): Promise<PetFormState> {
  const id = formData.get('id')?.toString();
  if (!id) return { error: 'Pet ID is missing.', success: false };

  const name = formData.get('name')?.toString().trim();
  const age = formData.get('age')?.toString().trim();
  const breed = formData.get('breed')?.toString().trim();
  const species = formData.get('species')?.toString() as PetSpecies | undefined;
  const description = formData.get('description')?.toString().trim();
  const emoji = formData.get('emoji')?.toString().trim() || undefined;
  const status = (formData.get('status')?.toString() as PetStatus) || undefined;

  const body: UpdatePetInput = {};
  if (name) body.name = name;
  if (age) body.age = age;
  if (breed) body.breed = breed;
  if (species) body.species = species;
  if (description) body.description = description;
  if (emoji) body.emoji = emoji;
  if (status) body.status = status;

  const res = await petsApi.update(id, body);
  if (res.error) return { error: res.error, success: false };

  revalidatePath('/dashboard/admin/pets');
  revalidatePath(`/pets/${id}`);
  redirect('/dashboard/admin/pets');
}

export async function deletePetAction(formData: FormData): Promise<void> {
  const id = formData.get('id')?.toString();
  if (!id) return;
  await petsApi.delete(id);
  revalidatePath('/dashboard/admin/pets');
  redirect('/dashboard/admin/pets');
}
