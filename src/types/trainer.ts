export type OutpostLocation = 'lunar' | 'mars';

export interface OutpostResources {
  oxygen: number;        // percentage (0-100%)
  water: number;         // percentage (0-100%)
  power: number;         // kW (0-100%)
  food: number;          // kg/days (0-100%)
  shielding: number;     // radiation protection (0-100%)
  morale: number;        // crew happiness/focus (0-100%)
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
  powerCost: number;     // kW consumed
  powerOutput: number;   // kW produced
  o2Output: number;      // O2 delta
  waterOutput: number;   // H2O delta
  foodOutput: number;    // Food delta
  shieldOutput: number;  // Radiation shield bonus
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
  source: string; // e.g. "NASA DONKI Alert" or "Perseverance Weather Station"
  description: string;
  severity: 'advisory' | 'warning' | 'emergency';
  countdown: number; // seconds left to respond
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
