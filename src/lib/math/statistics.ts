import { StatisticalSummary } from '../../types/metrics';

export function calculateSummary(values: number[]): StatisticalSummary {
  if (values.length === 0) {
    return {
      sampleCount: 0,
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      stdev: 0,
      p95: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Standard Deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdev = Math.sqrt(variance);

  // 95th percentile
  const p95Index = Math.min(Math.floor(n * 0.95), n - 1);
  const p95 = sorted[p95Index];

  return {
    sampleCount: n,
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdev: Number(stdev.toFixed(2)),
    p95: Number(p95.toFixed(2)),
  };
}
