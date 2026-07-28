'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, User } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useProfileForm } from '@/app/dashboard/profile/_hooks/useProfileForm';
import type { IUser } from '@/lib/types/auth';
import { cn } from '@/lib/utils/cn';

interface EditProfileFormProps {
  user: IUser;
}

import { useState, useRef } from 'react';

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { form, isPending, onSubmit } = useProfileForm(user, imageFile);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>
          Update your contact details. Your email address cannot be changed here.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="space-y-5">
          <FormField label="Email address" htmlFor="email" hint="Contact support to change your email.">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="pl-10 bg-secondary/50"
              />
            </div>
          </FormField>

          <FormField label="Profile Photo" htmlFor="profilePhoto" hint="Upload a square image for best results.">
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              className="w-full bg-[var(--section-bg)] border border-[var(--border-light)] rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-primary)] file:text-white hover:file:bg-[var(--brand-hover)] cursor-pointer" 
            />
            {imageFile && <p className="text-sm text-emerald-600 mt-1 font-medium">Selected: {imageFile.name}</p>}
          </FormField>

          <FormField label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="fullName"
                autoComplete="name"
                error={!!errors.fullName}
                className="pl-10"
                {...register('fullName')}
              />
            </div>
          </FormField>

          <FormField label="Phone number" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                error={!!errors.phoneNumber}
                className="pl-10"
                {...register('phoneNumber')}
              />
            </div>
          </FormField>

          <FormField label="Address" htmlFor="address" error={errors.address?.message}>
            <Input
              id="address"
              autoComplete="street-address"
              placeholder="Street address"
              error={!!errors.address}
              {...register('address')}
            />
          </FormField>

          <FormField label="Location" htmlFor="location" error={errors.location?.message}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="location"
                autoComplete="address-level2"
                placeholder="City, state, or region"
                error={!!errors.location}
                className="pl-10"
                {...register('location')}
              />
            </div>
          </FormField>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button type="submit" variant="brand" isLoading={isPending}>
            Save changes
          </Button>
          <Link
            href="/dashboard/settings"
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}
          >
            Change password
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
