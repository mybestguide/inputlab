import React from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { MouseSilhouette } from '../../components/visualizers/MouseSilhouette';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useMouseTest } from '../../hooks/useMouseTest';
import { exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { RotateCcw, CheckCircle2, Circle, Download } from 'lucide-react';

export default function ButtonsInspectorPage() {
  const {
    activeButtons,
    buttonCounts,
    totalClicks,
    holdTimes,
    metrics,
    eventBuffer,
    handlePointerDown,
    handlePointerUp,
    reset,
  } = useMouseTest();

  const buttonDefinitions = [
    { id: 0, label: 'Primary (Left Click)', bit: 1 },
    { id: 1, label: 'Auxiliary (Middle Click / Wheel)', bit: 4 },
    { id: 2, label: 'Secondary (Right Click)', bit: 2 },
    { id: 3, label: 'Browser Back (Thumb Button 1)', bit: 8 },
    { id: 4, label: 'Browser Forward (Thumb Button 2)', bit: 16 },
  ];

  const handleExport = () => {
    exportTelemetryAsJson(
      {
        test: '5-Button Switch Hardware Inspector',
        totalClicks,
        buttonCounts,
        activeButtons,
        metrics,
        events: eventBuffer.toArray(),
      },
      `inputlab-buttons-${Date.now()}`
    );
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
      } as unknown as React.PointerEvent<HTMLElement>;
      handlePointerDown(fakeEvent);
      setTimeout(() => {
        handlePointerUp(fakeEvent);
      }, 80);
    }
  };

  return (
    <DiagnosticShell
      title="5-Button Hardware Switch Inspector"
      subtitle="Verify that all physical mouse buttons and auxiliary thumb switches actuate cleanly without dropped signals."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset button test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bench (R)</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            aria-label="Export button test logs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Silhouette */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Interactive button test zone. Press left, right, middle, or thumb buttons here."
          className="md:col-span-5 p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <MouseSilhouette activeButtons={activeButtons} buttonCounts={buttonCounts} />
          <div className="mt-4 text-xs font-mono text-zinc-500">
            Current Bitmask: <span className="font-bold text-zinc-900 dark:text-zinc-100">0b{activeButtons.toString(2).padStart(5, '0')}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-2">
            Keyboard navigation: Press [Space] or [Enter]
          </span>
        </div>

        {/* Right: Button State Checklist & Verification Table */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Physical Button Verification Checklist
            </h3>

            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {buttonDefinitions.map((btn) => {
                const count = buttonCounts[btn.id] || 0;
                const isDown = (activeButtons & btn.bit) !== 0;

                return (
                  <div key={btn.id} className="py-3 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-3">
                      {count > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {btn.label}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          W3C button ID: {btn.id} | Bitmask: {btn.bit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 shadow-xs' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                        {isDown ? 'PRESSED' : 'RELEASED'}
                      </span>
                      <span className="w-16 text-right text-zinc-700 dark:text-zinc-300 font-semibold">
                        {count} hits
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hold Latency Summary */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Press Duration Statistics
            </h3>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block text-[10px] uppercase">Min Hold</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {metrics.holdTimes.min} ms
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block text-[10px] uppercase">Median Hold</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {metrics.holdTimes.median} ms
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block text-[10px] uppercase">Max Hold</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {metrics.holdTimes.max} ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Scope Transparency */}
      <MeasurementScopePanel
        observed={[
          { label: 'Button Index & Bitmask', description: 'Discrete W3C event.button integer and event.buttons bitfield flags.' },
          { label: 'Press & Release Transitions', description: 'Immediate browser DOM pointerdown and pointerup event trigger timestamps.' },
        ]}
        estimated={[
          { label: 'Hold Duration', description: 'Delta elapsed between pointerdown and pointerup for each switch ID (t_up - t_down).' },
        ]}
        unavailable={[
          { label: 'Auxiliary Multi-Function Buttons', description: 'Specialized DPI buttons or profile cycle switches often intercepted by onboard mouse firmware and never passed to the OS.' },
          { label: 'Switch Pre-Travel & Total Travel', description: 'Mechanical travel distance (mm) before leaf spring contact closure cannot be determined by software.' },
        ]}
      />
    </DiagnosticShell>
  );
}
