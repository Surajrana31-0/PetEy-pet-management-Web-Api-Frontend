'use client';

import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  title?: string;
  children: React.ReactNode;
  onReset?: () => void;
  className?: string;
  collapsibleOnMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FilterSidebar({
  title = 'Filters',
  children,
  onReset,
  className,
  collapsibleOnMobile = true,
  isOpen = true,
  onToggle,
}: FilterSidebarProps) {
  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
          )}
          {collapsibleOnMobile && onToggle && (
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      {(isOpen || !collapsibleOnMobile) && <CardContent className="space-y-4">{children}</CardContent>}
    </Card>
  );
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}
