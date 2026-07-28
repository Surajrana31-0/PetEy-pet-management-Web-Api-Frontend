'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { approveAdoptionAction, rejectAdoptionAction, completeAdoptionAction } from '@/lib/actions/adoption-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Clock, Sparkles, FileText } from 'lucide-react';

export function AdminAdoptionTable({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleOpenAction = (app: any, type: 'approve' | 'reject' | 'complete') => {
    setSelectedApp(app);
    setActionType(type);
    setNotes('');
  };

  const handleConfirmAction = () => {
    if (!selectedApp || !actionType) return;

    if (actionType === 'reject' && !notes.trim()) {
      toast.error('Please state a reason for rejecting the application.');
      return;
    }

    startTransition(async () => {
      let res: any;
      if (actionType === 'approve') {
        res = await approveAdoptionAction(selectedApp._id, notes);
      } else if (actionType === 'reject') {
        res = await rejectAdoptionAction(selectedApp._id, notes);
      } else {
        res = await completeAdoptionAction(selectedApp._id, notes);
      }

      if (res.success) {
        toast.success(`Application ${actionType}d successfully!`);
        setApplications((prev) => prev.filter((a) => a._id !== selectedApp._id));
        setActionType(null);
        setSelectedApp(null);
      } else {
        toast.error(res.message || `Failed to ${actionType} application`);
      }
    });
  };

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Queue Empty</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No pending adoption applications requiring review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Pet</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Living Space</th>
                <th className="p-4">AI Match</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {applications.map((app) => {
                const pet = app.petId || {};
                const user = app.userId || {};
                const data = app.applicationData || {};

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
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{user.fullName || app.applicantName || 'Applicant'}</p>
                      <p className="text-[10px] text-slate-400">{user.email || 'No Email'}</p>
                    </td>
                    <td className="p-4 capitalize">
                      {data.livingSpace || 'N/A'} ({data.hasYard ? 'Yard' : 'No Yard'})
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {app.aiMatchScore ?? 'N/A'}%
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="warning">{app.status}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="brand"
                        onClick={() => handleOpenAction(app, 'approve')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-3 py-1"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAction(app, 'reject')}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] px-3 py-1"
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Dialog Modal */}
      {selectedApp && actionType && (
        <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {actionType} Adoption Application
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                You are about to <strong className="capitalize">{actionType}</strong> the adoption application for pet{' '}
                <strong>{selectedApp.petId?.name || 'this pet'}</strong>.
              </p>

              <div>
                <Label htmlFor="adminNotes">
                  Admin Notes / Reason {actionType === 'reject' ? '(Required)' : '(Optional)'}
                </Label>
                <Textarea
                  id="adminNotes"
                  rows={3}
                  placeholder="Add notes for applicant email notification..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setActionType(null)} disabled={isPending}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'reject' ? 'destructive' : 'brand'}
                isLoading={isPending}
                onClick={handleConfirmAction}
              >
                Confirm {actionType}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
