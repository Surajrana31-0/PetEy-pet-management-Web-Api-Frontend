'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useWishlist } from '@/lib/hooks/use-wishlist';

interface PetWishlistButtonProps {
  petId: string;
  className?: string;
}

export function PetWishlistButton({ petId, className }: PetWishlistButtonProps) {
  const { toggle, isWishlisted, ready } = useWishlist();
  const wishlisted = ready && isWishlisted(petId);

  return (
    <button
      type="button"
      onClick={() => toggle(petId)}
      className={cn(
        'rounded-xl p-2.5 border border-border transition-colors',
        wishlisted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-surface text-muted hover:text-foreground',
        className,
      )}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
    >
      <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
    </button>
  );
}
