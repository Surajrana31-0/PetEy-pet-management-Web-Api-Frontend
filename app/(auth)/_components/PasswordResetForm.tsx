'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
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
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || '', newPassword: '', confirmPassword: '' },
  });

  const passwordValue = watch('newPassword', '');

  if (!token) {
    return (
      <div className="auth-error-state-modern">
        <div className="auth-error-state-modern__icon">
          <AlertCircle />
        </div>
        <h2 className="auth-success-modern__title">Invalid reset link</h2>
        <p className="auth-success-modern__message">
          This password reset link is missing or expired. Request a new one.
        </p>
        <Link href="/forget-password" className="mt-6 inline-block">
          <Button variant="brand" className="auth-submit-modern">
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
        const response = await handleResetPassword(token, data.newPassword);

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
      <div className="auth-success-modern">
        <div className="auth-success-modern__icon">
          <CheckCircle2 />
        </div>
        <h2 className="auth-success-modern__title">Password updated</h2>
        <p className="auth-success-modern__message">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <span className="font-semibold">Reset failed:</span> {serverError}
        </div>
      )}

      <div className="auth-field-modern">
        <label htmlFor="password" className="required">
          New password
        </label>
        <PasswordField
          id="password"
          placeholder="Enter new password"
          registration={register('newPassword')}
          error={!!errors.newPassword}
          autoComplete="new-password"
          showStrength
          passwordValue={passwordValue}
        />
        {errors.newPassword && (
          <span className="auth-error-modern">{errors.newPassword.message}</span>
        )}
      </div>

      <div className="auth-field-modern">
        <label htmlFor="confirmPassword" className="required">
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
          <span className="auth-error-modern">{errors.confirmPassword.message}</span>
        )}
      </div>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="auth-submit-modern"
        isLoading={isPending}
      >
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
