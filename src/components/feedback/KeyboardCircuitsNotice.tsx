import React, { useState } from 'react';
import { Eye, Layers, Cpu, ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface KeyboardCircuitsNoticeProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const KeyboardCircuitsNotice: React.FC<KeyboardCircuitsNoticeProps> = ({
  className = '',
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(p => !p)}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            Hardware Reality Check: Browser Observation vs. Keyboard Circuitry
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-300 font-medium">
          <span>{isExpanded ? 'Collapse' : 'Expand Metrology Guide'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Item 1: Keys Observed by Browser */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-sky-600 dark:text-sky-400 mb-1.5">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>1. Keys Observed by Browser</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                The web browser receives <code>KeyboardEvent</code> objects (<code className="font-mono">e.code</code> and <code className="font-mono">e.key</code>) delivered by the host OS after traversing USB HID parsing, OS window manager routing, and IME layout translation. If a key is blocked by the OS (e.g. system shortcuts or unfocused window), the browser never receives it.
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800 pt-1.5">
              Scope: Software application event delivery only.
            </div>
          </div>

          {/* Item 2: Simultaneous Combinations Observed */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>2. Simultaneous Combinations Observed</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                InputLab tracks the active set of keys that have dispatched a <code className="font-mono">keydown</code> event without yet receiving a <code className="font-mono">keyup</code>. This reflects the concurrent chord delivered to the web page, but can be influenced by OS key repeat intervals, browser event coalescing, or focus loss.
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800 pt-1.5">
              Scope: Real-time concurrent state in browser memory.
            </div>
          </div>

          {/* Item 3: Hardware-Level Rollover */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1.5">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>3. Hardware-Level Rollover (NKRO / 6KRO)</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Physical rollover is determined by the keyboard&apos;s microcontroller firmware and USB HID report descriptor. Standard USB keyboards use the 6KRO boot protocol (6 alphanumeric keys + 8 modifiers). True NKRO keyboards either transmit bitmask report arrays or multiple virtual HID endpoints to report every key simultaneously.
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800 pt-1.5">
              Scope: Microcontroller firmware &amp; USB HID endpoint architecture.
            </div>
          </div>

          {/* Item 4: Hardware-Level Anti-Ghosting */}
          <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-purple-600 dark:text-purple-400 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>4. Hardware-Level Anti-Ghosting</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                True anti-ghosting requires a physical diode soldered at each switch on the keyboard PCB. Diodes prevent reverse current leakage across row and column traces when 3 or more keys forming a matrix rectangle are actuated. Without diodes, firmware must artificially &ldquo;block&rdquo; (jam) the 3rd key to prevent phantom ghost keypresses.
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800 pt-1.5">
              Scope: Physical PCB wiring and individual switch isolation diodes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
