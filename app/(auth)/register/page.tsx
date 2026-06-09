import Link from 'next/link';
import RegisterForm from '@/app/_components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-top-icon">🐾</div>
      <h1 className="auth-heading">Create Account</h1>
      <p className="auth-subheading">
        Join Pet-Ey and start your journey to find your perfect furry companion.
      </p>

      <div className="auth-card">
        <RegisterForm />
        <p className="auth-switch mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="auth-switch-link text-orange-500 font-medium">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
