import * as THREE from 'three';
import type { SystemViewMode } from '../../types/earthSystem';
import { soundManager } from '../../utils/soundEffects';
import type {
  OrbitControllerState,
  SpaceLiveState,
  ThreeSceneUserData,
} from './types';

export function clampAndSetOrbitRadius(
  orbitState: OrbitControllerState,
  viewMode: SystemViewMode,
  nextRadius: number
): void {
  orbitState.isTransitioning = false;
  const minR = viewMode === 'solar_system' ? 25 : 5;
  const maxR = viewMode === 'solar_system' ? 420 : 60;
  const clamped = Math.min(maxR, Math.max(minR, nextRadius));
  orbitState.radius = clamped;
  orbitState.targetRadius = clamped;
}

function isObjectVisibleInHierarchy(object: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = object;
  while (cur) {
    if (!cur.visible) return false;
    cur = cur.parent;
  }
  return true;
}

function findFirstVisibleHit(
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  camera: THREE.Camera,
  pickableTargets: THREE.Object3D[]
): ThreeSceneUserData | null {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pickableTargets, false);
  for (const hit of intersects) {
    if (!isObjectVisibleInHierarchy(hit.object)) continue;
    const ud = hit.object.userData as ThreeSceneUserData | undefined;
    if (ud && ('isSatellite' in ud || 'isHotspot' in ud || 'isPlanet' in ud)) {
      return ud;
    }
  }
  return null;
}

export interface OrbitInputControllerOptions {
  container: HTMLDivElement;
  camera: THREE.Camera;
  orbitStateRef: { current: OrbitControllerState };
  liveRef: { current: SpaceLiveState };
  pickableTargets: THREE.Object3D[];
  setHoveredLabel: (label: string | null) => void;
}

/**
 * Attaches mouse drag-orbit, wheel zoom, and throttled hover/click raycasting listeners.
 */
export function attachOrbitInputController({
  container,
  camera,
  orbitStateRef,
  liveRef,
  pickableTargets,
  setHoveredLabel,
}: OrbitInputControllerOptions): () => void {
  let prevMouse = { x: 0, y: 0 };
  let mouseDownPos = { x: 0, y: 0 };
  let lastRaycastTime = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleMouseDown = (e: MouseEvent) => {
    liveRef.current.isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
    mouseDownPos = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (liveRef.current.isDragging) {
      orbitStateRef.current.isTransitioning = false;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      orbitStateRef.current.theta -= dx * 0.005;
      orbitStateRef.current.phi = Math.min(
        Math.PI * 0.48,
        Math.max(0.08, orbitStateRef.current.phi - dy * 0.005)
      );
      prevMouse = { x: e.clientX, y: e.clientY };
      return;
    }

    const now = performance.now();
    if (now - lastRaycastTime <= 45) return;
    lastRaycastTime = now;

    const hitData = findFirstVisibleHit(raycaster, mouse, camera, pickableTargets);
    if (hitData) {
      if ('isSatellite' in hitData && hitData.isSatellite) {
        setHoveredLabel(
          `🛰️ ${hitData.data.name} • ${hitData.data.orbitAltitudeKm} km Orbit`
        );
      } else {
        setHoveredLabel(hitData.data.name);
      }
      container.style.cursor = 'pointer';
      return;
    }

    setHoveredLabel(null);
    container.style.cursor = 'grab';
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!liveRef.current.isDragging) return;
    liveRef.current.isDragging = false;

    const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
    if (dist >= 7) return;

    const hitData = findFirstVisibleHit(raycaster, mouse, camera, pickableTargets);
    if (!hitData) return;

    soundManager.playClick();
    if ('isSatellite' in hitData && hitData.isSatellite) {
      liveRef.current.callbacks.onSelectSatellite?.(hitData.data);
    } else if ('isHotspot' in hitData && hitData.isHotspot) {
      liveRef.current.callbacks.onSelectHotspot(hitData.data);
    } else if ('isPlanet' in hitData && hitData.isPlanet) {
      liveRef.current.callbacks.onSelectPlanet(hitData.data);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = orbitStateRef.current.radius * 0.0016;
    clampAndSetOrbitRadius(
      orbitStateRef.current,
      liveRef.current.viewMode,
      orbitStateRef.current.radius + e.deltaY * zoomSpeed
    );
  };

  container.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    container.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    container.removeEventListener('wheel', handleWheel);
  };
}
