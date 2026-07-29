'use client';

import Link from 'next/link';
import { Heart, LayoutGrid, List, MapPin } from 'lucide-react';
import SafeImage from '@/app/_components/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { getPetImage } from '@/lib/utils/pet-images';
import { PET_SPECIES_LABELS } from '@/lib/constants/pets';
import { PetStatus, type IPet } from '@/lib/types/pet';

interface PublicPetCardProps {
  pet: IPet;
  index?: number;
  view?: 'grid' | 'list';
  isWishlisted?: boolean;
  onToggleWishlist?: (petId: string) => void;
  onQuickPreview?: (pet: IPet) => void;
}

function statusVariant(status: PetStatus) {
  if (status === PetStatus.AVAILABLE) return 'success' as const;
  if (status === PetStatus.PENDING) return 'warning' as const;
  return 'muted' as const;
}

export function PublicPetCard({
  pet,
  index = 0,
  view = 'grid',
  isWishlisted,
  onToggleWishlist,
  onQuickPreview,
}: PublicPetCardProps) {
  const image = getPetImage(pet, index);

  if (view === 'list') {
    return (
      <article className="pet-card pet-card--list pet-card--animated">
        <Link href={`/pets/${pet._id}`} className="pet-card-list-image">
          <SafeImage
            src={image}
            alt={`${pet.name} - ${pet.breed}`}
            width={200}
            height={160}
            className="pet-image"
          />
        </Link>
        <div className="pet-card-list-body">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Link href={`/pets/${pet._id}`} className="pet-name hover:text-brand transition-colors">
                  {pet.name}
                </Link>
                <Badge variant={statusVariant(pet.status ?? PetStatus.AVAILABLE)}>{pet.status}</Badge>
              </div>
              <p className="pet-breed">
                {pet.breed} · {PET_SPECIES_LABELS[pet.species]} · {pet.age}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={() => onToggleWishlist(pet._id)}
                  className={cn(
                    'rounded-xl p-2 transition-colors',
                    isWishlisted ? 'text-red-500 bg-red-50' : 'text-muted hover:bg-secondary',
                  )}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={isWishlisted}
                >
                  <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
                </button>
              )}
            </div>
          </div>
          <p className="pet-desc line-clamp-2">{pet.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {onQuickPreview && (
              <Button variant="outline" size="sm" onClick={() => onQuickPreview(pet)}>
                Quick preview
              </Button>
            )}
            <Link href={`/pets/${pet._id}`}>
              <Button size="sm">View details</Button>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="pet-card pet-card--animated h-full flex flex-col">
      <div className="pet-image-wrap relative group">
        <Link href={`/pets/${pet._id}`}>
          <SafeImage
            src={image}
            alt={`${pet.name} - ${pet.breed}`}
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, 25vw"
            className="pet-image"
          />
        </Link>
        <div className="pet-image-overlay" />
        <span className="pet-age-badge">{pet.age}</span>
        <span className="pet-species-badge">{PET_SPECIES_LABELS[pet.species]}</span>
        {onToggleWishlist && (
          <button
            type="button"
            onClick={() => onToggleWishlist(pet._id)}
            className={cn(
              'absolute top-3 right-3 z-10 rounded-full p-2.5 shadow-md transition-all',
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:scale-105',
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>
        )}
        {onQuickPreview && (
          <button
            type="button"
            onClick={() => onQuickPreview(pet)}
            className="absolute inset-x-4 bottom-4 z-10 rounded-xl bg-white/95 py-2 text-sm font-semibold text-foreground opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0"
          >
            Quick preview
          </button>
        )}
      </div>
      <div className="pet-info flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Link href={`/pets/${pet._id}`} className="pet-name hover:text-brand transition-colors">
            {pet.name}
          </Link>
          <Badge variant={statusVariant(pet.status ?? PetStatus.AVAILABLE)}>{pet.status}</Badge>
        </div>
        <div className="pet-breed flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {pet.breed}
        </div>
        <p className="pet-desc flex-1">{pet.description}</p>
        <Link href={`/pets/${pet._id}`} className="btn-primary pet-meet-btn mt-auto">
          Meet {pet.name}
        </Link>
      </div>
    </article>
  );
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-1" role="group" aria-label="View mode">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={cn(
          'rounded-lg p-2 transition-colors',
          view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground',
        )}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={cn(
          'rounded-lg p-2 transition-colors',
          view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground',
        )}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
