import ForgetForm from '../_components/ForgetForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password?"
      description="Enter your email and we'll send you a link to reset your password."
      footer={
        <AuthSwitchLink prompt="Remember your password?" href="/login" linkText="Back to sign in" />
      }
    >
      <ForgetForm />
    </AuthShell>
  );
}
