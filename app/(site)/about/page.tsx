import { Heart, Target, Users, PawPrint, Sparkles, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const VALUES = [
  { icon: Heart, title: 'Compassion', description: 'Every pet deserves a loving home. We put animal welfare at the center of everything we do.' },
  { icon: Sparkles, title: 'Innovation', description: 'We leverage AI and modern technology to make adoption smarter and more personal.' },
  { icon: Shield, title: 'Trust', description: 'Transparency and integrity guide our platform. Verified listings and secure processes.' },
  { icon: Users, title: 'Community', description: 'We connect shelters, pet owners, and adopters into one caring ecosystem.' },
];

const TEAM = [
  { name: 'Alex Morgan', role: 'Founder & CEO', initial: 'A' },
  { name: 'Priya Sharma', role: 'CTO', initial: 'P' },
  { name: 'James Lee', role: 'Head of AI', initial: 'J' },
  { name: 'Maria Garcia', role: 'Head of Operations', initial: 'M' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl text-center">
        <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl gradient-warm text-white shadow-glow">
          <PawPrint className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl text-balance">
          We believe every pet deserves a loving home
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-balance">
          PetEy is on a mission to revolutionize pet adoption through technology, transparency, and a
          deep love for animals. We connect shelters and rescues with caring families using AI-powered matching.
        </p>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.title} className="border-border/60 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
              <CardContent className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-20 rounded-3xl border border-border bg-card/50 p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-4 text-muted-foreground">
              Every year, millions of pets end up in shelters. We built PetEy to reduce that number
              by making adoption easy, transparent, and personal. Our AI-powered platform matches pets
              with the right families, ensuring lasting bonds and happier lives for pets and people alike.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">10k adoptions by 2027</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Pets Adopted' },
              { value: '1.2k', label: 'Happy Families' },
              { value: '50+', label: 'Partner Shelters' },
              { value: '98%', label: 'Match Accuracy' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="text-3xl font-bold gradient-warm bg-clip-text text-transparent">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">Meet the Team</h2>
        <p className="mt-2 text-center text-muted-foreground">The people behind PetEy</p>
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((member) => (
            <Card key={member.name} className="border-border/60 shadow-card text-center transition-all hover:-translate-y-1 hover:shadow-glow">
              <CardContent className="p-6">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-warm text-xl font-bold text-white">
                  {member.initial}
                </span>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 text-center">
        <div className="relative overflow-hidden rounded-3xl gradient-warm px-8 py-16 text-white shadow-glow">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Join our mission</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 text-balance">
              Whether you&apos;re looking to adopt or just want to support, we&apos;d love to have you.
            </p>
            <Button asChild size="lg" className="mt-8 bg-white/20 text-white hover:bg-white/30">
              <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
