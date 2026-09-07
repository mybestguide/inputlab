import React from 'react';
import { cn } from '../../lib/utils/cn';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface RolloverGaugeProps {
  currentHeld: number;
  peakHeld: number;
  activeCodes: string[];
  className?: string;
}

export const RolloverGauge: React.FC<RolloverGaugeProps> = ({
  currentHeld,
  peakHeld,
  activeCodes,
  className,
}) => {
  // Classification
  let tier = '2KRO (Standard)';
  let TierIcon = ShieldAlert;
  let tierColor = 'text-amber-500 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30';

  if (peakHeld >= 10) {
    tier = 'NKRO Ready (High-Rollover)';
    TierIcon = ShieldCheck;
    tierColor = 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30';
  } else if (peakHeld >= 6) {
    tier = 'USB Standard 6KRO';
    TierIcon = Cpu;
    tierColor = 'text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30';
  }

  return (
    <div className={cn('p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
            Host-Observed Key Rollover
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Measures maximum concurrent keys delivered to the browser process
          </p>
        </div>

        <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold', tierColor)}>
          <TierIcon className="w-3.5 h-3.5" />
          <span>{tier}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-3xl font-mono font-bold text-sky-600 dark:text-sky-400">
            {currentHeld}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase">
            Currently Held
          </div>
        </div>

        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {peakHeld}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono uppercase">
            Peak Simultaneous
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
          Active Scancodes ({activeCodes.length}):
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
          {activeCodes.length === 0 ? (
            <span className="text-zinc-400 italic">No keys currently pressed</span>
          ) : (
            activeCodes.map(code => (
              <span key={code} className="px-2 py-0.5 rounded bg-sky-500 text-white font-semibold">
                {code}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
