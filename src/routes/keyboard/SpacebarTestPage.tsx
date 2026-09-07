import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { KeyboardFocusNotice } from '../../components/feedback/KeyboardFocusNotice';
import { MeasurementScopePanel } from '../../components/feedback/MeasurementScopePanel';
import { useKeyboardTest } from '../../hooks/useKeyboardTest';
import { RotateCcw, Maximize2, Gauge, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SpacebarTestPage() {
  const { activeKeys, chatterAnomalies, lastHoldMs, isWindowFocused, reset } = useKeyboardTest();

  const [activeZone, setActiveZone] = useState<'left' | 'leftCenter' | 'center' | 'rightCenter' | 'right'>('center');
  const [zoneTaps, setZoneTaps] = useState({
    left: 0,
    leftCenter: 0,
    center: 0,
    rightCenter: 0,
    right: 0,
  });

  const [spacebarHistory, setSpacebarHistory] = useState<number[]>([]);
  const isSpaceDown = activeKeys.has('Space');
  const prevSpaceDownRef = useRef(false);

  // When spacebar is pressed, increment currently selected zone and log tap timestamp
  useEffect(() => {
    if (isSpaceDown && !prevSpaceDownRef.current) {
      const now = performance.now();
      setZoneTaps(prev => ({
        ...prev,
        [activeZone]: prev[activeZone] + 1,
      }));
      setSpacebarHistory(prev => [...prev.slice(-49), now]);
    }
    prevSpaceDownRef.current = isSpaceDown;
  }, [isSpaceDown, activeZone]);

  // Spacebar chatter anomalies specifically
  const spacebarChatter = chatterAnomalies.filter(a => a.code === 'Space');

  // Spacebar CPS (taps in the last 2 seconds / 2)
  const now = performance.now();
  const recentTaps = spacebarHistory.filter(t => now - t <= 2000).length;
  const spacebarCps = Number((recentTaps / 2).toFixed(1));

  const totalSpaceTaps = zoneTaps.left + zoneTaps.leftCenter + zoneTaps.center + zoneTaps.rightCenter + zoneTaps.right;

  const handleReset = () => {
    reset();
    setZoneTaps({ left: 0, leftCenter: 0, center: 0, rightCenter: 0, right: 0 });
    setSpacebarHistory([]);
  };

  return (
    <DiagnosticShell
      title="Spacebar Stabilizer, Balance & Chatter Test"
      subtitle="Inspect wire stabilizer binding, rattling, and actuation reliability across left, center, and right edges."
      bannerTopic="keyboard"
      actions={
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Counters</span>
        </button>
      }
    >
      <KeyboardFocusNotice isFocused={isWindowFocused} />

      {/* Main Spacebar Visual Graphic */}
      <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-2xl mb-4 font-mono text-xs text-zinc-500">
          <span>Target Stabilizer Actuation Zone: <strong className="text-zinc-900 dark:text-white uppercase">{activeZone}</strong></span>
          <span>Total Spacebar Taps: <strong className="text-zinc-900 dark:text-white">{totalSpaceTaps}</strong></span>
        </div>

        {/* 5-Zone Physical Spacebar Graphic */}
        <div className="w-full max-w-2xl h-24 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 flex overflow-hidden shadow-sm font-mono text-xs select-none">
          {/* Left Edge */}
          <button
            type="button"
            onClick={() => setActiveZone('left')}
            className={`flex-1 flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              activeZone === 'left' ? 'ring-2 ring-inset ring-sky-500' : ''
            } ${
              isSpaceDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold' : 'bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="font-bold text-[11px]">LEFT EDGE</span>
            <span className="text-[10px] opacity-80">{zoneTaps.left} taps</span>
          </button>

          {/* Left Center */}
          <button
            type="button"
            onClick={() => setActiveZone('leftCenter')}
            className={`flex-[1.2] flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              activeZone === 'leftCenter' ? 'ring-2 ring-inset ring-sky-500' : ''
            } ${
              isSpaceDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="font-bold text-[11px]">LEFT-MID</span>
            <span className="text-[10px] opacity-80">{zoneTaps.leftCenter} taps</span>
          </button>

          {/* Center Switch Stem */}
          <button
            type="button"
            onClick={() => setActiveZone('center')}
            className={`flex-[1.6] flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              activeZone === 'center' ? 'ring-2 ring-inset ring-sky-500' : ''
            } ${
              isSpaceDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold' : 'bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="font-bold text-[11px]">CENTER STEM</span>
            <span className="text-[10px] opacity-80">{zoneTaps.center} taps</span>
          </button>

          {/* Right Center */}
          <button
            type="button"
            onClick={() => setActiveZone('rightCenter')}
            className={`flex-[1.2] flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              activeZone === 'rightCenter' ? 'ring-2 ring-inset ring-sky-500' : ''
            } ${
              isSpaceDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="font-bold text-[11px]">RIGHT-MID</span>
            <span className="text-[10px] opacity-80">{zoneTaps.rightCenter} taps</span>
          </button>

          {/* Right Edge */}
          <button
            type="button"
            onClick={() => setActiveZone('right')}
            className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              activeZone === 'right' ? 'ring-2 ring-inset ring-sky-500' : ''
            } ${
              isSpaceDown ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold' : 'bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="font-bold text-[11px]">RIGHT EDGE</span>
            <span className="text-[10px] opacity-80">{zoneTaps.right} taps</span>
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center mt-4 max-w-lg">
          Select a zone above, then tap your physical spacebar at that physical point. Verify that the key switch actuates consistently without binding or sticking.
        </p>
      </div>

      {/* Metrics Row: Tap Speed, Hold Time, Chatter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-sky-500" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Spacebar Tap Cadence</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {spacebarCps} <span className="text-xs font-normal text-zinc-400">taps/sec</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Release Latency</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isSpaceDown ? 'HOLDING' : lastHoldMs !== null ? `${lastHoldMs} ms` : '—'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Spacebar Chatter</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {spacebarChatter.length === 0 ? (
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" /> 0 Anomalies
              </span>
            ) : (
              <span className="text-rose-500 text-sm font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4" /> {spacebarChatter.length} Bounces
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mechanical Stabilizer Diagnostic Advice */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
        <h4 className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-3 uppercase flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span>Stabilizer Diagnosis &amp; Tuning Guide</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-600 dark:text-zinc-400 font-sans">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
            <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">1. Warped Spacebar Binding</strong>
            PBT keycaps shrink non-uniformly during cooling, causing a slight banana curve. If pressing the far edge causes sluggish rebound or key binding, check if the spacebar rocks when laid flat on glass.
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
            <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">2. Bent Stabilizer Wire Ticking</strong>
            If one side rattles louder than the other, the steel wire is not coplanar. Straightening the wire on a flat smartphone screen or glass block eliminates uneven contact rattle.
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/70 dark:border-zinc-800">
            <strong className="text-zinc-900 dark:text-white block mb-1 font-mono">3. Switch Stem Centering</strong>
            Because the central switch stem bears the return spring, off-center presses transmit lateral torque through the stabilizer wire to keep the key level without tilting.
          </div>
        </div>
      </div>

      <MeasurementScopePanel
        observed={[
          { label: 'Spacebar keydown / keyup', description: 'Real-time detection of Space scancode actuation.' },
          { label: 'Zone Tap Distribution', description: 'Empirical count of verified actuations partitioned across left, center, and right zones.' },
        ]}
        estimated={[
          { label: 'Tap Cadence (CPS)', description: 'Spacebar clicks-per-second calculated over rolling 2-second moving window.' },
        ]}
        unavailable={[
          { label: 'Stabilizer Wire Straightness', description: 'Physical coplanar tolerance of steel wire must be checked mechanically on flat glass.' },
          { label: 'Acoustic Rattle Decibels', description: 'Microphone acoustic measurements of stabilizer housing wire strike.' },
        ]}
      />
    </DiagnosticShell>
  );
}
