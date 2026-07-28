import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight, PawPrint, Star, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchPets } from '@/lib/api';
import { matchPetsForUser, getRecommendations } from '@/lib/ai';
import type { Pet, PetRecommendation } from '@/types';
import { SPECIES_EMOJI, ageLabel, SIZE_LABELS } from '@/lib/constants';

export default function AIMatchingPage() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<PetRecommendation[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'matches' | 'all'>('matches');

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    setLoading(true);
    try {
      const { pets: data } = await fetchPets({ status: 'AVAILABLE', limit: 100 });
      setPets(data);
      if (profile?.preferences) {
        const recs = getRecommendations(data, profile.preferences);
        setRecommendations(recs);
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoading(false);
    }
  }

  const hasPrefs = profile?.preferences && (
    profile.preferences.petType?.length > 0 ||
    profile.preferences.size?.length > 0 ||
    profile.preferences.activityLevel ||
    profile.preferences.experience
  );

  const displayed = view === 'matches' ? recommendations.slice(0, 10) : recommendations;

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <Sparkles className="h-4 w-4" />
            AI-Powered Matching
          </div>
          <h1 className="mt-4 text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Pet Matches
          </h1>
          <p className="mt-2 text-stone-600">
            Based on your preferences, here are the pets that best match your lifestyle.
          </p>
        </div>

        {!hasPrefs && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Set Your Preferences for Better Matches</h3>
              <p className="mt-1 text-sm text-amber-700">
                To get accurate AI matches, please set your pet preferences in your profile first.
              </p>
              <Link to="/profile" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900">
                Update Preferences
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
            <PawPrint className="h-12 w-12 text-stone-300" />
            <h3 className="mt-4 text-lg font-semibold text-stone-700">No matches found</h3>
            <p className="mt-1 text-sm text-stone-500">There may not be available pets right now. Check back soon!</p>
            <Link to="/pets" className="mt-6 btn-primary">Browse All Pets</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((rec, index) => {
              const pet = pets.find((p) => p.id === rec.petId);
              const scoreColor = rec.matchScore >= 75 ? 'text-emerald-600' : rec.matchScore >= 50 ? 'text-amber-600' : 'text-rose-500';
              const scoreBg = rec.matchScore >= 75 ? 'bg-emerald-50 border-emerald-200' : rec.matchScore >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200';

              return (
                <div key={rec.petId} className="card overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image / Number */}
                    <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 bg-stone-100">
                      {rec.image ? (
                        <img src={rec.image} alt={rec.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-6xl">
                          {SPECIES_EMOJI[rec.species as keyof typeof SPECIES_EMOJI] ?? '🐾'}
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900/80 text-sm font-bold text-white backdrop-blur">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-stone-900">{rec.name}</h3>
                            <span className="text-xl">{SPECIES_EMOJI[rec.species as keyof typeof SPECIES_EMOJI]}</span>
                          </div>
                          <p className="text-sm text-stone-500">{rec.breed} · {ageLabel(rec.age)} · {SIZE_LABELS[pet?.size ?? 'MEDIUM']}</p>
                        </div>

                        {/* Score */}
                        <div className={`flex flex-col items-center rounded-xl border px-3 py-2 ${scoreBg}`}>
                          <span className={`text-2xl font-bold ${scoreColor}`}>{rec.matchScore}%</span>
                          <span className="text-xs text-stone-500">Match</span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-stone-600">{rec.recommendation}</p>

                      {/* Reasons */}
                      {rec.reasons.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Why it's a match</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {rec.reasons.map((r, i) => (
                              <span key={i} className="badge border-emerald-200 bg-emerald-50 text-emerald-700">
                                <Check className="h-3 w-3" />
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Concerns */}
                      {rec.concerns.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Things to consider</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {rec.concerns.map((c, i) => (
                              <span key={i} className="badge border-amber-200 bg-amber-50 text-amber-700">
                                <AlertCircle className="h-3 w-3" />
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-3">
                        <Link to={`/pets/${rec.petId}`} className="btn-secondary text-sm">
                          View Profile
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/profile" className="btn-ghost text-sm">
                          <Star className="h-4 w-4" />
                          Refine Matches
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
