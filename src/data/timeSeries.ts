import type { TrendDataPoint } from '../types/earthSystem';
import {
  TELEMETRY_END_YEAR,
  TELEMETRY_SPAN_YEARS,
  TELEMETRY_START_YEAR,
} from './earthConstants';

/**
 * Synthesizes deterministic annual Earth-system telemetry points from 1980 to 2026.
 *
 * @param startVal Baseline value at the telemetry start year.
 * @param annualDelta Linear annual drift applied per year since 1980.
 * @param noiseAmp Amplitude of deterministic seasonal/inter-annual oscillation.
 * @param accelFactor Quadratic acceleration coefficient over the full span.
 */
export function generateTimeSeries(
  startVal: number,
  annualDelta: number,
  noiseAmp: number,
  accelFactor = 0
): TrendDataPoint[] {
  const points: TrendDataPoint[] = [];

  for (let year = TELEMETRY_START_YEAR; year <= TELEMETRY_END_YEAR; year++) {
    const elapsed = year - TELEMETRY_START_YEAR;
    const t = elapsed / TELEMETRY_SPAN_YEARS;
    const accel = accelFactor * t * t;
    const noise =
      Math.sin(year * 0.8) * noiseAmp + Math.cos(year * 1.7) * noiseAmp * 0.5;
    const curr = startVal + annualDelta * elapsed + accel + noise;

    points.push({
      year,
      value: Number(curr.toFixed(2)),
      anomaly: Number((curr - startVal).toFixed(2)),
    });
  }

  return points;
}
