import ResetPasswordForm from '../_components/PasswordResetForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password to secure your PetEy account."
      footer={
        <AuthSwitchLink prompt="Ready to sign in?" href="/login" linkText="Go to sign in" />
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
