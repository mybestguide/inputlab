import { HistogramBin } from '../../types/metrics';

export function buildIntervalHistogram(intervals: number[]): HistogramBin[] {
  const bins: { label: string; min: number; max: number; count: number }[] = [
    { label: '<20ms (Severe Chatter)', min: 0, max: 20, count: 0 },
    { label: '20-40ms (Suspect Bounce)', min: 20, max: 40, count: 0 },
    { label: '40-60ms (Possible Anomaly)', min: 40, max: 60, count: 0 },
    { label: '60-80ms (Human Limit)', min: 60, max: 80, count: 0 },
    { label: '80-120ms (Rapid Tap)', min: 80, max: 120, count: 0 },
    { label: '>120ms (Normal Cadence)', min: 120, max: Infinity, count: 0 },
  ];

  for (const val of intervals) {
    for (const bin of bins) {
      if (val >= bin.min && val < bin.max) {
        bin.count++;
        break;
      }
    }
  }

  const total = intervals.length || 1;
  return bins.map(b => ({
    ...b,
    percentage: Number(((b.count / total) * 100).toFixed(1)),
  }));
}
