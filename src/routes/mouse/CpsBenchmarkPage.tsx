import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { exportTelemetryAsJson, exportTelemetryAsCsv } from '../../core/storage/sessionExporter';
import { Play, RotateCcw, Award, Gauge, Zap, Download } from 'lucide-react';
import { playClickSound } from '../../lib/utils/audioFeedback';
import { loadSettings } from '../../core/storage/localStorageAdapter';

export default function CpsBenchmarkPage() {
  const [duration, setDuration] = useState<number>(5); // 1, 5, 10, 30 seconds
  const [status, setStatus] = useState<'IDLE' | 'ACTIVE' | 'COMPLETED'>('IDLE');
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [peakCps, setPeakCps] = useState(0);

  const clicksHistoryRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startTest = useCallback(() => {
    const now = performance.now();
    setStatus('ACTIVE');
    setClickCount(1);
    setTimeLeft(duration);
    setPeakCps(1);
    clicksHistoryRef.current = [now];
    startTimeRef.current = now;
  }, [duration]);

  const endTest = useCallback(() => {
    setStatus('COMPLETED');
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // requestAnimationFrame timer loop for smooth, drift-free precision
  useEffect(() => {
    if (status === 'ACTIVE') {
      const updateLoop = () => {
        if (!startTimeRef.current) return;
        const now = performance.now();
        const elapsedSec = (now - startTimeRef.current) / 1000;
        const remaining = Math.max(0, duration - elapsedSec);
        setTimeLeft(Number(remaining.toFixed(2)));

        // Calculate rolling peak CPS in past 1000ms
        const oneSecAgo = now - 1000;
        const recentClicks = clicksHistoryRef.current.filter((t) => t >= oneSecAgo).length;
        setPeakCps((prev) => Math.max(prev, recentClicks));

        if (remaining <= 0) {
          endTest();
          return;
        }

        animFrameRef.current = requestAnimationFrame(updateLoop);
      };

      animFrameRef.current = requestAnimationFrame(updateLoop);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [status, duration, endTest]);

  const registerClick = () => {
    const settings = loadSettings();
    if (settings.soundEnabled) {
      playClickSound();
    }

    const now = performance.now();

    if (status === 'IDLE') {
      startTest();
      return;
    }

    if (status === 'ACTIVE') {
      clicksHistoryRef.current.push(now);
      setClickCount((prev) => prev + 1);
    } else if (status === 'COMPLETED') {
      // Retest
      reset();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    registerClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      registerClick();
    }
  };

  const reset = () => {
    setStatus('IDLE');
    setClickCount(0);
    setTimeLeft(duration);
    setPeakCps(0);
    clicksHistoryRef.current = [];
    startTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const currentCps =
    status === 'COMPLETED'
      ? Number((clickCount / duration).toFixed(1))
      : startTimeRef.current
      ? Number((clickCount / Math.max(0.1, (performance.now() - startTimeRef.current) / 1000)).toFixed(1))
      : 0;

  const handleExportJson = () => {
    exportTelemetryAsJson(
      {
        test: 'Clicks Per Second (CPS) Cadence Benchmark',
        durationSec: duration,
        totalClicks: clickCount,
        averageCps: currentCps,
        peakCps,
        timestamps: clicksHistoryRef.current,
      },
      `inputlab-cps-benchmark-${Date.now()}`
    );
  };

  const handleExportCsv = () => {
    const rows = clicksHistoryRef.current.map((t, i) => ({
      clickIndex: i + 1,
      timestampMs: t.toFixed(2),
      elapsedMs: startTimeRef.current ? (t - startTimeRef.current).toFixed(2) : '0',
    }));
    exportTelemetryAsCsv(rows, `inputlab-cps-clicks-${Date.now()}`);
  };

  return (
    <DiagnosticShell
      title="Clicks Per Second (CPS) Cadence Benchmark"
      subtitle="Standardized rate-of-fire cadence benchmark with instantaneous and peak speed tracking."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset CPS benchmark"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>
          {status === 'COMPLETED' && (
            <button
              type="button"
              onClick={handleExportJson}
              aria-label="Export CPS test results"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Result</span>
            </button>
          )}
        </div>
      }
    >
      {/* Duration Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
          Trial Duration
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[1, 5, 10, 30].map((sec) => (
            <button
              key={sec}
              type="button"
              disabled={status === 'ACTIVE'}
              onClick={() => {
                setDuration(sec);
                setTimeLeft(sec);
              }}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                duration === sec
                  ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Primary Click Benchmark Button Area */}
      <button
        type="button"
        onMouseDown={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={0}
        aria-label={
          status === 'IDLE'
            ? `Click here to begin ${duration} second CPS benchmark`
            : status === 'ACTIVE'
            ? `Active benchmark. Click as fast as possible. Time left: ${timeLeft.toFixed(1)} seconds`
            : `Benchmark completed with ${currentCps} CPS. Click to retest.`
        }
        className={`w-full min-h-[260px] p-8 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer select-none text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          status === 'ACTIVE'
            ? 'border-sky-500 bg-sky-500/10 active:scale-[0.99]'
            : status === 'COMPLETED'
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-sky-400'
        }`}
      >
        {status === 'IDLE' && (
          <>
            <Play className="w-12 h-12 text-sky-500 mb-2" />
            <span className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
              Click Here to Start {duration}s Trial
            </span>
            <span className="text-xs text-zinc-400 mt-1">
              Timer begins on the first click. Maintain your fastest steady rate.
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-2">
              Keyboard: Press [Space] or [Enter]
            </span>
          </>
        )}

        {status === 'ACTIVE' && (
          <>
            <div className="text-5xl sm:text-6xl font-mono font-black text-sky-600 dark:text-sky-400 animate-pulse">
              {clickCount}
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-2">
              Time Remaining: <span className="font-bold text-zinc-900 dark:text-zinc-100">{timeLeft.toFixed(1)}s</span>
            </span>
            <div className="w-64 max-w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(0, ((duration - timeLeft) / duration) * 100))}%` }}
              />
            </div>
          </>
        )}

        {status === 'COMPLETED' && (
          <>
            <Award className="w-12 h-12 text-emerald-500 mb-2" />
            <div className="text-4xl sm:text-5xl font-mono font-black text-emerald-600 dark:text-emerald-400">
              {currentCps} <span className="text-lg font-normal">CPS</span>
            </div>
            <span className="text-xs font-mono text-zinc-500 mt-1">
              Trial Complete: {clickCount} total clicks in {duration} seconds.
            </span>
            <div className="mt-4 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold">
              Click or Press Space to Retest
            </div>
          </>
        )}
      </button>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Average Rate</span>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            <Gauge className="w-5 h-5" />
            <span>{currentCps} CPS</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Peak 1-Sec Burst</span>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            <Zap className="w-5 h-5" />
            <span>{peakCps} CPS</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Human Performance Tier</span>
          <div className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
            {currentCps >= 12
              ? 'Elite / Butterfly / Drag'
              : currentCps >= 8
              ? 'Fast / Gaming Cadence'
              : currentCps >= 5
              ? 'Standard Human Cadence'
              : currentCps > 0
              ? 'Relaxed / Casual'
              : 'Awaiting Trial'}
          </div>
        </div>
      </div>

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'Event Trigger Count', description: 'Discrete MouseEvent/PointerEvent dispatches recorded during the benchmark window.' },
          { label: 'Elapsed Time Delta', description: 'High-precision performance.now() elapsed duration from start trigger to expiration.' },
        ]}
        estimated={[
          { label: 'Calculated Clicks Per Second (CPS)', description: 'Total clicks divided by active benchmark duration (Clicks / Duration).' },
          { label: 'Peak 1-Second Burst Window', description: 'Sliding 1000ms window measuring maximum click cluster density.' },
          { label: 'Cadence Tier Categorization', description: 'Heuristic classification of human clicking techniques (butterfly, jitter, standard).' },
        ]}
        unavailable={[
          { label: 'Physical Finger Velocity', description: 'Biomechanical finger speed and distance cannot be observed through web pointer events.' },
          { label: 'Browser Event Coalescing', description: 'In extreme rapid clicking (>30 CPS), OS event queues and display compositing may batch or quantize events.' },
        ]}
      />
    </DiagnosticShell>
  );
}
