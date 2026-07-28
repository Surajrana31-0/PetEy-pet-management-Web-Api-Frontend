import VerifyEmailForm from '../_components/VerifyEmailForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Verify your email"
      description="We sent a verification link to your email. Click below to verify your account and start your pet adoption journey."
      footer={
        <AuthSwitchLink prompt="Ready to sign in?" href="/login" linkText="Go to sign in" />
      }
    >
      <VerifyEmailForm token={token} />
    </AuthShell>
  );
}
