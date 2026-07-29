import Link from 'next/link';
import { Dog, Cat, Heart, Eye, MapPin } from 'lucide-react';
import type { Pet } from '@/lib/types';
import { StatusBadge } from '@/components/status-badge';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  className?: string;
}

const SPECIES_GRADIENTS: Record<string, string> = {
  DOG: 'from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20',
  CAT: 'from-teal-100 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/20',
};

export function PetCard({ pet, className }: PetCardProps) {
  const SpeciesIcon = pet.species === 'DOG' ? Dog : Cat;

  return (
    <Link
      href={`/pets/${pet._id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-shadow transition-all duration-300 hover:-translate-y-1 hover:card-shadow-hover',
        className
      )}
    >
      {/* Image area */}
      <div
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br',
          SPECIES_GRADIENTS[pet.species] || SPECIES_GRADIENTS.DOG
        )}
      >
        <div className="flex h-full items-center justify-center">
          <span className="text-7xl transition-transform duration-500 group-hover:scale-110">
            {pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}
          </span>
        </div>

        <div className="absolute left-3 top-3">
          <StatusBadge status={pet.status} />
        </div>

        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Eye className="h-4 w-4" />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
          <SpeciesIcon className="h-3.5 w-3.5 text-primary" />
          {pet.species}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight transition-colors group-hover:text-primary">
            {pet.name}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{pet.age} yr{pet.age !== 1 ? 's' : ''}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{pet.breed}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/80">{pet.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Available
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-destructive/10 group-hover:text-destructive">
            <Heart className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
