'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Alert } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { PasswordField } from '@/components/auth/password-field';
import { handleUpdatePassword } from '@/lib/actions/auth-action';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/auth/schemas';
import { cn } from '@/lib/utils/cn';

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setServerError(null);

    startTransition(async () => {
      const result = await handleUpdatePassword(data);

      if (!result.success) {
        setServerError(result.message || 'Failed to update password.');
        toast.error(result.message || 'Failed to update password.');
        return;
      }

      reset();
      toast.success(result.message || 'Password updated successfully.');
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Use a strong password with at least 8 characters, including uppercase, lowercase,
          a number, and a special character.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-5">
          {serverError && (
            <Alert variant="destructive" title="Password update failed">
              {serverError}
            </Alert>
          )}

          <FormField
            label="Current password"
            htmlFor="currentPassword"
            required
            error={errors.currentPassword?.message}
          >
            <PasswordField
              id="currentPassword"
              placeholder="Enter your current password"
              registration={register('currentPassword')}
              error={!!errors.currentPassword}
              autoComplete="current-password"
            />
          </FormField>

          <FormField
            label="New password"
            htmlFor="newPassword"
            required
            error={errors.newPassword?.message}
          >
            <PasswordField
              id="newPassword"
              placeholder="Create a new password"
              registration={register('newPassword')}
              error={!!errors.newPassword}
              autoComplete="new-password"
            />
          </FormField>

          <FormField
            label="Confirm new password"
            htmlFor="confirmPassword"
            required
            error={errors.confirmPassword?.message}
          >
            <PasswordField
              id="confirmPassword"
              placeholder="Re-enter your new password"
              registration={register('confirmPassword')}
              error={!!errors.confirmPassword}
              autoComplete="new-password"
            />
          </FormField>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button type="submit" variant="brand" isLoading={isPending}>
            Update password
          </Button>
          <Link
            href="/dashboard/profile"
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}
          >
            Back to profile
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
