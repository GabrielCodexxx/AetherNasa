export type InspectorTab = 'synthesis' | 'divergence' | 'correlation';

export type SignificanceAlpha = '0.05' | '0.01' | '0.001';

export interface CorrelationStats {
  r: number;
  r2: number;
  lag: string;
}

export interface DivergenceRegion {
  title: string;
  change: string;
  type: string;
  description: string;
}

export interface DivergenceMatrix {
  regionA: DivergenceRegion;
  regionB: DivergenceRegion;
  driver: string;
}

export interface MannKendallStats {
  tau: number;
  zScore: number;
  pValue: number;
  pLabel: string;
  confidenceLabel: string;
}
