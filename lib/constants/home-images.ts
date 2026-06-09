/** Verified Unsplash URLs — use auto=format for reliable Next.js image optimization */
export const HOME_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&h=800&q=80',
  heroAccent: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=400&q=80',
  cta: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&h=700&q=80',
  fallback: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&h=450&q=80',
  petDefaults: {
    DOG: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&h=450&q=80',
    CAT: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&h=450&q=80',
  },
  featured: [
    'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=600&h=450&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&h=450&q=80',
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=600&h=450&q=80',
    'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=600&h=450&q=80',
  ],
  testimonials: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  ],
} as const;

export function getPetImage(species: string, index = 0): string {
  if (species === 'CAT') {
    return HOME_IMAGES.featured[1] ?? HOME_IMAGES.petDefaults.CAT;
  }
  return HOME_IMAGES.featured[index % HOME_IMAGES.featured.length] ?? HOME_IMAGES.petDefaults.DOG;
}
