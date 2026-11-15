import type { TrendDataPoint } from '../../types/earthSystem';

export interface MannKendallSummary {
  tau: number;
  zScore: number;
  pLabel: string;
  confidenceLabel: string;
}

function normalCdfComplement(absZ: number): number {
  const t = 1 / (1 + 0.2316419 * absZ);
  const poly =
    t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const pdf = Math.exp(-0.5 * absZ * absZ) / Math.sqrt(2 * Math.PI);
  return 2 * pdf * poly;
}

export function computeMannKendall(points: TrendDataPoint[]): MannKendallSummary {
  const n = points.length;
  if (n < 3) {
    return { tau: 0, zScore: 0, pLabel: 'p = 1.0000', confidenceLabel: 'INSUFFICIENT DATA' };
  }

  let s = 0;
  const counts = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    counts.set(points[i].value, (counts.get(points[i].value) ?? 0) + 1);
    for (let j = i + 1; j < n; j++) {
      s += Math.sign(points[j].value - points[i].value);
    }
  }

  let tieSum = 0;
  for (const t of counts.values()) {
    if (t > 1) tieSum += t * (t - 1) * (2 * t + 5);
  }

  const varS = (n * (n - 1) * (2 * n + 5) - tieSum) / 18;
  const zScore = varS > 0 ? (s > 0 ? (s - 1) / Math.sqrt(varS) : s < 0 ? (s + 1) / Math.sqrt(varS) : 0) : 0;
  const tau = s / ((n * (n - 1)) / 2);
  const p = normalCdfComplement(Math.abs(zScore));

  const pLabel = p < 0.0001 ? 'p < 0.0001' : `p = ${p.toFixed(4)}`;
  const confidenceLabel = p < 0.001 ? '99.9% CONFIDENCE' : p < 0.01 ? '99% CONFIDENCE' : p < 0.05 ? '95% CONFIDENCE' : 'NOT SIGNIFICANT';

  return { tau, zScore, pLabel, confidenceLabel };
}
