'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { petsApi } from '@/lib/api/pets';
import type { CreatePetInput, UpdatePetInput, PetStatus, PetSpecies } from '@/lib/types';

export interface PetActionResponse {
  success: boolean;
  message?: string;
}

export async function createPetAction(formData: FormData): Promise<PetActionResponse> {
  const name = formData.get('name')?.toString().trim();
  const age = formData.get('age')?.toString().trim();
  const breed = formData.get('breed')?.toString().trim();
  const species = formData.get('species')?.toString() as PetSpecies | undefined;
  const description = formData.get('description')?.toString().trim();
  const emoji = formData.get('emoji')?.toString().trim() || undefined;
  const status = (formData.get('status')?.toString() as PetStatus) || 'AVAILABLE';

  if (!name || !age || !breed || !species || !description) {
    return { success: false, message: 'All required fields must be filled.' };
  }
  if (description.length < 10) {
    return { success: false, message: 'Description must be at least 10 characters.' };
  }

  const body: CreatePetInput = { name, age: Number(age), breed, species, description, emoji, status };
  const res = await petsApi.create(body as unknown as Record<string, unknown>);
  if (res.error) return { success: false, message: res.error };

  revalidatePath('/dashboard/admin/pets');
  redirect('/dashboard/admin/pets');
}

export async function updatePetAction(id: string, formData: FormData): Promise<PetActionResponse> {
  if (!id) return { success: false, message: 'Pet ID is missing.' };

  const name = formData.get('name')?.toString().trim();
  const age = formData.get('age')?.toString().trim();
  const breed = formData.get('breed')?.toString().trim();
  const species = formData.get('species')?.toString() as PetSpecies | undefined;
  const description = formData.get('description')?.toString().trim();
  const emoji = formData.get('emoji')?.toString().trim() || undefined;
  const status = (formData.get('status')?.toString() as PetStatus) || undefined;

  const body: UpdatePetInput = {};
  if (name) body.name = name;
  if (age) body.age = Number(age);
  if (breed) body.breed = breed;
  if (species) body.species = species;
  if (description) body.description = description;
  if (emoji) body.emoji = emoji;
  if (status) body.status = status;

  const res = await petsApi.update(id, body as unknown as Record<string, unknown>);
  if (res.error) return { success: false, message: res.error };

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
