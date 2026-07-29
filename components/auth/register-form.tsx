'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, UserCheck, Loader2, AlertCircle, Check } from 'lucide-react';
import { registerSchema, type RegisterValues } from '@/lib/schemas/auth-schema';
import { registerAction, type AuthFormState } from '@/lib/actions/auth-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterValues) => {
    setPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.set('fullName', data.fullName);
    formData.set('username', data.username);
    formData.set('email', data.email);
    formData.set('password', data.password);

    try {
      const result: AuthFormState = await registerAction({ error: null, success: false }, formData);
      if (!result.success) {
        setServerError(result.error || 'Registration failed. Please try again.');
        setPending(false);
        return;
      }
      toast.success('Account created! Redirecting to sign in…');
      router.push(result.redirectTo || '/login?registered=1');
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
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in-down">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">Registration failed</span>
            <p className="mt-0.5 text-destructive/80">{serverError}</p>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            className="pl-10"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <UserCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            placeholder="your.username"
            className="pl-10"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...register('username')}
          />
        </div>
        {errors.username ? (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Letters, numbers, dots, hyphens, and underscores only.</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password', {
              onChange: (e) => setPassword(e.target.value),
            })}
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

        {password && (
          <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
            {PASSWORD_RULES.map((rule) => {
              const passed = rule.test(password);
              return (
                <span
                  key={rule.label}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    passed ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {passed && <Check className="h-3 w-3" />}
                  {rule.label}
                </span>
              );
            })}
          </div>
        )}
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter your password"
            className="pl-10 pr-10"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="w-full gradient-warm text-white shadow-soft hover:shadow-glow">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}
