import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-gray-500">
          Join PetEy to browse pets, save favorites, and apply for adoption.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
