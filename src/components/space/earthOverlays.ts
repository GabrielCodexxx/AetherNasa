import * as THREE from 'three';
import type { EarthTrendDomain, SystemViewMode } from '../../types/earthSystem';
import { EARTH_HOTSPOTS } from '../../utils/earthSystemData';
import { createCanvas2D } from './planetTextures';
import type { HotspotBeaconEntry } from './types';

export function isEarthFocused(
  viewMode: SystemViewMode,
  selectedPlanetId: string
): boolean {
  return (
    viewMode === 'earth_focus' ||
    (viewMode === 'planet_focus' && selectedPlanetId === 'earth')
  );
}

/**
 * Converts geographic latitude/longitude (degrees) to 3D Cartesian coordinates on a sphere.
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates the procedural dual-pole regional thermal divergence heatmap canvas.
 */
function generateDivergenceTexture(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(512, 256);
  ctx.clearRect(0, 0, 512, 256);

  // 1. Arctic Tundra Greening Zone (>65°N)
  const arcticGrad = ctx.createLinearGradient(0, 0, 0, 60);
  arcticGrad.addColorStop(0, 'rgba(21, 128, 61, 0.85)');
  arcticGrad.addColorStop(0.65, 'rgba(34, 197, 94, 0.45)');
  arcticGrad.addColorStop(1, 'rgba(21, 128, 61, 0)');
  ctx.fillStyle = arcticGrad;
  ctx.fillRect(0, 0, 512, 60);

  // 2. Amazon Canopy Browning Hotspot (-10°S to +5°N, -70°W)
  const amazonGrad = ctx.createRadialGradient(156, 132, 4, 156, 132, 48);
  amazonGrad.addColorStop(0, 'rgba(220, 38, 38, 0.9)');
  amazonGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.55)');
  amazonGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
  ctx.fillStyle = amazonGrad;
  ctx.beginPath();
  ctx.arc(156, 132, 48, 0, Math.PI * 2);
  ctx.fill();

  // 3. West Antarctic Grounding Line Retreat (Thwaites: -75°S, -106°W)
  const antarcticGrad = ctx.createRadialGradient(105, 234, 5, 105, 234, 45);
  antarcticGrad.addColorStop(0, 'rgba(2, 132, 199, 0.85)');
  antarcticGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
  antarcticGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = antarcticGrad;
  ctx.beginPath();
  ctx.arc(105, 234, 45, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

export function buildDivergenceLensMesh(radius: number, visible: boolean): THREE.Mesh {
  const divTex = new THREE.CanvasTexture(generateDivergenceTexture());
  const divGeo = new THREE.SphereGeometry(radius * 1.008, 48, 36);
  const divMat = new THREE.MeshBasicMaterial({
    map: divTex,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const divMesh = new THREE.Mesh(divGeo, divMat);
  divMesh.visible = visible;
  return divMesh;
}

function getDomainColor(domain: EarthTrendDomain): number {
  switch (domain) {
    case 'cryosphere':
      return 0x38bdf8;
    case 'biosphere':
      return 0x22c55e;
    case 'hydrosphere':
      return 0x0284c7;
    default:
      return 0xef4444;
  }
}

const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const SELECTED_BEACON_COLOR = 0x0369a1;
const SELECTED_SCALE_Y = 0.22 / 0.14;

/**
 * Builds low-profile architectural research beacons for Earth climate hotspots.
 */
export function buildHotspotBeacons(
  planetRadius: number,
  selectedHotspotId: string | null,
  visible: boolean,
  pickableTargets: THREE.Object3D[]
): { hotspotsGroup: THREE.Group; hotspotBeacons: HotspotBeaconEntry[] } {
  const hotspotsGroup = new THREE.Group();
  hotspotsGroup.visible = visible;

  const baseGeo = new THREE.CylinderGeometry(0.015, 0.035, 0.14, 8);
  const hotspotBeacons: HotspotBeaconEntry[] = [];

  EARTH_HOTSPOTS.forEach((hs) => {
    const surfacePos = latLonToVector3(hs.lat, hs.lon, planetRadius);
    const normal = surfacePos.clone().normalize();
    const domainColor = getDomainColor(hs.domain);
    const isSelected = selectedHotspotId === hs.id;

    const beaconMat = new THREE.MeshStandardMaterial({
      color: isSelected ? SELECTED_BEACON_COLOR : domainColor,
      roughness: 0.2,
      metalness: 0.6,
    });
    const beacon = new THREE.Mesh(baseGeo, beaconMat);
    beacon.scale.set(1, isSelected ? SELECTED_SCALE_Y : 1, 1);
    beacon.position.copy(surfacePos).addScaledVector(normal, isSelected ? 0.11 : 0.07);
    beacon.quaternion.setFromUnitVectors(UP_VECTOR, normal);
    beacon.userData = { isHotspot: true, data: hs };

    hotspotsGroup.add(beacon);
    pickableTargets.push(beacon);
    hotspotBeacons.push({
      id: hs.id,
      mesh: beacon,
      surfacePos,
      normal,
      domainColor,
    });
  });

  return { hotspotsGroup, hotspotBeacons };
}

/**
 * Updates Earth hotspot beacon highlight colors and heights when selection changes.
 */
export function updateHotspotBeaconSelection(
  beacons: HotspotBeaconEntry[],
  selectedHotspotId: string | null
): void {
  beacons.forEach(({ id, mesh, surfacePos, normal, domainColor }) => {
    const isSelected = id === selectedHotspotId;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.color.setHex(isSelected ? SELECTED_BEACON_COLOR : domainColor);
    mesh.scale.set(1, isSelected ? SELECTED_SCALE_Y : 1, 1);
    mesh.position.copy(surfacePos).addScaledVector(normal, isSelected ? 0.11 : 0.07);
  });
}
