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
      setSortAsc(false);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Pet Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, and manage pet listings.</p>
        </div>
        <EmptyState
          icon={PawPrint}
          title="No pets listed yet"
          description="Create your first pet listing to get started."
          action={
            <Button asChild className="gradient-warm text-white">
              <Link href="/dashboard/admin/pets/new"><Plus className="mr-2 h-4 w-4" /> Add New Pet</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pet Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, edit, and manage pet listings.</p>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-card">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 border-0 bg-muted/50 focus-visible:ring-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PetStatus | 'ALL')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ADOPTED">Adopted</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild className="gradient-warm text-white">
                <Link href="/dashboard/admin/pets/new">
                  <Plus className="mr-2 h-4 w-4" /> Add New Pet
                </Link>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('name')}>
                      Pet <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Species</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('breed')}>
                      Breed <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('status')}>
                      Status <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('createdAt')}>
                      Created <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No pets match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((pet) => (
                    <tr key={pet._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}</span>
                          <div>
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-xs text-muted-foreground">{pet.age} years old</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{pet.species}</td>
                      <td className="px-4 py-3">{pet.breed}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={pet.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(pet.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="View pet">
                            <Link href={`/dashboard/admin/pets/${pet._id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit pet">
                            <Link href={`/dashboard/admin/pets/${pet._id}/edit`}><Pencil className="h-4 w-4" /></Link>
                          </Button>
                          <ConfirmDialog
                            title="Delete Pet"
                            description={`Are you sure you want to delete ${pet.name}? This action cannot be undone.`}
                            onConfirm={async () => {
                              const result = await deletePetAction(pet._id);
                              if (result.success) {
                                toast.success('Pet deleted successfully');
                                router.refresh();
                              } else {
                                toast.error(result.message || 'Failed to delete pet');
                              }
                            }}
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" aria-label="Delete pet">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filtered.length > 0 && !search && statusFilter === 'ALL' && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filtered.length} pets</p>
        </div>
      )}
    </div>
  );
}
