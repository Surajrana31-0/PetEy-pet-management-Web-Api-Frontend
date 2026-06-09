'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { petsApi } from '../api/pets';
import type { ICreatePetPayload, IPetActionResponse, IUpdatePetPayload } from '../types/pet';

export async function createPetAction(data: ICreatePetPayload): Promise<IPetActionResponse> {
  try {
    const response = await petsApi.create(data);
    revalidatePath('/dashboard/admin/pets');
    revalidatePath('/dashboard/user/browse');
    return { success: true, message: response.message };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create pet.';
    return { success: false, error: message };
  }
}

export async function updatePetAction(id: string, data: IUpdatePetPayload): Promise<IPetActionResponse> {
  try {
    const response = await petsApi.update(id, data);
    revalidatePath('/dashboard/admin/pets');
    revalidatePath(`/dashboard/admin/pets/${id}/edit`);
    revalidatePath('/dashboard/user/browse');
    return { success: true, message: response.message };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update pet.';
    return { success: false, error: message };
  }
}

export async function deletePetAction(id: string): Promise<void> {
  try {
    await petsApi.delete(id);
    revalidatePath('/dashboard/admin/pets');
    revalidatePath('/dashboard/user/browse');
  } catch {
    // Surface via redirect fallback for form actions.
  }

  redirect('/dashboard/admin/pets');
}
