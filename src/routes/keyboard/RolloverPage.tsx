import React from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { RolloverGauge } from '../../components/visualizers/RolloverGauge';
import { VirtualKeyboard } from '../../components/visualizers/VirtualKeyboard';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { KeyboardCircuitsNotice } from '../../components/feedback/KeyboardCircuitsNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { RotateCcw, Download, Layers, ShieldCheck, Cpu } from 'lucide-react';

export default function RolloverPage() {
  const {
    activeKeys,
    testedKeys,
    peakHeld,
    recordedChords,
    isWindowFocused,
    metrics,
    reset,
    clearStuckKeys,
  } = useKeyboardTest();

  const handleExport = () => {
    exportTelemetryAsJson(
      {
        testType: 'Key Rollover (KRO) Diagnostic',
        peakConcurrentHeld: peakHeld,
        rolloverTier: metrics.rolloverTier,
        highestChords: recordedChords,
        testedKeys: Array.from(testedKeys),
      },
      `inputlab-rollover-${Date.now()}`
    );
  };

  return (
    <DiagnosticShell
      title="Key Rollover (KRO) Diagnostic"
      subtitle="Examine your keyboard's simultaneous key actuation limit (2KRO, 6KRO, or Full NKRO)."
      bannerTopic="keyboard"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Chords</span>
          </button>
        </div>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      <div className="space-y-6">
        <RolloverGauge
          currentHeld={metrics.currentHeld}
          peakHeld={metrics.peakHeld}
          activeCodes={metrics.activeCodes}
        />

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Active Pressed Keys Matrix
            </h3>
            {activeKeys.size > 0 && (
              <button
                type="button"
                onClick={clearStuckKeys}
                className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Clear Stuck Keys
              </button>
            )}
          </div>
          <VirtualKeyboard activeKeys={activeKeys} testedKeys={testedKeys} />
        </div>

        {/* Highest Simultaneous Chords Ledger */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <h4 className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Simultaneous Key Combinations Log ({recordedChords.length})
              </h4>
            </div>
            <span className="text-[11px] text-zinc-400">
              Chords &ge; 3 keys logged automatically
            </span>
          </div>

          {recordedChords.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 italic">
              Press 3 or more keys at the same time to test multi-key chord concurrency.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {recordedChords.map((chord, idx) => (
                <div
                  key={chord.id}
                  className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 flex items-center justify-between gap-3 border border-zinc-200/60 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px]">
                      {chord.count} KEYS HELD
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      #{recordedChords.length - idx}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 items-center justify-end">
                    {chord.keys.map(k => (
                      <span
                        key={k}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px]"
                      >
                        {k.replace('Key', '').replace('Digit', '')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metrology Deep-Dive: Browser Observation vs. Keyboard Circuitry */}
        <KeyboardCircuitsNotice />

        {/* Rollover Tier Standards Card */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
          <h4 className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-3 uppercase">
            Rollover Classification Standards
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-600 dark:text-zinc-400">
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">2KRO (Membrane Default)</strong>
              Guarantees only two simultaneous key registrations. Additional keypresses may be dropped or jammed due to matrix ghosting limits.
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">6KRO (Standard USB HID)</strong>
              Legacy USB boot specification report buffer allows up to 6 alphanumeric keys plus 8 modifier keys simultaneously.
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">NKRO (N-Key Rollover)</strong>
              Full anti-ghosted matrix with individual diodes per mechanical switch. Every key pressed registers regardless of chord depth.
            </div>
          </div>
        </div>

        <MeasurementScopePanel
          observed={[
            { label: 'Concurrent keydown Events', description: 'Real-time count of active keydown events before corresponding keyup.' },
            { label: 'Simultaneous Chord Codes', description: 'Exact set of W3C codes received simultaneously in browser memory.' },
          ]}
          estimated={[
            { label: 'Rollover Tier Rating', description: 'Classified based on observed concurrent keys (2KRO, 6KRO, or NKRO Ready).' },
          ]}
          unavailable={[
            { label: 'USB Endpoint Report Descriptors', description: 'Direct inspection of USB HID endpoints, bitmasks, or boot protocol.' },
            { label: 'PCB Diode Hardware Presence', description: 'Direct verification of physical switch isolation diodes.' },
          ]}
        />
      </div>
    </DiagnosticShell>
  );
}
