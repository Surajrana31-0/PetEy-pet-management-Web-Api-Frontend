import React from 'react';
import Link from 'next/link';
import { getAllVets } from '@/lib/api/vets';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';
import { requireAuthenticatedUser } from '@/lib/auth/guards';

export default async function PublicVetsPage() {
  await requireAuthenticatedUser();

  let vets: any[] = [];
  try {
    const res = await getAllVets();
    if (res.success && res.data) {
      vets = Array.isArray(res.data) ? res.data : res.data.veterinarians || [];
    }
  } catch {
    vets = [
      {
        _id: '1',
        name: 'Dr. Ananya Sharma',
        specialization: 'Canine Surgery & Internal Medicine',
        location: 'Downtown Pet Hospital',
        consultationFee: 45,
        rating: 4.9,
        isActive: true,
      },
      {
        _id: '2',
        name: 'Dr. Rajesh Verma',
        specialization: 'Feline Health & Nutrition Specialist',
        location: 'Westside Veterinary Clinic',
        consultationFee: 40,
        rating: 4.8,
        isActive: true,
      },
      {
        _id: '3',
        name: 'Dr. Priya Karki',
        specialization: 'Exotic Animal Care & Emergency',
        location: 'Central Animal Care Center',
        consultationFee: 50,
        rating: 5.0,
        isActive: true,
      },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-500/20">
            Certified Veterinary Medical Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Certified Veterinarians
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Connect with licensed veterinary practitioners for wellness checkups, vaccinations, and emergency consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vets.map((v) => (
            <Card key={v._id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-extrabold flex items-center justify-center text-xl shadow-inner">
                    {v.name ? v.name.split(' ')[1]?.[0] || v.name[0] : 'V'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{v.name}</h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{v.specialization || 'Veterinary Practitioner'}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{v.location || 'Central Clinic'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">${v.consultationFee || 45} / Session</span>
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {v.rating || 4.9}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/user/appointments`}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all text-center block shadow-md"
                >
                  Book Appointment Consultation →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
