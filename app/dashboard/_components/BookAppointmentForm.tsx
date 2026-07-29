'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import type { IAvailabilitySlot } from '@/lib/types/vet';
import { bookAppointmentAction } from '@/lib/actions/appointment-actions';

const SPECIES = ['DOG', 'CAT'] as const;
const schema = z.object({
  petName: z.string().min(1, 'Pet name is required'),
  petSpecies: z.enum(SPECIES, { message: 'Species is required' }),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(10, 'Please provide a reason (min 10 characters)'),
});
type FormData = z.infer<typeof schema>;

interface Props { vetId: string; vetName: string; availability: IAvailabilitySlot[]; }

export function BookAppointmentForm({ vetId, vetName, availability }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const selectedDate = watch('appointmentDate');
  const timeSlots: string[] = [];
  if (selectedDate) {
    const dayName = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const slot = availability.find((a) => a.day === dayName);
    if (slot) {
      const [sh, sm] = slot.startTime.split(':').map(Number);
      const [eh, em] = slot.endTime.split(':').map(Number);
      let cur = sh * 60 + (sm || 0); const end = eh * 60 + (em || 0);
      while (cur + 60 <= end) {
        const hh = String(Math.floor(cur / 60)).padStart(2, '0'); const mm = String(cur % 60).padStart(2, '0');
        const nh = String(Math.floor((cur + 60) / 60)).padStart(2, '0'); const nm = String((cur + 60) % 60).padStart(2, '0');
        timeSlots.push(`${hh}:${mm}-${nh}:${nm}`); cur += 60;
      }
    }
  }
  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await bookAppointmentAction({ veterinarianId: vetId, ...data });
      if (result.success) { toast.success(result.message || 'Appointment booked!'); router.push('/dashboard/user/appointments'); }
      else { toast.error(result.message || 'Booking failed.'); }
    });
  };
  const ic = 'w-full h-11 border border-input bg-background rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-ring';
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div><label className="block text-sm font-bold mb-1">Pet Name *</label><input className={ic} placeholder="e.g. Buddy" {...register('petName')}/>{errors.petName && <p className="text-xs text-red-500 mt-1">{errors.petName.message}</p>}</div>
      <div><label className="block text-sm font-bold mb-1">Pet Species *</label><select className={ic} {...register('petSpecies')}><option value="">Select species</option>{SPECIES.map((s)=><option key={s} value={s}>{s}</option>)}</select>{errors.petSpecies && <p className="text-xs text-red-500 mt-1">{errors.petSpecies.message}</p>}</div>
      <div><label className="block text-sm font-bold mb-1">Preferred Date *</label><input type="date" className={ic} min={new Date().toISOString().split('T')[0]} {...register('appointmentDate')}/>{errors.appointmentDate && <p className="text-xs text-red-500 mt-1">{errors.appointmentDate.message}</p>}{selectedDate && timeSlots.length===0 && <p className="text-xs text-muted-foreground mt-1">No availability on this day.</p>}</div>
      {timeSlots.length>0 && <div><label className="block text-sm font-bold mb-1">Time Slot *</label><select className={ic} {...register('timeSlot')}><option value="">Choose a slot</option>{timeSlots.map((s)=><option key={s} value={s}>{s}</option>)}</select>{errors.timeSlot && <p className="text-xs text-red-500 mt-1">{errors.timeSlot.message}</p>}</div>}
      <div><label className="block text-sm font-bold mb-1">Reason for Visit *</label><textarea rows={3} className={`${ic} resize-y`} placeholder="Describe the reason..." {...register('reason')}/>{errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}</div>
      <button type="submit" disabled={isPending} className="h-11 rounded-lg bg-brand text-brand-foreground hover:bg-brand-hover font-bold">{isPending?'Booking...':`Book with ${vetName}`}</button>
    </form>
  );
}
