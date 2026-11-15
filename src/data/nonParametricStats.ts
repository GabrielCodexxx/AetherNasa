import type {
  MannKendallResult,
  SensSlopeResult,
  TrendDataPoint,
} from '../types/earthSystem';

function medianValue(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Two-tailed normal distribution p-value via Abramowitz & Stegun erfc approximation. */
function normalTwoTailedPValue(zScore: number): number {
  const x = Math.abs(zScore) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
    t;
  return Math.max(0, Math.min(1, poly * Math.exp(-x * x)));
}

/** Computes the non-parametric Mann-Kendall monotonic trend test with tie correction. */
export function computeMannKendall(
  points: readonly TrendDataPoint[],
  alpha = 0.001
): MannKendallResult {
  const n = points.length;
  if (n < 2) {
    return {
      score: 0,
      tau: 0,
      variance: 0,
      zScore: 0,
      pValue: 1,
      isSignificant: false,
      direction: 'neutral',
    };
  }

  let score = 0;
  const tieCounts = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const val = points[i].value;
    tieCounts.set(val, (tieCounts.get(val) ?? 0) + 1);
    for (let j = i + 1; j < n; j++) {
      const diff = points[j].value - val;
      if (diff > 0) score += 1;
      else if (diff < 0) score -= 1;
    }
  }

  let tieAdjustment = 0;
  for (const count of tieCounts.values()) {
    if (count > 1) {
      tieAdjustment += count * (count - 1) * (2 * count + 5);
    }
  }

  const variance = (n * (n - 1) * (2 * n + 5) - tieAdjustment) / 18;
  const tau = score / ((n * (n - 1)) / 2);

  let zScore = 0;
  if (variance > 0 && score !== 0) {
    zScore =
      score > 0
        ? (score - 1) / Math.sqrt(variance)
        : (score + 1) / Math.sqrt(variance);
  }

  const pValue = normalTwoTailedPValue(zScore);
  const direction =
    score > 0 ? 'increasing' : score < 0 ? 'decreasing' : 'neutral';

  return {
    score,
    tau,
    variance,
    zScore,
    pValue,
    isSignificant: pValue < alpha,
    direction,
  };
}

/** Computes Theil-Sen median non-parametric slope and intercept estimators. */
export function computeSensSlope(
  points: readonly TrendDataPoint[]
): SensSlopeResult {
  if (points.length < 2) {
    return {
      slopePerYear: 0,
      slopePerDecade: 0,
      intercept: points[0]?.value ?? 0,
    };
  }

  const slopes: number[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].year - points[i].year;
      if (dx !== 0) {
        slopes.push((points[j].value - points[i].value) / dx);
      }
    }
  }

  const slopePerYear = medianValue(slopes);
  const intercepts = points.map((pt) => pt.value - slopePerYear * pt.year);

  return {
    slopePerYear,
    slopePerDecade: slopePerYear * 10,
    intercept: medianValue(intercepts),
  };
}
