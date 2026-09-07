import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CircularBuffer } from '../core/engines/CircularBuffer';
import { MouseEventRecord } from '../types/events';
import { MouseSessionMetrics } from '../types/metrics';
import { calculateSummary } from '../lib/math/statistics';
import { buildIntervalHistogram } from '../lib/math/histogram';
import { evaluateChatter } from '../lib/math/chatterAnalysis';
import { loadSettings } from '../core/storage/localStorageAdapter';
import { playClickSound, playAnomalyAlertSound } from '../lib/utils/audioFeedback';

export function useMouseTest() {
  const [activeButtons, setActiveButtons] = useState(0);
  const [buttonCounts, setButtonCounts] = useState<Record<number, number>>({});
  const [totalClicks, setTotalClicks] = useState(0);
  const [chatterAnomalies, setChatterAnomalies] = useState<MouseEventRecord[]>([]);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [holdTimes, setHoldTimes] = useState<number[]>([]);
  const [lastInterval, setLastInterval] = useState<number | null>(null);
  const [scrollTicks, setScrollTicks] = useState(0);
  const [scrollReversals, setScrollReversals] = useState(0);

  // Engine buffers
  const eventBufferRef = useRef(new CircularBuffer<MouseEventRecord>(1000));
  const lastDownTimeRef = useRef<number | null>(null);
  const pressDownMapRef = useRef<Map<number, number>>(new Map());
  const lastScrollDirectionRef = useRef<number | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault();
    const now = performance.now();
    const button = e.button;
    const settings = loadSettings();

    if (settings.soundEnabled) {
      playClickSound();
    }

    // Interval calculation
    let deltaFromPrev: number | undefined;
    let isAnomaly = false;

    if (lastDownTimeRef.current !== null) {
      deltaFromPrev = Number((now - lastDownTimeRef.current).toFixed(2));
      setIntervals(prev => [...prev, deltaFromPrev!]);
      setLastInterval(deltaFromPrev);

      if (deltaFromPrev < settings.chatterThresholdMs) {
        isAnomaly = true;
        if (settings.soundEnabled) {
          playAnomalyAlertSound();
        }
      }
    }

    lastDownTimeRef.current = now;
    pressDownMapRef.current.set(button, now);

    const record: MouseEventRecord = {
      id: `${now}-${Math.random()}`,
      timestamp: now,
      device: 'mouse',
      type: 'down',
      button,
      buttons: e.buttons,
      clientX: e.clientX,
      clientY: e.clientY,
      intervalMs: deltaFromPrev,
      isChatterAnomaly: isAnomaly,
    };

    eventBufferRef.current.push(record);

    if (isAnomaly) {
      setChatterAnomalies(prev => [record, ...prev].slice(0, 50));
    }

    setActiveButtons(e.buttons);
    setButtonCounts(prev => ({
      ...prev,
      [button]: (prev[button] || 0) + 1,
    }));
    setTotalClicks(prev => prev + 1);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault();
    const now = performance.now();
    const button = e.button;

    const downTime = pressDownMapRef.current.get(button);
    if (downTime) {
      const holdDuration = Number((now - downTime).toFixed(2));
      setHoldTimes(prev => [...prev, holdDuration]);
      pressDownMapRef.current.delete(button);
    }

    setActiveButtons(e.buttons);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLElement>) => {
    e.preventDefault();
    const dir = Math.sign(e.deltaY);
    setScrollTicks(prev => prev + 1);

    if (lastScrollDirectionRef.current !== null && dir !== 0) {
      if (lastScrollDirectionRef.current !== dir) {
        setScrollReversals(prev => prev + 1);
      }
    }
    if (dir !== 0) {
      lastScrollDirectionRef.current = dir;
    }
  }, []);

  const reset = useCallback(() => {
    eventBufferRef.current.clear();
    lastDownTimeRef.current = null;
    pressDownMapRef.current.clear();
    lastScrollDirectionRef.current = null;

    setActiveButtons(0);
    setButtonCounts({});
    setTotalClicks(0);
    setChatterAnomalies([]);
    setIntervals([]);
    setHoldTimes([]);
    setLastInterval(null);
    setScrollTicks(0);
    setScrollReversals(0);
  }, []);

  // Keyboard shortcut for reset ('r' or 'Escape')
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
        // If not in input field
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset]);

  const intervalStats = calculateSummary(intervals);
  const holdStats = calculateSummary(holdTimes);
  const histogram = buildIntervalHistogram(intervals);
  const chatterEvaluation = evaluateChatter(
    totalClicks,
    chatterAnomalies.length,
    intervalStats.min
  );

  const metrics: MouseSessionMetrics = {
    totalClicks,
    buttonCounts,
    intervals: intervalStats,
    holdTimes: holdStats,
    chatterCount: chatterAnomalies.length,
    chatterRate: chatterEvaluation.anomalyRate,
    histogram,
    currentCps: 0,
    peakCps: 0,
    scrollTicks,
    scrollReversals,
  };

  return {
    activeButtons,
    buttonCounts,
    totalClicks,
    chatterAnomalies,
    lastInterval,
    intervals,
    holdTimes,
    scrollTicks,
    scrollReversals,
    metrics,
    chatterEvaluation,
    eventBuffer: eventBufferRef.current,
    handlePointerDown,
    handlePointerUp,
    handleWheel,
    reset,
  };
}
