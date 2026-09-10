import React from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { VirtualKeyboard } from '../../components/visualizers/VirtualKeyboard';
import { RolloverGauge } from '../../components/visualizers/RolloverGauge';
import { KeyboardCircuitsNotice } from '../../components/feedback/KeyboardCircuitsNotice';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { RotateCcw, Download, ShieldCheck, Grid, Gamepad2, Maximize2, Zap, Sliders } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function KeyboardOverviewPage() {
  const {
    activeKeys,
    testedKeys,
    peakHeld,
    totalKeystrokes,
    chatterAnomalies,
    lastEvent,
    isWindowFocused,
    metrics,
    eventBuffer,
    reset,
    clearStuckKeys,
  } = useKeyboardTest();

  const handleExport = () => {
    exportTelemetryAsJson(
      {
        sessionType: 'Keyboard Matrix Overview Diagnostic',
        exportedAt: new Date().toISOString(),
        metrics,
        testedKeys: Array.from(testedKeys),
        anomalies: chatterAnomalies,
        events: eventBuffer.toArray(),
      },
      `inputlab-keyboard-${Date.now()}`
    );
  };

  const coveragePct = Math.min(100, Math.round((testedKeys.size / 87) * 100));

  return (
    <DiagnosticShell
      title="Keyboard Diagnostics Overview & Matrix"
      subtitle="Examine keyboard switch registration, concurrent key rollover (KRO), and W3C KeyboardEvent scancodes."
      bannerTopic="keyboard"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Matrix</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Matrix JSON</span>
          </button>
        </div>
      }
    >
      {/* Focus & Window Capture Status */}
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Interactive Virtual Keyboard Matrix */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>Layout: ANSI 87-Key TKL</span>
            <span>&bull;</span>
            <span>Coverage: <strong className="text-zinc-900 dark:text-zinc-100">{coveragePct}%</strong> ({testedKeys.size}/87 keys)</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-700 dark:bg-sky-400 inline-block" /> Active ({activeKeys.size})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500 inline-block" /> Tested ({testedKeys.size})
            </span>
            {activeKeys.size > 0 && (
              <button
                type="button"
                onClick={clearStuckKeys}
                className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Clear Stuck Keys
              </button>
            )}
          </div>
        </div>

        <VirtualKeyboard activeKeys={activeKeys} testedKeys={testedKeys} />
      </div>

      {/* Rollover Gauge & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RolloverGauge
            currentHeld={metrics.currentHeld}
            peakHeld={metrics.peakHeld}
            activeCodes={metrics.activeCodes}
          />
        </div>

        {/* Realtime Scancode Readout */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between font-mono text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Last Key Scancode
            </h4>
            {lastEvent ? (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] text-zinc-400 block uppercase">e.code (Hardware Scancode)</span>
                  <span className="text-base font-bold text-sky-600 dark:text-sky-400">{lastEvent.code}</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] text-zinc-400 block uppercase">e.key (Semantic Character)</span>
                  <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">&ldquo;{lastEvent.key}&rdquo;</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-zinc-500 pt-1 text-[11px]">
                  <div>Type: <strong className="uppercase text-zinc-800 dark:text-zinc-200">{lastEvent.type}</strong></div>
                  <div>Repeat: <strong className="text-zinc-800 dark:text-zinc-200">{lastEvent.repeat ? 'YES' : 'NO'}</strong></div>
                  <div>Interval: <strong className="text-zinc-800 dark:text-zinc-200">{lastEvent.intervalMs ? `${lastEvent.intervalMs}ms` : '—'}</strong></div>
                  <div>Location: <strong className="text-zinc-800 dark:text-zinc-200">{lastEvent.location ?? 0}</strong></div>
                </div>
              </div>
            ) : (
              <div className="text-zinc-400 italic py-8 text-center">
                Press any key on your keyboard to inspect its scancode.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
            Total Keystrokes Logged: <strong className="text-zinc-700 dark:text-zinc-300">{totalKeystrokes}</strong>
          </div>
        </div>
      </div>

      {/* Critical Metrology Explanation: Browser Observation vs. Keyboard Circuitry */}
      <KeyboardCircuitsNotice />

      {/* Measurement Scope & Transparency Panel */}
      <MeasurementScopePanel
        observed={[
          { label: 'W3C e.code & e.key', description: 'Physical position identifier (e.code) and localized character (e.key) dispatched by host OS.' },
          { label: 'Concurrent Active Keystrokes', description: 'Real-time count and set of keys currently in keydown state before keyup.' },
          { label: 'Inter-Keystroke Timestamps', description: 'Microsecond performance.now() intervals between successive keydown events.' },
        ]}
        estimated={[
          { label: 'Rollover Classification Tier', description: 'Empirically observed peak concurrency (2KRO, 6KRO, or NKRO Ready) via simultaneous down events.' },
          { label: 'Matrix Coverage Ratio', description: 'Percentage of 87 standard ANSI TKL keys actuated during this diagnostic session.' },
        ]}
        unavailable={[
          { label: 'Physical PCB Trace Matrix', description: 'Browser APIs cannot inspect electrical circuit traces, ribbon cables, or solder joints.' },
          { label: 'Hardware Anti-Ghosting Diodes', description: 'Cannot physically probe surface-mount diode presence across key switches.' },
          { label: 'Switch Pre-Travel & Actuation Force', description: 'Mechanical travel depth (e.g. 2.0mm) and spring gram weight cannot be measured in software.' },
        ]}
      />

      {/* Dedicated Keyboard Diagnostic Suites */}
      <div className="mt-4">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Specialized Keyboard Diagnostic Suites
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <NavLink
            to="/keyboard/matrix"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Grid className="w-3.5 h-3.5 text-sky-500" />
              <span>Key Tester &amp; Scancodes</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Raw W3C KeyboardEvent stream, locations &amp; scancode audit.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/rollover"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Key Rollover (KRO)</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Test simultaneous chords &amp; empirical 2KRO / 6KRO / NKRO tier.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/anti-ghosting"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Grid className="w-3.5 h-3.5 text-indigo-500" />
              <span>Anti-Ghosting Triads</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Evaluate trace conflicts, blocking &amp; gaming triad chords.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/chatter"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Response &amp; Chatter</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Hold durations, repeat delay &amp; rapid mechanical contact bounce.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/gaming-wasd"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
              <span>WASD Gaming Cluster</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Movement cluster verification with live directional vector radar.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/spacebar"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Maximize2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Spacebar Stabilizer</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Wire stabilizer balance, rattle, edge vs. center actuation.
            </p>
          </NavLink>

          <NavLink
            to="/keyboard/modifiers"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-sky-400 dark:hover:border-sky-600 transition-all group"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              <Sliders className="w-3.5 h-3.5 text-teal-500" />
              <span>Modifier &amp; Lock States</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Left vs. Right modifier distinction &amp; hardware lock states.
            </p>
          </NavLink>
        </div>

        {/* Cross Navigation Bar */}
        <div className="mt-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <NavLink to="/" className="text-sky-600 dark:text-sky-400 hover:underline font-medium flex items-center gap-1">
            &larr; Return to InputLab Home
          </NavLink>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Also testing a mouse?</span>
            <NavLink to="/mouse" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1">
              Open Mouse Tester &rarr;
            </NavLink>
          </div>
        </div>
      </div>
    </DiagnosticShell>
  );
}

