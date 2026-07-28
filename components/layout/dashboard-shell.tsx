import { cn } from '@/lib/utils/cn';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, sidebar, header, footer, className }: DashboardShellProps) {
  return (
    <div className={cn('dash-body', className)}>
      {sidebar}
      <div className="dash-main">
        {header}
        <main className="dash-content">
          {children}
        </main>
        {footer}
      </div>
    </div>
  );
}
