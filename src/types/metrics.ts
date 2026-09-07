export interface StatisticalSummary {
  sampleCount: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdev: number;
  p95: number;
}

export interface HistogramBin {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface MouseSessionMetrics {
  totalClicks: number;
  buttonCounts: Record<number, number>;
  intervals: StatisticalSummary;
  holdTimes: StatisticalSummary;
  chatterCount: number;
  chatterRate: number;
  histogram: HistogramBin[];
  currentCps: number;
  peakCps: number;
  scrollTicks: number;
  scrollReversals: number;
}

export interface KeyboardSessionMetrics {
  totalKeystrokes: number;
  testedKeysCount: number;
  currentHeld: number;
  peakHeld: number;
  activeCodes: string[];
  rolloverTier: '2KRO' | '6KRO' | 'NKRO';
  chatterAnomalies: number;
  ghostingConflicts: number;
}
