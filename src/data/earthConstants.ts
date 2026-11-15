import type { EarthTrendDomain } from '../types/earthSystem';

/** Start year for NASA Earth system telemetry records. */
export const TELEMETRY_START_YEAR = 1980;

/** End year for NASA Earth system telemetry records. */
export const TELEMETRY_END_YEAR = 2026;

/** Total year span covered by the telemetry time series. */
export const TELEMETRY_SPAN_YEARS = TELEMETRY_END_YEAR - TELEMETRY_START_YEAR;

/** Supported p-value significance filter thresholds. */
export const SIGNIFICANCE_ALPHAS = ['0.05', '0.01', '0.001'] as const;

export type ObservationDomain = Exclude<EarthTrendDomain, 'all'>;

/** Ordered list of physical Earth observation domains. */
export const EARTH_OBSERVATION_DOMAINS: readonly ObservationDomain[] = [
  'temperature',
  'cryosphere',
  'hydrosphere',
  'biosphere',
  'atmosphere',
];

/** Canonical UI accent colors keyed by Earth observation domain. */
export const DOMAIN_COLORS: Record<ObservationDomain, string> = {
  temperature: '#dc2626',
  cryosphere: '#0284c7',
  hydrosphere: '#0369a1',
  atmosphere: '#d97706',
  biosphere: '#15803d',
};
