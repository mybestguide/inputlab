import React, { useState } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { RotateCcw, Compass, CheckCircle2, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GAMING_CLUSTER = [
  { code: 'KeyW', label: 'W', category: 'Forward' },
  { code: 'KeyA', label: 'A', category: 'Left Strafe' },
  { code: 'KeyS', label: 'S', category: 'Backward' },
  { code: 'KeyD', label: 'D', category: 'Right Strafe' },
  { code: 'ShiftLeft', label: 'Shift', category: 'Sprint' },
  { code: 'ControlLeft', label: 'Ctrl', category: 'Crouch' },
  { code: 'Space', label: 'Space', category: 'Jump' },
  { code: 'AltLeft', label: 'Alt', category: 'Walk / Dodge' },
  { code: 'KeyQ', label: 'Q', category: 'Ability 1 / Lean' },
  { code: 'KeyE', label: 'E', category: 'Interact / Lean' },
  { code: 'KeyR', label: 'R', category: 'Reload' },
  { code: 'KeyF', label: 'F', category: 'Flash / Melee' },
  { code: 'KeyC', label: 'C', category: 'Slide / Prone' },
  { code: 'Tab', label: 'Tab', category: 'Scoreboard' },
  { code: 'Digit1', label: '1', category: 'Primary Weapon' },
  { code: 'Digit2', label: '2', category: 'Secondary Weapon' },
  { code: 'Digit3', label: '3', category: 'Melee Weapon' },
  { code: 'Digit4', label: '4', category: 'Explosive' },
];

interface GamingChord {
  id: string;
  name: string;
  codes: string[];
  action: string;
}

const GAMING_CHORDS: GamingChord[] = [
  {
    id: 'sprint-diag-right',
    name: 'Shift + W + D',
    codes: ['ShiftLeft', 'KeyW', 'KeyD'],
    action: 'Sprint diagonal forward-right',
  },
  {
    id: 'sprint-diag-left',
    name: 'Shift + W + A',
    codes: ['ShiftLeft', 'KeyW', 'KeyA'],
    action: 'Sprint diagonal forward-left',
  },
  {
    id: 'jump-strafe',
    name: 'W + D + Space',
    codes: ['KeyW', 'KeyD', 'Space'],
    action: 'Air-strafe jump right',
  },
  {
    id: 'crouch-jump',
    name: 'Ctrl + Space + W',
    codes: ['ControlLeft', 'Space', 'KeyW'],
    action: 'Tactical crouch-jump obstacle clearance',
  },
  {
    id: 'sprint-slide',
    name: 'Shift + W + C',
    codes: ['ShiftLeft', 'KeyW', 'KeyC'],
    action: 'Tactical sprint slide',
  },
  {
    id: 'weapon-swap-strafe',
    name: 'W + D + 1',
    codes: ['KeyW', 'KeyD', 'Digit1'],
    action: 'Swap to primary weapon while strafing',
  },
];

export default function GamingWasdPage() {
  const { activeKeys, testedKeys, isWindowFocused, reset } = useKeyboardTest();
  const [completedChords, setCompletedChords] = useState<Set<string>>(new Set());

  // Check which chords are completed
  GAMING_CHORDS.forEach(chord => {
    const allHeld = chord.codes.every(c => activeKeys.has(c));
    if (allHeld && !completedChords.has(chord.id)) {
      setCompletedChords(prev => new Set(prev).add(chord.id));
    }
  });

  // Calculate directional heading vector from WASD
  const w = activeKeys.has('KeyW');
  const s = activeKeys.has('KeyS');
  const a = activeKeys.has('KeyA');
  const d = activeKeys.has('KeyD');

  let dx = 0;
  let dy = 0;
  if (w) dy -= 1;
  if (s) dy += 1;
  if (a) dx -= 1;
  if (d) dx += 1;

  let headingLabel = 'NEUTRAL / IDLE';
  let angleDeg = 0;
  let isMoving = false;

  if (dx === 0 && dy === -1) { headingLabel = 'FORWARD'; angleDeg = 0; isMoving = true; }
  else if (dx === 1 && dy === -1) { headingLabel = 'FORWARD-RIGHT (45°)'; angleDeg = 45; isMoving = true; }
  else if (dx === 1 && dy === 0) { headingLabel = 'RIGHT STRAFE (90°)'; angleDeg = 90; isMoving = true; }
  else if (dx === 1 && dy === 1) { headingLabel = 'BACKWARD-RIGHT (135°)'; angleDeg = 135; isMoving = true; }
  else if (dx === 0 && dy === 1) { headingLabel = 'BACKWARD (180°)'; angleDeg = 180; isMoving = true; }
  else if (dx === -1 && dy === 1) { headingLabel = 'BACKWARD-LEFT (225°)'; angleDeg = 225; isMoving = true; }
  else if (dx === -1 && dy === 0) { headingLabel = 'LEFT STRAFE (270°)'; angleDeg = 270; isMoving = true; }
  else if (dx === -1 && dy === -1) { headingLabel = 'FORWARD-LEFT (315°)'; angleDeg = 315; isMoving = true; }
  else if ((w && s) || (a && d)) { headingLabel = 'CANCELLED (OPPOSING KEYS)'; }

  return (
    <DiagnosticShell
      title="WASD & Movement Cluster Gaming Test"
      subtitle="Dedicated benchmark for competitive movement cluster keys, directional vectors, and simultaneous action chords."
      bannerTopic="keyboard"
      actions={
        <button
          type="button"
          onClick={() => {
            reset();
            setCompletedChords(new Set());
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cluster</span>
        </button>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Movement Vector Radar & Key Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Directional Vector Radar Compass */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-center font-mono">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Realtime Movement Vector
          </span>

          <div className="relative w-36 h-36 rounded-full border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-zinc-50 dark:bg-zinc-850">
            {/* Cardinal labels */}
            <span className="absolute top-1 text-[10px] font-bold text-zinc-400">W</span>
            <span className="absolute bottom-1 text-[10px] font-bold text-zinc-400">S</span>
            <span className="absolute left-2 text-[10px] font-bold text-zinc-400">A</span>
            <span className="absolute right-2 text-[10px] font-bold text-zinc-400">D</span>

            {/* Pointer needle */}
            {isMoving ? (
              <div
                className="w-1.5 h-16 bg-gradient-to-t from-transparent to-sky-500 rounded-full origin-bottom transform transition-transform duration-100"
                style={{ transform: `rotate(${angleDeg}deg) translateY(-24px)` }}
              />
            ) : (
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            )}
          </div>

          <div className="mt-4">
            <span className="text-xs text-zinc-400 block uppercase text-[10px]">Resulting Heading</span>
            <span className={`font-bold text-sm ${isMoving ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-500'}`}>
              {headingLabel}
            </span>
          </div>
        </div>

        {/* Gaming Cluster Keys Visual Grid */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Movement &amp; Action Keys Matrix
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-xs">
            {GAMING_CLUSTER.map((item) => {
              const isActive = activeKeys.has(item.code);
              const isTested = testedKeys.has(item.code);

              return (
                <div
                  key={item.code}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    isActive
                      ? 'border-sky-800 dark:border-sky-300 bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 shadow-xs scale-105'
                      : isTested
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/60'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider opacity-70 truncate max-w-full">
                    {item.category}
                  </span>
                  <span className={`text-xl font-bold my-0.5 ${isActive ? 'text-white dark:text-zinc-950' : isTested ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {item.label}
                  </span>
                  <span className="text-[9px]">
                    {isActive ? 'HELD' : isTested ? 'OK' : 'WAIT'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Gaming Movement Chords Checklist */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-purple-500" />
            <h4 className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Essential FPS &amp; Battle Royale Chords ({completedChords.size}/{GAMING_CHORDS.length})
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400">
            Press keys simultaneously to verify non-blocking
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GAMING_CHORDS.map((chord) => {
            const isDone = completedChords.has(chord.id);
            const activeCount = chord.codes.filter(c => activeKeys.has(c)).length;

            return (
              <div
                key={chord.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  isDone
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-850/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{chord.name}</span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans">{chord.action}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {chord.codes.map(c => (
                    <span
                      key={c}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        activeKeys.has(c)
                          ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                          : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {c.replace('Key', '').replace('Digit', '')}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'WASD Concurrency', description: 'Simultaneous receipt of W, A, S, D, modifier, and weapon number keydowns.' },
          { label: 'Directional Vector Calculation', description: 'Mathematical sum of horizontal and vertical axis key inputs in software.' },
        ]}
        estimated={[
          { label: 'Gaming Cluster Anti-Ghosting', description: 'Empirical verification that essential 3-key and 4-key gaming chords fire without dropping.' },
        ]}
        unavailable={[
          { label: 'Analog Rapid Trigger Travel', description: 'Hall effect / magnetic switch variable actuation depth (e.g. 0.1mm - 4.0mm).' },
          { label: 'Physical Keycap Texture', description: 'PBT double-shot vs ABS texture and finger grip.' },
        ]}
      />
    </DiagnosticShell>
  );
}
