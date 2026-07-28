import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, MapPin, Calendar, Ruler, PawPrint, Syringe, Check, X,
  Baby, Cat, Dog, Activity, ShieldCheck, Sparkles, Send, AlertCircle, FileText,
} from 'lucide-react';
import { fetchPetById, submitApplication, fetchFavoritePetIds, addFavorite, removeFavorite } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { analyzeCompatibility } from '@/lib/ai';
import type { Pet, ApplicationData } from '@/types';
import {
  STATUS_COLORS, STATUS_LABELS, SIZE_LABELS, GENDER_LABELS, ageLabel,
  SPECIES_EMOJI, ACTIVITY_LABELS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [compatibility, setCompatibility] = useState<{ score: number; reasons: string[]; concerns: string[] } | null>(null);

  const [formData, setFormData] = useState<ApplicationData>({
    livingSpace: 'apartment',
    hasYard: false,
    householdMembers: 1,
    hasChildren: false,
    hasOtherPets: false,
    experience: 'none',
    workSchedule: '',
    reasonForAdoption: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPetById(id)
      .then((p) => {
        setPet(p);
        if (p && profile?.preferences) {
          const result = analyzeCompatibility(p, profile.preferences);
          setCompatibility(result);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    if (user) {
      fetchFavoritePetIds()
        .then((ids) => setIsFavorited(ids.includes(id!)))
        .catch(() => {});
    }
  }, [id, user, profile]);

  async function handleToggleFavorite() {
    if (!user || !pet) return;
    try {
      if (isFavorited) {
        await removeFavorite(pet.id);
        setIsFavorited(false);
      } else {
        await addFavorite(pet.id);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }

  async function handleSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      await submitApplication(pet!.id, formData);
      setSubmitSuccess(true);
      setSubmitting(false);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container-app section-padding py-20 text-center">
        <PawPrint className="mx-auto h-12 w-12 text-stone-300" />
        <h2 className="mt-4 text-2xl font-bold text-stone-900">Pet Not Found</h2>
        <p className="mt-2 text-stone-600">This pet may have been adopted or removed.</p>
        <Link to="/pets" className="mt-6 btn-primary">Browse All Pets</Link>
      </div>
    );
  }

  const traits = [
    { icon: pet.good_with_kids ? Check : X, label: 'Good with Kids', value: pet.good_with_kids, color: pet.good_with_kids ? 'text-emerald-600' : 'text-rose-400' },
    { icon: pet.good_with_pets ? Check : X, label: 'Good with Pets', value: pet.good_with_pets, color: pet.good_with_pets ? 'text-emerald-600' : 'text-rose-400' },
    { icon: pet.vaccinated ? Check : X, label: 'Vaccinated', value: pet.vaccinated, color: pet.vaccinated ? 'text-emerald-600' : 'text-rose-400' },
    { icon: pet.neutered ? Check : X, label: 'Spayed/Neutered', value: pet.neutered, color: pet.neutered ? 'text-emerald-600' : 'text-rose-400' },
  ];

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Pet Info */}
          <div>
            {/* Image */}
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/10] bg-stone-100">
                {pet.images?.[0] ? (
                  <img src={pet.images[0]} alt={pet.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-9xl">
                    {SPECIES_EMOJI[pet.species]}
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={cn('badge bg-white/90 backdrop-blur', STATUS_COLORS[pet.status])}>
                    {STATUS_LABELS[pet.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Name & Basic Info */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {pet.name}
                </h1>
                <span className="text-4xl">{SPECIES_EMOJI[pet.species]}</span>
              </div>
              <p className="mt-2 text-lg text-stone-600">{pet.breed}</p>
              {pet.location && (
                <div className="mt-3 flex items-center gap-1.5 text-stone-500">
                  <MapPin className="h-4 w-4" />
                  {pet.location}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 card p-6">
              <h2 className="text-lg font-semibold text-stone-900">About {pet.name}</h2>
              <p className="mt-3 text-stone-600 leading-relaxed">{pet.description}</p>

              {pet.temperament.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-stone-700">Temperament</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pet.temperament.map((t) => (
                      <span key={t} className="badge border-teal-200 bg-teal-50 text-teal-700">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icon: Calendar, label: 'Age', value: ageLabel(pet.age) },
                { icon: pet.species === 'DOG' ? Dog : Cat, label: 'Species', value: pet.species === 'DOG' ? 'Dog' : 'Cat' },
                { icon: Ruler, label: 'Size', value: SIZE_LABELS[pet.size] },
                { icon: PawPrint, label: 'Gender', value: GENDER_LABELS[pet.gender] },
                { icon: Activity, label: 'Activity', value: ACTIVITY_LABELS[pet.activity_level] },
                { icon: ShieldCheck, label: 'Health', value: pet.health_status },
              ].map((stat) => (
                <div key={stat.label} className="card p-4">
                  <div className="flex items-center gap-2 text-stone-400">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-stone-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="mt-6 card p-6">
              <h2 className="text-lg font-semibold text-stone-900">Care & Compatibility</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {traits.map((trait) => (
                  <div key={trait.label} className="flex items-center gap-2.5">
                    <trait.icon className={cn('h-5 w-5 flex-shrink-0', trait.color)} />
                    <span className="text-sm text-stone-700">{trait.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Compatibility */}
            {compatibility && (
              <div className="mt-6 card p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-stone-900">AI Compatibility Analysis</h2>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#e7e5e4" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34" fill="none" stroke="#0d9488" strokeWidth="6"
                        strokeDasharray={`${(compatibility.score / 100) * 213.6} 213.6`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-stone-900">{compatibility.score}%</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">
                      {compatibility.score >= 75 ? 'Great Match!' : compatibility.score >= 50 ? 'Good Match' : 'Fair Match'}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Based on your profile preferences
                    </p>
                  </div>
                </div>

                {compatibility.reasons.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-emerald-700">Why it's a match</h3>
                    <ul className="mt-2 space-y-1.5">
                      {compatibility.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {compatibility.concerns.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-amber-700">Things to consider</h3>
                    <ul className="mt-2 space-y-1.5">
                      {compatibility.concerns.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!profile?.preferences?.petType?.length && (
                  <div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
                    <Link to="/profile" className="font-medium text-teal-600 hover:underline">
                      Update your preferences
                    </Link>
                    {' '}for a more accurate compatibility analysis.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Adoption Action Card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">Adoption Fee</p>
                  <p className="text-2xl font-bold text-stone-900">
                    {pet.adoption_fee > 0 ? `$${pet.adoption_fee}` : 'Free'}
                  </p>
                </div>
                {user && (
                  <button
                    onClick={handleToggleFavorite}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 transition-all hover:scale-105"
                  >
                    <Heart className={cn('h-5 w-5', isFavorited ? 'fill-rose-500 text-rose-500' : 'text-stone-400')} />
                  </button>
                )}
              </div>

              {pet.status === 'AVAILABLE' ? (
                submitSuccess ? (
                  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="mt-3 font-semibold text-emerald-900">Application Submitted!</h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      We'll review your application and get back to you soon.
                    </p>
                    <Link to="/my-applications" className="mt-4 btn-secondary w-full text-sm">
                      View My Applications
                    </Link>
                  </div>
                ) : showApplication ? (
                  <form onSubmit={handleSubmitApplication} className="mt-6 space-y-4">
                    <h3 className="font-semibold text-stone-900">Adoption Application</h3>

                    {submitError && (
                      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Living Space</label>
                      <select
                        value={formData.livingSpace}
                        onChange={(e) => setFormData({ ...formData, livingSpace: e.target.value as ApplicationData['livingSpace'] })}
                        className="input-field"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="farm">Farm</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-stone-700">
                        <input type="checkbox" checked={formData.hasYard} onChange={(e) => setFormData({ ...formData, hasYard: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500" />
                        Has a yard
                      </label>
                      <label className="flex items-center gap-2 text-sm text-stone-700">
                        <input type="checkbox" checked={formData.hasChildren} onChange={(e) => setFormData({ ...formData, hasChildren: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500" />
                        Has children
                      </label>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Household Members</label>
                      <input type="number" min={1} value={formData.householdMembers} onChange={(e) => setFormData({ ...formData, householdMembers: Number(e.target.value) })} className="input-field" />
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-stone-700">
                        <input type="checkbox" checked={formData.hasOtherPets} onChange={(e) => setFormData({ ...formData, hasOtherPets: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500" />
                        Has other pets
                      </label>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Experience Level</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value as ApplicationData['experience'] })}
                        className="input-field"
                      >
                        <option value="none">No experience</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Work Schedule</label>
                      <input type="text" required value={formData.workSchedule} onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })} placeholder="e.g., 9-5, remote, flexible" className="input-field" />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">Reason for Adoption</label>
                      <textarea required rows={3} value={formData.reasonForAdoption} onChange={(e) => setFormData({ ...formData, reasonForAdoption: e.target.value })} placeholder="Why do you want to adopt this pet?" className="input-field resize-none" />
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                      {!submitting && <Send className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => setShowApplication(false)} className="btn-ghost w-full">
                      Cancel
                    </button>
                  </form>
                ) : user ? (
                  <div className="mt-6">
                    <button onClick={() => setShowApplication(true)} className="btn-primary w-full">
                      <FileText className="h-5 w-5" />
                      Start Adoption
                    </button>
                    <p className="mt-3 text-center text-xs text-stone-500">
                      Submit an application to begin the adoption process.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    <Link to="/login" className="btn-primary w-full">
                      Sign In to Adopt
                    </Link>
                    <p className="text-center text-xs text-stone-500">
                      You need an account to start an adoption application.
                    </p>
                  </div>
                )
              ) : (
                <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
                  <p className="text-sm text-stone-600">
                    {pet.status === 'PENDING'
                      ? 'This pet has a pending application. Check back soon!'
                      : 'This pet has found their forever home! 🎉'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
