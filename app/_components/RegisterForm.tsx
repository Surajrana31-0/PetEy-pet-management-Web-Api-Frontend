'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerAction } from '@/lib/actions/auth-action';
import PasswordInput from './PasswordInput';
import { registerSchema, type RegisterInput } from './schema';

export default function RegisterForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterInput) {
    if (!agreed) {
      setServerError('You must agree to the Terms and Privacy Policy.');
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    const result = await registerAction({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setServerError(result.error || 'Registration failed. Please try again.');
      return;
    }

    setSuccessMessage(result.message || 'Account created successfully.');
    router.push('/login');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <div className="auth-alert auth-alert--error">{serverError}</div>}
      {successMessage && <div className="auth-alert auth-alert--success">{successMessage}</div>}

      <div className="auth-field">
        <label htmlFor="fullName" className="auth-label">Full Name</label>
        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>👤</span>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="auth-field-input"
            autoComplete="name"
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <span className="auth-error">{errors.fullName.message}</span>}
      </div>

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
          placeholder="Create a strong password"
          registration={register('password')}
        />
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
        <p className="auth-hint">Min 8 chars with uppercase, lowercase, number & special character.</p>
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter your password"
          registration={register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="auth-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <label className="auth-checkbox-label auth-row--top">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed((prev) => !prev)}
          className="auth-native-checkbox"
        />
        <span className="auth-checkbox-text">I agree to the Terms and Privacy Policy</span>
      </label>

      <button type="submit" className="auth-submit-btn" disabled={isSubmitting || !agreed}>
        {isSubmitting ? (
          <>
            <span className="auth-spinner" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}
