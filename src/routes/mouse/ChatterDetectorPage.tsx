import React, { useState } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { IntervalHistogram } from '../../components/visualizers/IntervalHistogram';
import { VerdictCard } from '../../components/feedback/VerdictCard';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useMouseTest } from '../../hooks/useMouseTest';
import { exportTelemetryAsJson, exportTelemetryAsCsv } from '../../core/storage/sessionExporter';
import { loadSettings, saveSettings } from '../../core/storage/localStorageAdapter';
import { RotateCcw, Download, AlertTriangle, CheckCircle2, Sliders, Zap } from 'lucide-react';

export default function ChatterDetectorPage() {
  const {
    buttonCounts,
    totalClicks,
    chatterAnomalies,
    lastInterval,
    metrics,
    chatterEvaluation,
    eventBuffer,
    handlePointerDown,
    handlePointerUp,
    reset,
  } = useMouseTest();

  const [threshold, setThreshold] = useState(() => loadSettings().chatterThresholdMs);

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    saveSettings({ chatterThresholdMs: val });
  };

  const handleExportJson = () => {
    exportTelemetryAsJson(
      {
        test: 'Mouse Double-Click & Switch Chatter Benchmark',
        thresholdMs: threshold,
        completedAt: new Date().toISOString(),
        metrics,
        anomalies: chatterAnomalies,
        events: eventBuffer.toArray(),
      },
      `inputlab-chatter-${Date.now()}`
    );
  };

  const handleExportCsv = () => {
    const rows = eventBuffer.toArray().map((e, idx) => ({
      index: idx + 1,
      timestamp: e.timestamp.toFixed(2),
      button: e.button,
      intervalMs: e.intervalMs ?? 'N/A',
      isAnomaly: e.isChatterAnomaly ? 'YES' : 'NO',
    }));
    exportTelemetryAsCsv(rows, `inputlab-chatter-events-${Date.now()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const fakeEvent = {
        preventDefault: () => {},
        button: 0,
        buttons: 1,
        clientX: 0,
        clientY: 0,
      } as unknown as React.PointerEvent<HTMLDivElement>;
      handlePointerDown(fakeEvent);
      setTimeout(() => {
        handlePointerUp(fakeEvent);
      }, 60);
    }
  };

  const testStatus = totalClicks === 0 
    ? 'IDLE' 
    : totalClicks < 10 
    ? 'SAMPLING' 
    : chatterAnomalies.length > 0 
    ? 'ANOMALY_DETECTED' 
    : 'CLEAN';

  return (
    <DiagnosticShell
      title="Double-Click & Switch Chatter Detector"
      subtitle="Detects unwanted microswitch electrical contact bounce and physical degradation using empirical arrival intervals."
      bannerTopic="chatter"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset test data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            aria-label="Export diagnostic findings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      }
    >
      {/* Threshold Calibration Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <div>
            <div className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span>Chatter Detection Threshold:</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">{threshold} ms</span>
            </div>
            <div className="text-xs text-zinc-500 font-sans mt-0.5">
              Consecutive clicks arriving faster than {threshold}ms are flagged as unintentional contact bounce.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {[30, 50, 80].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleThresholdChange(preset)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  threshold === preset
                    ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {preset}ms
              </button>
            ))}
          </div>

          <input
            type="range"
            min={20}
            max={120}
            step={5}
            value={threshold}
            aria-label="Chatter threshold slider in milliseconds"
            onChange={(e) => handleThresholdChange(Number(e.target.value))}
            className="w-32 accent-sky-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Primary Click Target Zone */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Double-click and chatter test zone. Perform deliberate single clicks here."
        className={`min-h-[220px] p-8 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer select-none text-center focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          chatterAnomalies.length > 0
            ? 'border-rose-400/80 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20'
            : totalClicks > 0
            ? 'border-emerald-400/80 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20'
            : 'border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/30 dark:bg-sky-950/20 hover:border-sky-500'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Double-Click Target Diagnostic Zone</span>
        </div>

        <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-900 dark:text-white my-2">
          {totalClicks} <span className="text-sm font-normal text-zinc-500">Clicks Logged</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
          Perform single, deliberate clicks with the suspect button. If a single click registers twice or reports an interval below {threshold}ms, it will be flagged immediately.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {lastInterval !== null && (
            <div className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-semibold">
              Last Arrival Interval: <span className={lastInterval < threshold ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{lastInterval} ms</span>
            </div>
          )}
          <span className="text-[10px] font-mono text-zinc-400">
            Keyboard test: Press [Space] or [Enter]
          </span>
        </div>
      </div>

      {/* Live Statistics & Histogram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntervalHistogram
          bins={metrics.histogram}
          totalSamples={metrics.intervals.sampleCount}
        />

        {/* Anomaly Live Log */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Flagged Anomalies ({chatterAnomalies.length})</span>
            </h4>
            {chatterAnomalies.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="text-[11px] font-mono text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Export CSV
              </button>
            )}
          </div>

          <div className="flex-1 max-h-64 overflow-y-auto font-mono text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
            {chatterAnomalies.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 opacity-60" />
                <span>No switch chatter anomalies flagged yet.</span>
                <span className="text-[11px] text-zinc-500 mt-1">Single-click steadily to test switch contacts.</span>
              </div>
            ) : (
              chatterAnomalies.map((anom) => (
                <div key={anom.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold">
                      {anom.intervalMs} ms
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Button {anom.button === 0 ? 'Left' : anom.button === 2 ? 'Right' : anom.button}
                    </span>
                  </div>
                  <span className="text-zinc-400 text-[10px]">
                    +{anom.intervalMs}ms from prev
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Final Verdict Card */}
      <VerdictCard
        verdict={chatterEvaluation.verdict}
        reason={chatterEvaluation.reason}
        stats={metrics.intervals}
        onRetest={reset}
        onExport={handleExportJson}
        learnLink="/learn/switch-chatter"
      />

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'Event Arrival Delta', description: 'Raw timestamp differences between consecutive pointerdown events captured via high-resolution performance.now().' },
          { label: 'Actuated Button Identification', description: 'Exact button index (0=Left, 1=Middle, 2=Right, etc.) associated with each event.' },
        ]}
        estimated={[
          { label: 'Chatter Probability Heuristic', description: 'Empirical classification of human clicking limits (<70ms is rapid human, <30ms is nearly impossible without hardware bounce).' },
          { label: 'Switch Health Verdict', description: 'Evaluated ratio of anomaly events relative to total sample size (>0.5% flagged as suspect).' },
        ]}
        unavailable={[
          { label: 'Microvolt Contact Bounce Oscilloscope Trace', description: 'Bare-metal switch contact oxidation and electrical bounce voltage pulses happen at microsecond scales prior to MCU debounce.' },
          { label: 'Firmware Debounce Algorithm', description: 'Whether the mouse uses deferral debounce, eager debounce, or optical beam interruption cannot be read from software.' },
        ]}
      />
    </DiagnosticShell>
  );
}
