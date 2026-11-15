import * as THREE from 'three';
import type { SystemViewMode } from '../../types/earthSystem';
import { SOLAR_PLANETS } from '../../utils/earthSystemData';
import { buildEarthGroup } from './earthBuilder';
import { generateSaturnRingCanvas } from './gasPlanetTextures';
import type { EarthTextureBundle } from './spaceMaterials';
import type {
  AnimatedPlanet,
  AnimatedSatellite,
  HotspotBeaconEntry,
} from './types';

export interface PlanetsBuildOptions {
  scene: THREE.Scene;
  planetMeshes: Map<string, THREE.Object3D>;
  pickableTargets: THREE.Object3D[];
  planetSurfaceTextures: Record<string, THREE.Texture>;
  earthTextures: EarthTextureBundle;
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  selectedHotspotId: string | null;
  showDivergenceLens: boolean;
}

export interface PlanetsBuildResult {
  planetsGroup: THREE.Group;
  animatedPlanets: AnimatedPlanet[];
  cloudsMesh: THREE.Mesh | null;
  divergenceMesh: THREE.Mesh | null;
  satellitesGroup: THREE.Group | null;
  hotspotsGroup: THREE.Group | null;
  animatedSatellites: AnimatedSatellite[];
  hotspotBeacons: HotspotBeaconEntry[];
}

/**
 * Builds all solar system orbital paths, planetary globes, Saturn rings, and Earth's Moon/overlays.
 */
export function buildSolarPlanets(
  options: PlanetsBuildOptions
): PlanetsBuildResult {
  const {
    scene,
    planetMeshes,
    pickableTargets,
    planetSurfaceTextures,
    earthTextures,
    viewMode,
    selectedPlanetId,
    selectedHotspotId,
    showDivergenceLens,
  } = options;

  const planetsGroup = new THREE.Group();
  scene.add(planetsGroup);

  const animatedPlanets: AnimatedPlanet[] = [];
  let earthExtras: Omit<PlanetsBuildResult, 'planetsGroup' | 'animatedPlanets'> = {
    cloudsMesh: null,
    divergenceMesh: null,
    satellitesGroup: null,
    hotspotsGroup: null,
    animatedSatellites: [],
    hotspotBeacons: [],
  };

  SOLAR_PLANETS.slice(1).forEach((planet) => {
    const orbitCurve = new THREE.EllipseCurve(
      0, 0, planet.orbitDistance, planet.orbitDistance, 0, Math.PI * 2, false, 0
    );
    const points = orbitCurve.getPoints(128);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    const orbitMat = new THREE.LineBasicMaterial({
      color: planet.id === 'earth' ? 0x0369a1 : 0x94a3b8,
      transparent: true,
      opacity: planet.id === 'earth' ? 0.75 : 0.35,
    });
    scene.add(new THREE.Line(orbitGeo, orbitMat));

    const pGroup = new THREE.Group();
    const initAngle = planet.initialAngle || 0;
    pGroup.position.set(
      Math.cos(initAngle) * planet.orbitDistance,
      0,
      Math.sin(initAngle) * planet.orbitDistance
    );
    planetsGroup.add(pGroup);
    planetMeshes.set(planet.id, pGroup);

    if (planet.id === 'earth') {
      earthExtras = buildEarthGroup({
        planet,
        pGroup,
        earthTextures,
        pickableTargets,
        viewMode,
        selectedPlanetId,
        selectedHotspotId,
        showDivergenceLens,
      });
    } else {
      const tex = planetSurfaceTextures[planet.id];
      const pGeo = new THREE.SphereGeometry(planet.radius, 40, 32);
      const pMat = new THREE.MeshStandardMaterial({
        map: tex,
        color: tex ? 0xffffff : planet.color,
        roughness: 0.75,
        metalness: 0.05,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData = { isPlanet: true, data: planet };
      pGroup.add(pMesh);
      pickableTargets.push(pMesh);

      if (planet.hasRings && planet.ringInnerRadius && planet.ringOuterRadius) {
        const ringTex = new THREE.CanvasTexture(generateSaturnRingCanvas());
        ringTex.rotation = Math.PI / 2;

        const rGeo = new THREE.RingGeometry(
          planet.ringInnerRadius,
          planet.ringOuterRadius,
          64
        );
        const rMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
          roughness: 0.6,
        });
        const rMesh = new THREE.Mesh(rGeo, rMat);
        rMesh.rotation.x = Math.PI / 2.3;
        pGroup.add(rMesh);
      }
    }

    animatedPlanets.push({ mesh: pGroup, data: planet, angle: initAngle });
  });

  return { planetsGroup, animatedPlanets, ...earthExtras };
}
