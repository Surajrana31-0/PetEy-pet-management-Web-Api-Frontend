'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { toggleVetActive, deleteVet } from '@/lib/api/admin/vets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stethoscope, Trash2, Power, Plus, Star } from 'lucide-react';

export function AdminVetTable({ initialVets }: { initialVets: any[] }) {
  const [vets, setVets] = useState(initialVets);
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (vetId: string) => {
    startTransition(async () => {
      try {
        await toggleVetActive(vetId);
        toast.success('Vet status updated.');
        setVets((prev) =>
          prev.map((v) => (v._id === vetId ? { ...v, isActive: !v.isActive } : v))
        );
      } catch (err: any) {
        toast.error(err.message || 'Failed to toggle status');
      }
    });
  };

  const handleDelete = (vetId: string, name: string) => {
    if (!confirm(`Delete veterinarian "${name}"?`)) return;

    startTransition(async () => {
      try {
        await deleteVet(vetId);
        toast.success('Veterinarian deleted.');
        setVets((prev) => prev.filter((v) => v._id !== vetId));
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete veterinarian');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Doctors</h3>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Veterinarian</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Location</th>
              <th className="p-4">Consultation Fee</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {vets.map((v) => (
              <tr key={v._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center">
                      {v.name ? v.name.charAt(0) : 'V'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{v.name}</p>
                      <p className="text-[10px] text-slate-400">{v.email || v.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium text-teal-600 dark:text-teal-400">
                  {Array.isArray(v.specializations) ? v.specializations.join(', ') : v.specialization || 'General Practice'}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{v.location || 'Central Clinic'}</td>
                <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">${v.consultationFee || 45}</td>
                <td className="p-4">
                  <Badge variant={v.isActive ? 'success' : 'muted'}>
                    {v.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(v._id)}
                    className="text-xs text-slate-700 dark:text-slate-300"
                    title="Toggle Active Status"
                  >
                    <Power className={`w-3.5 h-3.5 ${v.isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(v._id, v.name)}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 p-2"
                    title="Delete Veterinarian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
