'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleVerifyEmail } from '@/lib/actions/auth-action';

interface VerifyEmailFormProps {
  token?: string;
}

export default function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div className="auth-error-state-modern">
        <div className="auth-error-state-modern__icon">
          <AlertCircle />
        </div>
        <h2 className="auth-success-modern__title">Invalid verification link</h2>
        <p className="auth-success-modern__message">
          This email verification link is missing or expired. Please check your
          inbox or request a new one.
        </p>
        <div className="mt-6 space-y-3">
          <Link href="/login" className="block">
            <Button variant="brand" className="auth-submit-modern">
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleVerify = () => {
    setServerError(null);

    startTransition(async () => {
      try {
        const response = await handleVerifyEmail(token);

        if (!response.success) {
          setServerError(response.message || 'Email verification failed.');
          toast.error(response.message || 'Email verification failed.');
          return;
        }

        setIsSuccess(true);
        toast.success(response.message || 'Email verified successfully!');

        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Email verification failed.';
        setServerError(message);
        toast.error(message);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="auth-success-modern">
        <div className="auth-success-modern__icon">
          <CheckCircle2 />
        </div>
        <h2 className="auth-success-modern__title">Email verified!</h2>
        <p className="auth-success-modern__message">
          Your email has been verified. Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <span className="font-semibold">Verification failed:</span> {serverError}
        </div>
      )}

      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Mail className="h-8 w-8" />
        </div>
        <p className="text-sm text-muted">
          Click the button below to verify your email address and activate your
          account.
        </p>
      </div>

      <Button
        type="button"
        variant="brand"
        size="lg"
        className="auth-submit-modern"
        isLoading={isPending}
        onClick={handleVerify}
      >
        Verify email address
      </Button>

      <Link
        href="/login"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to sign in
      </Link>
    </div>
  );
}
