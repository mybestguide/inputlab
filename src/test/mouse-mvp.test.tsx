import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, renderHook, act } from './test-utils';
import { calculateSummary } from '../lib/math/statistics';
import { buildIntervalHistogram } from '../lib/math/histogram';
import { evaluateChatter } from '../lib/math/chatterAnalysis';
import { useMouseTest } from '../hooks/useMouseTest';
import { MeasurementScopePanel } from '../components/feedback/MeasurementScopePanel';
import { CircularBuffer } from '../core/engines/CircularBuffer';

describe('Mouse MVP Calculations', () => {
  describe('Statistical Summary Engine', () => {
    it('handles empty input arrays cleanly with zeros', () => {
      const summary = calculateSummary([]);
      expect(summary.sampleCount).toBe(0);
      expect(summary.min).toBe(0);
      expect(summary.max).toBe(0);
      expect(summary.mean).toBe(0);
      expect(summary.median).toBe(0);
      expect(summary.stdev).toBe(0);
      expect(summary.p95).toBe(0);
    });

    it('calculates single-sample stats accurately', () => {
      const summary = calculateSummary([50]);
      expect(summary.sampleCount).toBe(1);
      expect(summary.min).toBe(50);
      expect(summary.max).toBe(50);
      expect(summary.mean).toBe(50);
      expect(summary.median).toBe(50);
      expect(summary.stdev).toBe(0);
      expect(summary.p95).toBe(50);
    });

    it('computes min, max, median, mean, and stdev for normal sample arrays', () => {
      const values = [10, 20, 30, 40, 50];
      const summary = calculateSummary(values);
      expect(summary.sampleCount).toBe(5);
      expect(summary.min).toBe(10);
      expect(summary.max).toBe(50);
      expect(summary.median).toBe(30);
      expect(summary.mean).toBe(30);
      expect(summary.stdev).toBeCloseTo(14.14, 1);
    });
  });

  describe('Interval Histogram Binning', () => {
    it('creates standard interval histogram bins', () => {
      const intervals = [15, 25, 45, 95, 150];
      const bins = buildIntervalHistogram(intervals);
      expect(bins.length).toBeGreaterThan(0);
      const totalCount = bins.reduce((acc, b) => acc + b.count, 0);
      expect(totalCount).toBe(5);
    });
  });

  describe('Switch Chatter Evaluation Engine', () => {
    it('returns INCONCLUSIVE for fewer than 5 total clicks', () => {
      const evaluation = evaluateChatter(3, 0, 100);
      expect(evaluation.verdict).toBe('INCONCLUSIVE');
      expect(evaluation.anomalyRate).toBe(0);
      expect(evaluation.reason).toContain('Insufficient sample size');
    });

    it('returns HEALTHY when ample samples have zero anomalies', () => {
      const evaluation = evaluateChatter(40, 0, 85);
      expect(evaluation.verdict).toBe('HEALTHY');
      expect(evaluation.reason).toContain('Clean electrical contacts');
    });

    it('returns SUSPECT_ANOMALY when anomalies exist with interval >= 30ms', () => {
      const evaluation = evaluateChatter(100, 1, 45);
      expect(evaluation.verdict).toBe('SUSPECT_ANOMALY');
      expect(evaluation.anomalyRate).toBe(1);
      expect(evaluation.reason).toContain('May indicate early switch degradation');
    });

    it('returns DEFECT_CONFIRMED when anomaly interval < 30ms', () => {
      const evaluation = evaluateChatter(100, 5, 12);
      expect(evaluation.verdict).toBe('DEFECT_CONFIRMED');
      expect(evaluation.reason).toContain('Consistent with physical microswitch contact chatter/oxidation');
    });
  });

  describe('Circular Buffer Engine', () => {
    it('maintains a bounded capacity and evicts oldest items in FIFO order', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      expect(buffer.size).toBe(3);
      expect(buffer.toArray()).toEqual([1, 2, 3]);

      buffer.push(4);
      expect(buffer.size).toBe(3);
      expect(buffer.toArray()).toEqual([2, 3, 4]);
    });
  });
});

describe('Mouse Hook State Transitions', () => {
  it('initializes with clean idle state', () => {
    const { result } = renderHook(() => useMouseTest());
    expect(result.current.totalClicks).toBe(0);
    expect(result.current.activeButtons).toBe(0);
    expect(result.current.chatterAnomalies.length).toBe(0);
    expect(result.current.lastInterval).toBeNull();
  });

  it('updates total clicks, active buttons, and button counts on pointerdown', () => {
    const { result } = renderHook(() => useMouseTest());

    const fakeEvent = {
      preventDefault: vi.fn(),
      button: 0,
      buttons: 1,
      clientX: 100,
      clientY: 100,
    } as unknown as React.PointerEvent<HTMLElement>;

    act(() => {
      result.current.handlePointerDown(fakeEvent);
    });

    expect(result.current.totalClicks).toBe(1);
    expect(result.current.activeButtons).toBe(1);
    expect(result.current.buttonCounts[0]).toBe(1);
  });

  it('calculates hold times between pointerdown and pointerup', () => {
    const { result } = renderHook(() => useMouseTest());

    const downEvent = {
      preventDefault: vi.fn(),
      button: 0,
      buttons: 1,
      clientX: 50,
      clientY: 50,
    } as unknown as React.PointerEvent<HTMLElement>;

    const upEvent = {
      preventDefault: vi.fn(),
      button: 0,
      buttons: 0,
      clientX: 50,
      clientY: 50,
    } as unknown as React.PointerEvent<HTMLElement>;

    act(() => {
      result.current.handlePointerDown(downEvent);
    });

    act(() => {
      result.current.handlePointerUp(upEvent);
    });

    expect(result.current.holdTimes.length).toBe(1);
    expect(result.current.activeButtons).toBe(0);
  });

  it('resets all collected telemetry on reset()', () => {
    const { result } = renderHook(() => useMouseTest());

    const fakeEvent = {
      preventDefault: vi.fn(),
      button: 2,
      buttons: 2,
      clientX: 0,
      clientY: 0,
    } as unknown as React.PointerEvent<HTMLElement>;

    act(() => {
      result.current.handlePointerDown(fakeEvent);
    });

    expect(result.current.totalClicks).toBe(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.totalClicks).toBe(0);
    expect(result.current.activeButtons).toBe(0);
    expect(result.current.buttonCounts).toEqual({});
  });
});

describe('MeasurementScopePanel Component', () => {
  it('renders collapsed by default and expands on click', () => {
    render(
      <MeasurementScopePanel
        observed={[{ label: 'Event Timestamps', description: 'Captured via performance.now()' }]}
        estimated={[{ label: 'Inter-Click Intervals', description: 'Delta between clicks' }]}
        unavailable={[{ label: 'USB Polling Rate', description: 'Quantized by OS' }]}
      />
    );

    expect(screen.getByText('Measurement Scope & Accuracy Transparency')).toBeInTheDocument();
    expect(screen.queryByText('Browser-Observed')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /measurement scope & accuracy transparency/i }));

    expect(screen.getByText('Browser-Observed')).toBeInTheDocument();
    expect(screen.getByText('Calculated & Estimated')).toBeInTheDocument();
    expect(screen.getByText('Hardware Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Event Timestamps')).toBeInTheDocument();
  });
});
