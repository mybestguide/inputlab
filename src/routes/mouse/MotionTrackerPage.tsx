import React, { useState, useRef, useEffect } from 'react';
import { DiagnosticShell } from '../../components/layout/DiagnosticShell';
import { RotateCcw, Move, Lock, Unlock } from 'lucide-react';
import { useBrowserCapabilities } from '../../hooks/useBrowserCapabilities';

export default function MotionTrackerPage() {
  const [eventCount, setEventCount] = useState(0);
  const [coalescedCount, setCoalescedCount] = useState(0);
  const [currentRateHz, setCurrentRateHz] = useState(0);
  const [maxRateHz, setMaxRateHz] = useState(0);
  const [currentSpeedPxS, setCurrentSpeedPxS] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const { capabilities } = useBrowserCapabilities();
  const motionHistoryRef = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    setEventCount(prev => prev + 1);

    // Check for coalesced events
    let cCount = 1;
    if ('getCoalescedEvents' in e.nativeEvent) {
      const coalesced = e.nativeEvent.getCoalescedEvents();
      if (coalesced && coalesced.length > 0) {
        cCount = coalesced.length;
        setCoalescedCount(prev => prev + coalesced.length);
      }
    }

    motionHistoryRef.current.push(now);

    // Calculate instantaneous speed
    if (lastPosRef.current) {
      const dt = (now - lastPosRef.current.time) / 1000;
      if (dt > 0.005) {
        const dx = e.movementX || (e.clientX - lastPosRef.current.x);
        const dy = e.movementY || (e.clientY - lastPosRef.current.y);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.round(dist / dt);
        setCurrentSpeedPxS(speed);
        lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      }
    } else {
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
    }
  };

  // Rolling frequency calculator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      const oneSecAgo = now - 1000;
      const recent = motionHistoryRef.current.filter(t => t >= oneSecAgo);
      motionHistoryRef.current = recent;
      const rate = recent.length;
      setCurrentRateHz(rate);
      setMaxRateHz(prev => Math.max(prev, rate));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const togglePointerLock = () => {
    if (!containerRef.current) return;
    if (document.pointerLockElement === containerRef.current) {
      document.exitPointerLock();
      setIsLocked(false);
    } else {
      containerRef.current.requestPointerLock();
      setIsLocked(true);
    }
  };

  useEffect(() => {
    const onLockChange = () => {
      setIsLocked(document.pointerLockElement === containerRef.current);
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  const reset = () => {
    setEventCount(0);
    setCoalescedCount(0);
    setCurrentRateHz(0);
    setMaxRateHz(0);
    setCurrentSpeedPxS(0);
    motionHistoryRef.current = [];
    lastPosRef.current = null;
  };

  return (
    <DiagnosticShell
      title="Pointer Event Rate & Motion Tracker"
      subtitle="Observes browser-delivered pointer dispatch frequency, coalesced event counts, and movement dynamics."
      bannerTopic="polling"
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
      {/* Motion Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        tabIndex={0}
        className="min-h-[260px] p-8 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/20 dark:bg-sky-950/20 hover:border-sky-500 transition-all flex flex-col items-center justify-center cursor-crosshair select-none text-center focus:outline-none focus:ring-2 focus:ring-sky-500 relative"
      >
        <Move className="w-10 h-10 text-sky-500 mb-2" />
        <span className="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold mb-1">
          Move Pointer Continuously
        </span>
        <div className="text-4xl font-mono font-bold text-zinc-900 dark:text-white my-2">
          {currentRateHz} <span className="text-base font-normal text-zinc-500">Events/sec (Hz)</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
          Sweep your mouse rapidly across this area. Note that browser event dispatch is throttled by display refresh ({capabilities?.estimatedDisplayHz ?? 60}Hz) and OS compositor cycles.
        </p>

        {/* Pointer Lock Toggle */}
        <button
          type="button"
          onClick={togglePointerLock}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {isLocked ? <Unlock className="w-3.5 h-3.5 text-amber-500" /> : <Lock className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{isLocked ? 'Release Pointer Lock (Esc)' : 'Lock Pointer for Endless Sweep'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Current Event Rate</span>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            {currentRateHz} Hz
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Peak Event Rate</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {maxRateHz} Hz
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Pointer Speed</span>
          <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mt-1">
            {currentSpeedPxS} px/s
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-zinc-400 uppercase block">Coalesced Events</span>
          <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mt-1">
            {coalescedCount > 0 ? coalescedCount : 'N/A (Level 2)'}
          </div>
        </div>
      </div>
    </DiagnosticShell>
  );
}
