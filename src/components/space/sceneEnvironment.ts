import * as THREE from 'three';
import type { PlanetData } from '../../types/earthSystem';
import { createRimGlowMaterial } from './spaceMaterials';

export interface SceneEnvironmentResult {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  stars: THREE.Points;
  sunMesh: THREE.Mesh;
  gridHelper: THREE.PolarGridHelper;
  asteroidInstanced: THREE.InstancedMesh;
}

function createColoredPointCloud(
  count: number,
  size: number,
  opacity: number,
  populate: (i: number, positions: Float32Array, colors: Float32Array) => void,
  blending?: THREE.Blending
): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    populate(i, positions, colors);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    ...(blending !== undefined ? { blending } : {}),
  });

  return new THREE.Points(geometry, material);
}

/**
 * Initializes the Three.js scene, camera, WebGL renderer, starfield, Milky Way, Sun, grid, and asteroid belt.
 */
export function buildSceneEnvironment(
  container: HTMLDivElement,
  sunData: PlanetData,
  showGrid: boolean,
  planetMeshes: Map<string, THREE.Object3D>,
  pickableTargets: THREE.Object3D[]
): SceneEnvironmentResult {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf8fafc, 0.0009);

  const aspect = container.clientHeight > 0 ? container.clientWidth / container.clientHeight : 1;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 3500);
  camera.position.set(0, 75, 175);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.replaceChildren(renderer.domElement);

  const stars = createColoredPointCloud(3500, 1.6, 0.9, (i, pos, col) => {
    const r = 550 + Math.random() * 850;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const rnd = Math.random();
    if (rnd > 0.8) {
      col[i * 3] = 0.55;
      col[i * 3 + 1] = 0.85;
      col[i * 3 + 2] = 1.0;
    } else if (rnd > 0.6) {
      col[i * 3] = 1.0;
      col[i * 3 + 1] = 0.85;
      col[i * 3 + 2] = 0.5;
    } else {
      col[i * 3] = 0.95;
      col[i * 3 + 1] = 0.95;
      col[i * 3 + 2] = 1.0;
    }
  });
  scene.add(stars);

  const mwCount = 2000;
  const milkyWay = createColoredPointCloud(
    mwCount,
    4.8,
    0.45,
    (i, pos, col) => {
      const angle = (i / mwCount) * Math.PI * 2;
      const radius = 680 + (Math.random() - 0.5) * 140;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 95;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      col[i * 3] = 0.35 + Math.random() * 0.2;
      col[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    },
    THREE.AdditiveBlending
  );
  scene.add(milkyWay);

  const sunGeo = new THREE.SphereGeometry(sunData.radius, 48, 48);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.userData = { isPlanet: true, data: sunData };
  scene.add(sunMesh);
  planetMeshes.set(sunData.id, sunMesh);
  pickableTargets.push(sunMesh);

  const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.35, 32, 32);
  const coronaMat = createRimGlowMaterial({
    colorVec3: '1.0, 0.6, 0.0',
    power: '2.0',
    intensityScale: '1.5',
  });
  sunMesh.add(new THREE.Mesh(coronaGeo, coronaMat));

  scene.add(new THREE.PointLight(0xfff8eb, 4.5, 700, 0.5));
  scene.add(new THREE.AmbientLight(0xffffff, 2.2));

  const gridHelper = new THREE.PolarGridHelper(160, 16, 8, 64, 0x0369a1, 0xcbd5e1);
  gridHelper.position.y = -0.5;
  gridHelper.visible = showGrid;
  scene.add(gridHelper);

  const asteroidCount = 2000;
  const astGeo = new THREE.DodecahedronGeometry(0.28, 0);
  const astMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
  const asteroidInstanced = new THREE.InstancedMesh(astGeo, astMat, asteroidCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 52 + Math.random() * 14;
    const y = (Math.random() - 0.5) * 5.0;
    dummy.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const s = 0.5 + Math.random() * 1.2;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    asteroidInstanced.setMatrixAt(i, dummy.matrix);
  }
  asteroidInstanced.instanceMatrix.needsUpdate = true;
  scene.add(asteroidInstanced);

  return { scene, camera, renderer, stars, sunMesh, gridHelper, asteroidInstanced };
}
