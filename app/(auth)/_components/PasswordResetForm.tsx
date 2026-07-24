'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema, type ResetPasswordData } from '@/lib/auth/schemas';
import { handleResetPassword } from '@/lib/actions/auth-action';
import { PasswordField } from '@/components/auth/password-field';

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-destructive">
          <AlertCircle className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Invalid reset link</h2>
        <p className="text-sm text-muted">
          This password reset link is missing or expired. Request a new one.
        </p>
        <Link href="/forget-password">
          <Button variant="primary" className="w-full">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const response = await handleResetPassword(token, data.password);

        if (!response.success) {
          setServerError(response.message || 'Failed to reset password.');
          toast.error(response.message || 'Failed to reset password.');
          return;
        }

        setIsSuccess(true);
        toast.success(response.message || 'Password reset successfully!');

        setTimeout(() => {
          router.replace('/login?reset=true');
        }, 1500);
      } catch {
        setServerError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred.');
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Password updated</h2>
        <p className="text-sm text-muted">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      {serverError && (
        <Alert variant="destructive" title="Reset failed" className="mb-4">
          {serverError}
        </Alert>
      )}

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          New password
        </label>
        <PasswordField
          id="password"
          placeholder="Enter new password"
          registration={register('password')}
          error={!!errors.password}
          autoComplete="new-password"
        />
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
          Confirm new password
        </label>
        <PasswordField
          id="confirmPassword"
          placeholder="Re-enter new password"
          registration={register('confirmPassword')}
          error={!!errors.confirmPassword}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <span className="auth-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <Button type="submit" variant="brand" size="lg" className="auth-submit-btn w-full rounded-full" isLoading={isPending}>
        Reset password
      </Button>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to sign in
        </Link>
        <Link href="/forget-password" className="font-medium text-brand hover:text-brand-hover">
          Request another email
        </Link>
      </div>
    </form>
  );
}
