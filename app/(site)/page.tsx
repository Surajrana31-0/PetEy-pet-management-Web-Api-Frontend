import Link from 'next/link';
import { PawPrint, Search, Heart, Sparkles, ArrowRight, Star, Shield, Clock, Users, Dog, Cat, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATS = [
  { value: '500+', label: 'Pets Adopted', icon: PawPrint },
  { value: '1.2k', label: 'Happy Families', icon: Users },
  { value: '98%', label: 'AI Match rate', icon: Sparkles },
  { value: '24/7', label: 'Support', icon: Shield },
];

const CATEGORIES = [
  { label: 'Dogs', icon: Dog, href: '/pets?species=DOG', count: '200+ pets' },
  { label: 'Cats', icon: Cat, href: '/pets?species=CAT', count: '150+ pets' },
];

const AI_FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Pet Matcher',
    description: 'Our AI analyzes your lifestyle and preferences to recommend the perfect pet for you.',
  },
  {
    icon: Heart,
    title: 'Compatibility Score',
    description: 'Get a personalized compatibility score for every pet based on your profile.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Search and filter by species, breed, age, and status to find your ideal companion.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Adopted a Golden Retriever',
    quote: 'PetEy\'s AI matcher found the perfect dog for my family. The whole process was seamless and heartwarming.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Adopted a Tabby Cat',
    quote: 'The compatibility score was spot on. Luna and I bonded instantly. Couldn\'t be happier!',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Adopted a Beagle',
    quote: 'From browsing to adoption, PetEy made everything so easy. The AI recommendations were incredibly accurate.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-soft" />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in-down">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              AI-Powered Pet Adoption
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl animate-fade-in-up">
              Find your perfect{' '}
              <span className="gradient-warm bg-clip-text text-transparent">pet companion</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance animate-fade-in-up">
              Browse hundreds of loving pets looking for forever homes. Let our AI matcher find the
              perfect companion based on your lifestyle and personality.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
              <Button asChild size="lg" className="gradient-warm text-white shadow-glow">
                <Link href="/pets">
                  Browse Pets <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ai-matcher">
                  <Sparkles className="mr-2 h-4 w-4 text-primary" /> Try AI Matcher
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-border/60 bg-card/80 shadow-card animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </span>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">Find your new best friend by species</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.label} href={cat.href}>
                <Card className="group cursor-pointer overflow-hidden border-border/60 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                  <CardContent className="flex items-center justify-between p-8">
                    <div className="flex items-center gap-4">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">{cat.label}</h3>
                        <p className="text-sm text-muted-foreground">{cat.count}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> AI Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Powered by Artificial Intelligence</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
              We use cutting-edge AI to make pet adoption smarter, faster, and more personal.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AI_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border/60 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                  <CardContent className="p-8">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-warm text-white shadow-glow">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Loved by Pet Parents</h2>
          <p className="mt-2 text-muted-foreground">Real stories from families who found their companions</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border/60 shadow-card">
              <CardContent className="p-8">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-warm px-8 py-16 text-center text-white shadow-glow sm:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Ready to find your new best friend?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 text-balance">
              Join thousands of happy families who found their perfect companion through PetEy.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 text-white hover:bg-white/30">
                <Link href="/pets">Browse Pets <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
