import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import AdoptionWizardClient from './_components/AdoptionWizardClient';

/**
 * Server component — checks auth before rendering the wizard.
 * Unauthenticated visitors are sent to /login with a `next` param
 * so they land back here after signing in.
 */
export default async function AdoptionWizardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/pets/${id}/adopt`);
  }

  return <AdoptionWizardClient petId={id} />;
}