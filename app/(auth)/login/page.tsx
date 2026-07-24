import { Suspense } from 'react';
import LoginForm from '@/app/(auth)/_components/LoginForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';
import { Spinner } from '@/components/ui/spinner';

function LoginFormFallback() {
  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <Spinner size="lg" label="Loading sign in form" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your PetEy account to continue your pet adoption journey."
      footer={
        <AuthSwitchLink prompt="Don't have an account?" href="/register" linkText="Sign up for free" />
      }
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
