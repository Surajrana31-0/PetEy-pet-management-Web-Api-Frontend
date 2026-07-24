'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
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
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Check your inbox</h2>
        <p className="text-sm text-muted leading-relaxed">
          If an account exists for{' '}
          <span className="font-medium text-foreground">{getValues('email')}</span>, we sent a
          password reset link.
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      {serverError && (
        <Alert variant="destructive" title="Request failed" className="mb-4">
          {serverError}
        </Alert>
      )}

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Email address
        </label>
        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>
            <Mail className="h-4 w-4 text-muted" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="auth-field-input"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
      </div>

      <Button type="submit" variant="brand" size="lg" className="auth-submit-btn w-full rounded-full" isLoading={isPending}>
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
