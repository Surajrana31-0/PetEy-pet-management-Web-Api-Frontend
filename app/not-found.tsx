import Link from 'next/link';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-warm text-white shadow-glow">
        <PawPrint className="h-10 w-10" />
      </span>
      <h1 className="mt-8 text-6xl font-bold gradient-warm bg-clip-text text-transparent">404</h1>
      <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="mt-6 gradient-warm text-white">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
