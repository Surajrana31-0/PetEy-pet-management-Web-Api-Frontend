'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { updateProfileAction } from '@/lib/actions/auth-action';
import { profileSchema, type ProfileFormData } from '@/lib/auth/schemas';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { IUser } from '@/lib/types/auth';

export function useProfileForm(user: IUser, imageFile: File | null = null) {
  const router = useRouter();
  const { refetch } = useAuth();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber ?? '',
      address: user.address ?? '',
      location: user.location ?? '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateProfileAction(data, imageFile);

      if (!result.success) {
        toast.error(result.message || 'Failed to update profile.');
        return;
      }

      await refetch();
      toast.success(result.message || 'Profile updated successfully.');
      router.refresh();
    });
  });

  return {
    form,
    isPending,
    onSubmit,
    user,
  };
}
