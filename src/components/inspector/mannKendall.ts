import { computeMannKendall } from '../../data/nonParametricStats';
import type { TrendDataPoint } from '../../types/earthSystem';
import type { MannKendallStats } from './types';

function formatPValueLabel(pValue: number): string {
  if (pValue < 0.0001) return 'p < 0.0001';
  if (pValue < 0.001) return 'p < 0.001';
  if (pValue < 0.01) return 'p < 0.01';
  if (pValue < 0.05) return 'p < 0.05';
  return `p = ${pValue.toFixed(3)}`;
}

function formatConfidenceLabel(pValue: number): string {
  if (pValue < 0.001) return '99.9% Significant';
  if (pValue < 0.01) return '99% Significant';
  if (pValue < 0.05) return '95% Significant';
  return 'Not Significant';
}

/** Computes the non-parametric Mann-Kendall tau statistic, Z-score, and formatted significance labels. */
export function calculateMannKendallStats(timeSeries: TrendDataPoint[]): MannKendallStats {
  if (timeSeries.length < 2) {
    return {
      tau: 0,
      zScore: 0,
      pValue: 1,
      pLabel: 'p = 1.000',
      confidenceLabel: 'Insufficient Data',
    };
  }

  const { tau, zScore, pValue } = computeMannKendall(timeSeries);
  return {
    tau: Number(tau.toFixed(2)),
    zScore: Number(zScore.toFixed(2)),
    pValue,
    pLabel: formatPValueLabel(pValue),
    confidenceLabel: formatConfidenceLabel(pValue),
  };
}
