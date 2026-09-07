import React from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { MouseSilhouette } from '../../components/visualizers/MouseSilhouette';
import { IntervalHistogram } from '../../components/visualizers/IntervalHistogram';
import { VerdictCard } from '../../components/feedback/VerdictCard';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useMouseTest } from '../../hooks/useMouseTest';
import { exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { RotateCcw, Download, Zap, RotateCw, MousePointer } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function MouseOverviewPage() {
  const {
    activeButtons,
    buttonCounts,
    totalClicks,
    chatterAnomalies,
    lastInterval,
    metrics,
    chatterEvaluation,
    eventBuffer,
    handlePointerDown,
    handlePointerUp,
    handleWheel,
    reset,
  } = useMouseTest();

  const handleExport = () => {
    exportTelemetryAsJson(
      {
        sessionType: 'Mouse Overview Diagnostic',
        exportedAt: new Date().toISOString(),
        metrics,
        anomalies: chatterAnomalies,
        events: eventBuffer.toArray(),
      },
      `inputlab-mouse-overview-${Date.now()}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      // Simulate pointer click for keyboard users
      const fakeEvent = {
        preventDefault: () => {},
        button: 0,
        buttons: 1,
        clientX: 0,
        clientY: 0,
      } as unknown as React.PointerEvent<HTMLElement>;
      handlePointerDown(fakeEvent);
      setTimeout(() => {
        handlePointerUp(fakeEvent);
      }, 80);
    }
  };

  return (
    <DiagnosticShell
      title="Mouse Diagnostics Overview"
      subtitle="All-in-one peripheral diagnostic bench for buttons, switch bounce, scroll encoder, and click timing."
      bannerTopic="general"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset test results"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            aria-label="Export session telemetry data as JSON"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Session</span>
          </button>
        </div>
      }
    >
      {/* Primary Interactive Click & Scroll Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Mouse Silhouette Visualizer */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Interactive mouse test area. Click, right-click, middle-click or scroll here to test inputs."
          className="md:col-span-1 p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-sky-400 dark:hover:border-sky-500 transition-all flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 text-center">
            Click / Scroll Target Zone
          </div>
          <MouseSilhouette activeButtons={activeButtons} buttonCounts={buttonCounts} />
          <p className="text-xs text-zinc-500 text-center mt-3 max-w-[200px]">
            Actuate Left, Middle, Right, or Side buttons to verify mapping.
          </p>
          <span className="text-[10px] font-mono text-zinc-400 mt-2">
            Keyboard navigation: Press [Space] or [Enter]
          </span>
        </div>

        {/* Center & Right: Telemetry Cards & Quick Stats */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-[11px] text-zinc-400 uppercase">Total Clicks</span>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {totalClicks}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-[11px] text-zinc-400 uppercase">Last Interval</span>
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {lastInterval !== null ? `${lastInterval} ms` : '—'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-[11px] text-zinc-400 uppercase">Chatter Events</span>
              <div className={`text-2xl font-bold mt-1 ${chatterAnomalies.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {chatterAnomalies.length}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="text-[11px] text-zinc-400 uppercase">Scroll Reversals</span>
              <div className={`text-2xl font-bold mt-1 ${metrics.scrollReversals > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}>
                {metrics.scrollReversals}
              </div>
            </div>
          </div>

          {/* Interval Histogram */}
          <IntervalHistogram
            bins={metrics.histogram}
            totalSamples={metrics.intervals.sampleCount}
          />
        </div>
      </div>

      {/* Diagnostic Evaluation Verdict */}
      <VerdictCard
        verdict={chatterEvaluation.verdict}
        reason={chatterEvaluation.reason}
        stats={metrics.intervals}
        onRetest={reset}
        onExport={handleExport}
        learnLink="/learn/switch-chatter"
      />

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'Event Arrival Timestamps', description: 'Captured via performance.now() and PointerEvent.timeStamp (sub-millisecond resolution).' },
          { label: 'Hardware Button Bitmasks', description: 'Discrete W3C PointerEvent.buttons bitmask values (1=Left, 2=Right, 4=Middle, 8=Back, 16=Forward).' },
          { label: 'Wheel Delta Pulses', description: 'Vertical wheel ticks (deltaY) reported by the operating system HID stack.' },
        ]}
        estimated={[
          { label: 'Inter-Click Intervals', description: 'Calculated arrival delta between successive press events (t_current - t_previous).' },
          { label: 'Switch Chatter Probability', description: 'Heuristic anomaly detection based on empirical thresholds (<80ms suspect, <30ms defect).' },
          { label: 'Scroll Directional Reversals', description: 'Burst cadence tracking within 350ms to detect rotary encoder jitter.' },
        ]}
        unavailable={[
          { label: 'Bare-Metal USB Polling Rate', description: 'Browser event loop is quantized by OS thread scheduling and display compositor (vs true 1000-8000Hz hardware packet rates).' },
          { label: 'Microswitch Actuation Force', description: 'Gram-force (gf) mechanical actuation resistance cannot be sensed through software APIs.' },
          { label: 'Internal Firmware Debounce', description: 'On-board MCU debounce delay (e.g. 2ms-8ms debounce algorithms) applied before USB packet transmission.' },
        ]}
      />

      {/* Symptom-Based Quick Diagnostic Navigator */}
      <div className="mt-8">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Specialized Diagnostic Suites
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NavLink
            to="/mouse/chatter"
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Double-Click & Chatter</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Deep inspection of mechanical switch contact bounce and oxidation.
            </p>
          </NavLink>

          <NavLink
            to="/mouse/scroll"
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <RotateCw className="w-4 h-4 text-sky-500" />
              <span>Scroll Wheel Encoder</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Detect erratic directional reversals and rotary encoder dust glitches.
            </p>
          </NavLink>

          <NavLink
            to="/mouse/cps"
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <MousePointer className="w-4 h-4 text-emerald-500" />
              <span>CPS Speed Benchmark</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Time-bracketed clicking cadence, peak burst speed, and consistency.
            </p>
          </NavLink>
        </div>
      </div>
    </DiagnosticShell>
  );
}
