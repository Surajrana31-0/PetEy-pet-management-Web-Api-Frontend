'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { loginSchema, type LoginValues } from '@/lib/schemas/auth-schema';
import { loginUser } from '@/lib/actions/auth-action';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTarget = params.get('redirect') || '';
  const registered = params.get('registered') === '1';
  const reset = params.get('reset') === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (registered) toast.success('Account created! Please sign in.');
    if (reset) toast.success('Password updated! Sign in with your new password.');
  }, [registered, reset]);

  const onSubmit = (data: LoginValues) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await loginUser({
          email: data.email,
          password: data.password,
        });

        if (result && result.success) {
          const target =
            redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
              ? redirectTarget
              : '/dashboard';
          window.location.href = target;
          return;
        }

        if (result && !result.success) {
          setServerError(result.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'digest' in error &&
          typeof (error as { digest: unknown }).digest === 'string' &&
          (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
        ) {
          return;
        }
        setServerError(
          error instanceof Error ? error.message : 'Login failed. Please try again.',
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate method="post">
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          <span className="font-semibold">Sign in failed:</span>
          <span className="text-red-800">{serverError}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-gray-500 hover:text-orange-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
