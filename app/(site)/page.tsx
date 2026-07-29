import Link from 'next/link';
import {
  PawPrint,
  Search,
  Heart,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  Dog,
  Cat,
  CheckCircle,
  Home,
  FileSearch,
  HandHeart,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATS = [
  { value: '500+', label: 'Happy Adopters', icon: Heart },
  { value: '120+', label: 'Volunteers', icon: Users },
  { value: '50+', label: 'Partner Shelters', icon: Shield },
  { value: '98%', label: 'AI Match Rate', icon: Sparkles },
];

const CATEGORIES = [
  { label: 'Dogs', icon: Dog, href: '/pets?species=DOG', count: '200+ pets', emoji: '🐶' },
  { label: 'Cats', icon: Cat, href: '/pets?species=CAT', count: '150+ pets', emoji: '🐱' },
];

const STEPS = [
  {
    step: 1,
    icon: Search,
    title: 'Browse Pets',
    description: 'Explore our catalog of available pets. Filter by species, breed, age, and more to find your match.',
  },
  {
    step: 2,
    icon: Sparkles,
    title: 'AI Match',
    description: 'Use our AI-powered matcher to find pets that fit your lifestyle and personality perfectly.',
  },
  {
    step: 3,
    icon: FileSearch,
    title: 'Apply',
    description: 'Submit your adoption application online. Our team reviews it and gets back to you quickly.',
  },
  {
    step: 4,
    icon: PartyPopper,
    title: 'Welcome Home',
    description: 'Once approved, welcome your new companion home. We support you through the transition.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Adopted a Golden Retriever',
    quote: "PetEy's AI matcher found the perfect dog for my family. The whole process was seamless and heartwarming.",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Adopted a Tabby Cat',
    quote: 'The compatibility score was spot on. Luna and I bonded instantly. Could not be happier!',
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
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />

        <div className="container-page relative py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in-down">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              AI-Powered Pet Adoption
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl animate-fade-in-up">
              Find Your Perfect
              <br />
              <span className="text-primary">Companion</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance animate-fade-in-up">
              Browse hundreds of loving pets looking for forever homes. Let our AI matcher find the perfect companion based on your lifestyle and personality.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
              <Button asChild size="lg" className="gradient-warm text-white shadow-soft hover:shadow-glow">
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
        </div>
      </section>

      {/* Statistics */}
      <section className="container-page -mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-border/60 card-shadow animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </span>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse by Category</h2>
            <p className="mt-3 text-muted-foreground">Find your new best friend by species</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.label} href={cat.href}>
                  <Card className="group cursor-pointer overflow-hidden border-border/60 card-shadow transition-all duration-300 hover:-translate-y-1 hover:card-shadow-hover">
                    <CardContent className="flex items-center justify-between p-8">
                      <div className="flex items-center gap-5">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform group-hover:scale-110">
                          {cat.emoji}
                        </span>
                        <div>
                          <h3 className="text-xl font-bold">{cat.label}</h3>
                          <p className="text-sm text-muted-foreground">{cat.count}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/pets">View All Pets <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 section-padding">
        <div className="container-page">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-3">
              <PawPrint className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How Pet Adoption Works</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              From browsing to bringing your pet home, we make every step simple and transparent.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.step}
                  className="border-border/60 card-shadow animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-warm text-white shadow-soft">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="mt-4 text-sm font-bold text-primary">Step {step.step}</div>
                    <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Happy Adoption Stories</h2>
            <p className="mt-3 text-muted-foreground">Real stories from families who found their companions</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Card
                key={t.name}
                className="border-border/60 card-shadow animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-warning text-warning" />
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
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl gradient-warm px-8 py-16 text-center text-white shadow-glow sm:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Ready to Find Your Perfect Companion?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 text-balance">
                Join thousands of happy families who found their perfect companion through PetEy.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/pets">Browse Pets</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
