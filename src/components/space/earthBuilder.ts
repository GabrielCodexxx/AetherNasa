import * as THREE from 'three';
import type { PlanetData, SystemViewMode } from '../../types/earthSystem';
import {
  buildDivergenceLensMesh,
  buildHotspotBeacons,
  isEarthFocused,
} from './earthOverlays';
import { buildNasaSatellites } from './satellitesBuilder';
import {
  createRimGlowMaterial,
  type EarthTextureBundle,
} from './spaceMaterials';
import type { AnimatedSatellite, HotspotBeaconEntry } from './types';

export interface EarthBuildOptions {
  planet: PlanetData;
  pGroup: THREE.Group;
  earthTextures: EarthTextureBundle;
  pickableTargets: THREE.Object3D[];
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  selectedHotspotId: string | null;
  showDivergenceLens: boolean;
}

export interface EarthBuildResult {
  cloudsMesh: THREE.Mesh;
  divergenceMesh: THREE.Mesh;
  satellitesGroup: THREE.Group;
  hotspotsGroup: THREE.Group;
  animatedSatellites: AnimatedSatellite[];
  hotspotBeacons: HotspotBeaconEntry[];
}

/**
 * Populates Earth's globe, Rayleigh atmosphere, clouds, Moon, divergence lens,
 * NASA satellite constellation, and climate hotspot pins.
 */
export function buildEarthGroup({
  planet,
  pGroup,
  earthTextures,
  pickableTargets,
  viewMode,
  selectedPlanetId,
  selectedHotspotId,
  showDivergenceLens,
}: EarthBuildOptions): EarthBuildResult {
  const earthGeo = new THREE.SphereGeometry(planet.radius, 64, 48);
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTextures.diffuse,
    normalMap: earthTextures.normal,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughnessMap: earthTextures.specular,
    roughness: 0.65,
    metalness: 0.05,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.userData = { isPlanet: true, data: planet };
  pGroup.add(earthMesh);
  pickableTargets.push(earthMesh);

  const atmosGeo = new THREE.SphereGeometry(planet.radius * 1.02, 48, 48);
  const atmosMat = createRimGlowMaterial({
    colorVec3: '0.28, 0.65, 1.0',
    power: '3.2',
    intensityScale: '0.75',
    depthWrite: false,
  });
  pGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

  const cloudGeo = new THREE.SphereGeometry(planet.radius * 1.012, 48, 36);
  const cloudMat = new THREE.MeshStandardMaterial({
    map: earthTextures.clouds,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
  pGroup.add(cloudsMesh);

  const moonGeo = new THREE.SphereGeometry(0.65, 32, 32);
  const moonMat = new THREE.MeshStandardMaterial({
    map: earthTextures.moon,
    roughness: 0.9,
    metalness: 0.05,
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(5.2, 1.2, 0);
  pGroup.add(moonMesh);

  const divergenceMesh = buildDivergenceLensMesh(planet.radius, showDivergenceLens);
  pGroup.add(divergenceMesh);

  const earthFocused = isEarthFocused(viewMode, selectedPlanetId);
  const { satellitesGroup, animatedSatellites } = buildNasaSatellites(
    planet.radius,
    earthFocused,
    pickableTargets
  );
  pGroup.add(satellitesGroup);

  const { hotspotsGroup, hotspotBeacons } = buildHotspotBeacons(
    planet.radius,
    selectedHotspotId,
    earthFocused,
    pickableTargets
  );
  pGroup.add(hotspotsGroup);

  return {
    cloudsMesh,
    divergenceMesh,
    satellitesGroup,
    hotspotsGroup,
    animatedSatellites,
    hotspotBeacons,
  };
}
