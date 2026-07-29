'use client';

import Link from 'next/link';
import { MapPin, Sparkles } from 'lucide-react';
import SafeImage from '@/app/_components/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PET_SPECIES_LABELS } from '@/lib/constants/pets';
import { getPetImage } from '@/lib/utils/pet-images';
import { PetStatus, type IPet } from '@/lib/types/pet';

interface PetQuickPreviewProps {
  pet: IPet | null;
  index?: number;
  onClose: () => void;
}

function statusVariant(status: PetStatus) {
  if (status === PetStatus.AVAILABLE) return 'success' as const;
  if (status === PetStatus.PENDING) return 'warning' as const;
  return 'muted' as const;
}

export function PetQuickPreview({ pet, index = 0, onClose }: PetQuickPreviewProps) {
  if (!pet) return null;

  const image = getPetImage(pet, index);

  return (
    <Dialog
      open={!!pet}
      onClose={onClose}
      title={pet.name}
      description={`${pet.breed} · ${PET_SPECIES_LABELS[pet.species]} · ${pet.age}`}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
          <SafeImage
            src={image}
            alt={`${pet.name} - ${pet.breed}`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(pet.status ?? PetStatus.AVAILABLE)}>{pet.status}</Badge>
          {pet.temperament?.slice(0, 3).map((trait) => (
            <Badge key={trait} variant="outline">
              {trait}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted leading-relaxed">{pet.description}</p>

        {pet.aiGeneratedDescription && (
          <div className="rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden />
              AI insight
            </div>
            <p className="text-sm text-muted leading-relaxed">{pet.aiGeneratedDescription}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/pets/${pet._id}`} className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto">View full profile</Button>
          </Link>
          <Link href="/register" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto">
              Start adoption
            </Button>
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
