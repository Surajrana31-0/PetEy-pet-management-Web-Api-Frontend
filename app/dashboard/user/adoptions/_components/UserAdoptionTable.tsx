'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { cancelAdoptionAction } from '@/lib/actions/adoption-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, Sparkles, FileText, AlertCircle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'destructive' | 'default'; icon: typeof Clock }> = {
  PENDING: { label: 'Pending Review', variant: 'warning', icon: Clock },
  APPROVED: { label: 'Approved', variant: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  COMPLETED: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', variant: 'default', icon: XCircle },
};

export function UserAdoptionTable({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!cancelTarget) return;
    startTransition(async () => {
      const res = await cancelAdoptionAction(cancelTarget._id);
      if (res.success) {
        toast.success('Application cancelled successfully.');
        setApplications((prev) => prev.filter((a) => a._id !== cancelTarget._id));
        setCancelTarget(null);
      } else {
        toast.error(res.message || 'Failed to cancel application.');
      }
    });
  };

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-900 dark:text-white">No Applications Yet</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Browse available pets and submit an adoption application to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Pet</th>
              <th className="p-4">AI Match</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {applications.map((app) => {
              const pet = app.petId || {};
              const statusConfig = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center font-bold">
                        {pet.image ? <img src={pet.image} alt="" className="w-full h-full object-cover" /> : '🐾'}
                      </div>
                      <div>
                        <p className="font-bold">{pet.name || 'Unknown Pet'}</p>
                        <p className="text-[10px] text-slate-400">{pet.breed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {app.aiMatchScore != null ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {app.aiMatchScore}%
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <Badge variant={statusConfig.variant}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {app.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelTarget(app)}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] px-3 py-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {cancelTarget && (
        <Dialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                Cancel Application
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-600 dark:text-slate-300 py-3">
              Are you sure you want to cancel your adoption application for{' '}
              <strong>{cancelTarget.petId?.name || 'this pet'}</strong>? This action cannot be undone.
            </p>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={isPending}>
                Keep Application
              </Button>
              <Button variant="destructive" isLoading={isPending} onClick={handleCancel}>
                Yes, Cancel Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
