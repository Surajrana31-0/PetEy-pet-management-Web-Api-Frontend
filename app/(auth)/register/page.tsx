import RegisterForm from '@/app/(auth)/_components/RegisterForm';
import { AuthShell, AuthSwitchLink } from '@/components/auth/auth-shell';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join PetEy and start your journey to find your perfect furry companion."
      footer={
        <AuthSwitchLink prompt="Already have an account?" href="/login" linkText="Sign in" />
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
