'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/lib/auth/schemas';
import { loginUser } from '@/lib/actions/auth-action';
import { PasswordField } from '@/components/auth/password-field';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';
  const reset = searchParams.get('reset') === 'true';
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
    if (registered) toast.success('Account created! Sign in to continue.');
    if (reset) toast.success('Password updated! Sign in with your new password.');
  }, [registered, reset]);

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        /**
         * loginUser sets the accessToken cookie. If the server action calls
         * redirect() it throws NEXT_REDIRECT and we catch it below.
         * If it returns normally with { success: true } we navigate client-side.
         */
        const result = await loginUser(data);

        if (result && result.success) {
          // Perform a hard navigation to ensure cookies are sent to middleware
          // and the server-side layout is fully rebuilt.
          window.location.href = '/dashboard';
          return;
        }

        if (result && !result.success) {
          setServerError(result.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        // Next.js redirect() throws a special internal error — ignore it.
        // Navigation is already in progress, nothing else to do.
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <span className="font-semibold">Sign in failed:</span> {serverError}
        </div>
      )}

      {/* Email */}
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
            className={`auth-input-modern ${errors.email ? 'error' : ''}`}
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <span className="auth-error-modern">{errors.email.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="auth-field-modern">
        <label htmlFor="password" className="required">
          Password
        </label>
        <PasswordField
          id="password"
          placeholder="Enter your password"
          registration={register('password')}
          error={!!errors.password}
          autoComplete="current-password"
        />
        {errors.password && (
          <span className="auth-error-modern">{errors.password.message}</span>
        )}
      </div>

      {/* Row: remember + forgot */}
      <div className="auth-row-modern">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
            defaultChecked
          />
          Remember me
        </label>
        <Link href="/forget-password" className="font-medium text-brand hover:text-brand-hover">
          Forgot password?
        </Link>
      </div>

      {/* Social login */}
      <div className="auth-social">
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => toast.info('Google sign-in coming soon!')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.34-.97 2.46-1.94 3.18v2.67h3.1c1.84-1.69 2.92-4.16 2.92-6.86z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => toast.info('Apple sign-in coming soon!')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </button>
      </div>

      {/* Divider */}
      <div className="auth-divider">
        <span>Or continue with email</span>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="auth-submit-modern"
        isLoading={isPending}
      >
        Sign in
      </Button>
    </form>
  );
}