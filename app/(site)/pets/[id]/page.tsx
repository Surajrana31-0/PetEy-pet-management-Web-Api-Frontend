import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  PawPrint,
  Shield,
  Sparkles,
} from 'lucide-react';
import AnimateIn from '@/app/_components/AnimateIn';
import SafeImage from '@/app/_components/SafeImage';
import { Badge } from '@/components/ui/badge';
import { PetWishlistButton } from '@/components/pets/pet-wishlist-button';
import { petsApi } from '@/lib/api/pets';
import { PET_SPECIES_LABELS } from '@/lib/constants/pets';
import { getPetImage } from '@/lib/utils/pet-images';
import { PetStatus } from '@/lib/types/pet';

function statusVariant(status: PetStatus) {
  if (status === PetStatus.AVAILABLE) return 'success' as const;
  if (status === PetStatus.PENDING) return 'warning' as const;
  return 'muted' as const;
}

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let pet = null;
  try {
    const response = await petsApi.getById(id);
    if (response.success && response.data) {
      pet = response.data;
    }
  } catch {
    notFound();
  }

  if (!pet) notFound();

  const image = getPetImage(pet);

  return (
    <>
      <section className="pet-detail-hero">
        <div className="container">
          <AnimateIn immediate>
            <Link href="/adopt" className="pet-detail-back">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to browse
            </Link>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white section-white--compact">
        <div className="container">
          <div className="pet-detail-grid">
            <AnimateIn direction="scale" immediate>
              <div className="pet-detail-image-wrap">
                <SafeImage
                  src={image}
                  alt={`${pet.name} - ${pet.breed}`}
                  width={640}
                  height={480}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="pet-detail-image"
                />
                <span className="pet-species-badge">{PET_SPECIES_LABELS[pet.species]}</span>
              </div>
            </AnimateIn>

            <AnimateIn delay={100}>
              <div className="pet-detail-info">
                <div className="pet-detail-header">
                  <div>
                    <h1 className="pet-detail-name">{pet.name}</h1>
                    <p className="pet-detail-meta">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {pet.breed} · {pet.age}
                    </p>
                  </div>
                  <div className="pet-detail-actions">
                    <Badge variant={statusVariant(pet.status)}>{pet.status}</Badge>
                    <PetWishlistButton petId={pet._id} />
                  </div>
                </div>

                <p className="pet-detail-desc">{pet.description}</p>

                {pet.aiGeneratedDescription && (
                  <div className="pet-detail-ai">
                    <div className="pet-detail-ai-header">
                      <Sparkles className="h-5 w-5 text-brand" aria-hidden />
                      <span>AI personality insight</span>
                    </div>
                    <p>{pet.aiGeneratedDescription}</p>
                  </div>
                )}

                <div className="pet-detail-traits">
                  {pet.size && (
                    <div className="pet-detail-trait">
                      <PawPrint className="h-4 w-4" aria-hidden />
                      <span>Size: {pet.size.charAt(0) + pet.size.slice(1).toLowerCase()}</span>
                    </div>
                  )}
                  {pet.gender && (
                    <div className="pet-detail-trait">
                      <Heart className="h-4 w-4" aria-hidden />
                      <span>Gender: {pet.gender.charAt(0) + pet.gender.slice(1).toLowerCase()}</span>
                    </div>
                  )}
                  {pet.vaccinated !== undefined && (
                    <div className="pet-detail-trait">
                      <Shield className="h-4 w-4" aria-hidden />
                      <span>{pet.vaccinated ? 'Vaccinated' : 'Vaccination pending'}</span>
                    </div>
                  )}
                  {pet.energyLevel && (
                    <div className="pet-detail-trait">
                      <Calendar className="h-4 w-4" aria-hidden />
                      <span>Energy: {pet.energyLevel}</span>
                    </div>
                  )}
                </div>

                {pet.temperament && pet.temperament.length > 0 && (
                  <div className="pet-detail-tags">
                    {pet.temperament.map((trait) => (
                      <Badge key={trait} variant="outline">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}

                {pet.status === PetStatus.AVAILABLE ? (
                  <div className="pet-detail-cta">
                    <Link href="/register" className="btn-primary">
                      Start adoption process
                    </Link>
                    <Link href="/ai" className="btn-outline">
                      Check AI compatibility
                    </Link>
                  </div>
                ) : (
                  <p className="pet-detail-unavailable">
                    This pet is currently {pet.status.toLowerCase()}.{' '}
                    <Link href="/adopt" className="text-brand font-medium hover:underline">
                      Browse other available pets
                    </Link>
                  </p>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
