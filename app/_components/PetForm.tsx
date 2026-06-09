'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPetAction, updatePetAction } from '@/lib/actions/pet-actions';
import { PetSpecies, PetStatus } from '@/lib/types/pet';
import type { IPet } from '@/lib/types/pet';
import { petFormSchema, type PetFormInput } from './pet-schema';

interface PetFormProps {
  mode: 'create' | 'edit';
  pet?: IPet;
}

export default function PetForm({ mode, pet }: PetFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormInput>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet?.name || '',
      age: pet?.age || '',
      breed: pet?.breed || '',
      species: pet?.species || PetSpecies.DOG,
      description: pet?.description || '',
      emoji: pet?.emoji || '',
      status: pet?.status || PetStatus.AVAILABLE,
    },
  });

  async function onSubmit(data: PetFormInput) {
    setServerError(null);

    const payload = {
      name: data.name,
      age: data.age,
      breed: data.breed,
      species: data.species,
      description: data.description,
      emoji: data.emoji || undefined,
      status: data.status,
    };

    const result =
      mode === 'create'
        ? await createPetAction(payload)
        : await updatePetAction(pet!._id, payload);

    if (!result.success) {
      setServerError(result.error || 'Operation failed.');
      return;
    }

    router.push('/dashboard/admin/pets');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('age')} />
          {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
          <input className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('breed')} />
          {errors.breed && <p className="text-sm text-red-500 mt-1">{errors.breed.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Species</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('species')}>
            <option value={PetSpecies.DOG}>Dog</option>
            <option value={PetSpecies.CAT}>Cat</option>
          </select>
          {errors.species && <p className="text-sm text-red-500 mt-1">{errors.species.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('status')}>
            <option value={PetStatus.AVAILABLE}>Available</option>
            <option value={PetStatus.PENDING}>Pending</option>
            <option value={PetStatus.ADOPTED}>Adopted</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Emoji (optional)</label>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2" {...register('emoji')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          rows={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Pet' : 'Update Pet'}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => router.push('/dashboard/admin/pets')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
