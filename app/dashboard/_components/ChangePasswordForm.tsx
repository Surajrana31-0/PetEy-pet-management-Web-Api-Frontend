'use client';

import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { PasswordField } from '@/components/auth/password-field';
import { useChangePasswordForm } from '@/app/dashboard/settings/_hooks/useChangePasswordForm';
import { cn } from '@/lib/utils/cn';

export function ChangePasswordForm() {
  const { form, isPending, serverError, onSubmit } = useChangePasswordForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Use a strong password with at least 8 characters, including uppercase, lowercase,
          a number, and a special character.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
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
