import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, renderHook, act } from './test-utils';
import { useKeyboardTest } from '../hooks/useKeyboardTest';
import { KeyboardCircuitsNotice } from '../components/feedback/KeyboardCircuitsNotice';
import { KeyboardFocusNotice } from '../components/feedback/KeyboardFocusNotice';

describe('Keyboard MVP Test Suite', () => {
  describe('useKeyboardTest Hook & Event Processing', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('initializes with clean, empty state and default metrics', () => {
      const { result } = renderHook(() => useKeyboardTest());

      expect(result.current.activeKeys.size).toBe(0);
      expect(result.current.testedKeys.size).toBe(0);
      expect(result.current.peakHeld).toBe(0);
      expect(result.current.totalKeystrokes).toBe(0);
      expect(result.current.chatterAnomalies.length).toBe(0);
      expect(result.current.lastEvent).toBeNull();
      expect(result.current.metrics.rolloverTier).toBe('2KRO');
    });

    it('tracks single keydown and keyup lifecycles with hold duration', () => {
      const { result } = renderHook(() => useKeyboardTest());

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            code: 'KeyA',
            key: 'a',
            location: 0,
            repeat: false,
          })
        );
      });

      expect(result.current.activeKeys.has('KeyA')).toBe(true);
      expect(result.current.testedKeys.has('KeyA')).toBe(true);
      expect(result.current.totalKeystrokes).toBe(1);
      expect(result.current.lastEvent?.code).toBe('KeyA');
      expect(result.current.lastEvent?.key).toBe('a');

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            code: 'KeyA',
            key: 'a',
            location: 0,
          })
        );
      });

      expect(result.current.activeKeys.has('KeyA')).toBe(false);
      expect(result.current.lastHoldMs).not.toBeNull();
      expect(result.current.holdSummary.sampleCount).toBe(1);
    });

    it('accurately tracks concurrent key chords and classifies rollover tier', () => {
      const { result } = renderHook(() => useKeyboardTest());

      // Press 6 keys simultaneously (A, S, D, F, G, H -> 6KRO)
      act(() => {
        ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH'].forEach(code => {
          window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code.replace('Key', '').toLowerCase() }));
        });
      });

      expect(result.current.activeKeys.size).toBe(6);
      expect(result.current.peakHeld).toBe(6);
      expect(result.current.metrics.rolloverTier).toBe('6KRO');

      // Add 4 more keys (total 10 held -> NKRO)
      act(() => {
        ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'].forEach(code => {
          window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code }));
        });
      });

      expect(result.current.activeKeys.size).toBe(10);
      expect(result.current.peakHeld).toBe(10);
      expect(result.current.metrics.rolloverTier).toBe('NKRO');
      expect(result.current.recordedChords.length).toBeGreaterThan(0);
    });

    it('detects mechanical contact bounce chatter within debounce threshold window', () => {
      let mockTime = 1000;
      vi.spyOn(performance, 'now').mockImplementation(() => mockTime);

      const { result } = renderHook(() => useKeyboardTest({ debounceThresholdMs: 35 }));

      // First keydown at t=1000
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', repeat: false }));
      });

      // Rapid bounce 15ms later (t=1015)
      mockTime = 1015;
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', repeat: false }));
      });

      expect(result.current.chatterAnomalies.length).toBe(1);
      expect(result.current.chatterAnomalies[0].code).toBe('Space');
      expect(result.current.chatterAnomalies[0].intervalMs).toBe(15);
    });

    it('ignores OS auto-repeat events when calculating chatter', () => {
      const { result } = renderHook(() => useKeyboardTest({ debounceThresholdMs: 35 }));

      // First initial keydown
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', key: 'w', repeat: false }));
      });

      // OS repeat event with repeat: true
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', key: 'w', repeat: true }));
      });

      // Repeat should NOT be flagged as chatter anomaly
      expect(result.current.chatterAnomalies.length).toBe(0);
    });

    it('automatically flushes activeKeys when window loses focus (preventing stuck keys)', () => {
      const { result } = renderHook(() => useKeyboardTest());

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', key: 'w' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft', key: 'Shift' }));
      });

      expect(result.current.activeKeys.size).toBe(2);

      // Window blur event (e.g. user Alt+Tabs or clicks out)
      act(() => {
        window.dispatchEvent(new Event('blur'));
      });

      expect(result.current.activeKeys.size).toBe(0);
      expect(result.current.isWindowFocused).toBe(false);

      // Window focus returns
      act(() => {
        window.dispatchEvent(new Event('focus'));
      });

      expect(result.current.isWindowFocused).toBe(true);
    });

    it('provides a manual clearStuckKeys mechanism', () => {
      const { result } = renderHook(() => useKeyboardTest());

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ControlLeft', key: 'Control' }));
      });
      expect(result.current.activeKeys.size).toBe(1);

      act(() => {
        result.current.clearStuckKeys();
      });
      expect(result.current.activeKeys.size).toBe(0);
    });
  });

  describe('Keyboard Metrology Transparency Components', () => {
    it('renders KeyboardCircuitsNotice explaining physical vs browser distinctions', () => {
      render(<KeyboardCircuitsNotice defaultExpanded={true} />);

      expect(screen.getByText(/Browser Observation vs. Keyboard Circuitry/i)).toBeInTheDocument();
      expect(screen.getByText(/1. Keys Observed by Browser/i)).toBeInTheDocument();
      expect(screen.getByText(/2. Simultaneous Combinations Observed/i)).toBeInTheDocument();
      expect(screen.getByText(/3. Hardware-Level Rollover/i)).toBeInTheDocument();
      expect(screen.getByText(/4. Hardware-Level Anti-Ghosting/i)).toBeInTheDocument();
    });

    it('renders KeyboardFocusNotice with active warning when unfocused', () => {
      const { rerender } = render(<KeyboardFocusNotice isFocused={true} />);
      expect(screen.getByText(/Focus Active/i)).toBeInTheDocument();

      rerender(<KeyboardFocusNotice isFocused={false} />);
      expect(screen.getByText(/Browser Window Unfocused/i)).toBeInTheDocument();
      expect(screen.getByText(/Click anywhere inside/i)).toBeInTheDocument();
    });
  });
});
