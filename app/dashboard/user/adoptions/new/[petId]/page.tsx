import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireUserRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import AdoptionForm from './_components/AdoptionForm';
import { ArrowLeft } from 'lucide-react';
import { PetStatus } from '@/lib/types/pet';

interface PageProps {
  params: Promise<{ petId: string }>;
}

export default async function NewAdoptionPage({ params }: PageProps) {
  const user = await requireUserRole();
  const { petId } = await params;

  let pet = null;
  try {
    const res = await petsApi.getById(petId);
    if (res.success && res.data) {
      pet = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch pet:', error);
  }

  if (!pet || pet.status !== PetStatus.AVAILABLE) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <Link
          href="/dashboard/user/browse"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to browsing
        </Link>
        <h1 className="text-2xl font-extrabold text-[var(--text-dark)]">
          Adopt {pet.name} {pet.emoji}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          You're one step closer to giving {pet.name} a forever home! Please fill out the application below so our team can review your request.
        </p>
      </div>

      <div className="bg-[var(--section-bg)] p-6 rounded-2xl border border-[var(--border-light)] mb-6">
        <h3 className="font-bold text-[var(--text-dark)] mb-2">About {pet.name}</h3>
        <p className="text-sm text-[var(--text-muted)]">{pet.description}</p>
        <div className="flex gap-4 mt-4 text-xs font-medium text-slate-500">
          <span>Breed: {pet.breed}</span>
          <span>Species: {pet.species}</span>
          <span>Age: {pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
        </div>
      </div>

      <AdoptionForm petId={petId} />
    </div>
  );
}
