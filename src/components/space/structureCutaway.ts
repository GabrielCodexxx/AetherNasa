import * as THREE from 'three';
import type { PlanetData, PlanetLayer } from '../../types/earthSystem';
import { disposeObject3D } from './spaceMaterials';
import type { StructureCallout } from './types';

const _ptLocal = new THREE.Vector3();
const _ptWorld = new THREE.Vector3();

function createCutawayLayerMaterial(
  layer: PlanetLayer,
  isCore: boolean,
  isOuterCore: boolean,
  roughness: number
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: layer.color,
    emissive: isCore ? 0xffaa00 : isOuterCore ? 0xff4400 : 0x000000,
    emissiveIntensity: isCore ? 0.75 : isOuterCore ? 0.35 : 0,
    roughness: isCore ? 0.2 : roughness,
    side: THREE.DoubleSide,
  });
}

/**
 * Rebuilds the 3/4 planetary cross-section layers and flat wedge cap faces,
 * disposing previous cutaway geometries and materials before clearing.
 */
export function buildStructureLayers(
  structureGroup: THREE.Group,
  targetPlanet: PlanetData,
  planetSurfaceTextures: Record<string, THREE.Texture>,
  protectedTextures: Set<THREE.Texture>
): void {
  disposeObject3D(structureGroup, protectedTextures);
  structureGroup.clear();

  const r = targetPlanet.radius;
  const layers = targetPlanet.layers;
  const outerTex = planetSurfaceTextures[targetPlanet.id];

  const outerGeo = new THREE.SphereGeometry(r, 48, 36, 0, Math.PI * 1.5);
  const outerMat = new THREE.MeshStandardMaterial({
    map: outerTex,
    color: outerTex ? 0xffffff : targetPlanet.color,
    roughness: 0.65,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  structureGroup.add(new THREE.Mesh(outerGeo, outerMat));

  // Stepped concentric inner shells (Mantle, Outer Core, Inner Core)
  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    const shellR = Math.max(0.2, r * layer.thicknessRadius);
    const shellGeo = new THREE.SphereGeometry(shellR, 36, 24, 0, Math.PI * 1.5);
    const isCore = i === layers.length - 1;
    const isOuterCore = i === layers.length - 2;
    const shellMat = createCutawayLayerMaterial(layer, isCore, isOuterCore, 0.65);
    structureGroup.add(new THREE.Mesh(shellGeo, shellMat));
  }

  // Flat cut faces (wedge caps) at phi = 0 (XY) and phi = 1.5 * PI (ZY)
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const rOuter = r * layer.thicknessRadius;
    const rInner = i < layers.length - 1 ? r * layers[i + 1].thicknessRadius : 0;
    const isCore = i === layers.length - 1;
    const isOuterCore = i === layers.length - 2;

    const capMat = createCutawayLayerMaterial(layer, isCore, isOuterCore, 0.75);
    const capGeo =
      rInner === 0
        ? new THREE.CircleGeometry(rOuter, 36, -Math.PI / 2, Math.PI)
        : new THREE.RingGeometry(rInner, rOuter, 36, 1, -Math.PI / 2, Math.PI);

    const cap1 = new THREE.Mesh(capGeo, capMat);
    structureGroup.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.rotation.y = -Math.PI / 2;
    structureGroup.add(cap2);
  }

  const coreLight = new THREE.PointLight(0xffaa00, 3.2, r * 5);
  structureGroup.add(coreLight);

  structureGroup.rotation.y = 0.4;
  structureGroup.rotation.x = 0.12;
}

/**
 * Projects 3D cutaway layer midpoints onto 2D viewport coordinates for non-overlapping SVG callouts.
 */
export function projectStructureCallouts(
  structureGroup: THREE.Group,
  camera: THREE.Camera,
  container: HTMLDivElement,
  planet: PlanetData
): StructureCallout[] {
  const pr = planet.radius;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const callouts: StructureCallout[] = [];
  const numLayers = planet.layers.length;

  structureGroup.updateMatrixWorld(true);

  planet.layers.forEach((layer, idx) => {
    const rOuter = pr * layer.thicknessRadius;
    const rInner =
      idx < numLayers - 1 ? pr * planet.layers[idx + 1].thicknessRadius : 0;
    const rMid = (rOuter + rInner) / 2;

    _ptLocal.set(rMid * Math.cos(0.4), rMid * Math.sin(0.4), 0.05);
    _ptWorld.copy(_ptLocal).applyMatrix4(structureGroup.matrixWorld).project(camera);

    if (_ptWorld.z < 1) {
      const startX = (_ptWorld.x * 0.5 + 0.5) * cw;
      const startY = (-_ptWorld.y * 0.5 + 0.5) * ch;

      const endX = Math.min(cw - 260, Math.max(startX + 80, cw * 0.58));
      const baseCenterY = ch * 0.48;
      const slotSpacing = 74;
      const endY = Math.max(
        90,
        Math.min(ch - 130, baseCenterY + (idx - (numLayers - 1) / 2) * slotSpacing)
      );

      callouts.push({
        name: layer.name,
        subtitle: layer.subtitle,
        composition: layer.composition,
        color: layer.color,
        startX,
        startY,
        endX,
        endY,
      });
    }
  });

  return callouts;
}
