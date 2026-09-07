import React from 'react';
import { HistogramBin } from '../../types/metrics';
import { cn } from '../../lib/utils/cn';

interface IntervalHistogramProps {
  bins: HistogramBin[];
  totalSamples: number;
  className?: string;
}

export const IntervalHistogram: React.FC<IntervalHistogramProps> = ({
  bins,
  totalSamples,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900', className)}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
          Click Interval Distribution (ms)
        </h4>
        <span className="text-xs font-mono text-zinc-500">
          N = {totalSamples} samples
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {bins.map((bin) => {
          const isSevere = bin.min === 0;
          const isSuspect = bin.min === 20 || bin.min === 40;
          const hasCount = bin.count > 0;

          return (
            <div key={bin.label} className="text-xs font-mono">
              <div className="flex justify-between mb-1">
                <span className={cn(
                  'font-medium',
                  isSevere && hasCount ? 'text-rose-600 dark:text-rose-400 font-bold' :
                  isSuspect && hasCount ? 'text-amber-600 dark:text-amber-400' :
                  'text-zinc-700 dark:text-zinc-300'
                )}>
                  {bin.label}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {bin.count} ({bin.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-150 rounded-full',
                    isSevere && hasCount ? 'bg-rose-500' :
                    isSuspect && hasCount ? 'bg-amber-500' :
                    'bg-sky-500'
                  )}
                  style={{ width: `${Math.max(bin.percentage, bin.count > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
