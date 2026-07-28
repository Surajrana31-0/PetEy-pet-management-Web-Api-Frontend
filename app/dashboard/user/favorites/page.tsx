'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles, Trash2 } from 'lucide-react';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UserFavoritesPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/user"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Saved Pets & Favorites
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your personal shortlist of pets you are considering for adoption.
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Clear All Saved
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-center py-16 px-4">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              ❤️
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Save pets to your favorites while browsing so you can easily review and compare them.
            </p>
            <Link
              href="/adopt"
              className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Browse Pets & Save Favorites
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((petId) => (
            <Card key={petId} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Saved Pet #{petId.slice(-4)}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(petId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ready to view details or start your adoption application for this pet?
                </p>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/pets/${petId}`}
                    className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-center text-xs font-bold text-slate-900 dark:text-white transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/pets/${petId}/adopt`}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-center text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    Apply Now
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
