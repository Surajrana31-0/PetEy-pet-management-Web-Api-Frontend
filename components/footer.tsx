import Link from 'next/link';
import { PawPrint, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Pets', href: '/pets' },
  { label: 'AI Matcher', href: '/ai-matcher' },
  { label: 'Vets', href: '/vets' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
];

const services = [
  'Pet Adoption',
  'AI Pet Matching',
  'Veterinary Partners',
  'Pet Care Tips',
  'Foster Program',
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-warm text-white">
                <PawPrint className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight">PetEy</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connecting loving families with adorable pets. Every pet deserves a forever home, and every family deserves the joy of a furry companion.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-soft"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">Services</h4>
            <ul className="mt-4 space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">Contact Us</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Animal City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>+1 (977) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>info@petey.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PetEy. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> for pets and their families
          </p>
        </div>
      </div>
    </footer>
  );
}
