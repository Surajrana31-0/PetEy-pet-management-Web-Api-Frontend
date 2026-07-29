import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="relative hidden flex-1 overflow-hidden gradient-warm lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">PetEy</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              Find your perfect companion with AI-powered matching
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Browse hundreds of pets looking for loving homes. Let our AI help you find the perfect match.
            </p>
            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/70">Pets Adopted</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1.2k</div>
                <div className="text-sm text-white/70">Happy Families</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/70">Match Rate</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} PetEy. Made with care.</p>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-warm text-white">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">PetEy</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="hidden justify-end p-6 lg:flex">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md animate-fade-in-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
