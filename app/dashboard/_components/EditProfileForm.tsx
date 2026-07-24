'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, MapPin, Phone, User } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { updateProfileAction } from '@/lib/actions/auth-action';
import { profileSchema, type ProfileFormData } from '@/lib/auth/schemas';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { IUser } from '@/lib/types/auth';
import { cn } from '@/lib/utils/cn';

interface EditProfileFormProps {
  user: IUser;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber ?? '',
      address: user.address ?? '',
      location: user.location ?? '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    startTransition(async () => {
      const result = await updateProfileAction(data);

      if (!result.success) {
        toast.error(result.message || 'Failed to update profile.');
        return;
      }

      await checkAuth();
      toast.success(result.message || 'Profile updated successfully.');
      router.refresh();
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>
          Update your contact details. Your email address cannot be changed here.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
