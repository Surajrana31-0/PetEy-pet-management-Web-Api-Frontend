import Link from 'next/link';
import { PawPrint, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react';

const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { href: '/pets', label: 'Browse Pets' },
      { href: '/ai-matcher', label: 'AI Pet Matcher' },
      { href: '/about', label: 'About Us' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Sign In' },
      { href: '/register', label: 'Create Account' },
      { href: '/forgot-password', label: 'Forgot Password' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/about', label: 'Help Center' },
      { href: '/about', label: 'Contact' },
      { href: '/about', label: 'Privacy Policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-warm text-white">
                <PawPrint className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">PetEy</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered pet adoption platform helping you find the perfect companion. Every pet deserves a loving home.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="GitHub" className="text-muted-foreground transition-colors hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PetEy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> hello@petey.com</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> +1 (555) 123-4567</span>
            <span className="hidden items-center gap-1 sm:flex"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
