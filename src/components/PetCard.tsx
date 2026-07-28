import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import type { Pet } from '@/types';
import { STATUS_COLORS, STATUS_LABELS, SIZE_LABELS, ageLabel, SPECIES_EMOJI } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  isFavorited?: boolean;
  onToggleFavorite?: (petId: string) => void;
}

export default function PetCard({ pet, isFavorited, onToggleFavorite }: PetCardProps) {
  const imageUrl = pet.images?.[0];
  return (
    <Link to={`/pets/${pet.id}`} className="group card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img src={imageUrl} alt={pet.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">{SPECIES_EMOJI[pet.species]}</div>
        )}
        <div className="absolute top-3 left-3"><span className={cn('badge bg-white/90 backdrop-blur', STATUS_COLORS[pet.status])}>{STATUS_LABELS[pet.status]}</span></div>
        {onToggleFavorite && (
          <button onClick={(e) => { e.preventDefault(); onToggleFavorite(pet.id); }} className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition-all hover:scale-110">
            <Heart className={cn('h-5 w-5 transition-colors', isFavorited ? 'fill-rose-500 text-rose-500' : 'text-stone-400')} />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div><h3 className="text-lg font-semibold text-stone-900">{pet.name}</h3><p className="text-sm text-stone-500">{pet.breed}</p></div>
          <span className="text-2xl">{SPECIES_EMOJI[pet.species]}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge border-stone-200 bg-stone-50 text-stone-600">{ageLabel(pet.age)}</span>
          <span className="badge border-stone-200 bg-stone-50 text-stone-600">{SIZE_LABELS[pet.size]}</span>
          <span className="badge border-stone-200 bg-stone-50 text-stone-600 capitalize">{pet.gender.toLowerCase()}</span>
        </div>
        {pet.location && (<div className="mt-4 flex items-center gap-1.5 text-sm text-stone-500"><MapPin className="h-4 w-4" />{pet.location}</div>)}
        {pet.good_with_kids && pet.good_with_pets && (<div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600"><Heart className="h-3.5 w-3.5" />Great with kids & other pets</div>)}
      </div>
    </Link>
  );
}
