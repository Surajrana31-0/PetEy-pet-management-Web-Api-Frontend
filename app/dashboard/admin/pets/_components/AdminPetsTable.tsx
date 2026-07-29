'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, PawPrint, ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Pet, PetStatus } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { deletePetAction } from '@/lib/actions/pet-actions';
import { toast } from 'sonner';

type SortField = 'name' | 'breed' | 'createdAt' | 'status';

export function AdminPetsTable({ initialPets }: { initialPets: Pet[] }) {
  const router = useRouter();
  const [pets] = useState<Pet[]>(initialPets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PetStatus | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = [...pets];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'breed':
          cmp = a.breed.localeCompare(b.breed);
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [pets, search, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleDelete = async (id: string) => {
    const formData = new FormData();
    formData.set('id', id);
    await deletePetAction(formData);
    toast.success('Pet deleted successfully');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pet Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, and manage pet listings.</p>
        </div>
        <Button asChild className="gradient-warm text-white">
          <Link href="/dashboard/admin/pets/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Pet
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PetStatus | 'ALL')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ADOPTED">Adopted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={PawPrint}
          title={search || statusFilter !== 'ALL' ? 'No pets match your filters' : 'No pets yet'}
          description={search || statusFilter !== 'ALL' ? 'Try adjusting your search or filters.' : 'Add your first pet listing to get started.'}
          action={
            !search && statusFilter === 'ALL' ? (
              <Button asChild className="gradient-warm text-white">
                <Link href="/dashboard/admin/pets/new"><Plus className="mr-2 h-4 w-4" /> Add Pet</Link>
              </Button>
            ) : undefined
          }
        />
      )}

      {filtered.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border shadow-card lg:block">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                      Pet <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('breed')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                      Breed <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Species</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Age</th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                      Created <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((pet) => (
                  <tr key={pet._id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}</span>
                        <span className="font-medium">{pet.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{pet.breed}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{pet.species}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{pet.age}</td>
                    <td className="px-4 py-3"><StatusBadge status={pet.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(pet.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="View pet">
                          <Link href={`/pets/${pet._id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit pet">
                          <Link href={`/dashboard/admin/pets/${pet._id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" aria-label="Delete pet">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title={`Delete ${pet.name}?`}
                          description="This action cannot be undone. The pet listing will be permanently removed."
                          confirmLabel="Delete"
                          onConfirm={() => handleDelete(pet._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {filtered.map((pet) => (
              <Card key={pet._id} className="border-border/60 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}</span>
                      <div>
                        <h3 className="font-semibold">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">{pet.breed} · {pet.age}</p>
                        <div className="mt-2"><StatusBadge status={pet.status} /></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="View">
                        <Link href={`/pets/${pet._id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit">
                        <Link href={`/dashboard/admin/pets/${pet._id}/edit`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title={`Delete ${pet.name}?`}
                        description="This action cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(pet._id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
