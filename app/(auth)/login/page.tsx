import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from '@/app/(auth)/_components/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-top-icon">🐾</div>
      <h1 className="auth-heading">Welcome Back!</h1>
      <p className="auth-subheading">
        Sign in to your Pet-Ey account to continue your pet adoption journey.
      </p>

      <div className="auth-card">
        <Suspense fallback={<p className="text-sm text-slate-500">Loading login form...</p>}>
          <LoginForm />
        </Suspense>
        <p className="auth-switch mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-switch-link text-orange-500 font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
