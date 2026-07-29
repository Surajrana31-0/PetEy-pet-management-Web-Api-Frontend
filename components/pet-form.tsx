'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PawPrint } from 'lucide-react';
import { petSchema, type PetFormValues } from '@/lib/schemas/pet-schema';
import type { Pet, PetSpecies, PetStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface PetFormProps {
  mode: 'create' | 'edit';
  pet?: Pet;
  onSubmit: (formData: FormData) => Promise<{ error: string | null; success: boolean }>;
}

const SPECIES_OPTIONS: { value: PetSpecies; label: string; emoji: string }[] = [
  { value: 'DOG' as PetSpecies, label: 'Dog', emoji: '🐶' },
  { value: 'CAT' as PetSpecies, label: 'Cat', emoji: '🐱' },
];
const STATUS_OPTIONS: { value: PetStatus; label: string }[] = [
  { value: 'AVAILABLE' as PetStatus, label: 'Available' },
  { value: 'PENDING' as PetStatus, label: 'Pending' },
  { value: 'ADOPTED' as PetStatus, label: 'Adopted' },
];
const EMOJI_OPTIONS = ['🐶', '🐱', '🦮', '🐈‍⬛', '🐩', '😸', '🐾'];

export function PetForm({ mode, pet, onSubmit }: PetFormProps) {
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState(pet?.emoji || '');
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: pet ? { name: pet.name, age: String(pet.age), breed: pet.breed, species: pet.species as PetSpecies, description: pet.description, emoji: pet.emoji || '', status: pet.status as PetStatus } : { name: '', age: '', breed: '', species: 'DOG' as PetSpecies, description: '', emoji: '', status: 'AVAILABLE' as PetStatus },
  });
  const species = watch('species');
  const status = watch('status');
  const handleFormSubmit = async (data: PetFormValues) => {
    setPending(true); setServerError(null);
    const formData = new FormData();
    if (mode === 'edit' && pet) formData.set('id', pet._id);
    formData.set('name', data.name); formData.set('age', data.age); formData.set('breed', data.breed);
    formData.set('species', data.species); formData.set('description', data.description);
    if (selectedEmoji) formData.set('emoji', selectedEmoji); formData.set('status', data.status);
    const result = await onSubmit(formData);
    if (!result.success) { setServerError(result.error); setPending(false); }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {serverError && <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{serverError}</div>}
      <Card className="border-border/60 shadow-card"><CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="name">Pet Name *</Label><Input id="name" placeholder="Max" {...register('name')}/>{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="age">Age *</Label><Input id="age" placeholder="2 years" {...register('age')}/>{errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="breed">Breed *</Label><Input id="breed" placeholder="Golden Retriever" {...register('breed')}/>{errors.breed && <p className="text-xs text-destructive">{errors.breed.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="species">Species *</Label>
            <Select value={species} onValueChange={(v) => setValue('species', v as PetSpecies, { shouldValidate: true })}>
              <SelectTrigger id="species"><SelectValue/></SelectTrigger><SelectContent>{SPECIES_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.emoji} {opt.label}</SelectItem>)}</SelectContent>
            </Select>
            {errors.species && <p className="text-xs text-destructive">{errors.species.message}</p>}
          </div>
        </div>
        <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" rows={4} placeholder="Describe the pet's personality..." {...register('description')}/>{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}</div>
        <div className="space-y-2"><Label>Emoji</Label><div className="flex flex-wrap gap-2">{EMOJI_OPTIONS.map((emoji) => <button key={emoji} type="button" onClick={() => setSelectedEmoji(emoji)} className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition-all ${selectedEmoji===emoji?'border-primary bg-primary/10 scale-110':'border-border bg-card hover:border-primary/50'}`} aria-label={`Select ${emoji}`}>{emoji}</button>)}</div></div>
        <div className="space-y-2"><Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setValue('status', v as PetStatus, { shouldValidate: true })}>
            <SelectTrigger id="status"><SelectValue/></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardContent></Card>
      <div className="flex items-center justify-end gap-3"><Button type="submit" disabled={pending} className="gradient-warm text-white">{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{mode==='create'?'Creating…':'Saving…'}</> : <><PawPrint className="mr-2 h-4 w-4"/>{mode==='create'?'Create Pet':'Save Changes'}</>}</Button></div>
    </form>
  );
}
