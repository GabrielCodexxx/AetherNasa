import type {
  LinearRegressionResult,
  PearsonCorrelationResult,
  TrendDataPoint,
} from '../types/earthSystem';

interface BivariateSums {
  meanX: number;
  meanY: number;
  ssXX: number;
  ssXY: number;
  ssYY: number;
}

function summarizeBivariate(
  xs: readonly number[],
  ys: readonly number[]
): BivariateSums {
  const n = Math.min(xs.length, ys.length);
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += xs[i];
    sumY += ys[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let ssXX = 0;
  let ssXY = 0;
  let ssYY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    ssXX += dx * dx;
    ssXY += dx * dy;
    ssYY += dy * dy;
  }

  return { meanX, meanY, ssXX, ssXY, ssYY };
}

/** Computes ordinary least-squares linear regression over annual telemetry points. */
export function computeLinearRegression(
  points: readonly TrendDataPoint[]
): LinearRegressionResult {
  if (points.length < 2) {
    return {
      slopePerYear: 0,
      slopePerDecade: 0,
      intercept: points[0]?.value ?? 0,
      rSquared: 0,
    };
  }

  const { meanX, meanY, ssXX, ssXY, ssYY } = summarizeBivariate(
    points.map((pt) => pt.year),
    points.map((pt) => pt.value)
  );

  if (ssXX === 0) {
    return { slopePerYear: 0, slopePerDecade: 0, intercept: meanY, rSquared: 0 };
  }

  const slopePerYear = ssXY / ssXX;
  const rSquared = ssYY === 0 ? 0 : (ssXY * ssXY) / (ssXX * ssYY);

  return {
    slopePerYear,
    slopePerDecade: slopePerYear * 10,
    intercept: meanY - slopePerYear * meanX,
    rSquared,
  };
}

/** Computes Pearson linear correlation (r and R^2) between two telemetry series. */
export function computePearsonCorrelation(
  seriesA: readonly TrendDataPoint[],
  seriesB: readonly TrendDataPoint[]
): PearsonCorrelationResult {
  const n = Math.min(seriesA.length, seriesB.length);
  if (n < 2) return { r: 0, rSquared: 0 };

  const { ssXX, ssXY, ssYY } = summarizeBivariate(
    seriesA.slice(0, n).map((pt) => pt.value),
    seriesB.slice(0, n).map((pt) => pt.value)
  );

  const den = Math.sqrt(ssXX * ssYY);
  if (den === 0) return { r: 0, rSquared: 0 };
  const r = ssXY / den;
  return { r, rSquared: r * r };
}
