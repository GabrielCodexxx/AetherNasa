import type * as THREE from 'three';
import { SOLAR_PLANETS } from '../../utils/earthSystemData';
import { animateNasaSatellites } from './satellitesBuilder';
import { projectStructureCallouts } from './structureCutaway';
import type {
  AnimatedPlanet,
  AnimatedSatellite,
  OrbitControllerState,
  SpaceLiveState,
  StructureCalloutState,
} from './types';

export interface FrameStepContext {
  delta: number;
  container: HTMLDivElement;
  camera: THREE.PerspectiveCamera;
  orbitState: OrbitControllerState;
  live: SpaceLiveState;
  sunMesh: THREE.Mesh;
  animatedPlanets: AnimatedPlanet[];
  cloudsMesh: THREE.Mesh | null;
  animatedSatellites: AnimatedSatellite[];
  asteroidInstanced: THREE.InstancedMesh;
  stars: THREE.Points;
  structureGroup: THREE.Group;
  setCalloutState: (state: StructureCalloutState) => void;
}

/**
 * Advances one simulation frame: camera orbit/fly-to, celestial motion, and cutaway callouts.
 */
export function stepSpaceFrame({
  delta,
  container,
  camera,
  orbitState,
  live,
  sunMesh,
  animatedPlanets,
  cloudsMesh,
  animatedSatellites,
  asteroidInstanced,
  stars,
  structureGroup,
  setCalloutState,
}: FrameStepContext): void {
  if (orbitState.isTransitioning) {
    orbitState.radius += (orbitState.targetRadius - orbitState.radius) * 0.06;
    orbitState.phi += (orbitState.targetPhi - orbitState.phi) * 0.06;
    orbitState.target.lerp(orbitState.targetLookAt, 0.06);

    if (
      Math.abs(orbitState.radius - orbitState.targetRadius) < 0.25 &&
      orbitState.target.distanceTo(orbitState.targetLookAt) < 0.2
    ) {
      orbitState.isTransitioning = false;
    }
  } else if (live.autoRotate && !live.isDragging) {
    orbitState.theta += 0.001;
  }

  const cx =
    orbitState.target.x +
    orbitState.radius * Math.sin(orbitState.phi) * Math.sin(orbitState.theta);
  const cy = orbitState.target.y + orbitState.radius * Math.cos(orbitState.phi);
  const cz =
    orbitState.target.z +
    orbitState.radius * Math.sin(orbitState.phi) * Math.cos(orbitState.theta);
  camera.position.set(cx, cy, cz);
  camera.lookAt(orbitState.target);

  sunMesh.rotation.y += 0.002;
  animatedPlanets.forEach((pl) => {
    if (live.autoRotate && live.viewMode === 'solar_system') {
      pl.angle += pl.data.orbitSpeed * delta * 0.7;
      pl.mesh.position.x = Math.cos(pl.angle) * pl.data.orbitDistance;
      pl.mesh.position.z = Math.sin(pl.angle) * pl.data.orbitDistance;
    }
    pl.mesh.rotation.y += pl.data.rotationSpeed;
  });

  if (cloudsMesh) {
    cloudsMesh.rotation.y += 0.0006;
  }
  animateNasaSatellites(animatedSatellites, delta);
  asteroidInstanced.rotation.y += 0.0004;
  stars.rotation.y += 0.0001;

  if (live.viewMode === 'structure') {
    const now = performance.now();
    if (now - live.lastCalloutUpdate > 75) {
      live.lastCalloutUpdate = now;
      const curPlanet =
        SOLAR_PLANETS.find((p) => p.id === live.selectedPlanetId) ||
        SOLAR_PLANETS[3];
      live.calloutActive = true;
      setCalloutState({
        planetId: curPlanet.id,
        items: projectStructureCallouts(structureGroup, camera, container, curPlanet),
      });
    }
  } else if (live.calloutActive) {
    live.calloutActive = false;
    setCalloutState({ planetId: '', items: [] });
  }
}
