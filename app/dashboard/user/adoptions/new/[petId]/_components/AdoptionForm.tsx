'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createAdoptionAction } from '@/lib/actions/adoption-actions';
import { Button } from '@/components/ui/button';

interface AdoptionFormProps {
  petId: string;
}

interface AdoptionFormData {
  livingSpace: 'apartment' | 'house' | 'farm';
  hasYard: string; // "true" or "false"
  householdMembers: number;
  hasChildren: string; // "true" or "false"
  childrenAges?: string;
  hasOtherPets: string; // "true" or "false"
  otherPetsDetails?: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'expert';
  workSchedule: string;
  reasonForAdoption: string;
  veterinarianInfo?: string;
  references?: string;
}

export default function AdoptionForm({ petId }: AdoptionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdoptionFormData>({
    defaultValues: {
      livingSpace: 'house',
      hasYard: 'true',
      householdMembers: 1,
      hasChildren: 'false',
      hasOtherPets: 'false',
      experience: 'beginner',
      workSchedule: 'Full-time, away from home 8 hours a day',
      reasonForAdoption: '',
    },
  });

  const hasChildren = watch('hasChildren') === 'true';
  const hasOtherPets = watch('hasOtherPets') === 'true';

  const onSubmit = (data: AdoptionFormData) => {
    setServerError(null);

    const payload = {
      livingSpace: data.livingSpace,
      hasYard: data.hasYard === 'true',
      householdMembers: Number(data.householdMembers) || 1,
      hasChildren: data.hasChildren === 'true',
      childrenAges: (data.hasChildren === 'true' && data.childrenAges) ? data.childrenAges.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)) : [],
      hasOtherPets: data.hasOtherPets === 'true',
      otherPetsDetails: data.hasOtherPets === 'true' ? data.otherPetsDetails : undefined,
      experience: data.experience,
      workSchedule: data.workSchedule,
      reasonForAdoption: data.reasonForAdoption,
      veterinarianInfo: data.veterinarianInfo,
      references: data.references ? data.references.split(',').map(s => s.trim()) : [],
    };

    startTransition(async () => {
      const result = await createAdoptionAction({ petId, applicationData: payload });

      if (result.success) {
        router.push('/dashboard/user/adoptions');
        router.refresh();
      } else {
        setServerError(result.message || 'Failed to submit application');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Living Space</label>
          <select
            {...register('livingSpace')}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="farm">Farm</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Do you have a yard?</label>
          <select
            {...register('hasYard')}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Household Members</label>
          <input
            type="number"
            min="1"
            {...register('householdMembers', { required: true, min: 1 })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Pet Experience</label>
          <select
            {...register('experience')}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Have children?</label>
          <select
            {...register('hasChildren')}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {hasChildren && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Children Ages (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. 5, 8"
              {...register('childrenAges')}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Have other pets?</label>
          <select
            {...register('hasOtherPets')}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {hasOtherPets && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Other Pets Details</label>
            <input
              type="text"
              placeholder="e.g. 2 cats, 1 dog"
              {...register('otherPetsDetails')}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Work Schedule (e.g., away 8 hours)</label>
        <input
          type="text"
          {...register('workSchedule', { required: true })}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Why do you want to adopt this pet?</label>
        <textarea
          rows={3}
          {...register('reasonForAdoption', { required: true })}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Veterinarian Info (Optional)</label>
        <input
          type="text"
          placeholder="Name and phone number"
          {...register('veterinarianInfo')}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200">References (Optional, comma separated)</label>
        <input
          type="text"
          placeholder="e.g. Jane Doe 555-1234, John Smith 555-9876"
          {...register('references')}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="submit"
          variant="brand"
          className="w-full py-6 text-base shadow-lg shadow-brand/20"
          isLoading={isPending}
        >
          Submit Adoption Application
        </Button>
        <p className="text-center text-xs text-slate-500 mt-4">
          By submitting this application, you agree to our adoption terms and conditions.
        </p>
      </div>
    </form>
  );
}
