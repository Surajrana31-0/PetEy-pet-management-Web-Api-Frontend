'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/lib/auth/schemas';
import { getPostLoginPath } from '@/lib/auth/redirect';
import { loginUser } from '@/lib/actions/auth-action';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PasswordField } from '@/components/auth/password-field';
import type { IUser } from '@/lib/types/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const registered = searchParams.get('registered') === 'true';
  const reset = searchParams.get('reset') === 'true';
  const { checkAuth } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (registered) {
      toast.success('Account created! Sign in to continue.');
    }
    if (reset) {
      toast.success('Password updated! Sign in with your new password.');
    }
  }, [registered, reset]);

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await loginUser(data);

        if (!result.success || !result.data?.user) {
          setServerError(result.message || 'Login failed. Please try again.');
          return;
        }

        await checkAuth();
        toast.success('Welcome back!');

        const user = result.data.user as IUser;
        router.push(getPostLoginPath(user, redirectTo));
        router.refresh();
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : 'Login failed. Please try again.',
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      {serverError && (
        <Alert variant="destructive" title="Sign in failed" className="mb-4">
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
            className="auth-field-input"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <PasswordField
          id="password"
          placeholder="Enter your password"
          registration={register('password')}
          error={!!errors.password}
          autoComplete="current-password"
        />
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
      </div>

      <div className="auth-row">
        <Link href="/forget-password" className="auth-forgot-link">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="brand" size="lg" className="auth-submit-btn w-full rounded-full" isLoading={isPending}>
        Sign in
      </Button>
    </form>
  );
}
