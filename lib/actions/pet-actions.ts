'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createPet as createPetApi,
  updatePet as updatePetApi,
  deletePet as deletePetApi,
} from '@/lib/api/admin/pets';
import type { PetStatus, PetSpecies } from '@/lib/types';

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

  if (!name || !age || !breed || !species || !description) {
    return { success: false, message: 'All required fields must be filled.' };
  }
  if (description.length < 10) {
    return { success: false, message: 'Description must be at least 10 characters.' };
  }

  try {
    const res = await createPetApi(formData);
    if (!res.success) {
      return { success: false, message: res.message || 'Failed to create pet.' };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create pet.',
    };
  }

  revalidatePath('/dashboard/admin/pets');
  redirect('/dashboard/admin/pets');
}

export async function updatePetAction(id: string, formData: FormData): Promise<PetActionResponse> {
  if (!id) return { success: false, message: 'Pet ID is missing.' };

  try {
    const res = await updatePetApi(id, formData);
    if (!res.success) {
      return { success: false, message: res.message || 'Failed to update pet.' };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update pet.',
    };
  }

  revalidatePath('/dashboard/admin/pets');
  revalidatePath(`/pets/${id}`);
  redirect('/dashboard/admin/pets');
}

export async function deletePetAction(formData: FormData): Promise<PetActionResponse> {
  const id = formData.get('id')?.toString();
  if (!id) return { success: false, message: 'Pet ID is missing.' };

  try {
    await deletePetApi(id);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete pet.',
    };
  }

  revalidatePath('/dashboard/admin/pets');
  redirect('/dashboard/admin/pets');
}

export async function updatePetStatusAction(id: string, status: PetStatus | string): Promise<PetActionResponse> {
  if (!id) return { success: false, message: 'Pet ID is missing.' };

  try {
    const { updatePetStatus } = await import('@/lib/api/admin/pets');
    const res = await updatePetStatus(id, status);
    if (!res.success) {
      return { success: false, message: res.message || 'Failed to update pet status.' };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update pet status.',
    };
  }

  revalidatePath('/dashboard/admin/pets');
  return { success: true };
}
