import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  gradientBg?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  change,
  icon: Icon,
  gradientBg = 'from-primary/10 via-primary/5 to-transparent',
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md animate-pulse p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {Icon && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-primary dark:text-primary-foreground group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h3>
          {change && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                change.isPositive
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              }`}
            >
              {change.isPositive ? '+' : ''}{change.value}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
