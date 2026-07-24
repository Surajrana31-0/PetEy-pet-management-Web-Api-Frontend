import { cn } from '@/lib/utils/cn';
import { PageContainer } from './page-container';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, sidebar, className }: DashboardShellProps) {
  return (
    <div className={cn('min-h-[calc(100vh-4rem)] bg-background', className)}>
      <PageContainer className="py-6 sm:py-8">
        {sidebar ? (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
            <aside className="hidden lg:block">{sidebar}</aside>
            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </PageContainer>
    </div>
  );
}
