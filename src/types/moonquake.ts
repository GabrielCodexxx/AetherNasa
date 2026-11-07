export type MoonquakeCategory =
  | 'shallow'            // Tectonic, 20-30km depth, high magnitude, rings for minutes
  | 'deep'               // Tidal gravity stress, ~700km depth, cyclical
  | 'thermal'            // Thermal expansion at sunrise/sunset
  | 'artificial_impact'  // Apollo S-IVB booster & LM crashes
  | 'meteorite';         // Natural meteoroid strikes

export interface MoonquakeEvent {
  id: string;
  name: string;
  category: MoonquakeCategory;
  dateStr: string;
  year: number;
  lat: number;        // Degrees (-90 to +90)
  lon: number;        // Degrees (-180 to +180)
  depthKm: number;    // Depth below lunar surface in kilometers
  magnitude: number;  // Richter scale / Moonquake Magnitude (ML)
  durationMinutes: number;
  detectedBy: string[]; // e.g. ['Apollo 12', 'Apollo 14', 'Apollo 15']
  description: string;
  scienceNote: string;
  artemisRisk: 'CRITICAL' | 'MODERATE' | 'LOW';
  waveformData: number[]; // 50 amplitude data points for the seismograph
}

export interface ApolloStation {
  id: string;
  mission: string;
  name: string;
  lat: number;
  lon: number;
  deployedDate: string;
  seismometerType: string;
  color: string;
}

export interface FilterState {
  category: MoonquakeCategory | 'all';
  minMagnitude: number;
  selectedStation: string | 'all';
  searchQuery: string;
}
