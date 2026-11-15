// Backward-compatible barrel re-exporting modular Earth system data and trend statistics
export {
  DOMAIN_COLORS,
  EARTH_OBSERVATION_DOMAINS,
  SIGNIFICANCE_ALPHAS,
  TELEMETRY_END_YEAR,
  TELEMETRY_SPAN_YEARS,
  TELEMETRY_START_YEAR,
} from '../data/earthConstants';
export type { ObservationDomain } from '../data/earthConstants';
export { generateTimeSeries } from '../data/timeSeries';
export {
  computeLinearRegression,
  computeMannKendall,
  computePearsonCorrelation,
  computeSensSlope,
} from '../data/trendStatistics';
export {
  EARTH_LAYERS,
  INNER_SOLAR_PLANETS,
  JUPITER_LAYERS,
  MARS_LAYERS,
  MERCURY_LAYERS,
  NEPTUNE_LAYERS,
  OUTER_SOLAR_PLANETS,
  SATURN_LAYERS,
  SOLAR_PLANETS,
  SUN_LAYERS,
  URANUS_LAYERS,
  VENUS_LAYERS,
} from '../data/solarPlanets';
export { EARTH_HOTSPOTS } from '../data/earthHotspots';
export { EARTH_SYSTEM_TRENDS } from '../data/climateTrends';
export { DETECTIVE_SCENARIOS } from '../data/detectiveScenarios';
export { NASA_FLEET } from '../data/nasaFleet';
