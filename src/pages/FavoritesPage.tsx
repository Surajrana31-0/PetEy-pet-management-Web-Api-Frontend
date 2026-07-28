import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, PawPrint } from 'lucide-react';
import PetCard from '@/components/PetCard';
import { fetchFavorites, removeFavorite } from '@/lib/api';
import type { Pet } from '@/types';

export default function FavoritesPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    try {
      const favs = await fetchFavorites();
      setPets(favs.map((f) => f.pet).filter(Boolean) as Pet[]);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(petId: string) {
    try {
      await removeFavorite(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  }

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            <Heart className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              My Favorites
            </h1>
            <p className="text-stone-600">{pets.length} {pets.length === 1 ? 'pet' : 'pets'} saved</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
          </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
            <Heart className="h-12 w-12 text-stone-300" />
            <h3 className="mt-4 text-lg font-semibold text-stone-700">No favorites yet</h3>
            <p className="mt-1 text-sm text-stone-500">Browse pets and save the ones you love.</p>
            <Link to="/pets" className="mt-6 btn-primary">
              <PawPrint className="h-5 w-5" />
              Browse Pets
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="relative">
                <PetCard pet={pet} isFavorited onToggleFavorite={handleRemove} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
