import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Sparkles, PawPrint, Baby, Home as HomeIcon, Search, Star, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PetCard from '@/components/PetCard';
import { fetchFeaturedPets, fetchPetStats } from '@/lib/api';
import type { Pet } from '@/types';

export default function LandingPage() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState({ total: 0, available: 0, pending: 0, adopted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedPets(6), fetchPetStats()])
      .then(([pets, s]) => {
        setFeaturedPets(pets);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-stone-50 to-amber-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="container-app relative section-padding py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered Pet Matching
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-stone-900 sm:text-5xl lg:text-6xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Find Your <span className="text-teal-600">Perfect</span> Companion
              </h1>
              <p className="mt-6 max-w-lg text-lg text-stone-600 leading-relaxed">
                PetEy uses AI to match you with pets that fit your lifestyle. Browse adoptable pets,
                get personalized recommendations, and start your adoption journey today.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/pets" className="btn-primary text-base">
                  Browse Pets
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/register" className="btn-secondary text-base">
                  Create Account
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-stone-900">{stats.total}</div>
                  <div className="text-sm text-stone-500">Pets Listed</div>
                </div>
                <div className="h-12 w-px bg-stone-300" />
                <div>
                  <div className="text-3xl font-bold text-stone-900">{stats.available}</div>
                  <div className="text-sm text-stone-500">Available Now</div>
                </div>
                <div className="h-12 w-px bg-stone-300" />
                <div>
                  <div className="text-3xl font-bold text-stone-900">{stats.adopted}</div>
                  <div className="text-sm text-stone-500">Adopted</div>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg"
                      alt="Happy dog"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg"
                      alt="Happy cat"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="https://images.pexels.com/photos/1490903/pexels-photo-1490903.jpeg"
                      alt="Adoptable dog"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="https://images.pexels.com/photos/2223336/pexels-photo-2223336.jpeg"
                      alt="Adoptable cat"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                  <Heart className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900">Loving Homes</div>
                  <div className="text-xs text-stone-500">Find the right match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding py-20">
        <div className="container-app">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How PetEy Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
              We make pet adoption simple, transparent, and powered by AI to help you find the right companion.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: 'Browse Pets', desc: 'Filter by species, size, age, and more to find pets near you.', color: 'bg-teal-100 text-teal-600' },
              { icon: Sparkles, title: 'AI Matching', desc: 'Our smart algorithm matches pets to your lifestyle and preferences.', color: 'bg-amber-100 text-amber-600' },
              { icon: Heart, title: 'Save Favorites', desc: 'Bookmark pets you love and keep track of them in one place.', color: 'bg-rose-100 text-rose-600' },
              { icon: Shield, title: 'Adopt with Confidence', desc: 'Submit applications and track their status every step of the way.', color: 'bg-sky-100 text-sky-600' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 transition-all hover:shadow-md">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="bg-stone-50 section-padding py-20">
        <div className="container-app">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Meet Our Pets
              </h2>
              <p className="mt-3 text-lg text-stone-600">Featured pets looking for their forever homes.</p>
            </div>
            <Link to="/pets" className="hidden items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 sm:flex">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse overflow-hidden">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-32 rounded bg-stone-200" />
                    <div className="h-4 w-24 rounded bg-stone-200" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-stone-200" />
                      <div className="h-6 w-16 rounded-full bg-stone-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/pets" className="btn-primary">
              Browse All Pets
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="section-padding py-20">
        <div className="container-app">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </div>
              <h2 className="mt-6 text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Let AI Help You Decide
              </h2>
              <p className="mt-4 text-lg text-stone-600 leading-relaxed">
                Not sure which pet is right for you? Our AI assistant analyzes your preferences,
                lifestyle, and home situation to recommend the best matches.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Personalized pet recommendations based on your lifestyle',
                  'Compatibility analysis for any pet you are interested in',
                  'AI chatbot to answer pet care and adoption questions',
                  'Smart matching that considers children, other pets, and experience',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-stone-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/ai-chat" className="btn-primary">
                  <Sparkles className="h-5 w-5" />
                  Try AI Assistant
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="card overflow-hidden p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl bg-stone-50 p-4">
                      <p className="text-sm text-stone-700">
                        "I live in an apartment with two kids and no other pets. What kind of dog would suit us?"
                      </p>
                    </div>
                    <div className="mt-3 rounded-2xl bg-teal-50 p-4">
                      <p className="text-sm text-stone-700">
                        Based on your apartment living and children, I would recommend a small to medium
                        sized dog with low to medium energy. A French Bulldog or Beagle would be great
                        options — both are good with kids and adapt well to apartment living.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="badge border-teal-200 bg-teal-50 text-teal-700">
                        <Star className="h-3 w-3" /> 92% Match
                      </span>
                      <span className="badge border-amber-200 bg-amber-50 text-amber-700">
                        <PawPrint className="h-3 w-3" /> 3 Recommendations
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding pb-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 px-8 py-16 text-center shadow-xl">
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Ready to Find Your New Best Friend?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-teal-50">
                Join PetEy today and let our AI help you find the perfect pet for your home and lifestyle.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-sm transition-all hover:bg-stone-50 hover:shadow-md active:scale-[0.98]">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/pets" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]">
                  Browse Pets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
