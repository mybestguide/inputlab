import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, Eye, Calculator, Ban } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

export interface ScopeCategoryItem {
  label: string;
  description: string;
}

export interface MeasurementScopeProps {
  observed: ScopeCategoryItem[];
  estimated: ScopeCategoryItem[];
  unavailable: ScopeCategoryItem[];
  className?: string;
  defaultExpanded?: boolean;
}

export const MeasurementScopePanel: React.FC<MeasurementScopeProps> = ({
  observed,
  estimated,
  unavailable,
  className,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-850/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            Measurement Scope & Accuracy Transparency
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400">
            (Browser APIs vs Hardware Reality)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-mono font-medium">
          <span>{isExpanded ? 'Hide Specs' : 'View Spec Breakdown'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. Directly Observed */}
          <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-bold uppercase text-[11px] mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Browser-Observed</span>
            </div>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              {observed.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  <strong className="font-mono text-zinc-900 dark:text-zinc-100 block">
                    {item.label}
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Calculated / Estimated */}
          <div className="p-3.5 rounded-lg border border-sky-200 dark:border-sky-900/40 bg-sky-50/30 dark:bg-sky-950/10">
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-mono font-bold uppercase text-[11px] mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculated & Estimated</span>
            </div>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              {estimated.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  <strong className="font-mono text-zinc-900 dark:text-zinc-100 block">
                    {item.label}
                  </strong>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Hardware Unavailable */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/30">
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono font-bold uppercase text-[11px] mb-2">
              <Ban className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hardware Unavailable</span>
            </div>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              {unavailable.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  <strong className="font-mono text-zinc-800 dark:text-zinc-200 block">
                    {item.label}
                  </strong>
                  <span className="text-zinc-500 text-[11px]">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
