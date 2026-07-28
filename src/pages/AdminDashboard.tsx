import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint, Users, FileText, TrendingUp, Plus, Edit2, Trash2,
  Check, X, Clock, AlertCircle, Heart, Search,
} from 'lucide-react';
import {
  fetchPets, fetchPetStats, createPet, updatePet, deletePet,
  fetchAllApplications, updateApplicationStatus,
} from '@/lib/api';
import type { Pet, AdoptionApplication, PetSpecies, PetStatus, PetSize, PetGender, ActivityLevel } from '@/types';
import {
  STATUS_LABELS, STATUS_COLORS, SIZE_LABELS, GENDER_LABELS, ageLabel,
  SPECIES_EMOJI, ADOPTION_STATUS_LABELS, ADOPTION_STATUS_COLORS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'pets' | 'applications';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [pets, setPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState({ total: 0, available: 0, pending: 0, adopted: 0 });
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [appFilter, setAppFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [petData, statData, appData] = await Promise.all([
        fetchPets({ limit: 100 }),
        fetchPetStats(),
        fetchAllApplications(),
      ]);
      setPets(petData.pets);
      setStats(statData);
      setApplications(appData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadApps() {
    try {
      const data = await fetchAllApplications(appFilter === 'all' ? undefined : appFilter);
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }

  useEffect(() => {
    if (tab === 'applications') loadApps();
  }, [appFilter, tab]);

  async function handleDeletePet(id: string) {
    if (!confirm('Are you sure you want to delete this pet?')) return;
    try {
      await deletePet(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete pet:', err);
      alert('Failed to delete pet. Please try again.');
    }
  }

  async function handleAppAction(id: string, status: string, notes?: string) {
    try {
      await updateApplicationStatus(id, status, notes);
      await loadApps();
    } catch (err) {
      console.error('Failed to update application:', err);
      alert('Failed to update application status.');
    }
  }

  const filteredPets = search
    ? pets.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.breed.toLowerCase().includes(search.toLowerCase())
      )
    : pets;

  const filteredApps = appFilter === 'all'
    ? applications
    : applications.filter((a) => a.status === appFilter);

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Admin Dashboard
          </h1>
          <p className="mt-1 text-stone-600">Manage pets, applications, and platform overview.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
          {[
            { key: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
            { key: 'pets' as Tab, label: 'Pets', icon: PawPrint },
            { key: 'applications' as Tab, label: 'Applications', icon: FileText, badge: pendingCount },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex-1 justify-center sm:flex-initial',
                tab === t.key ? 'bg-teal-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-bold text-amber-900">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { icon: PawPrint, label: 'Total Pets', value: stats.total, color: 'bg-teal-100 text-teal-600' },
                { icon: Heart, label: 'Available', value: stats.available, color: 'bg-emerald-100 text-emerald-600' },
                { icon: Clock, label: 'Pending', value: stats.pending, color: 'bg-amber-100 text-amber-600' },
                { icon: Check, label: 'Adopted', value: stats.adopted, color: 'bg-sky-100 text-sky-600' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-stone-900">{stat.value}</p>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Applications */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-900">Recent Applications</h2>
                  <button onClick={() => setTab('applications')} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                    View All
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-xl">
                        {app.pet ? SPECIES_EMOJI[app.pet.species] : '🐾'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">{app.pet?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-stone-500">{new Date(app.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <span className={cn('badge', ADOPTION_STATUS_COLORS[app.status])}>
                        {ADOPTION_STATUS_LABELS[app.status]}
                      </span>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="py-4 text-center text-sm text-stone-500">No applications yet.</p>
                  )}
                </div>
              </div>

              {/* Recent Pets */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-900">Recently Added Pets</h2>
                  <button onClick={() => setTab('pets')} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                    View All
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {pets.slice(0, 5).map((pet) => (
                    <Link key={pet.id} to={`/pets/${pet.id}`} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3 transition-colors hover:bg-stone-50">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-stone-100">
                        {pet.images?.[0] ? (
                          <img src={pet.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">{SPECIES_EMOJI[pet.species]}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">{pet.name}</p>
                        <p className="text-xs text-stone-500">{pet.breed}</p>
                      </div>
                      <span className={cn('badge', STATUS_COLORS[pet.status])}>
                        {STATUS_LABELS[pet.status]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pets Tab */}
        {tab === 'pets' && (
          <div>
            {showPetForm ? (
              <PetForm
                pet={editingPet}
                onClose={() => { setShowPetForm(false); setEditingPet(null); }}
                onSaved={() => { setShowPetForm(false); setEditingPet(null); loadAll(); }}
              />
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search pets..."
                      className="input-field pl-11"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingPet(null); setShowPetForm(true); }}
                    className="btn-primary"
                  >
                    <Plus className="h-5 w-5" />
                    Add Pet
                  </button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-stone-200 bg-stone-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-stone-700">Pet</th>
                          <th className="px-4 py-3 text-left font-semibold text-stone-700">Species</th>
                          <th className="px-4 py-3 text-left font-semibold text-stone-700">Age</th>
                          <th className="px-4 py-3 text-left font-semibold text-stone-700">Status</th>
                          <th className="px-4 py-3 text-right font-semibold text-stone-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredPets.map((pet) => (
                          <tr key={pet.id} className="transition-colors hover:bg-stone-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-lg bg-stone-100">
                                  {pet.images?.[0] ? (
                                    <img src={pet.images[0]} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xl">{SPECIES_EMOJI[pet.species]}</div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-stone-900">{pet.name}</p>
                                  <p className="text-xs text-stone-500">{pet.breed}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-stone-600">{SPECIES_EMOJI[pet.species]} {pet.species}</td>
                            <td className="px-4 py-3 text-stone-600">{ageLabel(pet.age)}</td>
                            <td className="px-4 py-3">
                              <span className={cn('badge', STATUS_COLORS[pet.status])}>
                                {STATUS_LABELS[pet.status]}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => { setEditingPet(pet); setShowPetForm(true); }}
                                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-teal-600"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePet(pet.id)}
                                  className="rounded-lg p-2 text-stone-500 hover:bg-rose-50 hover:text-rose-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {['all', 'pending', 'approved', 'rejected', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setAppFilter(status)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-all capitalize',
                    appFilter === status
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  )}
                >
                  {status === 'all' ? 'All' : ADOPTION_STATUS_LABELS[status as keyof typeof ADOPTION_STATUS_LABELS]}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div key={app.id} className="card p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left: Pet & Applicant Info */}
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {app.pet?.images?.[0] ? (
                          <img src={app.pet.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl">
                            {app.pet ? SPECIES_EMOJI[app.pet.species] : '🐾'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-900">{app.pet?.name ?? 'Unknown Pet'}</h3>
                          <span className={cn('badge', ADOPTION_STATUS_COLORS[app.status])}>
                            {ADOPTION_STATUS_LABELS[app.status]}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">{app.pet?.breed}</p>
                        <p className="mt-1 text-xs text-stone-400">
                          Submitted {new Date(app.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAppAction(app.id, 'approved')}
                          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          <Check className="mr-1 inline h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide a rejection reason:');
                            if (reason) handleAppAction(app.id, 'rejected', reason);
                          }}
                          className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          <X className="mr-1 inline h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'approved' && (
                      <button
                        onClick={() => handleAppAction(app.id, 'completed')}
                        className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-100"
                      >
                        <Check className="mr-1 inline h-4 w-4" />
                        Mark Completed
                      </button>
                    )}
                  </div>

                  {/* Application Details */}
                  {app.application_data && (
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-4 text-sm sm:grid-cols-3 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-stone-400">Living Space</p>
                        <p className="font-medium text-stone-700 capitalize">{app.application_data.livingSpace}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Household</p>
                        <p className="font-medium text-stone-700">{app.application_data.householdMembers} members</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Experience</p>
                        <p className="font-medium text-stone-700 capitalize">{app.application_data.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Has Yard</p>
                        <p className="font-medium text-stone-700">{app.application_data.hasYard ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Children</p>
                        <p className="font-medium text-stone-700">{app.application_data.hasChildren ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Other Pets</p>
                        <p className="font-medium text-stone-700">{app.application_data.hasOtherPets ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}

                  {app.application_data?.reasonForAdoption && (
                    <div className="mt-3 rounded-xl bg-stone-50 p-4">
                      <p className="text-xs text-stone-400">Reason for Adoption</p>
                      <p className="mt-1 text-sm text-stone-700">{app.application_data.reasonForAdoption}</p>
                    </div>
                  )}

                  {app.admin_notes && (
                    <div className="mt-3 rounded-xl border border-stone-200 p-4">
                      <p className="text-xs font-medium text-stone-400">Admin Notes</p>
                      <p className="mt-1 text-sm text-stone-700">{app.admin_notes}</p>
                    </div>
                  )}
                </div>
              ))}
              {filteredApps.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
                  <FileText className="h-10 w-10 text-stone-300" />
                  <p className="mt-3 text-sm text-stone-500">No applications in this category.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pet Form Component ─────────────────────────────────────

interface PetFormProps {
  pet: Pet | null;
  onClose: () => void;
  onSaved: () => void;
}

function PetForm({ pet, onClose, onSaved }: PetFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    age: number;
    breed: string;
    species: PetSpecies;
    description: string;
    status: PetStatus;
    size: PetSize;
    gender: PetGender;
    location: string;
    adoption_fee: number;
    good_with_kids: boolean;
    good_with_pets: boolean;
    vaccinated: boolean;
    neutered: boolean;
    health_status: string;
    activity_level: ActivityLevel;
    images: string;
    temperament: string;
  }>({
    name: pet?.name ?? '',
    age: pet?.age ?? 0,
    breed: pet?.breed ?? '',
    species: pet?.species ?? 'DOG',
    description: pet?.description ?? '',
    status: pet?.status ?? 'AVAILABLE',
    size: pet?.size ?? 'MEDIUM',
    gender: pet?.gender ?? 'MALE',
    location: pet?.location ?? '',
    adoption_fee: pet?.adoption_fee ?? 0,
    good_with_kids: pet?.good_with_kids ?? false,
    good_with_pets: pet?.good_with_pets ?? false,
    vaccinated: pet?.vaccinated ?? false,
    neutered: pet?.neutered ?? false,
    health_status: pet?.health_status ?? 'Healthy',
    activity_level: pet?.activity_level ?? 'MEDIUM',
    images: pet?.images?.join(', ') ?? '',
    temperament: pet?.temperament?.join(', ') ?? '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const petData = {
      name: form.name,
      age: Number(form.age),
      breed: form.breed,
      species: form.species as PetSpecies,
      description: form.description,
      status: form.status as PetStatus,
      size: form.size as PetSize,
      gender: form.gender as PetGender,
      location: form.location || null,
      adoption_fee: Number(form.adoption_fee),
      good_with_kids: form.good_with_kids,
      good_with_pets: form.good_with_pets,
      vaccinated: form.vaccinated,
      neutered: form.neutered,
      health_status: form.health_status,
      activity_level: form.activity_level as ActivityLevel,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      temperament: form.temperament.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (pet) {
        await updatePet(pet.id, petData);
      } else {
        await createPet(petData);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save pet');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">{pet ? 'Edit Pet' : 'Add New Pet'}</h2>
        <button onClick={onClose} className="btn-ghost">
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Breed *</label>
            <input type="text" required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Species *</label>
            <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as PetSpecies })} className="input-field">
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Age *</label>
            <input type="number" required min={0} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PetStatus })} className="input-field">
              <option value="AVAILABLE">Available</option>
              <option value="PENDING">Pending</option>
              <option value="ADOPTED">Adopted</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Size</label>
            <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value as PetSize })} className="input-field">
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as PetGender })} className="input-field">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Activity Level</label>
            <select value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value as ActivityLevel })} className="input-field">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Adoption Fee ($)</label>
            <input type="number" min={0} value={form.adoption_fee} onChange={(e) => setForm({ ...form, adoption_fee: Number(e.target.value) })} className="input-field" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Description *</label>
          <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Health Status</label>
          <input type="text" value={form.health_status} onChange={(e) => setForm({ ...form, health_status: e.target.value })} className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Image URLs (comma-separated)</label>
          <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="input-field" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Temperament (comma-separated)</label>
          <input type="text" value={form.temperament} onChange={(e) => setForm({ ...form, temperament: e.target.value })} placeholder="Friendly, Energetic, Loyal" className="input-field" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { key: 'good_with_kids' as const, label: 'Good with Kids' },
            { key: 'good_with_pets' as const, label: 'Good with Pets' },
            { key: 'vaccinated' as const, label: 'Vaccinated' },
            { key: 'neutered' as const, label: 'Spayed/Neutered' },
          ].map((field) => (
            <label key={field.key} className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 cursor-pointer hover:bg-stone-50">
              <input
                type="checkbox"
                checked={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
              />
              {field.label}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : pet ? 'Update Pet' : 'Create Pet'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
