import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type AlertVariant = 'default' | 'success' | 'warning' | 'destructive';

const icons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

const styles: Record<AlertVariant, string> = {
  default: 'border-border bg-slate-50 text-foreground',
  success: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  destructive: 'border-red-200 bg-red-50 text-red-900',
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'default', title, children, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-xl border p-4 text-sm', styles[variant], className)}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
