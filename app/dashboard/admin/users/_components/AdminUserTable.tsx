'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { updateUserRole, deleteUser } from '@/lib/api/admin/users';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Search, ShieldAlert, Trash2, UserCheck } from 'lucide-react';

export function AdminUserTable({ initialUsers, currentAdminId }: { initialUsers: any[]; currentAdminId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success('User role updated successfully!');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } catch (err: any) {
        toast.error(err.message || 'Failed to update user role');
      }
    });
  };

  const handleDelete = (userId: string, name: string) => {
    if (userId === currentAdminId) {
      toast.error('You cannot delete your own admin account.');
      return;
    }
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;

    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success('User deleted.');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          placeholder="Search by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.profileImage} name={u.fullName} size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                      {u._id === currentAdminId && (
                        <span className="text-[10px] text-emerald-600 font-bold">(You)</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={u._id === currentAdminId || isPending}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 text-right">
                  {u._id !== currentAdminId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(u._id, u.fullName)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 p-2"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
