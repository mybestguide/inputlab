import React, { useState } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { KeyboardCircuitsNotice } from '../../components/feedback/KeyboardCircuitsNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { CheckCircle2, XCircle, RotateCcw, ShieldCheck, Plus, Layers } from 'lucide-react';

interface TriadTest {
  id: string;
  name: string;
  codes: string[];
  purpose: string;
}

const COMMON_TRIADS: TriadTest[] = [
  {
    id: 'wasd-jump',
    name: 'W + D + Space',
    codes: ['KeyW', 'KeyD', 'Space'],
    purpose: 'Diagonal forward-right movement while jumping (FPS staple).',
  },
  {
    id: 'wasd-sprint-strafe',
    name: 'Shift + W + A',
    codes: ['ShiftLeft', 'KeyW', 'KeyA'],
    purpose: 'Sprint diagonal strafe forward-left.',
  },
  {
    id: 'sprint-slide',
    name: 'Shift + W + C',
    codes: ['ShiftLeft', 'KeyW', 'KeyC'],
    purpose: 'Tactical slide action during full sprint.',
  },
  {
    id: 'adjacent-row',
    name: 'Q + W + E',
    codes: ['KeyQ', 'KeyW', 'KeyE'],
    purpose: 'Adjacent single-row switch matrix conflict test.',
  },
  {
    id: 'adjacent-col',
    name: 'Digit1 + KeyQ + KeyA',
    codes: ['Digit1', 'KeyQ', 'KeyA'],
    purpose: 'Adjacent single-column switch matrix conflict test.',
  },
  {
    id: 'arrow-chord',
    name: 'ArrowUp + ArrowRight + Space',
    codes: ['ArrowUp', 'ArrowRight', 'Space'],
    purpose: 'Classic 2D platformer / racing diagonal jump chord.',
  },
  {
    id: 'rhythm-chord',
    name: 'D + F + J + K',
    codes: ['KeyD', 'KeyF', 'KeyJ', 'KeyK'],
    purpose: '4-key rhythm game simultaneous multi-lane chord.',
  },
  {
    id: 'typing-chord',
    name: 'J + K + L',
    codes: ['KeyJ', 'KeyK', 'KeyL'],
    purpose: 'Home row simultaneous multi-finger roll.',
  },
];

export default function AntiGhostingPage() {
  const { activeKeys, isWindowFocused, reset } = useKeyboardTest();
  const [passedTriads, setPassedTriads] = useState<Set<string>>(new Set());

  // Check which triads are fully satisfied
  COMMON_TRIADS.forEach(triad => {
    const allHeld = triad.codes.every(code => activeKeys.has(code));
    if (allHeld && !passedTriads.has(triad.id)) {
      setPassedTriads(prev => new Set(prev).add(triad.id));
    }
  });

  const passedCount = passedTriads.size;
  const totalCount = COMMON_TRIADS.length;

  return (
    <DiagnosticShell
      title="Anti-Ghosting & Matrix Conflict Triads"
      subtitle="Evaluates matrix trace blocking. In keyboards without diodes, pressing 2 keys on a shared trace can mask a 3rd key."
      bannerTopic="keyboard"
      actions={
        <button
          type="button"
          onClick={() => {
            reset();
            setPassedTriads(new Set());
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Suite</span>
        </button>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Progress & Live Chord Monitor */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
            {passedCount}/{totalCount}
          </div>
          <div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              Triad Verification Progress
            </span>
            <span className="text-xs text-zinc-500">
              Hold each 3-key or 4-key combination together until marked &ldquo;PASSED&rdquo;.
            </span>
          </div>
        </div>

        {/* Live Active Keys Chord */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-400">Currently Held:</span>
          {activeKeys.size === 0 ? (
            <span className="text-zinc-400 italic">None</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {Array.from(activeKeys).map(k => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs"
                >
                  {k.replace('Key', '').replace('Digit', '')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Triad Status Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
          Critical Gaming &amp; Matrix Conflict Triads
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_TRIADS.map((triad) => {
            const isPassed = passedTriads.has(triad.id);
            const activeMatchCount = triad.codes.filter(c => activeKeys.has(c)).length;

            return (
              <div
                key={triad.id}
                className={`p-4 rounded-xl border transition-all font-mono text-xs ${
                  isPassed
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {triad.name}
                  </span>
                  {isPassed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASSED</span>
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">
                      {activeMatchCount}/{triad.codes.length} Held
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-500 font-sans mb-3">
                  {triad.purpose}
                </p>

                {/* Key indicators */}
                <div className="flex gap-2">
                  {triad.codes.map((code) => {
                    const isDown = activeKeys.has(code);
                    return (
                      <span
                        key={code}
                        className={`px-2 py-1 rounded text-center transition-all flex-1 ${
                          isDown
                            ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {code.replace('Key', '').replace('Digit', '')}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Metrology Guide: Browser Observation vs. Keyboard Circuitry */}
      <KeyboardCircuitsNotice />

      {/* Educational Card on Ghosting */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-2 uppercase">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span>Why Matrix Ghosting &amp; Blocking Occurs</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
          Keyboards wire switches into an X &times; Y grid matrix (rows and columns) to minimize microcontroller pins. When two keys sharing a row and column are actuated alongside a third key on that intersection, current can backfeed across the matrix, producing a phantom &ldquo;ghost&rdquo; keypress. Cheap keyboards prevent ghosts by artificially &ldquo;blocking&rdquo; (jamming) the third key from registering. Modern gaming and mechanical keyboards add a surface-mount diode to each switch, achieving true non-blocking NKRO.
        </p>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'Observed Triad Completion', description: 'Whether the browser successfully receives concurrent keydown events for all 3 or 4 keys.' },
          { label: 'Active Triad Match Count', description: 'Real-time count of active chord keys held simultaneously.' },
        ]}
        estimated={[
          { label: 'Matrix Conflict Susceptibility', description: 'Failure to register the 3rd key in a chord suggests matrix blocking or 2KRO limits.' },
        ]}
        unavailable={[
          { label: 'Microcontroller Matrix Pin Layout', description: 'Software cannot know which specific row/column traces physically intersect.' },
          { label: 'Physical SMT Diode Verification', description: 'Diodes prevent ghost currents at the circuit board level and cannot be read via USB.' },
        ]}
      />
    </DiagnosticShell>
  );
}
