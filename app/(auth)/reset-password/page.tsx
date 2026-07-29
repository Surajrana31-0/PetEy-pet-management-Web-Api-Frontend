import { Suspense } from 'react';
import Link from 'next/link';
import PasswordResetForm from '../_components/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the reset token from your email and choose a new password.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <PasswordResetForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-hover transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
