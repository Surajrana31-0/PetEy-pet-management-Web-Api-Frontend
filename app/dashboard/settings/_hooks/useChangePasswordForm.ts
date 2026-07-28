'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { handleUpdatePassword } from '@/lib/actions/auth-action';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/auth/schemas';

export function useChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);

    startTransition(async () => {
      const result = await handleUpdatePassword(data);

      if (!result.success) {
        const message = result.message || 'Failed to update password.';
        setServerError(message);
        toast.error(message);
        return;
      }

      form.reset();
      toast.success(result.message || 'Password updated successfully.');
    });
  });

  return {
    form,
    isPending,
    serverError,
    onSubmit,
  };
}
