import React from 'react';
import { DiagnosticVerdict } from '../../types/results';
import { StatisticalSummary } from '../../types/metrics';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, RotateCcw, Download, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

interface VerdictCardProps {
  verdict: DiagnosticVerdict;
  reason: string;
  stats?: StatisticalSummary;
  onRetest: () => void;
  onExport: () => void;
  learnLink?: string;
  className?: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  verdict,
  reason,
  stats,
  onRetest,
  onExport,
  learnLink,
  className,
}) => {
  const config = {
    HEALTHY: {
      title: 'PASS: HEALTHY INPUT BEHAVIOR',
      icon: CheckCircle2,
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
    },
    SUSPECT_ANOMALY: {
      title: 'SUSPECT ANOMALY DETECTED',
      icon: AlertTriangle,
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    },
    DEFECT_CONFIRMED: {
      title: 'ANOMALY / CHATTER CONFIRMED',
      icon: XCircle,
      badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
    },
    INCONCLUSIVE: {
      title: 'INCONCLUSIVE / GATHERING SAMPLES',
      icon: HelpCircle,
      badgeColor: 'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700',
    },
  }[verdict];

  const IconComponent = config.icon;

  return (
    <div className={cn('p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wide', config.badgeColor)}>
          <IconComponent className="w-4 h-4" />
          <span>{config.title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRetest}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retest (R)</span>
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans mb-4">
        {reason}
      </p>

      {stats && stats.sampleCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 font-mono text-xs">
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block">Min Interval</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{stats.min} ms</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block">Median</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{stats.median} ms</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block">Mean / StDev</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{stats.mean} ± {stats.stdev} ms</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block">95th Percentile</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{stats.p95} ms</span>
          </div>
        </div>
      )}

      {learnLink && (
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <a
            href={learnLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn how switch bounce and debounce algorithms work &rarr;</span>
          </a>
        </div>
      )}
    </div>
  );
};
