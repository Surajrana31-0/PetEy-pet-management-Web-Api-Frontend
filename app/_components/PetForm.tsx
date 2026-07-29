'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPetAction, updatePetAction } from '@/lib/actions/pet-actions';
import { PetSpecies, PetStatus } from '@/lib/types/pet';
import type { IPet } from '@/lib/types/pet';

interface PetFormProps {
  mode: 'create' | 'edit';
  pet?: IPet | null;
}

interface PetFormData {
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status: PetStatus;
}

export default function PetForm({ mode, pet }: PetFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetFormData>({
    defaultValues: {
      name: pet?.name || '',
      age: pet?.age || 0,
      breed: pet?.breed || '',
      species: pet?.species || PetSpecies.DOG,
      description: pet?.description || '',
      emoji: pet?.emoji || '',
      status: pet?.status || PetStatus.AVAILABLE,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', String(data.age));
    formData.append('breed', data.breed);
    formData.append('species', data.species);
    formData.append('description', data.description);
    if (data.emoji) formData.append('emoji', data.emoji);
    formData.append('status', data.status || PetStatus.AVAILABLE);
    if (imageFile) formData.append('images', imageFile);

    const result = mode === 'create' ? await createPetAction(formData) : await updatePetAction(pet!._id, formData);
    if (!result.success) { setServerError(result.message || 'Operation failed.'); return; }
    router.push('/dashboard/admin/pets');
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {serverError && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">{serverError}</div>}
      <div className="space-y-1.5"><label className="block text-sm font-bold">Pet Name</label><input className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none" placeholder="e.g. Max" {...register('name')}/>{errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="block text-sm font-bold">Age (years)</label><input type="number" step="0.1" className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none" placeholder="e.g. 2.5" {...register('age')}/>{errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age.message}</p>}</div>
        <div className="space-y-1.5"><label className="block text-sm font-bold">Breed</label><input className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none" placeholder="e.g. Golden Retriever" {...register('breed')}/>{errors.breed && <p className="text-xs text-rose-500 mt-1">{errors.breed.message}</p>}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><label className="block text-sm font-bold">Species</label><select className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none cursor-pointer" {...register('species')}><option value={PetSpecies.DOG}>Dog</option><option value={PetSpecies.CAT}>Cat</option></select></div>
        <div className="space-y-1.5"><label className="block text-sm font-bold">Status</label><select className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none cursor-pointer" {...register('status')}><option value={PetStatus.AVAILABLE}>Available</option><option value={PetStatus.PENDING}>Pending</option><option value={PetStatus.ADOPTED}>Adopted</option></select></div>
      </div>
      <div className="space-y-1.5"><label className="block text-sm font-bold">Profile Emoji (optional)</label><input className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none" placeholder="e.g. dog" {...register('emoji')}/></div>
      <div className="space-y-1.5"><label className="block text-sm font-bold">Pet Photo</label><input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0];if(f)setImageFile(f);}} className="w-full border border-input bg-background rounded-xl px-4 py-3 outline-none cursor-pointer"/>{imageFile && <p className="text-sm text-emerald-600 mt-1">Selected: {imageFile.name}</p>}</div>
      <div className="space-y-1.5"><label className="block text-sm font-bold">Description & Personality</label><textarea rows={5} className="w-full border border-input bg-background rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring outline-none resize-y" placeholder="Describe the pet's personality..." {...register('description')}/>{errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}</div>
      <div className="flex gap-4 pt-4 border-t border-border"><button type="submit" className="px-8 py-3 rounded-xl flex-1 bg-brand text-brand-foreground hover:bg-brand-hover font-bold" disabled={isSubmitting}>{isSubmitting?'Saving...':mode==='create'?'Create Pet Profile':'Update Pet Profile'}</button><button type="button" className="px-6 py-3 rounded-xl font-bold bg-muted hover:bg-accent border border-border" onClick={()=>router.push('/dashboard/admin/pets')}>Cancel</button></div>
    </form>
  );
}
