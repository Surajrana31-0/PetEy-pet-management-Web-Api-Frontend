'use client';

import { useState } from 'react';
import { Settings, Bell, Globe, Moon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTheme } from '@/lib/contexts/theme-context';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [pending, setPending] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: false, adoption: true });

  const handleSave = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      toast.success('Settings saved');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Customize your PetEy experience.</p>
      </div>

      <Card className="mb-6 border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates about your applications</p>
            </div>
            <Switch
              id="emailNotif"
              checked={notifications.email}
              onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotif">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Get alerts on your device</p>
            </div>
            <Switch
              id="pushNotif"
              checked={notifications.push}
              onCheckedChange={(v) => setNotifications({ ...notifications, push: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="adoptNotif">Adoption Updates</Label>
              <p className="text-sm text-muted-foreground">Notify me when my application status changes</p>
            </div>
            <Switch
              id="adoptNotif"
              checked={notifications.adoption}
              onCheckedChange={(v) => setNotifications({ ...notifications, adoption: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={pending} className="gradient-warm text-white">
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
