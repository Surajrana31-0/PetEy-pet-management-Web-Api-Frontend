'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Sparkles, Wand2 } from 'lucide-react';
import AnimateIn from '@/app/_components/AnimateIn';
import SafeImage from '@/app/_components/SafeImage';
import { aiMatchAction } from '@/lib/actions/ai-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PET_SPECIES_LABELS } from '@/lib/constants/pets';
import { getPetImage } from '@/lib/utils/pet-images';
import { PetSpecies, PetStatus, type IAiPetMatch } from '@/lib/types/pet';

const DEMO_MATCHES: IAiPetMatch[] = [
  { pet: { _id: 'demo-1', name: 'Luna', age: 2, breed: 'Golden Retriever', species: PetSpecies.DOG, description: 'Friendly and energetic, loves playing fetch.', emoji: '🐕', status: PetStatus.AVAILABLE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, score: 92, reason: 'Great match for active families.' },
  { pet: { _id: 'demo-2', name: 'Milo', age: 1, breed: 'Persian Cat', species: PetSpecies.CAT, description: 'Gentle and affectionate, perfect for calm households.', emoji: '🐈', status: PetStatus.AVAILABLE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, score: 87, reason: 'Ideal for apartment living.' },
];

export function AiMatcherPreview() {
  const [isPending, startTransition] = useTransition();
  const [matches, setMatches] = useState<IAiPetMatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedDemo, setUsedDemo] = useState(false);
  const [form, setForm] = useState({ lifestyle: 'moderate', housingType: 'house', hasChildren: false, hasOtherPets: false, activityLevel: 'moderate', preferences: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setUsedDemo(false);
    startTransition(async () => {
      const result = await aiMatchAction();
      if (result.success && result.matches.length > 0) { setMatches(result.matches); return; }
      setUsedDemo(true); setMatches(DEMO_MATCHES);
      if (!result.success) { setError(result.message ?? 'AI service unavailable — showing sample matches.'); }
    });
  };

  return (
    <div className="ai-matcher"><div className="ai-matcher-grid">
      <AnimateIn><form onSubmit={handleSubmit} className="ai-matcher-form">
        <h2 className="ai-matcher-form-title">Tell us about your lifestyle</h2>
        <p className="ai-matcher-form-desc">Our AI analyzes your preferences to recommend pets with the best compatibility.</p>
        <div className="ai-form-field"><label htmlFor="lifestyle">Living situation</label>
          <select id="lifestyle" value={form.lifestyle} onChange={(e)=>setForm((f)=>({...f,lifestyle:e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
            <option value="active">Active & outdoorsy</option><option value="moderate">Balanced lifestyle</option><option value="calm">Calm & relaxed</option>
          </select>
        </div>
        <div className="ai-form-field"><label htmlFor="housingType">Home type</label>
          <select id="housingType" value={form.housingType} onChange={(e)=>setForm((f)=>({...f,housingType:e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
            <option value="apartment">Apartment</option><option value="house">House with yard</option><option value="condo">Condo / townhouse</option>
          </select>
        </div>
        <div className="ai-form-field"><label htmlFor="activityLevel">Activity level</label>
          <select id="activityLevel" value={form.activityLevel} onChange={(e)=>setForm((f)=>({...f,activityLevel:e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
            <option value="low">Low — prefer quiet companions</option><option value="moderate">Moderate — daily walks & play</option><option value="high">High — runs, hikes, adventures</option>
          </select>
        </div>
        <div className="ai-form-checkboxes">
          <label className="ai-checkbox"><input type="checkbox" checked={form.hasChildren} onChange={(e)=>setForm((f)=>({...f,hasChildren:e.target.checked}))}/> I have children at home</label>
          <label className="ai-checkbox"><input type="checkbox" checked={form.hasOtherPets} onChange={(e)=>setForm((f)=>({...f,hasOtherPets:e.target.checked}))}/> I have other pets</label>
        </div>
        <div className="ai-form-field"><label htmlFor="preferences">Anything else we should know?</label><Textarea id="preferences" value={form.preferences} onChange={(e)=>setForm((f)=>({...f,preferences:e.target.value}))} placeholder="e.g. Prefer a hypoallergenic breed..." rows={4}/></div>
        <Button type="submit" isLoading={isPending} className="w-full"><Wand2 className="h-4 w-4"/> Find my perfect match</Button>
      </form></AnimateIn>
      <div className="ai-matcher-results">
        {matches === null ? (
          <AnimateIn delay={100}><div className="ai-matcher-empty"><div className="ai-matcher-empty-icon"><Sparkles className="h-8 w-8"/></div><h3>Your AI matches will appear here</h3><p>Fill in your lifestyle preferences and let our AI find companions that fit your home.</p></div></AnimateIn>
        ) : (
          <>
            {error && <p className="ai-matcher-notice" role="status">{error}</p>}
            {usedDemo && !error && <p className="ai-matcher-notice" role="status">Showing sample matches — sign in for personalized recommendations.</p>}
            <div className="ai-match-list">
              {matches.map((match, index) => (
                <AnimateIn key={match.pet._id} delay={index * 80}>
                  <article className="ai-match-card">
                    <div className="ai-match-image"><SafeImage src={getPetImage(match.pet, index)} alt={match.pet.name} width={120} height={120} className="rounded-xl object-cover w-full h-full"/></div>
                    <div className="ai-match-body">
                      <div className="ai-match-header"><div><h3>{match.pet.name}</h3><p>{match.pet.breed} · {PET_SPECIES_LABELS[match.pet.species]}</p></div><Badge variant="success">{match.score}% match</Badge></div>
                      <p className="ai-match-reason">{match.reason}</p>
                      {match.pet._id.startsWith('demo') ? <Link href="/adopt" className="ai-match-link">Browse all pets →</Link> : <Link href={`/pets/${match.pet._id}`} className="ai-match-link">View profile →</Link>}
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
            <div className="ai-matcher-cta"><p>Want full AI recommendations and chat?</p><Link href="/register" className="btn-primary">Create free account</Link></div>
          </>
        )}
      </div>
    </div></div>
  );
}
