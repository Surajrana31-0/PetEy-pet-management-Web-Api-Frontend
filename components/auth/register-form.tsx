'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { registerSchema, type RegisterValues } from '@/lib/schemas/auth-schema';
import { registerUser } from '@/lib/actions/auth-action';

const PASSWORD_RULES = [
  { test: (v: string) => v.length >= 8, label: '8+ characters' },
  { test: (v: string) => /[A-Z]/.test(v), label: 'Uppercase letter' },
  { test: (v: string) => /[a-z]/.test(v), label: 'Lowercase letter' },
  { test: (v: string) => /[0-9]/.test(v), label: 'Number' },
  { test: (v: string) => /[@$!%*?&]/.test(v), label: 'Special char' },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterValues) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await registerUser({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: data.password,
        });

        if (result && result.success) {
          toast.success('Account created! Redirecting to sign in…');
          router.push('/login?registered=1');
          return;
        }

        if (result && !result.success) {
          setServerError(result.message || 'Registration failed. Please try again.');
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
          error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate method="post">
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          <span className="font-semibold">Registration failed:</span>
          <span className="text-red-800">{serverError}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          {...register('fullName')}
        />
        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="your.username"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="username"
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username ? (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        ) : (
          <p className="text-xs text-gray-500">Letters, numbers, dots, hyphens, and underscores only.</p>
        )}
      </div>

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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password', {
            onChange: (e) => setPassword(e.target.value),
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="mt-1 text-xs text-gray-500 hover:text-orange-600"
        >
          {showPassword ? 'Hide password' : 'Show password'}
        </button>

        {password && (
          <div className="flex flex-wrap gap-2 pt-1">
            {PASSWORD_RULES.map((rule) => {
              const passed = rule.test(password);
              return (
                <span
                  key={rule.label}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    passed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`
                >
                  {passed && '✓ '}
                  {rule.label}
                </span>
              );
            })}
          </div>
        )}
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter your password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="mt-1 text-xs text-gray-500 hover:text-orange-600"
        >
          {showConfirm ? 'Hide password' : 'Show password'}
        </button>
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
