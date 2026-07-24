'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, User } from 'lucide-react';
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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      {serverError && (
        <Alert variant="destructive" title="Registration failed" className="mb-4">
          {serverError}
        </Alert>
      )}

      <div className="auth-field">
        <label htmlFor="fullName" className="auth-label">
          Full name
        </label>
        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>
            <User className="h-4 w-4 text-muted" />
          </span>
          <input
            id="fullName"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className="auth-field-input"
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <span className="auth-error">{errors.fullName.message}</span>}
      </div>

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

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <PasswordField
          id="password"
          placeholder="Create a strong password"
          registration={register('password')}
          error={!!errors.password}
          autoComplete="new-password"
        />
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
        <p className="auth-hint">
          At least 8 characters with uppercase, lowercase, number, and special character.
        </p>
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
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
          <span className="auth-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <label className="auth-checkbox-label auth-row--top">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="auth-native-checkbox"
        />
        <span className="auth-checkbox-text">I agree to the Terms and Privacy Policy</span>
      </label>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="auth-submit-btn w-full rounded-full"
        isLoading={isPending}
        disabled={!agreed}
      >
        Create account
      </Button>
    </form>
  );
}
