'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
// import { loginAction } from '@/lib/actions/auth-action';
import PasswordInput from '../../_components/PasswordInput';
import { loginSchema, type LoginInput } from '../../_components/schema';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LoginFormData } from './schemas';
import { loginUser } from '@/lib/actions/auth-action';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || undefined;
  const [serverError, setServerError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');




  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) =>{
    //isPending is true during transition
    //and false after it finsh
    setServerError(null);
    setError("");
    startTransition(
      async ()=>{
        try {
                    const result = await loginUser(data);
                    if(result.success){
                        await checkAuth();
                        router.push("/dashboard");
                    }else{
                        setError(result.message || 'Login failed. Please try again');
                    }
                } catch (error: any) {
                    setError(error?.message || 'Login failed. Please try again');
                }
      }
    )

  };

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
