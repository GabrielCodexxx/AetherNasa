import { computeMannKendall as computeMannKendallCore } from '../../data/nonParametricStats';
import type { TrendDataPoint } from '../../types/earthSystem';

export interface MannKendallSummary {
  tau: number;
  zScore: number;
  pLabel: string;
  confidenceLabel: string;
}

/** Formats Mann-Kendall rank correlation summary labels for the forensic report modal. */
export function computeMannKendall(points: TrendDataPoint[]): MannKendallSummary {
  if (points.length < 3) {
    return { tau: 0, zScore: 0, pLabel: 'p = 1.0000', confidenceLabel: 'INSUFFICIENT DATA' };
  }

  const { tau, zScore, pValue } = computeMannKendallCore(points);
  const pLabel = pValue < 0.0001 ? 'p < 0.0001' : `p = ${pValue.toFixed(4)}`;
  const confidenceLabel =
    pValue < 0.001
      ? '99.9% CONFIDENCE'
      : pValue < 0.01
        ? '99% CONFIDENCE'
        : pValue < 0.05
          ? '95% CONFIDENCE'
          : 'NOT SIGNIFICANT';

  return { tau, zScore, pLabel, confidenceLabel };
}
