import * as THREE from 'three';
import type { PlanetData } from '../../types/earthSystem';
import { SOLAR_PLANETS } from '../../utils/earthSystemData';
import { attachOrbitInputController } from './orbitInputController';
import { createPlanetTextureMap } from './planetTextures';
import { buildSolarPlanets } from './planetsBuilder';
import { buildSceneEnvironment } from './sceneEnvironment';
import { stepSpaceFrame } from './spaceFrameLoop';
import {
  buildPlanetSurfaceTextures,
  disposeObject3D,
  loadEarthTextureBundle,
} from './spaceMaterials';
import { buildStructureLayers } from './structureCutaway';
import type {
  OrbitControllerState,
  SpaceLiveState,
  SpaceSceneHandles,
  StructureCalloutState,
} from './types';

export interface MountSpaceSceneOptions {
  container: HTMLDivElement;
  orbitStateRef: { current: OrbitControllerState };
  liveRef: { current: SpaceLiveState };
  handlesRef: { current: SpaceSceneHandles | null };
  setHoveredLabel: (label: string | null) => void;
  setCalloutState: (state: StructureCalloutState) => void;
}

/**
 * Mounts the Three.js solar system scene, runs the 60 FPS render loop,
 * and returns an unmount cleanup callback that disposes all GPU resources.
 */
export function mountSpaceScene({
  container,
  orbitStateRef,
  liveRef,
  handlesRef,
  setHoveredLabel,
  setCalloutState,
}: MountSpaceSceneOptions): () => void {
  liveRef.current.isDragging = false;
  liveRef.current.lastCalloutUpdate = 0;
  liveRef.current.calloutActive = false;

  const planetMeshes = new Map<string, THREE.Object3D>();
  const pickableTargets: THREE.Object3D[] = [];

  const {
    scene,
    camera,
    renderer,
    stars,
    sunMesh,
    gridHelper,
    asteroidInstanced,
  } = buildSceneEnvironment(
    container,
    SOLAR_PLANETS[0],
    liveRef.current.showGrid,
    planetMeshes,
    pickableTargets
  );

  const earthTextures = loadEarthTextureBundle();
  const canvasTextureMap = createPlanetTextureMap();
  const { surfaceTextures, protectedTextures } = buildPlanetSurfaceTextures(
    earthTextures.diffuse,
    canvasTextureMap
  );

  const {
    animatedPlanets,
    cloudsMesh,
    divergenceMesh,
    satellitesGroup,
    hotspotsGroup,
    animatedSatellites,
    hotspotBeacons,
  } = buildSolarPlanets({
    scene,
    planetMeshes,
    pickableTargets,
    planetSurfaceTextures: surfaceTextures,
    earthTextures,
    viewMode: liveRef.current.viewMode,
    selectedPlanetId: liveRef.current.selectedPlanetId,
    selectedHotspotId: liveRef.current.selectedHotspotId,
    showDivergenceLens: liveRef.current.showDivergenceLens,
  });

  const structureGroup = new THREE.Group();
  structureGroup.visible = false;
  scene.add(structureGroup);

  const rebuildStructure = (targetPlanet: PlanetData) => {
    buildStructureLayers(
      structureGroup,
      targetPlanet,
      surfaceTextures,
      protectedTextures
    );
  };

  const initialPlanet =
    SOLAR_PLANETS.find((p) => p.id === liveRef.current.selectedPlanetId) ||
    SOLAR_PLANETS[3];
  rebuildStructure(initialPlanet);

  handlesRef.current = {
    planetMeshes,
    structureGroup,
    rebuildStructure,
    divergenceMesh,
    satellitesGroup,
    hotspotsGroup,
    hotspotBeacons,
    gridHelper,
  };

  const detachInput = attachOrbitInputController({
    container,
    camera,
    orbitStateRef,
    liveRef,
    pickableTargets,
    setHoveredLabel,
  });

  let animId = 0;
  let lastFrameMs: number | null = null;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    const nowMs = performance.now();
    // Match THREE.Clock.getDelta() seconds semantics while clamping background-tab spikes.
    const delta =
      lastFrameMs === null ? 0 : Math.min(Math.max((nowMs - lastFrameMs) / 1000, 0), 0.1);
    lastFrameMs = nowMs;
    stepSpaceFrame({
      delta,
      container,
      camera,
      orbitState: orbitStateRef.current,
      live: liveRef.current,
      sunMesh,
      animatedPlanets,
      cloudsMesh,
      animatedSatellites,
      asteroidInstanced,
      stars,
      structureGroup,
      setCalloutState,
    });
    renderer.render(scene, camera);
  };

  animate();

  const handleResize = () => {
    if (container.clientHeight <= 0) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animId);
    detachInput();
    window.removeEventListener('resize', handleResize);
    disposeObject3D(scene);
    protectedTextures.forEach((tex) => tex.dispose());
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    handlesRef.current = null;
  };
}
