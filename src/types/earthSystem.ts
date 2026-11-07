export type SystemViewMode =
  | 'solar_system'
  | 'planet_focus'
  | 'earth_focus'
  | 'structure'
  | 'scenarios'
  | 'night_sky';

export type PlanetType = 'star' | 'rocky' | 'gas_giant' | 'ice_giant';

export interface PlanetLayer {
  name: string;
  subtitle: string;
  description: string;
  composition: string;
  color: string;
  thicknessRadius: number; // Relative radius of this layer (e.g. core 0.25, mantle 0.8, crust 1.0)
}

export interface PlanetData {
  id: string;
  name: string;
  type: PlanetType;
  radius: number;
  orbitDistance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  initialAngle: number; // Starting non-aligned orbital angle in radians
  color: string;
  emissive?: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  description: string;
  meanTempC: string;
  dayLength: string;
  yearLength: string;
  moonsCount: number;
  gravity: string;
  mass: string;
  atmosphere: string;
  layers: PlanetLayer[];
}

export type EarthTrendDomain =
  | 'all'
  | 'temperature'
  | 'cryosphere'
  | 'hydrosphere'
  | 'biosphere'
  | 'atmosphere';

export interface TrendDataPoint {
  year: number;
  value: number;
  anomaly?: number;
}

export interface HotspotMarker {
  id: string;
  name: string;
  lat: number;
  lon: number;
  domain: EarthTrendDomain;
  headline: string;
  trendRate: string;
  observationNote: string;
  satelliteSource: string;
}

export interface EarthSystemTrend {
  id: string;
  name: string;
  domain: EarthTrendDomain;
  metricUnit: string;
  baselinePeriod: string;
  currentValue: number;
  currentAnomaly: number;
  trendDirection: 'rising' | 'declining' | 'accelerating';
  ratePerDecade: string;
  significance: string; // e.g. "99.9% Significant (p < 0.001)"
  timeSeries: TrendDataPoint[]; // 1980 to 2026
  summary: string;
  detectiveBrief: string;
  nasaSatellites: string[];
  hotspots: HotspotMarker[];
}

export interface DetectiveScenario {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  domain: EarthTrendDomain;
  focusYear: number;
  cameraLat: number;
  cameraLon: number;
  cameraZoom: number;
  whatIsChanging: string;
  whereIsChanging: string;
  howMuchIsChanging: string;
  isSignificant: string;
  evidencePoints: string[];
  detectiveVerdict: string;
}

export interface NasaSatelliteMission {
  id: string;
  name: string;
  launchYear: number;
  orbitAltitudeKm: number;
  sensorPayload: string;
  primaryMission: string;
  status: 'OPERATIONAL' | 'EXTENDED' | 'HISTORIC';
}
