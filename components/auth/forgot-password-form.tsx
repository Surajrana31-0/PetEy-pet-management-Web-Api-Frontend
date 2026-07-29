'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/schemas/auth-schema';
import { handleRequestPasswordReset } from '@/lib/actions/auth-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setPending(true);
    setServerError(null);

    try {
      const result = await handleRequestPasswordReset(data.email);
      if (!result.success) {
        setServerError(result.message || 'Failed to send reset link.');
        setPending(false);
        return;
      }
      setSentEmail(data.email);
      setIsSuccess(true);
      toast.success(result.message || 'Password reset link sent to your email.');
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Failed to request password reset.',
      );
      setPending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            If an account exists for{' '}
            <span className="font-medium text-foreground">{sentEmail}</span>, we've sent a
            password reset link.
          </p>
        </div>
        <Button asChild className="w-full gradient-warm text-white">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in-down">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">Request failed</span>
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

      <Button type="submit" disabled={pending} className="w-full gradient-warm text-white">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          'Send reset link'
        )}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </form>
  );
}
