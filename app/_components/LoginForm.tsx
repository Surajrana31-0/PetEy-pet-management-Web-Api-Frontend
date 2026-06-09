'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginAction } from '@/lib/actions/auth-action';
import PasswordInput from './PasswordInput';
import { loginSchema, type LoginInput } from './schema';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || undefined;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);

    const result = await loginAction(
      { email: data.email, password: data.password },
      redirectTo,
    );

    if (!result.success) {
      setServerError(result.error || 'Login failed. Please try again.');
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <div className="auth-alert auth-alert--error">{serverError}</div>}

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">Email Address</label>
        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>🐾</span>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="auth-field-input"
            autoComplete="email"
            {...register('email')}
          />
        </div>
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">Password</label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          registration={register('password')}
        />
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
      </div>

      <div className="auth-row">
        <Link href="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="auth-spinner" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}
