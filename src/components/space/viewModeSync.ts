import * as THREE from 'three';
import type { SystemViewMode } from '../../types/earthSystem';
import { SOLAR_PLANETS } from '../../utils/earthSystemData';
import { isEarthFocused } from './earthOverlays';
import type {
  OrbitControllerState,
  SpaceLiveState,
  SpaceSceneHandles,
} from './types';

function setOrbitFlyTo(
  orbitState: OrbitControllerState,
  targetPos: THREE.Vector3,
  distance: number,
  elevation: number = Math.PI / 3.4
): void {
  orbitState.targetLookAt.copy(targetPos);
  orbitState.targetRadius = distance;
  orbitState.targetPhi = elevation;
  orbitState.isTransitioning = true;
}

export interface SyncViewModeOptions {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  orbitState: OrbitControllerState;
  live: SpaceLiveState;
  handles: SpaceSceneHandles | null;
}

/**
 * Synchronizes camera fly-to target, Earth telemetry overlays, and 3D cutaway visibility
 * whenever viewMode or selectedPlanetId changes.
 */
export function syncViewModeAndStructure({
  viewMode,
  selectedPlanetId,
  orbitState,
  live,
  handles,
}: SyncViewModeOptions): void {
  live.viewMode = viewMode;
  live.selectedPlanetId = selectedPlanetId;
  live.lastCalloutUpdate = 0;

  const selectedObj = handles?.planetMeshes.get(selectedPlanetId);
  const targetPos = selectedObj
    ? selectedObj.position.clone()
    : new THREE.Vector3(0, 0, 0);
  const planetData =
    SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[0];

  if (viewMode === 'solar_system') {
    setOrbitFlyTo(orbitState, new THREE.Vector3(0, 0, 0), 180, Math.PI / 3.2);
  } else if (viewMode === 'planet_focus' || viewMode === 'earth_focus') {
    setOrbitFlyTo(orbitState, targetPos, planetData.radius * 3.4 + 4, Math.PI / 2.5);
  } else if (viewMode === 'structure') {
    orbitState.theta = 0.35;
    setOrbitFlyTo(orbitState, targetPos, planetData.radius * 3.8 + 5, Math.PI / 2.3);
  } else if (viewMode === 'night_sky') {
    setOrbitFlyTo(orbitState, targetPos, planetData.radius * 1.5, Math.PI * 0.15);
  }

  if (!handles) return;

  const earthFocused = isEarthFocused(viewMode, selectedPlanetId);
  if (handles.satellitesGroup) handles.satellitesGroup.visible = earthFocused;
  if (handles.hotspotsGroup) handles.hotspotsGroup.visible = earthFocused;

  handles.planetMeshes.forEach((mesh) => {
    mesh.visible = true;
  });

  if (viewMode === 'structure') {
    const targetPlanet =
      SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[3];
    handles.rebuildStructure(targetPlanet);
    if (selectedObj) {
      handles.structureGroup.position.copy(selectedObj.position);
      handles.structureGroup.visible = true;
      selectedObj.visible = false;
    }
  } else {
    handles.structureGroup.visible = false;
  }
}
