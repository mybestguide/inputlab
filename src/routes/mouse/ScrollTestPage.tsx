import React, { useState, useRef } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { exportTelemetryAsJson, exportTelemetryAsCsv } from '../../core/storage/sessionExporter';
import { RotateCw, AlertTriangle, CheckCircle2, RotateCcw, ArrowDown, ArrowUp, Download } from 'lucide-react';

interface ScrollTick {
  id: string;
  deltaY: number;
  dir: 'down' | 'up';
  isReversal: boolean;
  time: string;
}

export default function ScrollTestPage() {
  const [ticks, setTicks] = useState<ScrollTick[]>([]);
  const [totalTicks, setTotalTicks] = useState(0);
  const [reversalCount, setReversalCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [upCount, setUpCount] = useState(0);

  const lastDirRef = useRef<'down' | 'up' | null>(null);
  const lastTimeRef = useRef<number>(0);

  const processDelta = (deltaY: number) => {
    if (deltaY === 0) return;
    const now = performance.now();
    const dir: 'down' | 'up' = deltaY > 0 ? 'down' : 'up';
    let isReversal = false;

    // Detect if this tick contradicted a rapid burst in the opposite direction within 350ms
    if (lastDirRef.current !== null && (now - lastTimeRef.current) < 350) {
      if (dir !== lastDirRef.current) {
        isReversal = true;
        setReversalCount((prev) => prev + 1);
      }
    }

    lastDirRef.current = dir;
    lastTimeRef.current = now;

    if (dir === 'down') setDownCount((prev) => prev + 1);
    else setUpCount((prev) => prev + 1);

    setTotalTicks((prev) => prev + 1);

    const tick: ScrollTick = {
      id: `${now}-${Math.random()}`,
      deltaY: Number(deltaY.toFixed(1)),
      dir,
      isReversal,
      time: new Date().toLocaleTimeString().slice(3),
    };

    setTicks((prev) => [tick, ...prev].slice(0, 40));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    processDelta(e.deltaY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      processDelta(100);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      processDelta(-100);
    }
  };

  const reset = () => {
    setTicks([]);
    setTotalTicks(0);
    setReversalCount(0);
    setDownCount(0);
    setUpCount(0);
    lastDirRef.current = null;
    lastTimeRef.current = 0;
  };

  const handleExportJson = () => {
    exportTelemetryAsJson(
      {
        test: 'Scroll Wheel & Encoder Glitch Diagnostic',
        totalTicks,
        downCount,
        upCount,
        reversalCount,
        encoderStatus: reversalCount === 0 ? 'STABLE' : 'GLITCH_DETECTED',
        ticks,
      },
      `inputlab-scroll-test-${Date.now()}`
    );
  };

  const handleExportCsv = () => {
    const rows = ticks.map((t, idx) => ({
      index: idx + 1,
      direction: t.dir,
      deltaY: t.deltaY,
      isReversal: t.isReversal ? 'YES' : 'NO',
      time: t.time,
    }));
    exportTelemetryAsCsv(rows, `inputlab-scroll-ticks-${Date.now()}`);
  };

  return (
    <DiagnosticShell
      title="Scroll Wheel & Encoder Diagnostic"
      subtitle="Diagnose rotary encoder skipping, dust contamination, and directional reversal glitches."
      bannerTopic="general"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset scroll test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bench (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            aria-label="Export scroll diagnostic data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      }
    >
      {/* Interactive Scroll Target Canvas */}
      <div
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Interactive scroll wheel diagnostic target. Scroll wheel down or up inside this zone."
        className="min-h-[220px] p-8 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/20 dark:bg-sky-950/20 hover:border-sky-500 transition-all flex flex-col items-center justify-center cursor-pointer select-none text-center focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <RotateCw className="w-10 h-10 text-sky-500 mb-2 animate-spin-slow" />
        <span className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold mb-1">
          Scroll Active Target
        </span>
        <div className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 dark:text-white my-2">
          {totalTicks} <span className="text-sm font-normal text-zinc-500">Notches Captured</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
          Place your pointer inside this box and scroll steadily in one direction (e.g. 20 notches down, then 20 notches up). If an encoder reversal glitch occurs, it will be flagged.
        </p>
        <span className="text-[10px] font-mono text-zinc-400 mt-2">
          Keyboard navigation: Use [ArrowUp] / [ArrowDown] or [PageUp] / [PageDown]
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Down Notches</span>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            <ArrowDown className="w-5 h-5" />
            <span>{downCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Up Notches</span>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            <ArrowUp className="w-5 h-5" />
            <span>{upCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Reversal Glitches</span>
          <div className={`text-2xl font-bold mt-1 ${reversalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {reversalCount}
          </div>
        </div>
      </div>

      {/* Verdict & Live Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Verdict */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {totalTicks === 0 ? (
                <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-xs font-bold">
                  AWAITING SCROLL INPUT
                </div>
              ) : reversalCount === 0 ? (
                <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ENCODER STABLE (0 REVERSALS)</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 font-mono text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ENCODER GLITCH DETECTED ({reversalCount})</span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {totalTicks === 0
                ? 'Scroll in continuous unidirectional bursts inside the target area to test rotary encoder contact brushes.'
                : reversalCount === 0
                ? 'All scroll events registered in continuous unidirectional bursts without spontaneous reverse ticks. Optical/mechanical rotary encoder brushes are functioning normally.'
                : 'Detected reverse scroll pulses during active unidirectional scrolling. This is the hallmark symptom of dust accumulation, mechanical rotary encoder brush wear, or lubricant breakdown on the wheel axle.'}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 text-xs font-mono text-zinc-500">
            Tip: Blowing compressed air into the wheel crevice often clears dust without requiring switch replacement.
          </div>
        </div>

        {/* Real-time Ticker */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Real-Time Wheel Event Ticker
            </h4>
            {ticks.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="text-[11px] font-mono text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Export CSV
              </button>
            )}
          </div>
          <div className="flex-1 max-h-56 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-xs">
            {ticks.length === 0 ? (
              <div className="text-zinc-400 italic py-6 text-center">Scroll inside the target to populate log</div>
            ) : (
              ticks.map((t) => (
                <div key={t.id} className="py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.dir === 'down' ? (
                      <ArrowDown className="w-3.5 h-3.5 text-sky-500" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5 text-sky-500" />
                    )}
                    <span className="font-semibold uppercase">{t.dir}</span>
                    <span className="text-zinc-400 text-[11px]">(&Delta;y: {t.deltaY})</span>
                  </div>
                  {t.isReversal && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold text-[10px]">
                      GLITCH REVERSAL
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'WheelEvent deltaY', description: 'Raw scroll delta magnitudes and direction passed by the OS HID driver.' },
          { label: 'Event Inter-Arrival Timing', description: 'Microsecond timestamps between successive wheel pulses.' },
        ]}
        estimated={[
          { label: 'Rotary Detent Count', description: 'Approximated hardware notch detents based on discrete wheel event bursts.' },
          { label: 'Encoder Reversal Glitch Heuristic', description: 'Detection of reverse-polarity pulses during rapid unidirectional scrolling (<350ms).' },
        ]}
        unavailable={[
          { label: 'Hardware Encoder Pulses-per-Revolution (PPR)', description: 'Physical encoder wheel resolution (e.g. 24-step vs 12-step TTC/Kailh/Alps encoders) cannot be queried directly.' },
          { label: 'Rotational Resistance (Torque)', description: 'Mechanical tactile feedback and detent stiffness (g-cm) cannot be measured by browser software.' },
        ]}
      />
    </DiagnosticShell>
  );
}
