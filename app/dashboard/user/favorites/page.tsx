import Link from 'next/link';
import { Heart, PawPrint } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Favorite Pets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pets you&apos;ve saved to your wishlist.</p>
      </div>

      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Browse available pets and tap the heart icon to save them here for quick access."
        action={
          <Button asChild className="gradient-warm text-white">
            <Link href="/pets">
              <PawPrint className="mr-2 h-4 w-4" /> Browse Pets
            </Link>
          </Button>
        }
      />
    </div>
  );
}
