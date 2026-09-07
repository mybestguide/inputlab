import React, { useState, useEffect } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { RotateCcw, Sliders, CheckCircle2, Lock, ShieldCheck, Zap } from 'lucide-react';

interface ModifierDef {
  code: string;
  name: string;
  side: 'left' | 'right' | 'lock';
  location: number;
}

const MODIFIERS: ModifierDef[] = [
  { code: 'ShiftLeft', name: 'Left Shift', side: 'left', location: 1 },
  { code: 'ControlLeft', name: 'Left Ctrl', side: 'left', location: 1 },
  { code: 'AltLeft', name: 'Left Alt / Option', side: 'left', location: 1 },
  { code: 'MetaLeft', name: 'Left Win / Cmd', side: 'left', location: 1 },
  { code: 'ShiftRight', name: 'Right Shift', side: 'right', location: 2 },
  { code: 'ControlRight', name: 'Right Ctrl', side: 'right', location: 2 },
  { code: 'AltRight', name: 'Right Alt / AltGr', side: 'right', location: 2 },
  { code: 'MetaRight', name: 'Right Win / Cmd', side: 'right', location: 2 },
];

const MODIFIER_CHORDS = [
  { id: 'ctrl-shift', name: 'Ctrl + Shift', codes: ['ControlLeft', 'ShiftLeft'] },
  { id: 'ctrl-alt', name: 'Ctrl + Alt', codes: ['ControlLeft', 'AltLeft'] },
  { id: 'shift-alt', name: 'Shift + Alt', codes: ['ShiftLeft', 'AltLeft'] },
  { id: 'ctrl-shift-alt', name: 'Ctrl + Shift + Alt', codes: ['ControlLeft', 'ShiftLeft', 'AltLeft'] },
  { id: 'hyper-chord', name: 'All 4 Modifiers (Hyper)', codes: ['ControlLeft', 'ShiftLeft', 'AltLeft', 'MetaLeft'] },
];

export default function ModifiersPage() {
  const { activeKeys, testedKeys, isWindowFocused, reset } = useKeyboardTest();

  // Hardware lock states queried via KeyboardEvent.getModifierState()
  const [locks, setLocks] = useState({
    capsLock: false,
    numLock: false,
    scrollLock: false,
  });

  const [testedChords, setTestedChords] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setLocks({
        capsLock: e.getModifierState('CapsLock'),
        numLock: e.getModifierState('NumLock'),
        scrollLock: e.getModifierState('ScrollLock'),
      });
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  // Track chord test pass
  MODIFIER_CHORDS.forEach(chord => {
    const allHeld = chord.codes.every(c => activeKeys.has(c));
    if (allHeld && !testedChords.has(chord.id)) {
      setTestedChords(prev => new Set(prev).add(chord.id));
    }
  });

  const handleReset = () => {
    reset();
    setTestedChords(new Set());
  };

  return (
    <DiagnosticShell
      title="Modifier Keys & Lock State Diagnostic"
      subtitle="Verify Left vs. Right modifier differentiation, concurrent modifier chords, and hardware Lock states."
      bannerTopic="keyboard"
      actions={
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Counters</span>
        </button>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Hardware Lock States Readout */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Hardware Keyboard Lock States (getModifierState)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              locks.capsLock
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-wider block text-zinc-500 dark:text-zinc-400 font-medium">Lock State</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Caps Lock</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${locks.capsLock ? 'bg-amber-500 text-white shadow-xs' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
              {locks.capsLock ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              locks.numLock
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-wider block text-zinc-500 dark:text-zinc-400 font-medium">Lock State</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Num Lock</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${locks.numLock ? 'bg-amber-500 text-white shadow-xs' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
              {locks.numLock ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              locks.scrollLock
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-wider block text-zinc-500 dark:text-zinc-400 font-medium">Lock State</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Scroll Lock</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${locks.scrollLock ? 'bg-amber-500 text-white shadow-xs' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
              {locks.scrollLock ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Left vs Right Modifier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left Side Modifiers */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h4 className="font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Left Modifiers (Location 1)
            </h4>
            <span className="text-[11px] text-zinc-400">Standard Left Hand</span>
          </div>

          <div className="space-y-2">
            {MODIFIERS.filter(m => m.side === 'left').map(m => {
              const isDown = activeKeys.has(m.code);
              const isTested = testedKeys.has(m.code);

              return (
                <div
                  key={m.code}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isDown
                      ? 'border-sky-800 dark:border-sky-300 bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                      : isTested
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{m.name}</span>
                    <span className="text-[10px] opacity-75">{m.code}</span>
                  </div>
                  <span className="text-xs font-bold uppercase">
                    {isDown ? 'HELD' : isTested ? 'VERIFIED' : 'UNTESTED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Modifiers */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h4 className="font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Right Modifiers (Location 2)
            </h4>
            <span className="text-[11px] text-zinc-400">Right Hand / AltGr</span>
          </div>

          <div className="space-y-2">
            {MODIFIERS.filter(m => m.side === 'right').map(m => {
              const isDown = activeKeys.has(m.code);
              const isTested = testedKeys.has(m.code);

              return (
                <div
                  key={m.code}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isDown
                      ? 'border-sky-800 dark:border-sky-300 bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                      : isTested
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{m.name}</span>
                    <span className="text-[10px] opacity-75">{m.code}</span>
                  </div>
                  <span className="text-xs font-bold uppercase">
                    {isDown ? 'HELD' : isTested ? 'VERIFIED' : 'UNTESTED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modifier Combinations / Chords */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-500" />
            <h4 className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Simultaneous Modifier Combinations ({testedChords.size}/{MODIFIER_CHORDS.length})
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400">
            Hold modifiers simultaneously to verify chord registration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {MODIFIER_CHORDS.map(chord => {
            const isDone = testedChords.has(chord.id);

            return (
              <div
                key={chord.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDone
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850'
                }`}
              >
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">{chord.name}</span>
                  <span className="text-[10px] text-zinc-400">{chord.codes.join(' + ')}</span>
                </div>
                {isDone ? (
                  <span className="text-emerald-700 dark:text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="text-zinc-600 dark:text-zinc-400 text-[10px] font-mono font-medium">AWAITING</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'DOM Level 3 e.location', description: 'Distinguishes between Location 1 (Left) and Location 2 (Right) modifier switches.' },
          { label: 'getModifierState()', description: 'Queries host operating system toggle state for CapsLock, NumLock, and ScrollLock.' },
        ]}
        estimated={[
          { label: 'Modifier Chord Concurrency', description: 'Simultaneous hold verification for complex hotkeys and IDE chords.' },
        ]}
        unavailable={[
          { label: 'Physical LED Indicators', description: 'Browser cannot detect whether the physical diode LED on the keyboard case is illuminated.' },
          { label: 'OS-Level Global Hotkey Intercepts', description: 'Certain OS keys (e.g. Win key on Windows or Cmd+Space on macOS) are trapped by the OS before reaching web tabs.' },
        ]}
      />
    </DiagnosticShell>
  );
}
