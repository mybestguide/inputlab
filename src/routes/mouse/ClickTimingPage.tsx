import React, { useState, useRef, useEffect } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useMouseTest } from '../../hooks/useMouseTest';
import { exportTelemetryAsJson, exportTelemetryAsCsv } from '../../core/storage/sessionExporter';
import { RotateCcw, Clock, Download, Play, CheckCircle2 } from 'lucide-react';

export default function ClickTimingPage() {
  const {
    holdTimes,
    intervals,
    metrics,
    eventBuffer,
    handlePointerDown,
    handlePointerUp,
    reset,
  } = useMouseTest();

  const [isHolding, setIsHolding] = useState(false);
  const [currentHoldLiveMs, setCurrentHoldLiveMs] = useState(0);
  const holdStartRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Live hold duration counter using requestAnimationFrame
  const updateLiveHold = () => {
    if (holdStartRef.current !== null) {
      setCurrentHoldLiveMs(Number((performance.now() - holdStartRef.current).toFixed(1)));
      animFrameRef.current = requestAnimationFrame(updateLiveHold);
    }
  };

  const onPointerDownHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerDown(e);
    setIsHolding(true);
    holdStartRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updateLiveHold);
  };

  const onPointerUpHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
    setIsHolding(false);
    holdStartRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !isHolding) {
      e.preventDefault();
      const fakeDown = {
        preventDefault: () => {},
        button: 0,
        buttons: 1,
        clientX: 0,
        clientY: 0,
      } as unknown as React.PointerEvent<HTMLDivElement>;
      onPointerDownHandler(fakeDown);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const fakeUp = {
        preventDefault: () => {},
        button: 0,
        buttons: 0,
        clientX: 0,
        clientY: 0,
      } as unknown as React.PointerEvent<HTMLDivElement>;
      onPointerUpHandler(fakeUp);
    }
  };

  const handleExportJson = () => {
    exportTelemetryAsJson(
      {
        test: 'Click Hold & Actuation Latency Benchmark',
        holdTimes,
        intervals,
        metrics: metrics.holdTimes,
        intervalMetrics: metrics.intervals,
        events: eventBuffer.toArray(),
      },
      `inputlab-click-timing-${Date.now()}`
    );
  };

  const handleExportCsv = () => {
    const rows = holdTimes.map((h, i) => ({
      sample: i + 1,
      holdTimeMs: h,
    }));
    exportTelemetryAsCsv(rows, `inputlab-click-hold-${Date.now()}`);
  };

  return (
    <DiagnosticShell
      title="Click Hold & Actuation Latency Analyzer"
      subtitle="Measures press-to-release hold duration, release variance, and actuation consistency."
      bannerTopic="general"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset test samples"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            aria-label="Export latency telemetry"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      }
    >
      {/* Primary Click Target Zone */}
      <div
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}
        role="button"
        aria-label="Click hold measurement zone. Press and hold down here, then release."
        aria-pressed={isHolding}
        className={`min-h-[240px] p-8 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer select-none text-center focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          isHolding
            ? 'border-sky-500 bg-sky-500/15 scale-[0.995]'
            : holdTimes.length > 0
            ? 'border-emerald-400/80 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20'
            : 'border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/20 dark:bg-sky-950/20 hover:border-sky-500'
        }`}
      >
        <Clock className={`w-10 h-10 mb-2 transition-transform ${isHolding ? 'text-sky-600 scale-110 animate-spin-slow' : 'text-sky-500'}`} />
        
        <span className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold mb-1">
          {isHolding ? 'Switch Contact Closed' : 'Hold Latency Target Zone'}
        </span>

        <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-900 dark:text-white my-2">
          {isHolding ? (
            <span>{currentHoldLiveMs} <span className="text-base font-normal text-sky-600">ms live</span></span>
          ) : holdTimes.length > 0 ? (
            <span>{holdTimes[holdTimes.length - 1]} <span className="text-base font-normal text-emerald-600">ms (last)</span></span>
          ) : (
            <span className="text-2xl text-zinc-400">Press &amp; Hold Switch</span>
          )}
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mt-1">
          {isHolding
            ? 'Holding switch down... Release to commit sample timing.'
            : 'Press and hold down any button, then release. The contact closure duration is measured via high-precision browser timestamps.'}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>Samples: <strong>{holdTimes.length}</strong></span>
          <span>•</span>
          <span>Keyboard: Press &amp; hold [Space] or [Enter]</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block text-[11px]">Shortest Hold</span>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            {metrics.holdTimes.min} ms
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Quickest tap</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block text-[11px]">Median Hold</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.holdTimes.median} ms
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">50th percentile</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block text-[11px]">Average &plusmn; StDev</span>
          <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mt-1 truncate">
            {metrics.holdTimes.mean} &plusmn; {metrics.holdTimes.stdev} ms
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Consistency spread</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block text-[11px]">Longest Hold</span>
          <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mt-1">
            {metrics.holdTimes.max} ms
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Max sustained</span>
        </div>
      </div>

      {/* Inter-Click Cadence Comparison */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
            Hold Duration vs. Arrival Interval Dynamics
          </h3>
          {holdTimes.length > 0 && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="text-[11px] font-mono text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              Export CSV
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[11px]">Contact Closure (Hold Time)</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
              {metrics.holdTimes.sampleCount > 0 ? `${metrics.holdTimes.mean} ms mean` : 'Awaiting samples'}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Time switch remains depressed. Typical tactile mouse switches register between 40ms and 120ms during normal human actuation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <span className="text-zinc-400 block text-[11px]">Inter-Click Interval (&Delta;t)</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
              {metrics.intervals.sampleCount > 0 ? `${metrics.intervals.mean} ms mean` : 'Awaiting 2+ clicks'}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Time between consecutive clicks. Intervals below 30ms during single clicks indicate switch chatter defects.
            </p>
          </div>
        </div>
      </div>

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'DOM PointerEvent Timestamps', description: 'Raw high-resolution browser performance.now() timestamps upon pointerdown and pointerup event dispatches.' },
          { label: 'Event Order and Sequence', description: 'Strict chronological ordering of down-then-up lifecycle states.' },
        ]}
        estimated={[
          { label: 'Calculated Hold Duration', description: 'Difference between pointerup and pointerdown timestamps (t_release - t_press).' },
          { label: 'Standard Deviation of Actuation', description: 'Statistical dispersion of hold times indicating physical finger release repeatability.' },
        ]}
        unavailable={[
          { label: 'Internal MCU Debounce Delay', description: 'Hardware firmware debounce delay (e.g. 2-8ms delay added before sending the USB report).' },
          { label: 'Mechanical Pre-Travel & Bottom-Out Force', description: 'Physical switch travel distance (in millimeters) and spring actuation weight (in gram-force).' },
        ]}
      />
    </DiagnosticShell>
  );
}
