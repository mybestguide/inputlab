import { DiagnosticVerdict } from '../../types/results';

export interface ChatterEvaluation {
  verdict: DiagnosticVerdict;
  reason: string;
  anomalyRate: number;
}

export function evaluateChatter(
  totalClicks: number, 
  anomaliesCount: number, 
  minInterval: number
): ChatterEvaluation {
  if (totalClicks < 5) {
    return {
      verdict: 'INCONCLUSIVE',
      reason: 'Insufficient sample size. Perform at least 15-20 deliberate single clicks.',
      anomalyRate: 0,
    };
  }

  const anomalyRate = Number(((anomaliesCount / totalClicks) * 100).toFixed(1));

  if (anomaliesCount === 0) {
    return {
      verdict: 'HEALTHY',
      reason: `Zero switch bounce anomalies detected across ${totalClicks} actuations. Clean electrical contacts.`,
      anomalyRate: 0,
    };
  }

  if (minInterval < 30) {
    return {
      verdict: 'DEFECT_CONFIRMED',
      reason: `Detected ${anomaliesCount} event(s) below 30ms (minimum: ${minInterval.toFixed(1)}ms). Consistent with physical microswitch contact chatter/oxidation.`,
      anomalyRate,
    };
  }

  return {
    verdict: 'SUSPECT_ANOMALY',
    reason: `Detected ${anomaliesCount} event(s) within the 30-80ms range (${anomalyRate}% anomaly rate). May indicate early switch degradation or extreme rapid clicking.`,
    anomalyRate,
  };
}
