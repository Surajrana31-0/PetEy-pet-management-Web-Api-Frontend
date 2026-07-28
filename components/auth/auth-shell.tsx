'use client';

import Link from 'next/link';
import { PawPrint, CheckCircle, Clock, Shield, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const features = [
  { icon: Heart, label: 'Find your perfect companion' },
  { icon: Shield, label: 'Verified, healthy pets' },
  { icon: Clock, label: 'Streamlined adoption' },
  { icon: CheckCircle, label: 'Hassle-free process' },
];

export function AuthShell({ title, description, children, footer, className }: AuthShellProps) {
  return (
    <div className={cn('auth-layout', className)}>
      {/* Left side: illustration */}
      <div className="auth-illustration">
        <div className="auth-illustration__bg" />
        <div className="auth-illustration__content">
          <div className="auth-illustration__icon">
            <PawPrint />
          </div>
          <h2 className="auth-illustration__title">PetEy</h2>
          <p className="auth-illustration__subtitle">
            Join thousands of happy pet parents who found their forever companions
            through our platform. Every adoption saves a life.
          </p>

          <div className="auth-illustration__features">
            {features.map((feature) => (
              <div key={feature.label} className="auth-illustration__feature">
                <div className="auth-illustration__feature-icon">
                  <feature.icon />
                </div>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: form */}
      <div className="auth-form-side">
        <div className="auth-card-modern">
          <div className="auth-header">
            <h1 className="auth-header__title">{title}</h1>
            <p className="auth-header__subtitle">{description}</p>
          </div>

          {children}

          {footer}
        </div>
      </div>
    </div>
  );
}

interface AuthSwitchLinkProps {
  prompt: string;
  href: string;
  linkText: string;
}

export function AuthSwitchLink({ prompt, href, linkText }: AuthSwitchLinkProps) {
  return (
    <p className="auth-switch-modern">
      {prompt}{' '}
      <Link href={href} className="font-semibold text-brand hover:text-brand-hover transition-colors">
        {linkText}
      </Link>
    </p>
  );
}
