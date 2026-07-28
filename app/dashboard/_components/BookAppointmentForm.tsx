'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import type { IAvailability } from '@/lib/types/vet';
import { bookAppointmentAction } from '@/lib/actions/appointment-actions';

const SPECIES = ['DOG', 'CAT'] as const;

const schema = z.object({
  petName: z.string().min(1, 'Pet name is required'),
  petSpecies: z.enum(SPECIES, { error: 'Species is required' }),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(10, 'Please provide a reason (min 10 characters)'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  vetId: string;
  vetName: string;
  availability: IAvailability[];
}

export function BookAppointmentForm({ vetId, vetName, availability }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedDate = watch('appointmentDate');

  // Compute available time slots based on selected date's day-of-week
  const timeSlots: string[] = [];
  if (selectedDate) {
    const dayName = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const slot = availability.find((a) => a.day === dayName);
    if (slot) {
      // Generate hourly slots between startTime and endTime
      const [sh, sm] = slot.startTime.split(':').map(Number);
      const [eh, em] = slot.endTime.split(':').map(Number);
      let cur = sh * 60 + (sm || 0);
      const end = eh * 60 + (em || 0);
      while (cur + 60 <= end) {
        const hh = String(Math.floor(cur / 60)).padStart(2, '0');
        const mm = String(cur % 60).padStart(2, '0');
        const nexth = String(Math.floor((cur + 60) / 60)).padStart(2, '0');
        const nextm = String((cur + 60) % 60).padStart(2, '0');
        timeSlots.push(`${hh}:${mm}-${nexth}:${nextm}`);
        cur += 60;
      }
    }
  }

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await bookAppointmentAction({
        veterinarianId: vetId,
        ...data,
      });
      if (result.success) {
        toast.success(result.message || 'Appointment booked!');
        router.push('/dashboard/user/appointments');
      } else {
        toast.error(result.message || 'Booking failed.');
      }
    });
  };

  const fieldClass = (error?: { message?: string }) =>
    `auth-input auth-input--no-icon${error ? ' border-red-400' : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="auth-field">
        <label className="auth-label">Pet Name <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
        <input className={fieldClass(errors.petName)} placeholder="e.g. Buddy" {...register('petName')} />
        {errors.petName && <span className="auth-error">{errors.petName.message}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label">Pet Species <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
        <select className={fieldClass(errors.petSpecies)} {...register('petSpecies')}
          style={{ height: 52, padding: '0 14px', border: '1.5px solid var(--border-light)', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', width: '100%' }}>
          <option value="">Select species</option>
          {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.petSpecies && <span className="auth-error">{errors.petSpecies.message}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label">Preferred Date <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
        <input
          type="date"
          className={fieldClass(errors.appointmentDate)}
          min={new Date().toISOString().split('T')[0]}
          style={{ height: 52, padding: '0 14px', border: '1.5px solid var(--border-light)', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', width: '100%' }}
          {...register('appointmentDate')}
        />
        {errors.appointmentDate && <span className="auth-error">{errors.appointmentDate.message}</span>}
        {selectedDate && timeSlots.length === 0 && (
          <span className="auth-hint">No availability on this day. Please choose another date.</span>
        )}
      </div>

      {timeSlots.length > 0 && (
        <div className="auth-field">
          <label className="auth-label">Time Slot <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
          <select
            className={fieldClass(errors.timeSlot)}
            style={{ height: 52, padding: '0 14px', border: '1.5px solid var(--border-light)', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', width: '100%' }}
            {...register('timeSlot')}>
            <option value="">Choose a slot</option>
            {timeSlots.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.timeSlot && <span className="auth-error">{errors.timeSlot.message}</span>}
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label">Reason for Visit <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
        <textarea
          rows={3}
          className={fieldClass(errors.reason)}
          placeholder="Describe the reason for the appointment..."
          style={{ height: 'auto', padding: '12px 14px', resize: 'vertical', border: '1.5px solid var(--border-light)', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff', width: '100%' }}
          {...register('reason')}
        />
        {errors.reason && <span className="auth-error">{errors.reason.message}</span>}
      </div>

      <button type="submit" disabled={isPending} className="auth-submit-btn">
        {isPending ? <span className="auth-spinner" /> : null}
        {isPending ? 'Booking...' : `Book with ${vetName}`}
      </button>
    </form>
  );
}
