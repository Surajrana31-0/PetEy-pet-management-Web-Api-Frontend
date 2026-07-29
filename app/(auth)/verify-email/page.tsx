import Link from 'next/link';
import VerifyEmailForm from '../_components/VerifyEmailForm';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email. Click below to verify your account and start your pet adoption journey.
        </p>
      </div>

      <VerifyEmailForm token={token} />

      <p className="text-center text-sm text-muted-foreground">
        Ready to sign in?{' '}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-hover transition-colors">
          Go to sign in
        </Link>
      </p>
    </div>
  );
}
