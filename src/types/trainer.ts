export type HazardType = 'clear_skies' | 'solar_storm' | 'dust_storm' | 'eclipse';

export interface SolHazard {
  type: HazardType;
  title: string;
  badge: string;
  description: string;
  solarGeneration: number;  // % power gained from solar panels
  o2Depletion: number;      // % oxygen lost naturally
  shieldDepletion: number;  // % shields lost naturally
  nasaFact: string;
}

export interface TurnResources {
  power: number;     // 0 - 100% (Yellow)
  oxygen: number;    // 0 - 100% (Blue)
  shielding: number; // 0 - 100% (Green)
}

export type LunarResources = TurnResources;

export interface PowerAllocation {
  toOxygen: number;
  toShield: number;
}

export interface LunarEnvironment {
  solarProduction: number;
  ambientRadiation: number;
  isSolarStorm: boolean;
  stormTimeRemaining: number;
  dayNightPhase: 'day' | 'night' | 'eclipse';
  sunElevation: number;
}

export interface LunarCrisis {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'major' | 'extreme';
  radiationMultiplier: number;
  durationSeconds: number;
  nasaContext: string;
}

export type OutpostLocation = 'lunar' | 'mars';

export interface OutpostResources {
  oxygen: number;
  water: number;
  power: number;
  food: number;
  shielding: number;
  morale: number;
}

export interface ResourceDeltas {
  oxygen: number;
  water: number;
  power: number;
  food: number;
  shielding: number;
  morale: number;
}

export type ModuleCategory = 'life_support' | 'energy' | 'agriculture' | 'defense' | 'research';

export interface OutpostModule {
  id: string;
  name: string;
  category: ModuleCategory;
  level: number;
  maxLevel: number;
  status: 'operational' | 'damaged' | 'offline';
  powerCost: number;
  powerOutput: number;
  o2Output: number;
  waterOutput: number;
  foodOutput: number;
  shieldOutput: number;
  description: string;
  nasaRef: string;
}

export interface ChoiceOption {
  text: string;
  impactDescription: string;
  effects: Partial<OutpostResources>;
  solveCrisis: boolean;
  scientificFact: string;
}

export interface CrisisEvent {
  id: string;
  title: string;
  source: string;
  description: string;
  severity: 'advisory' | 'warning' | 'emergency';
  countdown: number;
  options: ChoiceOption[];
}

export interface CadetBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  nasaPrinciple: string;
}

export interface OutpostMissionConfig {
  name: string;
  location: OutpostLocation;
  siteName: string;
  coordinates: string;
  temperature: string;
  gravity: string;
  dayLength: string;
  solarFlux: string;
  primaryRisk: string;
}

export type LunarCadetBadge = CadetBadge;
