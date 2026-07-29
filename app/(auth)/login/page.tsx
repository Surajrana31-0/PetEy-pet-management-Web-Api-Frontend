import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500">
          Sign in to your PetEy account to continue your adoption journey.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
        <LoginForm />
      </Suspense>

      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            Sign up
          </Link>
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-xs text-gray-500 hover:text-orange-600 transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
