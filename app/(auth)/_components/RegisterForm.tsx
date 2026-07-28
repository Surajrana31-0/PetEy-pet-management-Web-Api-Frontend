'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, User, UserCheck } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormData } from '@/lib/auth/schemas';
import { registerUser } from '@/lib/actions/auth-action';
import { PasswordField } from '@/components/auth/password-field';

export default function RegisterForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);

    if (!agreed) {
      setServerError('You must agree to the Terms and Privacy Policy.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerUser(data);

        if (!result.success) {
          setServerError(result.message || 'Registration failed. Please try again.');
          return;
        }

        toast.success(result.message || 'Account created successfully!');
        router.push('/login?registered=true');
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
      {serverError && (
        <Alert variant="destructive" title="Registration failed" className="mb-4">
          {serverError}
        </Alert>
      )}

      {/* Full Name */}
      <div className="auth-field-modern">
        <label htmlFor="fullName" className="required">
          Full name
        </label>
        <div className="auth-input-wrapper">
          <span className="auth-input-icon-modern" aria-hidden>
            <User className="h-4 w-4" />
          </span>
          <input
            id="fullName"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className={`auth-input-modern ${errors.fullName ? 'error' : ''}`}
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <span className="auth-error-modern">{errors.fullName.message}</span>
        )}
      </div>

      {/* Username */}
      <div className="auth-field-modern">
        <label htmlFor="username" className="required">
          Username
        </label>
        <div className="auth-input-wrapper">
          <span className="auth-input-icon-modern" aria-hidden>
            <UserCheck className="h-4 w-4" />
          </span>
          <input
            id="username"
            type="text"
            placeholder="your.username"
            autoComplete="username"
            className={`auth-input-modern ${errors.username ? 'error' : ''}`}
            aria-invalid={!!errors.username}
            {...register('username')}
          />
        </div>
        {errors.username && (
          <span className="auth-error-modern">{errors.username.message}</span>
        )}
        <p className="auth-hint-modern">
          Letters, numbers, dots, hyphens, and underscores only.
        </p>
      </div>

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

      {/* Password */}
      <div className="auth-field-modern">
        <label htmlFor="password" className="required">
          Password
        </label>
        <PasswordField
          id="password"
          placeholder="Create a strong password"
          registration={register('password')}
          error={!!errors.password}
          autoComplete="new-password"
          showStrength
          passwordValue={passwordValue}
        />
        {errors.password && (
          <span className="auth-error-modern">{errors.password.message}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="auth-field-modern">
        <label htmlFor="confirmPassword" className="required">
          Confirm password
        </label>
        <PasswordField
          id="confirmPassword"
          placeholder="Re-enter your password"
          registration={register('confirmPassword')}
          error={!!errors.confirmPassword}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <span className="auth-error-modern">{errors.confirmPassword.message}</span>
        )}
      </div>

      {/* Terms */}
      <label className="auth-row-modern">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
          />
          <span className="text-sm text-muted">
            I agree to the{' '}
            <a href="/terms" className="text-brand hover:text-brand-hover">
              Terms and Privacy Policy
            </a>
          </span>
        </div>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="auth-submit-modern"
        isLoading={isPending}
        disabled={!agreed}
      >
        Create account
      </Button>
    </form>
  );
}
