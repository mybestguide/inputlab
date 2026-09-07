import * as React from 'react';
import { cn } from '../../lib/utils';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  subtext?: string;
  status?: 'pass' | 'warning' | 'defect' | 'neutral';
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, unit, subtext, status = 'neutral', ...props }, ref) => {
    const statusBorder = {
      neutral: 'border-zinc-200 dark:border-zinc-800',
      pass: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10',
      warning: 'border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10',
      defect: 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-xl border bg-white dark:bg-zinc-900 transition-colors flex flex-col justify-between',
          statusBorder[status],
          className
        )}
        {...props}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
              {unit}
            </span>
          )}
        </div>
        {subtext && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
            {subtext}
          </span>
        )}
      </div>
    );
  }
);
MetricCard.displayName = 'MetricCard';
