import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon, Mail, MapPin, Phone, Save, Sparkles, Heart, FileText,
  PawPrint, Check, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, updatePreferences, fetchMyApplications, fetchFavorites } from '@/lib/api';
import type { UserPreferences, AdoptionApplication, Pet } from '@/types';
import { cn } from '@/lib/utils';

const EMPTY_PREFS: UserPreferences = {
  petType: [],
  size: [],
  age: null,
  activityLevel: null,
  experience: null,
  hasChildren: false,
  hasOtherPets: false,
};

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [prefs, setPrefs] = useState<UserPreferences>(EMPTY_PREFS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const [appCount, setAppCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhoneNumber(profile.phone_number ?? '');
      setAddress(profile.address ?? '');
      setLocation(profile.location ?? '');
      setPrefs(profile.preferences ?? EMPTY_PREFS);
    }
  }, [profile]);

  useEffect(() => {
    Promise.all([fetchMyApplications(), fetchFavorites()])
      .then(([apps, favs]) => {
        setAppCount(apps.length);
        setFavCount(favs.length);
      })
      .catch(() => {});
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await updateProfile(user!.id, {
        full_name: fullName,
        phone_number: phoneNumber || null,
        address: address || null,
        location: location || null,
      });
      await refreshProfile();
      setProfileSaved(true);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePrefs() {
    setSavingPrefs(true);
    setPrefsSaved(false);
    try {
      await updatePreferences(user!.id, prefs);
      await refreshProfile();
      setPrefsSaved(true);
    } catch (err) {
      console.error('Failed to update preferences:', err);
    } finally {
      setSavingPrefs(false);
    }
  }

  function toggleArrayValue(key: keyof UserPreferences, value: string) {
    setPrefs((prev) => {
      const arr = (prev[key] as string[]) ?? [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Profile
        </h1>
        <p className="mt-1 text-stone-600">Manage your account and adoption preferences.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: FileText, label: 'Applications', value: appCount, link: '/my-applications' },
            { icon: Heart, label: 'Favorites', value: favCount, link: '/favorites' },
            { icon: PawPrint, label: 'Role', value: profile?.role ?? 'USER' },
            { icon: Check, label: 'Verified', value: profile?.email_verified ? 'Yes' : 'No' },
          ].map((stat) => (
            stat.link ? (
              <Link key={stat.label} to={stat.link} className="card p-5 transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-stone-400">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-stone-900">{stat.value}</p>
              </Link>
            ) : (
              <div key={stat.label} className="card p-5">
                <div className="flex items-center gap-2 text-stone-400">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-stone-900">{stat.value}</p>
              </div>
            )
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Profile Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-stone-900">Account Information</h2>
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field pl-11" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input type="email" value={user?.email ?? ''} disabled className="input-field pl-11 bg-stone-50" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Optional" className="input-field pl-11" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" className="input-field" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" className="input-field pl-11" />
                </div>
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Check className="h-5 w-5" />
                  Profile updated successfully!
                </div>
              )}

              <button type="submit" disabled={savingProfile} className="btn-primary w-full">
                {savingProfile ? 'Saving...' : 'Save Changes'}
                {!savingProfile && <Save className="h-4 w-4" />}
              </button>
            </form>
          </div>

          {/* Preferences for AI Matching */}
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-stone-900">Adoption Preferences</h2>
            </div>
            <p className="mt-1 text-sm text-stone-500">These help our AI find the best pet matches for you.</p>

            <div className="mt-5 space-y-5">
              {/* Pet Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Preferred Pet Types</label>
                <div className="flex gap-2">
                  {['DOG', 'CAT'].map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleArrayValue('petType', type)}
                      className={cn(
                        'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                        prefs.petType.includes(type)
                          ? 'border-teal-300 bg-teal-50 text-teal-700'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      {type === 'DOG' ? '🐕 Dogs' : '🐱 Cats'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Preferred Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleArrayValue('size', size)}
                      className={cn(
                        'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                        prefs.size.includes(size as any)
                          ? 'border-teal-300 bg-teal-50 text-teal-700'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      {size.charAt(0) + size.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Activity Level</label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setPrefs({ ...prefs, activityLevel: prefs.activityLevel === level ? null : level as any })}
                      className={cn(
                        'flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                        prefs.activityLevel === level
                          ? 'border-teal-300 bg-teal-50 text-teal-700'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {['BEGINNER', 'INTERMEDIATE', 'EXPERIENCED'].map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setPrefs({ ...prefs, experience: prefs.experience === exp ? null : exp as any })}
                      className={cn(
                        'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                        prefs.experience === exp
                          ? 'border-teal-300 bg-teal-50 text-teal-700'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      {exp.charAt(0) + exp.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-700">Lifestyle</label>
                <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 cursor-pointer hover:bg-stone-50">
                  <input type="checkbox" checked={prefs.hasChildren} onChange={(e) => setPrefs({ ...prefs, hasChildren: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500" />
                  I have children at home
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 cursor-pointer hover:bg-stone-50">
                  <input type="checkbox" checked={prefs.hasOtherPets} onChange={(e) => setPrefs({ ...prefs, hasOtherPets: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500" />
                  I have other pets
                </label>
              </div>

              {prefsSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Check className="h-5 w-5" />
                  Preferences saved! Your AI matches will improve.
                </div>
              )}

              <button onClick={handleSavePrefs} disabled={savingPrefs} className="btn-primary w-full">
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
                {!savingPrefs && <Save className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
