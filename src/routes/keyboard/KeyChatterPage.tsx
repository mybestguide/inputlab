import React, { useState } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { VerdictCard } from '../../components/feedback/VerdictCard';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { DiagnosticVerdict } from '../../types/results';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Zap, Sliders, Activity } from 'lucide-react';

export default function KeyChatterPage() {
  const [thresholdMs, setThresholdMs] = useState(35);
  const {
    totalKeystrokes,
    chatterAnomalies,
    lastHoldMs,
    holdSummary,
    repeatDelaySummary,
    repeatIntervalSummary,
    isWindowFocused,
    reset,
  } = useKeyboardTest({ debounceThresholdMs: thresholdMs });

  const getVerdict = (): { verdict: DiagnosticVerdict; reason: string } => {
    if (totalKeystrokes < 10) {
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'Awaiting switch samples. Tap individual mechanical keys (e.g. Space, W, Enter) at least 10 times to evaluate switch chatter.',
      };
    }
    if (chatterAnomalies.length === 0) {
      return {
        verdict: 'HEALTHY',
        reason: `Clean Switch Contacts: Zero contact bounce anomalies detected across ${totalKeystrokes} keystrokes below ${thresholdMs}ms.`,
      };
    }
    if (chatterAnomalies.length <= 2) {
      return {
        verdict: 'SUSPECT_ANOMALY',
        reason: `Occasional Contact Bounce: ${chatterAnomalies.length} bounce pulse(s) logged within <${thresholdMs}ms. Clean switch or test debounce firmware settings.`,
      };
    }
    return {
      verdict: 'DEFECT_CONFIRMED',
      reason: `Mechanical Switch Chatter Detected: ${chatterAnomalies.length} rapid bounce events detected. Switch leaf oxidation or failing mechanical switch suspected.`,
    };
  };

  const verdictData = getVerdict();

  const handleExport = () => {
    exportTelemetryAsJson(
      {
        testType: 'Key Response & Switch Chatter Test',
        debounceThresholdMs: thresholdMs,
        totalKeystrokes,
        anomalies: chatterAnomalies,
        holdSummary,
        repeatDelaySummary,
        repeatIntervalSummary,
      },
      `inputlab-key-chatter-${Date.now()}`
    );
  };

  return (
    <DiagnosticShell
      title="Key Response, Hold Latency & Chatter Test"
      subtitle="Evaluates key switch release latency, OS repeat delay, and mechanical contact bounce chatter (<35ms)."
      bannerTopic="chatter"
      actions={
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset (R)</span>
        </button>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Target Key Tap Stage */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold mb-1">
          Target Switch Response Bench
        </span>
        <div className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 dark:text-white my-2">
          {totalKeystrokes} <span className="text-sm font-normal text-zinc-500">Keystrokes Monitored</span>
        </div>
        <p className="text-xs text-zinc-500 max-w-lg">
          Tap individual keys quickly (especially suspected chattering keys like Space, Enter, or WASD). Hold a key to observe the OS repeat delay and cadence.
        </p>

        {/* Debounce Threshold Selector */}
        <div className="mt-4 flex items-center gap-3 font-mono text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <Sliders className="w-3.5 h-3.5 text-sky-500" />
          <span>Debounce Anomaly Threshold:</span>
          <input
            type="range"
            min={15}
            max={70}
            step={5}
            value={thresholdMs}
            onChange={e => setThresholdMs(Number(e.target.value))}
            className="w-24 accent-sky-500 cursor-pointer"
          />
          <span className="font-bold text-zinc-900 dark:text-white w-10 text-right">{thresholdMs}ms</span>
        </div>
      </div>

      {/* Primary Metrics Row: Hold Timing & Repeat Timing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Hold Latency Card */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Hold Duration (Release Latency)</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {lastHoldMs !== null ? `${lastHoldMs} ms` : '—'}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">
              Press-to-release duration of most recent key.
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-1 text-[10px] text-zinc-500">
            <div>Min: <strong className="text-zinc-700 dark:text-zinc-300">{holdSummary.min}ms</strong></div>
            <div>Med: <strong className="text-zinc-700 dark:text-zinc-300">{holdSummary.median}ms</strong></div>
            <div>P95: <strong className="text-zinc-700 dark:text-zinc-300">{holdSummary.p95}ms</strong></div>
          </div>
        </div>

        {/* Repeat Delay Card */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">OS Key Repeat Delay</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {repeatDelaySummary.sampleCount > 0 ? `${repeatDelaySummary.median} ms` : '—'}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">
              Duration before OS fires the first repeat event (typically 250–500ms).
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-500">
            Samples logged: <strong className="text-zinc-700 dark:text-zinc-300">{repeatDelaySummary.sampleCount}</strong>
          </div>
        </div>

        {/* Repeat Cadence Card */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Repeat Rate Cadence</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {repeatIntervalSummary.sampleCount > 0 ? (
                <>
                  {repeatIntervalSummary.mean} ms
                  <span className="text-xs text-zinc-400 font-normal ml-2">
                    (~{Math.round(1000 / (repeatIntervalSummary.mean || 33))} Hz)
                  </span>
                </>
              ) : (
                '—'
              )}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">
              Interval between consecutive auto-repeated keydown events.
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-500">
            Repeat pulses: <strong className="text-zinc-700 dark:text-zinc-300">{repeatIntervalSummary.sampleCount}</strong>
          </div>
        </div>
      </div>

      {/* Verdict & Anomaly Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verdict Card */}
        <div className="space-y-4">
          <VerdictCard
            verdict={verdictData.verdict}
            reason={verdictData.reason}
            stats={holdSummary}
            onRetest={reset}
            onExport={handleExport}
          />

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <h4 className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-2 uppercase">
              How Switch Chatter Manifests
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Mechanical key switches rely on gold-plated metal leaf springs. As switches accumulate dust or oxidize with age, the physical contact bounces upon closing. If the firmware debounce window is too aggressive, the host receives two keydown events in rapid succession (&lt;35ms).
            </p>
          </div>
        </div>

        {/* Flagged Anomaly List */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold uppercase tracking-wider text-zinc-400">
              Flagged Bounce Events ({chatterAnomalies.length})
            </h4>
            <span className="text-[10px] text-zinc-400">Filtered &lt;{thresholdMs}ms</span>
          </div>
          <div className="flex-1 max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {chatterAnomalies.length === 0 ? (
              <div className="text-zinc-400 italic py-10 text-center">
                No bounce anomalies logged. Contacts operating cleanly.
              </div>
            ) : (
              chatterAnomalies.map((anom) => (
                <div key={anom.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold text-[11px]">
                      {anom.code}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-semibold">&ldquo;{anom.key}&rdquo;</span>
                  </div>
                  <span className="text-rose-500 font-semibold text-[11px]">
                    +{anom.intervalMs} ms
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'Event Arrival Delta', description: 'Microsecond performance.now() delta between consecutive keydown dispatches for the same switch.' },
          { label: 'Key Hold Time', description: 'Delta between keydown and corresponding keyup event for individual keystrokes.' },
          { label: 'Repeat Arrival Cadence', description: 'Observed interval between consecutive repeat events.' },
        ]}
        estimated={[
          { label: 'Contact Bounce Anomaly', description: 'Flagged when consecutive non-repeat keydowns occur under the user-defined debounce threshold.' },
          { label: 'Repeat Rate (Hz)', description: 'Estimated frequency calculated from reciprocal of mean repeat interval.' },
        ]}
        unavailable={[
          { label: 'Physical Actuation Pre-Travel', description: 'Switch travel distance to electrical contact point (e.g. 1.2mm - 2.0mm).' },
          { label: 'Actuation Force (Grams / cN)', description: 'Mechanical spring force required to actuate the switch.' },
        ]}
      />
    </DiagnosticShell>
  );
}
