'use server';

import { revalidatePath } from 'next/cache';
import { petsApi } from '../api/pets';
import { ICreatePetPayload, IUpdatePetPayload, IPetActionResponse } from '@/lib/types/pet';


export async function createPetAction(data: ICreatePetPayload) {
  try {
    const result = await petsApi.create(data);

    if (result.success) {
      revalidatePath("/dashboard/admin/pets");
      revalidatePath("/dashboard/user/browse");

      return {
        success: true,
        data: result.data,
        message: result.message || "Pet created successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Pet creation failed",
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Pet creation failed",
    };
  }
}

export async function updatePetAction(
  id: string,
  data: IUpdatePetPayload
): Promise<IPetActionResponse> {
  try {
    const result = await petsApi.update(id, data);

    if (result.success) {
      revalidatePath('/dashboard/admin/pets');
      revalidatePath(`/dashboard/admin/pets/${id}/edit`);
      revalidatePath('/dashboard/user/browse');

      return {
        success: true,
        data: result.data,
        message: result.message || 'Pet updated successfully',
      };
    }

    return {
      success: false,
      message: result.message || 'Pet update failed',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Pet update failed',
    };
  }
}

export async function deletePetAction(
  id: string
): Promise<IPetActionResponse> {
  try {
    const result = await petsApi.delete(id);

    if (result.success) {
      revalidatePath('/dashboard/admin/pets');
      revalidatePath('/dashboard/user/browse');

      return {
        success: true,
        message: result.message || 'Pet deleted successfully',
      };
    }

    return {
      success: false,
      message: result.message || 'Pet deletion failed',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Pet deletion failed',
    };
  }
}

export async function deletePetFormAction(id: string, formData: FormData): Promise<void> {
  void formData;
  await deletePetAction(id);
}