import { cn } from '@/lib/utils';
import type { PetStatus } from '@/lib/types';
import { Check, Clock, PawPrint } from 'lucide-react';

const STATUS_CONFIG: Record<PetStatus, { label: string; className: string; icon: typeof Check }> = {
  AVAILABLE: {
    label: 'Available',
    className: 'bg-success/15 text-success border-success/30',
    icon: Check,
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-warning/15 text-warning border-warning/30',
    icon: Clock,
  },
  ADOPTED: {
    label: 'Adopted',
    className: 'bg-muted text-muted-foreground border-border',
    icon: PawPrint,
  },
};

export function StatusBadge({ status, className }: { status: PetStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
