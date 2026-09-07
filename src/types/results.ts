import { StatisticalSummary } from './metrics';

export type DiagnosticVerdict = 
  | 'HEALTHY' 
  | 'SUSPECT_ANOMALY' 
  | 'DEFECT_CONFIRMED' 
  | 'INCONCLUSIVE';

export interface AnomalyRecord {
  timestamp: number;
  description: string;
  deltaMs: number;
  targetId: string;
}

export interface TestSessionResult {
  testId: string;
  testName: string;
  completedAt: string;
  durationSeconds: number;
  verdict: DiagnosticVerdict;
  verdictReason: string;
  sampleCount: number;
  anomalies: AnomalyRecord[];
  summaryStats?: StatisticalSummary;
}
