export type SystemViewMode =
  | 'solar_system'
  | 'earth_focus'
  | 'structure'
  | 'scenarios'
  | 'satellites';

export type PlanetType = 'star' | 'rocky' | 'gas_giant' | 'ice_giant';

export interface PlanetData {
  id: string;
  name: string;
  type: PlanetType;
  radius: number;
  orbitDistance: number;
  orbitSpeed: number;
  rotationSpeed: number;
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
