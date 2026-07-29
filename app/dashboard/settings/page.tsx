import Link from 'next/link';
import { ChangePasswordForm } from '@/app/dashboard/_components/ChangePasswordForm';
import { EditProfileForm } from '@/app/dashboard/_components/EditProfileForm';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { PageContainer, PageHeader, Section } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Calendar, Shield } from 'lucide-react';

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
        description="Manage your profile, security preferences, and account information."
      />

      <Section>
        <EditProfileForm user={user} />
      </Section>

      <Section>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Account information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Role:</span>
              <span className="text-muted-foreground">{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Joined:</span>
              <span className="text-muted-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span className="text-muted-foreground">{user.phoneNumber}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span className="text-muted-foreground">{user.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </Section>

      <Section>
        <ChangePasswordForm />
      </Section>
    </PageContainer>
  );
}
