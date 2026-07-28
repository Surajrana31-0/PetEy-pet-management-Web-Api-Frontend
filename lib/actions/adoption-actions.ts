'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adoptionsApi } from '@/lib/api/adoptions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8088';

export async function createAdoptionAction(payload: {
  petId: string;
  applicationData: Record<string, unknown>;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return { success: false as const, message: 'You must be logged in to adopt a pet.' };
    }

    const res = await fetch(`${API_BASE}/api/v1/adoptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const json = await res.json();
    return { success: json.success as boolean, message: json.message as string, data: json.data };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Failed to submit application',
    };
  }
}

export async function cancelAdoptionAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return { success: false as const, message: 'Unauthorized' };

    const res = await fetch(`${API_BASE}/api/v1/adoptions/${id}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const json = await res.json();
    return { success: json.success as boolean, message: json.message as string };
  } catch {
    return { success: false as const, message: 'Failed to cancel application' };
  }
}

export async function approveAdoptionAction(id: string, adminNotes?: string) {
  try {
    const result = await adoptionsApi.approve(id, adminNotes);

    if (result.success) {
      revalidatePath('/dashboard/admin/adoptions');
      revalidatePath('/dashboard/user/adoptions');
    }

    return {
      success: result.success as boolean,
      message: result.message as string,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : 'Failed to approve adoption',
    };
  }
}

export async function rejectAdoptionAction(id: string, adminNotes: string) {
  try {
    const result = await adoptionsApi.reject(id, adminNotes);

    if (result.success) {
      revalidatePath('/dashboard/admin/adoptions');
      revalidatePath('/dashboard/user/adoptions');
    }

    return {
      success: result.success as boolean,
      message: result.message as string,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : 'Failed to reject adoption',
    };
  }
}

export async function completeAdoptionAction(id: string, adminNotes?: string) {
  try {
    const result = await adoptionsApi.complete(id, adminNotes);

    if (result.success) {
      revalidatePath('/dashboard/admin/adoptions');
      revalidatePath('/dashboard/user/adoptions');
    }

    return {
      success: result.success as boolean,
      message: result.message as string,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : 'Failed to complete adoption',
    };
  }
}