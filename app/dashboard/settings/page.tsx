import Link from 'next/link';
import { ChangePasswordForm } from '@/app/dashboard/_components/ChangePasswordForm';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { PageContainer, PageHeader, Section } from '@/components/layout';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const dashboardPath = getDashboardPathForRole(user.role);

  const backLink = (
    <Link href={dashboardPath} className="text-sm font-medium text-brand hover:underline mb-2 block">
      ← Back to dashboard
    </Link>
  );

  return (
    <PageContainer>
      {backLink}
      <PageHeader
        title="Account settings"
        description="Manage your security preferences and keep your account protected."
      />

      <Section>
        <ChangePasswordForm />
      </Section>
    </PageContainer>
  );
}
