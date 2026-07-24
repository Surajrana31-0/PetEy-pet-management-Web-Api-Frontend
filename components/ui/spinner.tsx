import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)} role="status">
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-muted">
      <Spinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
