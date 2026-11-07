export type TileType =
  | 'basalt'    // Smooth plains (Cost: 1)
  | 'regolith'  // Loose sand hazard (Cost: 2)
  | 'boulder'   // Impassable obstacle
  | 'solar'     // Solar ridge (Restores +2 Battery)
  | 'ice'       // Water ice science deposit (Cost: 3, gives 1 Star)
  | 'start'     // Rover landing site
  | 'goal';     // Primary target/sample site

export interface Coordinate {
  r: number; // Row index (0 to height-1)
  c: number; // Col index (0 to width-1)
}

export interface LevelConfig {
  id: number;
  name: string;
  location: string;
  width: number;
  height: number;
  maxBattery: number;
  start: Coordinate;
  goal: Coordinate;
  grid: TileType[][];
  briefing: string;
  nasaFact: string;
  targetStars: number;
}

export type GamePhase = 'planning' | 'transmitting' | 'executing' | 'success' | 'failure';

export interface ExecutionLog {
  step: number;
  coord: Coordinate;
  tile: TileType;
  batteryChange: number;
  batteryRemaining: number;
  actionText: string;
}
