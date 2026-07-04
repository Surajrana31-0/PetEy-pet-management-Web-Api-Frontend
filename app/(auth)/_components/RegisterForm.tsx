'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import PasswordInput from '../../_components/PasswordInput';
import {
  RegisterFormData,
  registerSchema,
} from '@/app/(auth)/_components/schemas';
import { registerUser } from '@/lib/actions/auth-action';

export default function RegisterForm() {
  const router = useRouter();

  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setMessage('');
    setMessageType('');

    if (!agreed) {
      setMessage('You must agree to the Terms and Privacy Policy.');
      setMessageType('error');
      return;
    }

    try {
      const result = await registerUser(data);

      if (!result.success) {
        setMessage(result.message || 'Registration failed. Please try again.');
        setMessageType('error');
        return;
      }

      setMessage(result.message || 'Account created successfully.');
      setMessageType('success');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
      setMessageType('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {message && (
        <div
          className={`auth-alert ${
            messageType === 'success'
              ? 'auth-alert--success'
              : 'auth-alert--error'
          }`}
        >
          {message}
        </div>
      )}

      {/* Full Name */}
      <div className="auth-field">
        <label htmlFor="fullName" className="auth-label">
          Full Name
        </label>

        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>
            👤
          </span>

          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            className="auth-field-input"
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </div>

        {errors.fullName && (
          <span className="auth-error">
            {errors.fullName.message}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Email Address
        </label>

        <div className="auth-field-control">
          <span className="auth-field-icon" aria-hidden>
            🐾
          </span>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="auth-field-input"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>

        {errors.email && (
          <span className="auth-error">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Password
        </label>

        <PasswordInput
          id="password"
          placeholder="Create a strong password"
          registration={register('password')}
        />

        {errors.password && (
          <span className="auth-error">
            {errors.password.message}
          </span>
        )}

        <p className="auth-hint">
          Minimum 8 characters with uppercase, lowercase,
          number and special character.
        </p>
      </div>

      {/* Confirm Password */}
      <div className="auth-field">
        <label htmlFor="confirmPassword" className="auth-label">
          Confirm Password
        </label>

        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter your password"
          registration={register('confirmPassword')}
        />

        {errors.confirmPassword && (
          <span className="auth-error">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      {/* Terms */}
      <label className="auth-checkbox-label auth-row--top">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="auth-native-checkbox"
        />

        <span className="auth-checkbox-text">
          I agree to the Terms and Privacy Policy
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="auth-submit-btn"
        disabled={isSubmitting || !agreed}
      >
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