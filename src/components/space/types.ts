import type * as THREE from 'three';
import type {
  HotspotMarker,
  NasaSatelliteMission,
  PlanetData,
  SystemViewMode,
} from '../../types/earthSystem';

export interface OrbitControllerState {
  target: THREE.Vector3;
  radius: number;
  theta: number;
  phi: number;
  isTransitioning: boolean;
  targetRadius: number;
  targetTheta: number;
  targetPhi: number;
  targetLookAt: THREE.Vector3;
}

export interface AnimatedPlanet {
  mesh: THREE.Group;
  data: PlanetData;
  angle: number;
}

export interface AnimatedSatellite {
  mesh: THREE.Group;
  dist: number;
  speed: number;
  angle: number;
  incX: number;
  incZ: number;
  data: NasaSatelliteMission;
}

export interface HotspotBeaconEntry {
  id: string;
  mesh: THREE.Mesh;
  surfacePos: THREE.Vector3;
  normal: THREE.Vector3;
  domainColor: number;
}

export interface StructureCallout {
  name: string;
  subtitle: string;
  composition: string;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface StructureCalloutState {
  planetId: string;
  items: StructureCallout[];
}

export interface SceneCallbacks {
  onSelectPlanet: (planet: PlanetData) => void;
  onSelectHotspot: (hotspot: HotspotMarker) => void;
  onSelectSatellite?: (satellite: NasaSatelliteMission) => void;
}

export interface SpaceLiveState {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  selectedHotspotId: string | null;
  autoRotate: boolean;
  showGrid: boolean;
  showDivergenceLens: boolean;
  callbacks: SceneCallbacks;
  isDragging: boolean;
  lastCalloutUpdate: number;
  calloutActive: boolean;
}

export interface SpaceSceneHandles {
  planetMeshes: Map<string, THREE.Object3D>;
  structureGroup: THREE.Group;
  rebuildStructure: (planet: PlanetData) => void;
  divergenceMesh: THREE.Mesh | null;
  satellitesGroup: THREE.Group | null;
  hotspotsGroup: THREE.Group | null;
  hotspotBeacons: HotspotBeaconEntry[];
  gridHelper: THREE.PolarGridHelper;
}

export type ThreeSceneUserData =
  | { isPlanet: true; data: PlanetData }
  | { isHotspot: true; data: HotspotMarker }
  | { isSatellite: true; data: NasaSatelliteMission };
