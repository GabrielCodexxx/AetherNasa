import type { TrendDataPoint } from '../../types/earthSystem';
import type { MannKendallStats } from './types';

function erfcApprox(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const ans =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? ans : 2 - ans;
}

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

/** Computes the non-parametric Mann-Kendall tau statistic, Z-score, and two-sided p-value. */
export function calculateMannKendallStats(timeSeries: TrendDataPoint[]): MannKendallStats {
  const n = timeSeries.length;
  if (n < 2) {
    return {
      tau: 0,
      zScore: 0,
      pValue: 1,
      pLabel: 'p = 1.000',
      confidenceLabel: 'Insufficient Data',
    };
  }

  let s = 0;
  const tieCounts = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const ptI = timeSeries[i];
    if (!ptI) continue;
    tieCounts.set(ptI.value, (tieCounts.get(ptI.value) ?? 0) + 1);
    for (let j = i + 1; j < n; j++) {
      const ptJ = timeSeries[j];
      if (!ptJ) continue;
      if (ptJ.value > ptI.value) s += 1;
      else if (ptJ.value < ptI.value) s -= 1;
    }
  }

  let tieCorrection = 0;
  for (const count of tieCounts.values()) {
    if (count > 1) {
      tieCorrection += count * (count - 1) * (2 * count + 5);
    }
  }

  const varS = (n * (n - 1) * (2 * n + 5) - tieCorrection) / 18;
  const totalPairs = (n * (n - 1)) / 2;
  const tau = totalPairs === 0 ? 0 : Number((s / totalPairs).toFixed(2));

  let zScore = 0;
  if (varS > 0) {
    if (s > 0) zScore = (s - 1) / Math.sqrt(varS);
    else if (s < 0) zScore = (s + 1) / Math.sqrt(varS);
  }

  const pValue = Math.min(1, Math.max(0, erfcApprox(Math.abs(zScore) / Math.SQRT2)));
  return {
    tau,
    zScore: Number(zScore.toFixed(2)),
    pValue,
    pLabel: formatPValueLabel(pValue),
    confidenceLabel: formatConfidenceLabel(pValue),
  };
}
