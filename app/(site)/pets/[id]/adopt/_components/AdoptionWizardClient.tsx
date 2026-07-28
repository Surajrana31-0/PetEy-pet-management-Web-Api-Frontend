'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Home, Heart, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createAdoptionAction } from '@/lib/actions/adoption-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface AdoptionWizardClientProps {
  petId: string;
}

export default function AdoptionWizardClient({ petId }: AdoptionWizardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    livingSpace: 'apartment' as 'apartment' | 'house' | 'farm',
    hasYard: false,
    householdMembers: 1,
    hasChildren: false,
    childrenAges: '',
    hasOtherPets: false,
    otherPetsDetails: '',
    experience: 'intermediate' as 'none' | 'beginner' | 'intermediate' | 'expert',
    workSchedule: 'Full-time (remote / hybrid)',
    reasonForAdoption: '',
    veterinarianInfo: '',
    references: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.reasonForAdoption.trim()) {
      toast.error('Please provide your reason for adoption.');
      return;
    }

    startTransition(async () => {
      const payload = {
        petId,
        applicationData: {
          livingSpace: formData.livingSpace,
          hasYard: formData.hasYard,
          householdMembers: Number(formData.householdMembers),
          hasChildren: formData.hasChildren,
          childrenAges:
            formData.hasChildren && formData.childrenAges
              ? formData.childrenAges
                  .split(',')
                  .map((a) => Number(a.trim()))
                  .filter((n) => !isNaN(n))
              : [],
          hasOtherPets: formData.hasOtherPets,
          otherPetsDetails: formData.hasOtherPets ? formData.otherPetsDetails : undefined,
          experience: formData.experience,
          workSchedule: formData.workSchedule,
          reasonForAdoption: formData.reasonForAdoption,
          veterinarianInfo: formData.veterinarianInfo || undefined,
          references: formData.references
            ? formData.references
                .split(',')
                .map((r) => r.trim())
                .filter(Boolean)
            : [],
        },
      };

      const result = await createAdoptionAction(payload);
      if (result.success) {
        toast.success('Adoption application submitted successfully! Our shelter team will review it.');
        router.push('/dashboard/user/adoptions');
      } else {
        toast.error(result.message || 'Failed to submit application.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/pets/${petId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pet Profile
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            Adoption Application
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Adoption Questionnaire
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Please fill out this questionnaire so our shelter team can evaluate your match for this pet.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          {[
            { num: 1, label: 'Living Space' },
            { num: 2, label: 'Pets & Care' },
            { num: 3, label: 'Motivation' },
            { num: 4, label: 'Review' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  Step 1: Your Living Environment
                </h3>

                <div>
                  <Label htmlFor="livingSpace">Living Space Type</Label>
                  <Select
                    id="livingSpace"
                    value={formData.livingSpace}
                    onChange={(e) => handleChange('livingSpace', e.target.value)}
                    options={[
                      { value: 'apartment', label: 'Apartment / Condo' },
                      { value: 'house', label: 'Single Family House' },
                      { value: 'farm', label: 'Farm / Rural Property' },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id="hasYard"
                    checked={formData.hasYard}
                    onChange={(e) => handleChange('hasYard', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <Label htmlFor="hasYard" className="cursor-pointer mb-0">
                    Does your home have a fenced yard?
                  </Label>
                </div>

                <div>
                  <Label htmlFor="householdMembers">Total Household Members</Label>
                  <Input
                    id="householdMembers"
                    type="number"
                    min={1}
                    value={formData.householdMembers}
                    onChange={(e) => handleChange('householdMembers', e.target.value)}
                  />
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasChildren"
                      checked={formData.hasChildren}
                      onChange={(e) => handleChange('hasChildren', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <Label htmlFor="hasChildren" className="cursor-pointer mb-0">
                      Are there children living in your household?
                    </Label>
                  </div>
                  {formData.hasChildren && (
                    <div>
                      <Label htmlFor="childrenAges" className="text-xs">
                        Children Ages (comma separated, e.g. 4, 8)
                      </Label>
                      <Input
                        id="childrenAges"
                        placeholder="e.g. 5, 10"
                        value={formData.childrenAges}
                        onChange={(e) => handleChange('childrenAges', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Step 2: Pets & Pet Care Experience
                </h3>

                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasOtherPets"
                      checked={formData.hasOtherPets}
                      onChange={(e) => handleChange('hasOtherPets', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <Label htmlFor="hasOtherPets" className="cursor-pointer mb-0">
                      Do you currently own other pets?
                    </Label>
                  </div>
                  {formData.hasOtherPets && (
                    <div>
                      <Label htmlFor="otherPetsDetails" className="text-xs">
                        Details of Other Pets (species, breed, age, spayed/neutered)
                      </Label>
                      <Textarea
                        id="otherPetsDetails"
                        rows={2}
                        placeholder="e.g. 1 vaccinated Golden Retriever (3 yrs)"
                        value={formData.otherPetsDetails}
                        onChange={(e) => handleChange('otherPetsDetails', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Pet Care Experience Level</Label>
                  <Select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    options={[
                      { value: 'none', label: 'First-time pet owner' },
                      { value: 'beginner', label: 'Beginner (had pets in childhood)' },
                      { value: 'intermediate', label: 'Intermediate (experienced pet owner)' },
                      { value: 'expert', label: 'Expert / Trainer / Rescue Volunteer' },
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="workSchedule">Daily Work Schedule</Label>
                  <Input
                    id="workSchedule"
                    placeholder="e.g. Work from home / Away 9am to 5pm"
                    value={formData.workSchedule}
                    onChange={(e) => handleChange('workSchedule', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Step 3: Adoption Motivation & References
                </h3>

                <div>
                  <Label htmlFor="reasonForAdoption" required>
                    Why do you want to adopt this pet?
                  </Label>
                  <Textarea
                    id="reasonForAdoption"
                    rows={4}
                    placeholder="Explain your motivation, routine planned for the pet, and long term commitment..."
                    value={formData.reasonForAdoption}
                    onChange={(e) => handleChange('reasonForAdoption', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="veterinarianInfo">Current / Preferred Veterinarian Clinic</Label>
                  <Input
                    id="veterinarianInfo"
                    placeholder="e.g. City Pet Hospital - Dr. Sharma"
                    value={formData.veterinarianInfo}
                    onChange={(e) => handleChange('veterinarianInfo', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="references">Personal References (Optional)</Label>
                  <Input
                    id="references"
                    placeholder="e.g. John Doe (Friend - 555-0192)"
                    value={formData.references}
                    onChange={(e) => handleChange('references', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Step 4: Final Application Review
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Living Space:</span>
                    <strong className="text-slate-900 dark:text-white capitalize">
                      {formData.livingSpace} ({formData.hasYard ? 'Fenced Yard' : 'No Yard'})
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Household Members:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {formData.householdMembers} person(s)
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Experience Level:</span>
                    <strong className="text-slate-900 dark:text-white capitalize">
                      {formData.experience}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Work Schedule:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {formData.workSchedule}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Reason for Adoption:</span>
                    <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
                      &ldquo;{formData.reasonForAdoption}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Our AI compatibility engine will evaluate your questionnaire against the pet&apos;s
                    temperament score. Shelter administrators will review your application within 24-48 hours.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isPending}
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button type="button" variant="brand" onClick={() => setStep((s) => s + 1)}>
                  Continue Next Step
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  isLoading={isPending}
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Submit Application Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}