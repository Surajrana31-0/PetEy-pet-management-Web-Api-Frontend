'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormInput>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet?.name || '',
      age: pet?.age ?? 0,
      breed: pet?.breed || '',
      species: pet?.species || PetSpecies.DOG,
      description: pet?.description || '',
      emoji: pet?.emoji || '',
      status: pet?.status || PetStatus.AVAILABLE,
    },
  });

  async function onSubmit(data: PetFormInput) {
    setServerError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age.toString());
    formData.append('breed', data.breed);
    formData.append('species', data.species);
    formData.append('description', data.description);
    if (data.emoji) formData.append('emoji', data.emoji);
    formData.append('status', data.status);

    if (imageFile) {
      formData.append('images', imageFile);
    }

    const result =
      mode === 'create'
        ? await createPetAction(formData)
        : await updatePetAction(pet!._id, formData);

    if (!result.success) {
      setServerError(result.message || 'Operation failed.');
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

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-[var(--text-dark)]">Pet Name</label>
        <input 
          className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" 
          placeholder="e.g. Max"
          {...register('name')} 
        />
        {errors.name && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[var(--text-dark)]">Age (years/months)</label>
          <input 
            type="number"
            step="0.1"
            className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" 
            placeholder="e.g. 2.5"
            {...register('age')} 
          />
          {errors.age && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.age.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[var(--text-dark)]">Breed</label>
          <input 
            className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" 
            placeholder="e.g. Golden Retriever"
            {...register('breed')} 
          />
          {errors.breed && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.breed.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[var(--text-dark)]">Species</label>
          <select 
            className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer" 
            {...register('species')}
          >
            <option value={PetSpecies.DOG}>🐶 Dog</option>
            <option value={PetSpecies.CAT}>🐱 Cat</option>
          </select>
          {errors.species && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.species.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[var(--text-dark)]">Status</label>
          <select 
            className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer" 
            {...register('status')}
          >
            <option value={PetStatus.AVAILABLE}>🟢 Available for Adoption</option>
            <option value={PetStatus.PENDING}>🟡 Application Pending</option>
            <option value={PetStatus.ADOPTED}>🔴 Adopted</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-[var(--text-dark)]">Profile Emoji (optional)</label>
        <input 
          className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all" 
          placeholder="e.g. 🐕"
          {...register('emoji')} 
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-[var(--text-dark)]">Pet Photo</label>
        <input 
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImageFile(file);
          }}
          className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-primary)] file:text-white hover:file:bg-[var(--brand-hover)] cursor-pointer" 
        />
        {imageFile && <p className="text-sm text-emerald-600 mt-1 font-medium">Selected: {imageFile.name}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-[var(--text-dark)]">Description & Personality</label>
        <textarea
          rows={5}
          className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all resize-y"
          placeholder="Describe the pet's personality, behavior, and ideal home environment..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs font-semibold text-rose-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-[var(--border-light)]">
        <button type="submit" className="btn-primary px-8 py-3 rounded-xl flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Pet Profile' : 'Update Pet Profile'}
        </button>
        <button
          type="button"
          className="px-6 py-3 rounded-xl font-bold text-[var(--text-muted)] bg-[var(--section-bg)] border border-[var(--border-light)] hover:bg-slate-100 transition-colors"
          onClick={() => router.push('/dashboard/admin/pets')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
