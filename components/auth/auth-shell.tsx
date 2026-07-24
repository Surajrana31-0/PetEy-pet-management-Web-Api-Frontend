'use client';

import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthShell({ title, description, children, footer, className }: AuthShellProps) {
  return (
    <div className={cn('auth-page-wrapper', className)}>
      <Link href="/" className="auth-top-icon" aria-label="Back to PetEy home">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <PawPrint className="h-7 w-7" aria-hidden />
        </span>
      </Link>

      <h1 className="auth-heading">{title}</h1>
      <p className="auth-subheading">{description}</p>

      <div className="auth-card">
        {children}
        {footer}
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
    <p className="auth-switch mt-6 text-center text-sm text-muted">
      {prompt}{' '}
      <Link href={href} className="auth-switch-link font-semibold text-brand hover:text-brand-hover">
        {linkText}
      </Link>
    </p>
  );
}
