'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginValues } from '@/lib/schemas/auth-schema';
import { loginAction, type AuthFormState } from '@/lib/actions/auth-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTarget = params.get('redirect') || '';
  const registered = params.get('registered') === '1';
  const reset = params.get('reset') === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  const onSubmit = async (data: LoginValues) => {
    setPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);
    if (redirectTarget) formData.set('redirect', redirectTarget);

    try {
      const result: AuthFormState = await loginAction({ error: null, success: false }, formData);
      if (!result.success) {
        setServerError(result.error || 'Login failed. Please try again.');
        setPending(false);
        return;
      }
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        router.push('/dashboard');
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
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in-down">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">Sign in failed</span>
            <p className="mt-0.5 text-destructive/80">{serverError}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={pending} className="w-full gradient-warm text-white">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}
