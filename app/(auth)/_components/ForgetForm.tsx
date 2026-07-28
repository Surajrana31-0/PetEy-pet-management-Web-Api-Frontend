'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  requestPasswordResetSchema,
  type RequestPasswordResetData,
} from '@/lib/auth/schemas';
import { handleRequestPasswordReset } from '@/lib/actions/auth-action';

export default function ForgetForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RequestPasswordResetData>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: RequestPasswordResetData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const response = await handleRequestPasswordReset(data.email);

        if (!response.success) {
          setServerError(response.message || 'Failed to send reset link.');
          toast.error(response.message || 'Failed to send reset link.');
          return;
        }

        setIsSuccess(true);
        toast.success(response.message || 'Password reset link sent to your email.');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to request password reset.';
        setServerError(message);
        toast.error(message);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="auth-success-modern">
        <div className="auth-success-modern__icon">
          <CheckCircle2 />
        </div>
        <h2 className="auth-success-modern__title">Check your inbox</h2>
        <p className="auth-success-modern__message">
          If an account exists for{' '}
          <span className="font-medium text-foreground">{getValues('email')}</span>, we sent a
          password reset link.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button variant="brand" className="auth-submit-modern">
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <span className="font-semibold">Request failed:</span> {serverError}
        </div>
      )}

      <div className="auth-field-modern">
        <label htmlFor="email" className="required">
          Email address
        </label>
        <div className="auth-input-wrapper">
          <span className="auth-input-icon-modern" aria-hidden>
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`auth-input-modern ${errors.email ? 'error' : ''}`}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <span className="auth-error-modern">{errors.email.message}</span>
        )}
      </div>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="auth-submit-modern"
        isLoading={isPending}
      >
        Send reset link
      </Button>

      <Link
        href="/login"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to sign in
      </Link>
    </form>
  );
}
