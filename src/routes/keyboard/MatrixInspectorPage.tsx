import React, { useState, useMemo } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { exportTelemetryAsCsv, exportTelemetryAsJson } from '../../core/storage/sessionExporter';
import { RotateCcw, Download, Search, Filter, ShieldCheck, Zap, Hash, Clock } from 'lucide-react';

export default function MatrixInspectorPage() {
  const {
    eventBuffer,
    lastEvent,
    lastHoldMs,
    holdSummary,
    totalKeystrokes,
    isWindowFocused,
    reset,
  } = useKeyboardTest();

  const [filterType, setFilterType] = useState<'all' | 'keydown' | 'keyup'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAnomalies, setOnlyAnomalies] = useState(false);

  const events = eventBuffer.toArray();

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (onlyAnomalies && !e.isChatterAnomaly) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return e.code.toLowerCase().includes(q) || e.key.toLowerCase().includes(q);
      }
      return true;
    });
  }, [events, filterType, onlyAnomalies, searchQuery]);

  const handleExportCsv = () => {
    const rows = events.map((e, idx) => ({
      index: idx + 1,
      timestamp: e.timestamp.toFixed(2),
      type: e.type,
      code: e.code,
      key: e.key,
      location: e.location ?? 0,
      repeat: e.repeat ? 'YES' : 'NO',
      holdMs: e.holdDurationMs ?? 'N/A',
      intervalMs: e.intervalMs ?? 'N/A',
      isAnomaly: e.isChatterAnomaly ? 'YES' : 'NO',
      shift: e.modifiers.shift ? 'YES' : 'NO',
      ctrl: e.modifiers.ctrl ? 'YES' : 'NO',
      alt: e.modifiers.alt ? 'YES' : 'NO',
      meta: e.modifiers.meta ? 'YES' : 'NO',
    }));
    exportTelemetryAsCsv(rows, `inputlab-key-tester-${Date.now()}`);
  };

  const handleExportJson = () => {
    exportTelemetryAsJson(
      {
        totalKeystrokes,
        events,
        holdSummary,
      },
      `inputlab-key-tester-${Date.now()}`
    );
  };

  const getLocationLabel = (loc?: number) => {
    switch (loc) {
      case 1: return 'Left Hand';
      case 2: return 'Right Hand';
      case 3: return 'Numpad';
      default: return 'Standard';
    }
  };

  return (
    <DiagnosticShell
      title="Key Tester & Scancode Inspector"
      subtitle="Examine raw W3C DOM Level 3 KeyboardEvents: physical e.code vs. OS-mapped e.key, locations, and timings."
      bannerTopic="keyboard"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stream</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Target Key Inspection Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Key Tile */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
            Active Switch Under Test
          </span>

          {lastEvent ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 border-2 border-sky-500 text-sky-600 dark:text-sky-400 flex flex-col items-center justify-center shadow-lg my-2">
                <span className="text-3xl font-mono font-black">{lastEvent.key === ' ' ? '␣' : lastEvent.key}</span>
                <span className="text-[10px] font-mono opacity-75 mt-0.5">{lastEvent.code}</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 mt-4 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-left border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">Type</span>
                  <span className="font-bold text-zinc-900 dark:text-white uppercase">{lastEvent.type}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-left border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">Location</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{getLocationLabel(lastEvent.location)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-left border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">Repeat</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{lastEvent.repeat ? 'Repeated' : 'First Down'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-left border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">Hold Latency</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {lastEvent.holdDurationMs ? `${lastEvent.holdDurationMs}ms` : lastHoldMs ? `${lastHoldMs}ms` : 'Actuated'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-zinc-400 font-mono text-xs italic">
              Press any key on your keyboard to begin inspection.
            </div>
          )}
        </div>

        {/* Live Event Stream Table with Search and Filters */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Scancode Log ({filteredEvents.length})
              </span>
            </div>

            {/* Filter buttons & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter code or key..."
                  className="pl-8 pr-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-zinc-100 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${filterType === 'all' ? 'bg-white dark:bg-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('keydown')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${filterType === 'keydown' ? 'bg-white dark:bg-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('keyup')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${filterType === 'keyup' ? 'bg-white dark:bg-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
                >
                  Up
                </button>
              </div>

              <button
                type="button"
                onClick={() => setOnlyAnomalies(p => !p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  onlyAnomalies
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Anomalies Only
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left divide-y divide-zinc-200 dark:divide-zinc-800 text-[11px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="py-1.5 px-2">#</th>
                  <th className="py-1.5 px-2">Type</th>
                  <th className="py-1.5 px-2">Physical Code</th>
                  <th className="py-1.5 px-2">Semantic Key</th>
                  <th className="py-1.5 px-2">Location</th>
                  <th className="py-1.5 px-2">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-zinc-400 italic">
                      No matching events. Press keys to populate log.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.slice(-60).reverse().map((e, idx) => (
                    <tr key={e.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/50">
                      <td className="py-1.5 px-2 text-zinc-400">{filteredEvents.length - idx}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            e.type === 'keydown'
                              ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {e.type}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 font-bold text-sky-600 dark:text-sky-400">{e.code}</td>
                      <td className="py-1.5 px-2 font-medium text-zinc-900 dark:text-zinc-100">&ldquo;{e.key}&rdquo;</td>
                      <td className="py-1.5 px-2 text-zinc-500">{getLocationLabel(e.location)}</td>
                      <td className="py-1.5 px-2 text-zinc-500">
                        {e.holdDurationMs ? (
                          <span className="text-emerald-600 font-semibold">{e.holdDurationMs}ms hold</span>
                        ) : e.intervalMs ? (
                          <span className={e.isChatterAnomaly ? 'text-rose-500 font-bold' : ''}>
                            {e.intervalMs}ms int
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'Physical Scancode (e.code)', description: 'Physical key position on standard keyboard layout, invariant to active typing language.' },
          { label: 'Semantic Character (e.key)', description: 'OS-mapped text symbol generated according to active keyboard layout and modifier state.' },
          { label: 'Location Flag (e.location)', description: 'Identifies standard, left vs right modifier variants, and numeric keypad switches.' },
        ]}
        estimated={[
          { label: 'Key Hold Latency', description: 'Calculated delta between keydown and keyup performance.now() timestamps.' },
          { label: 'Inter-Keystroke Interval', description: 'Delta between consecutive keydown events on the same switch.' },
        ]}
        unavailable={[
          { label: 'Mechanical Stem Friction', description: 'Linear switch smoothness, tactile bump peak, or spring weight.' },
          { label: 'Switch Debounce Firmware Logic', description: 'Microcontroller debounce algorithm (e.g. defer vs eager debounce).' },
        ]}
      />
    </DiagnosticShell>
  );
}
