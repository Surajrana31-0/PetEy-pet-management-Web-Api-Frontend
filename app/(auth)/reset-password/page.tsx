import { Suspense } from 'react';
import PasswordResetForm from '../_components/PasswordResetForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      description="Enter the reset token from your email and choose a new password."
      footer={
        <AuthSwitchLink prompt="Remember your password?" href="/login" linkText="Back to sign in" />
      }
    >
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <PasswordResetForm />
      </Suspense>
    </AuthShell>
  );
}
