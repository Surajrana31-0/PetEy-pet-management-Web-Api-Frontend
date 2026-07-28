'use client';

import { useState, useMemo } from 'react';
import { FileText, Clock, Check, X, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

const APPLICATIONS = [
  { id: '1', petName: 'Max', applicant: 'Sarah Johnson', email: 'sarah@example.com', date: 'Jan 20, 2026', status: 'PENDING', compatibility: 92 },
  { id: '2', petName: 'Luna', applicant: 'Michael Chen', email: 'michael@example.com', date: 'Jan 19, 2026', status: 'PENDING', compatibility: 87 },
  { id: '3', petName: 'Buddy', applicant: 'Emily Davis', email: 'emily@example.com', date: 'Jan 18, 2026', status: 'APPROVED', compatibility: 95 },
  { id: '4', petName: 'Whiskers', applicant: 'John Smith', email: 'john@example.com', date: 'Jan 17, 2026', status: 'REJECTED', compatibility: 65 },
  { id: '5', petName: 'Rocky', applicant: 'Lisa Brown', email: 'lisa@example.com', date: 'Jan 16, 2026', status: 'PENDING', compatibility: 89 },
];

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [apps, setApps] = useState(APPLICATIONS);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = !search ||
        app.petName.toLowerCase().includes(search.toLowerCase()) ||
        app.applicant.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Application ${status.toLowerCase()}`);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Adoption Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage adoption applications.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by pet or applicant…"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((app) => (
          <Card key={app.id} className="border-border/60 shadow-card transition-all hover:shadow-glow">
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                  {app.petName === 'Max' ? '🐶' : app.petName === 'Luna' ? '🐱' : app.petName === 'Buddy' ? '🐶' : app.petName === 'Whiskers' ? '🐱' : '🦮'}
                </span>
                <div>
                  <h3 className="font-semibold">{app.petName}</h3>
                  <p className="text-sm text-muted-foreground">{app.applicant} · {app.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Applied {app.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold gradient-warm bg-clip-text text-transparent">{app.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
                <Badge variant="outline" className={
                  app.status === 'PENDING' ? 'bg-warning/15 text-warning border-warning/30' :
                  app.status === 'APPROVED' ? 'bg-success/15 text-success border-success/30' :
                  'bg-destructive/15 text-destructive border-destructive/30'
                }>
                  {app.status === 'PENDING' && <Clock className="mr-1 h-3 w-3" />}
                  {app.status === 'APPROVED' && <Check className="mr-1 h-3 w-3" />}
                  {app.status === 'REJECTED' && <X className="mr-1 h-3 w-3" />}
                  {app.status}
                </Badge>

                {app.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <ConfirmDialog
                      trigger={<Button size="sm" className="bg-success text-success-foreground hover:bg-success/90"><Check className="h-4 w-4" /></Button>}
                      title="Approve this application?"
                      description={`Approve ${app.applicant}'s application to adopt ${app.petName}?`}
                      confirmLabel="Approve"
                      onConfirm={() => updateStatus(app.id, 'APPROVED')}
                    />
                    <ConfirmDialog
                      trigger={<Button size="sm" variant="destructive"><X className="h-4 w-4" /></Button>}
                      title="Reject this application?"
                      description={`Reject ${app.applicant}'s application to adopt ${app.petName}?`}
                      confirmLabel="Reject"
                      onConfirm={() => updateStatus(app.id, 'REJECTED')}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
