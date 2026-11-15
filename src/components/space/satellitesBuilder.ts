import * as THREE from 'three';
import { NASA_FLEET } from '../../utils/earthSystemData';
import type { AnimatedSatellite } from './types';

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const ORIGIN = new THREE.Vector3(0, 0, 0);
const _satPos = new THREE.Vector3();

/**
 * Builds the 3D orbital rings and spacecraft meshes for the NASA Earth Observing fleet.
 */
export function buildNasaSatellites(
  earthRadius: number,
  visible: boolean,
  pickableTargets: THREE.Object3D[]
): { satellitesGroup: THREE.Group; animatedSatellites: AnimatedSatellite[] } {
  const satellitesGroup = new THREE.Group();
  satellitesGroup.visible = visible;

  const ringMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.32,
  });
  const bodyGeo = new THREE.BoxGeometry(0.12, 0.12, 0.22);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.8,
  });
  const wingGeo = new THREE.BoxGeometry(0.48, 0.02, 0.14);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.2,
    metalness: 0.6,
  });

  const animatedSatellites: AnimatedSatellite[] = [];

  NASA_FLEET.forEach((sat, sIdx) => {
    const satOrbitR = earthRadius * (1.28 + sIdx * 0.16);
    const incX = sIdx * 0.42 + 0.35;
    const incZ = sIdx * 0.28;

    const ringPts: THREE.Vector3[] = [];
    for (let a = 0; a <= 64; a++) {
      const th = (a / 64) * Math.PI * 2;
      const p = new THREE.Vector3(
        Math.cos(th) * satOrbitR,
        0,
        Math.sin(th) * satOrbitR
      );
      p.applyAxisAngle(X_AXIS, incX);
      p.applyAxisAngle(Z_AXIS, incZ);
      ringPts.push(p);
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    satellitesGroup.add(new THREE.Line(ringGeo, ringMat));

    const satGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);

    const userData = { isSatellite: true, data: sat };
    bodyMesh.userData = userData;
    wingMesh.userData = userData;
    satGroup.userData = userData;

    satGroup.add(bodyMesh);
    satGroup.add(wingMesh);
    satellitesGroup.add(satGroup);
    pickableTargets.push(bodyMesh);

    animatedSatellites.push({
      mesh: satGroup,
      dist: satOrbitR,
      speed: 0.3 + (5 - sIdx) * 0.08,
      angle: sIdx * 1.3,
      incX,
      incZ,
      data: sat,
    });
  });

  return { satellitesGroup, animatedSatellites };
}

/**
 * Advances orbital positions for all NASA satellites without per-frame vector allocations.
 */
export function animateNasaSatellites(
  satellites: AnimatedSatellite[],
  delta: number
): void {
  satellites.forEach((sat) => {
    sat.angle += sat.speed * delta * 0.45;
    _satPos.set(
      Math.cos(sat.angle) * sat.dist,
      0,
      Math.sin(sat.angle) * sat.dist
    );
    _satPos.applyAxisAngle(X_AXIS, sat.incX);
    _satPos.applyAxisAngle(Z_AXIS, sat.incZ);
    sat.mesh.position.copy(_satPos);
    sat.mesh.lookAt(ORIGIN);
  });
}
