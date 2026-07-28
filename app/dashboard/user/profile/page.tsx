'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Loader2, Camera, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [pending, setPending] = useState(false);
  const [pendingPassword, setPendingPassword] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingPassword(true);
    setTimeout(() => {
      setPendingPassword(false);
      toast.success('Password changed successfully');
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and account settings.</p>
      </div>

      <Card className="mb-6 border-border/60 shadow-card">
        <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row">
          <div className="relative">
            <span className="flex h-24 w-24 items-center justify-center rounded-full gradient-warm text-3xl font-bold text-white">
              U
            </span>
            <button
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-card transition-colors hover:bg-muted"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">Pet Lover</h2>
            <p className="text-sm text-muted-foreground">Member since 2026</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-border/60 shadow-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="fullName" className="pl-10" placeholder="Your name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" className="pl-10" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="location" className="pl-10" placeholder="City, State" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={pending} className="gradient-warm text-white">
                {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" placeholder="Re-enter new password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={pendingPassword} variant="outline">
                {pendingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…</> : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
