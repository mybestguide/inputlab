import { useState, useRef, useCallback, useEffect } from 'react';
import { CircularBuffer } from '../core/engines/CircularBuffer';
import { KeyboardEventRecord } from '../types/events';
import { KeyboardSessionMetrics, StatisticalSummary } from '../types/metrics';
import { loadSettings } from '../core/storage/localStorageAdapter';
import { playClickSound, playAnomalyAlertSound } from '../lib/utils/audioFeedback';
import { calculateSummary } from '../lib/math/statistics';

export interface RecordedChord {
  id: string;
  timestamp: number;
  count: number;
  keys: string[];
}

export interface UseKeyboardTestOptions {
  debounceThresholdMs?: number;
  trackKeyUps?: boolean;
}

export function useKeyboardTest(options: UseKeyboardTestOptions = {}) {
  const debounceThreshold = options.debounceThresholdMs ?? 35;
  const trackKeyUps = options.trackKeyUps ?? true;

  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [peakHeld, setPeakHeld] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [chatterAnomalies, setChatterAnomalies] = useState<KeyboardEventRecord[]>([]);
  const [lastEvent, setLastEvent] = useState<KeyboardEventRecord | null>(null);
  const [isWindowFocused, setIsWindowFocused] = useState(() => (typeof document !== 'undefined' ? document.hasFocus() : true));
  const [recordedChords, setRecordedChords] = useState<RecordedChord[]>([]);
  const [holdTimes, setHoldTimes] = useState<number[]>([]);
  const [lastHoldMs, setLastHoldMs] = useState<number | null>(null);
  const [repeatDelays, setRepeatDelays] = useState<number[]>([]);
  const [repeatIntervals, setRepeatIntervals] = useState<number[]>([]);

  const eventBufferRef = useRef(new CircularBuffer<KeyboardEventRecord>(1000));
  const lastKeyTimeMapRef = useRef<Map<string, number>>(new Map());
  const keyPressDownTimeMapRef = useRef<Map<string, number>>(new Map());
  const keyFirstRepeatMapRef = useRef<Map<string, boolean>>(new Map());
  const keyLastRepeatTimeMapRef = useRef<Map<string, number>>(new Map());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent common browser navigation/scrolling defaults for test area keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace'].includes(e.code)) {
      e.preventDefault();
    }

    const code = e.code;
    const now = performance.now();
    const settings = loadSettings();

    if (settings.soundEnabled && !e.repeat) {
      playClickSound(600);
    }

    let isAnomaly = false;
    let delta: number | undefined;

    // Chatter detection on non-repeat keydowns
    const lastTime = lastKeyTimeMapRef.current.get(code);
    if (lastTime !== undefined && !e.repeat) {
      delta = Number((now - lastTime).toFixed(2));
      if (delta < debounceThreshold) {
        isAnomaly = true;
        if (settings.soundEnabled) {
          playAnomalyAlertSound();
        }
      }
    }
    lastKeyTimeMapRef.current.set(code, now);

    // Initial press time tracking (for hold duration)
    if (!e.repeat) {
      keyPressDownTimeMapRef.current.set(code, now);
      keyFirstRepeatMapRef.current.set(code, false);
    } else {
      // Repeat metrics tracking
      const downTime = keyPressDownTimeMapRef.current.get(code);
      const hasHadFirstRepeat = keyFirstRepeatMapRef.current.get(code);
      if (downTime && !hasHadFirstRepeat) {
        const initialDelay = Number((now - downTime).toFixed(1));
        setRepeatDelays(prev => [...prev.slice(-99), initialDelay]);
        keyFirstRepeatMapRef.current.set(code, true);
      }
      const lastRepeat = keyLastRepeatTimeMapRef.current.get(code);
      if (lastRepeat) {
        const repeatDelta = Number((now - lastRepeat).toFixed(1));
        setRepeatIntervals(prev => [...prev.slice(-99), repeatDelta]);
      }
      keyLastRepeatTimeMapRef.current.set(code, now);
    }

    const record: KeyboardEventRecord = {
      id: `${now}-${code}-down`,
      timestamp: now,
      device: 'keyboard',
      type: 'keydown',
      code,
      key: e.key,
      repeat: e.repeat,
      location: e.location,
      keyCode: e.keyCode,
      activeCount: activeKeys.size + (activeKeys.has(code) ? 0 : 1),
      intervalMs: delta,
      isChatterAnomaly: isAnomaly,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        capsLock: e.getModifierState ? e.getModifierState('CapsLock') : false,
        numLock: e.getModifierState ? e.getModifierState('NumLock') : false,
      },
    };

    eventBufferRef.current.push(record);
    setLastEvent(record);

    if (isAnomaly) {
      setChatterAnomalies(prev => [record, ...prev].slice(0, 50));
    }

    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      const newSize = next.size;
      setPeakHeld(currentPeak => {
        if (newSize > currentPeak) {
          return newSize;
        }
        return currentPeak;
      });

      // Record simultaneous chords if 3 or more keys
      if (newSize >= 3) {
        setRecordedChords(oldChords => {
          const keyList = Array.from(next).sort();
          const lastChord = oldChords[0];
          // Don't duplicate exact identical chord in short succession
          if (lastChord && lastChord.keys.join(',') === keyList.join(',')) {
            return oldChords;
          }
          const chord: RecordedChord = {
            id: `${now}-chord-${newSize}`,
            timestamp: now,
            count: newSize,
            keys: keyList,
          };
          return [chord, ...oldChords].slice(0, 20);
        });
      }

      return next;
    });

    setTestedKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });

    setTotalKeystrokes(prev => prev + 1);
  }, [activeKeys, debounceThreshold]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const code = e.code;
    const now = performance.now();
    const downTime = keyPressDownTimeMapRef.current.get(code);
    let holdDuration: number | undefined;

    if (downTime !== undefined) {
      holdDuration = Number((now - downTime).toFixed(1));
      keyPressDownTimeMapRef.current.delete(code);
      setLastHoldMs(holdDuration);
      setHoldTimes(prev => [...prev.slice(-299), holdDuration!]);
    }
    keyFirstRepeatMapRef.current.delete(code);
    keyLastRepeatTimeMapRef.current.delete(code);

    if (trackKeyUps) {
      const record: KeyboardEventRecord = {
        id: `${now}-${code}-up`,
        timestamp: now,
        device: 'keyboard',
        type: 'keyup',
        code,
        key: e.key,
        repeat: false,
        location: e.location,
        keyCode: e.keyCode,
        activeCount: Math.max(0, activeKeys.size - 1),
        holdDurationMs: holdDuration,
        modifiers: {
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey,
          meta: e.metaKey,
          capsLock: e.getModifierState ? e.getModifierState('CapsLock') : false,
          numLock: e.getModifierState ? e.getModifierState('NumLock') : false,
        },
      };
      eventBufferRef.current.push(record);
      setLastEvent(record);
    }

    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  }, [activeKeys.size, trackKeyUps]);

  // Clear stuck keys if focus is lost (Alt-Tab, Cmd-Tab, clicking outside)
  const handleWindowBlur = useCallback(() => {
    setIsWindowFocused(false);
    setActiveKeys(new Set());
    keyPressDownTimeMapRef.current.clear();
    keyFirstRepeatMapRef.current.clear();
    keyLastRepeatTimeMapRef.current.clear();
  }, []);

  const handleWindowFocus = useCallback(() => {
    setIsWindowFocused(true);
  }, []);

  const reset = useCallback(() => {
    eventBufferRef.current.clear();
    lastKeyTimeMapRef.current.clear();
    keyPressDownTimeMapRef.current.clear();
    keyFirstRepeatMapRef.current.clear();
    keyLastRepeatTimeMapRef.current.clear();
    setActiveKeys(new Set());
    setTestedKeys(new Set());
    setPeakHeld(0);
    setTotalKeystrokes(0);
    setChatterAnomalies([]);
    setLastEvent(null);
    setRecordedChords([]);
    setHoldTimes([]);
    setLastHoldMs(null);
    setRepeatDelays([]);
    setRepeatIntervals([]);
  }, []);

  const clearStuckKeys = useCallback(() => {
    setActiveKeys(new Set());
    keyPressDownTimeMapRef.current.clear();
  }, []);

  // Set up window listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [handleKeyDown, handleKeyUp, handleWindowBlur, handleWindowFocus]);

  let rolloverTier: '2KRO' | '6KRO' | 'NKRO' = '2KRO';
  if (peakHeld >= 10) rolloverTier = 'NKRO';
  else if (peakHeld >= 6) rolloverTier = '6KRO';

  const metrics: KeyboardSessionMetrics = {
    totalKeystrokes,
    testedKeysCount: testedKeys.size,
    currentHeld: activeKeys.size,
    peakHeld,
    activeCodes: Array.from(activeKeys),
    rolloverTier,
    chatterAnomalies: chatterAnomalies.length,
    ghostingConflicts: 0,
  };

  const holdSummary: StatisticalSummary = calculateSummary(holdTimes);
  const repeatDelaySummary: StatisticalSummary = calculateSummary(repeatDelays);
  const repeatIntervalSummary: StatisticalSummary = calculateSummary(repeatIntervals);

  return {
    activeKeys,
    testedKeys,
    peakHeld,
    totalKeystrokes,
    chatterAnomalies,
    lastEvent,
    isWindowFocused,
    recordedChords,
    holdTimes,
    lastHoldMs,
    holdSummary,
    repeatDelaySummary,
    repeatIntervalSummary,
    metrics,
    eventBuffer: eventBufferRef.current,
    reset,
    clearStuckKeys,
  };
}

