import React from 'react';
import { Focus, AlertCircle } from 'lucide-react';

interface KeyboardFocusNoticeProps {
  isFocused: boolean;
  className?: string;
}

export const KeyboardFocusNotice: React.FC<KeyboardFocusNoticeProps> = ({
  isFocused,
  className = '',
}) => {
  if (isFocused) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Focus Active: Diagnostic stage is capturing browser KeyboardEvents</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-mono ${className}`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="font-semibold">
          Browser Window Unfocused — Click anywhere inside to capture keyboard input.
        </span>
      </div>
      <span className="text-[10px] text-amber-700 dark:text-amber-400 hidden sm:inline">
        OS Hotkeys or Alt-Tab released focus
      </span>
    </div>
  );
};
