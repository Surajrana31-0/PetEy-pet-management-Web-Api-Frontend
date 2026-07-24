'use client';

import { useCallback, useEffect, useState } from 'react';
import { WISHLIST_STORAGE_KEY } from '@/lib/constants/pets';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      setWishlist(stored ? (JSON.parse(stored) as string[]) : []);
    } catch {
      setWishlist([]);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((ids: string[]) => {
    setWishlist(ids);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const toggle = useCallback(
    (petId: string) => {
      setWishlist((prev) => {
        const next = prev.includes(petId)
          ? prev.filter((id) => id !== petId)
          : [...prev, petId];
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const isWishlisted = useCallback((petId: string) => wishlist.includes(petId), [wishlist]);

  return { wishlist, toggle, isWishlisted, ready, persist };
}
