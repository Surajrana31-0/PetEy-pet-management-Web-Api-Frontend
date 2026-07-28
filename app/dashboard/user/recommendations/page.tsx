import { Sparkles, Heart, ArrowRight, PawPrint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const RECOMMENDATIONS = [
  { name: 'Buddy', breed: 'Labrador Retriever', species: 'DOG', emoji: '🐶', score: 95, reason: 'Great match for your active lifestyle and spacious home.' },
  { name: 'Whiskers', breed: 'Maine Coon', species: 'CAT', emoji: '🐱', score: 88, reason: 'Perfect for your calm environment and work-from-home schedule.' },
  { name: 'Rocky', breed: 'Beagle', species: 'DOG', emoji: '🐶', score: 82, reason: 'Matches your preference for small to medium-sized dogs.' },
];

export default function RecommendationsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> AI Recommendations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pets our AI thinks would be a great match for you, based on your profile and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RECOMMENDATIONS.map((rec) => (
          <Card key={rec.name} className="group overflow-hidden border-border/60 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/10">
              <span className="text-6xl transition-transform group-hover:scale-110">{rec.emoji}</span>
              <div className="absolute right-3 top-3">
                <div className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {rec.score}% match
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold">{rec.name}</h3>
              <p className="text-sm text-muted-foreground">{rec.breed}</p>
              <p className="mt-3 text-sm text-muted-foreground/80">{rec.reason}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{rec.species}</Badge>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/pets">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-border/60 shadow-card">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-8 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold">Want better recommendations?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Chat with our AI to refine your preferences and get personalized matches.</p>
          </div>
          <Button asChild size="lg" className="gradient-warm text-white">
            <Link href="/ai-matcher">
              <PawPrint className="mr-2 h-4 w-4" /> Open AI Matcher
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
