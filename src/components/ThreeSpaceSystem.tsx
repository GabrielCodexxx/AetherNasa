import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { PlanetData, HotspotMarker, SystemViewMode } from '../types/earthSystem';
import { SOLAR_PLANETS, EARTH_HOTSPOTS } from '../utils/earthSystemData';
import { soundManager } from '../utils/soundEffects';
import { RotateCw, Grid, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeSpaceSystemProps {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  selectedHotspotId: string | null;
  currentYear: number;
  onSelectPlanet: (planet: PlanetData) => void;
  onSelectHotspot: (hotspot: HotspotMarker) => void;
}

// Convert Lat/Lon to 3D Cartesian coordinates on a sphere of given radius
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Procedural Earth Landmass & Ocean Texture Generator
function generateEarthTexture(iceReductionFactor: number = 0): { diffuse: HTMLCanvasElement; bump: HTMLCanvasElement } {
  const width = 2048;
  const height = 1024;

  const dCanvas = document.createElement('canvas');
  dCanvas.width = width;
  dCanvas.height = height;
  const dCtx = dCanvas.getContext('2d')!;

  const bCanvas = document.createElement('canvas');
  bCanvas.width = width;
  bCanvas.height = height;
  const bCtx = bCanvas.getContext('2d')!;

  // 1. Deep Ocean Base (Navy / Cobalt Blue)
  const oceanGrad = dCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0f172a');
  oceanGrad.addColorStop(0.3, '#1e3a8a');
  oceanGrad.addColorStop(0.5, '#1d4ed8');
  oceanGrad.addColorStop(0.7, '#1e3a8a');
  oceanGrad.addColorStop(1, '#0f172a');
  dCtx.fillStyle = oceanGrad;
  dCtx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#202020';
  bCtx.fillRect(0, 0, width, height);

  // 2. Continents
  dCtx.fillStyle = '#15803d'; // Green vegetation
  bCtx.fillStyle = '#b0b0b0';

  const drawContinent = (cx: number, cy: number, rx: number, ry: number, rot: number, color: string = '#15803d') => {
    dCtx.save();
    dCtx.translate(cx, cy);
    dCtx.rotate(rot);
    dCtx.scale(rx / 100, ry / 100);
    dCtx.fillStyle = color;
    dCtx.beginPath();
    dCtx.arc(0, 0, 100, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.restore();

    bCtx.save();
    bCtx.translate(cx, cy);
    bCtx.rotate(rot);
    bCtx.scale(rx / 100, ry / 100);
    bCtx.fillStyle = '#c0c0c0';
    bCtx.beginPath();
    bCtx.arc(0, 0, 100, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.restore();
  };

  // North America
  drawContinent(520, 320, 220, 160, -0.2);
  drawContinent(420, 280, 140, 100, 0.1);

  // South America
  drawContinent(680, 640, 160, 240, 0.25, '#166534'); // Amazon green

  // Eurasia (Europe + Asia)
  drawContinent(1200, 320, 360, 180, 0.05);
  drawContinent(1480, 340, 260, 160, -0.1);

  // Africa & Sahara Desert
  drawContinent(1080, 520, 180, 220, 0.1, '#ca8a04'); // Sahara ochre
  drawContinent(1100, 640, 140, 160, 0.0, '#15803d'); // Central Africa green

  // Australia
  drawContinent(1620, 680, 130, 90, 0.15, '#b45309'); // Outback red/brown

  // 3. Polar Ice Caps
  const arcticIceHeight = Math.max(30, 110 * (1 - iceReductionFactor * 0.45));
  const arcticGrad = dCtx.createLinearGradient(0, 0, 0, arcticIceHeight);
  arcticGrad.addColorStop(0, '#ffffff');
  arcticGrad.addColorStop(0.8, '#e0f2fe');
  arcticGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');
  dCtx.fillStyle = arcticGrad;
  dCtx.fillRect(0, 0, width, arcticIceHeight);

  const antarcticStart = height - 120;
  const antarcticGrad = dCtx.createLinearGradient(0, antarcticStart, 0, height);
  antarcticGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  antarcticGrad.addColorStop(0.3, '#e0f2fe');
  antarcticGrad.addColorStop(1, '#ffffff');
  dCtx.fillStyle = antarcticGrad;
  dCtx.fillRect(0, antarcticStart, width, 120);

  // Greenland Ice Sheet
  drawContinent(820, 190, 90, 110, -0.15, '#f8fafc');

  return { diffuse: dCanvas, bump: bCanvas };
}

// Procedural Atmospheric Cloud Layer Texture
function generateCloudTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 70; i++) {
    const x = (i * 137) % canvas.width;
    const y = 80 + ((i * 97) % (canvas.height - 160));
    const rx = 60 + (i % 5) * 25;
    const ry = 15 + (i % 3) * 10;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.3 * Math.sin(i), 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export const ThreeSpaceSystem: React.FC<ThreeSpaceSystemProps> = ({
  viewMode,
  selectedPlanetId,
  selectedHotspotId,
  currentYear,
  onSelectPlanet,
  onSelectHotspot,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // Dedicated Spherical Orbit & Camera Controller State
  const orbitStateRef = useRef({
    target: new THREE.Vector3(0, 0, 0),        // Center of orbit
    radius: 180,                               // Distance (zoom)
    theta: 0.2,                                // Azimuth angle
    phi: Math.PI / 3.4,                        // Polar elevation angle
    isTransitioning: false,                    // True only during fly-to animations
    targetRadius: 180,
    targetTheta: 0.2,
    targetPhi: Math.PI / 3.4,
    targetLookAt: new THREE.Vector3(0, 0, 0),
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const structureGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const shockwavesRef = useRef<THREE.Mesh[]>([]);

  // Smoothly initiate a transition to a new view/target
  const triggerFlyTo = useCallback((targetPos: THREE.Vector3, distance: number, elevation: number = Math.PI / 3.4) => {
    orbitStateRef.current.targetLookAt.copy(targetPos);
    orbitStateRef.current.targetRadius = distance;
    orbitStateRef.current.targetPhi = elevation;
    orbitStateRef.current.isTransitioning = true;
  }, []);

  // Update target when viewMode changes
  useEffect(() => {
    if (viewMode === 'solar_system') {
      triggerFlyTo(new THREE.Vector3(0, 0, 0), 180, Math.PI / 3.2);
    } else if (viewMode === 'earth_focus') {
      const earth = SOLAR_PLANETS.find((p) => p.id === 'earth')!;
      triggerFlyTo(new THREE.Vector3(earth.orbitDistance, 0, 0), 12, Math.PI / 2.4);
    } else if (viewMode === 'structure') {
      const earth = SOLAR_PLANETS.find((p) => p.id === 'earth')!;
      triggerFlyTo(new THREE.Vector3(earth.orbitDistance, 0, 0), 14, Math.PI / 2.3);
    }
  }, [viewMode, triggerFlyTo]);

  // Update target when selected planet changes while in solar system mode
  useEffect(() => {
    if (viewMode === 'solar_system') {
      const planet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId);
      if (planet && planet.id !== 'sun') {
        triggerFlyTo(new THREE.Vector3(planet.orbitDistance, 0, 0), planet.radius * 3.5 + 8, Math.PI / 2.6);
      } else {
        triggerFlyTo(new THREE.Vector3(0, 0, 0), 180, Math.PI / 3.2);
      }
    }
  }, [selectedPlanetId, viewMode, triggerFlyTo]);

  // Zoom Controls (+ / -)
  const handleZoom = (factor: number) => {
    soundManager.playClick();
    orbitStateRef.current.isTransitioning = false; // Give immediate control to user
    const minR = viewMode === 'solar_system' ? 25 : 5;
    const maxR = viewMode === 'solar_system' ? 380 : 50;
    const newR = orbitStateRef.current.radius * factor;
    orbitStateRef.current.radius = Math.min(maxR, Math.max(minR, newR));
    orbitStateRef.current.targetRadius = orbitStateRef.current.radius;
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020617, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      3000
    );
    camera.position.set(0, 75, 175);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Starfield & Milky Way
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 500 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const rnd = Math.random();
      if (rnd > 0.8) {
        starColors[i * 3] = 0.55;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else if (rnd > 0.6) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.5;
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Milky Way Galaxy Band
    const mwCount = 1800;
    const mwGeo = new THREE.BufferGeometry();
    const mwPositions = new Float32Array(mwCount * 3);
    const mwColors = new Float32Array(mwCount * 3);

    for (let i = 0; i < mwCount; i++) {
      const angle = (i / mwCount) * Math.PI * 2;
      const radius = 650 + (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 90;
      mwPositions[i * 3] = Math.cos(angle) * radius;
      mwPositions[i * 3 + 1] = y;
      mwPositions[i * 3 + 2] = Math.sin(angle) * radius;

      mwColors[i * 3] = 0.35 + Math.random() * 0.2;
      mwColors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      mwColors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    }
    mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPositions, 3));
    mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));
    const mwMat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const milkyWay = new THREE.Points(mwGeo, mwMat);
    scene.add(milkyWay);

    // 3. Central Sun
    const sunData = SOLAR_PLANETS[0];
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { isPlanet: true, data: sunData };
    scene.add(sunMesh);

    const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.35, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(1.0, 0.6, 0.0, 1.0) * intensity * 1.5;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunMesh.add(coronaMesh);

    const sunLight = new THREE.PointLight(0xfff8eb, 4.5, 600, 0.6);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // 4. Ecliptic Coordinate Grid
    const gridHelper = new THREE.PolarGridHelper(160, 16, 8, 64, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // 5. Planets Group
    const planetsGroup = new THREE.Group();
    scene.add(planetsGroup);

    const animatedPlanets: {
      mesh: THREE.Object3D;
      data: PlanetData;
      angle: number;
    }[] = [];

    SOLAR_PLANETS.slice(1).forEach((planet) => {
      // Orbital path line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0, planet.orbitDistance, planet.orbitDistance, 0, Math.PI * 2, false, 0
      );
      const points = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: planet.id === 'earth' ? 0x38bdf8 : 0x334155,
        transparent: true,
        opacity: planet.id === 'earth' ? 0.75 : 0.35,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Planet container
      const pGroup = new THREE.Group();
      pGroup.position.set(planet.orbitDistance, 0, 0);
      planetsGroup.add(pGroup);

      if (planet.id === 'earth') {
        earthGroupRef.current = pGroup;

        const iceFactor = (currentYear - 1980) / 46;
        const { diffuse, bump } = generateEarthTexture(iceFactor);
        const diffTex = new THREE.CanvasTexture(diffuse);
        const bumpTex = new THREE.CanvasTexture(bump);

        const earthGeo = new THREE.SphereGeometry(planet.radius, 48, 36);
        const earthMat = new THREE.MeshStandardMaterial({
          map: diffTex,
          bumpMap: bumpTex,
          bumpScale: 0.35,
          roughness: 0.6,
          metalness: 0.1,
        });
        const earthMesh = new THREE.Mesh(earthGeo, earthMat);
        earthMesh.userData = { isPlanet: true, data: planet };
        pGroup.add(earthMesh);

        // Atmosphere halo
        const atmosGeo = new THREE.SphereGeometry(planet.radius * 1.05, 32, 32);
        const atmosMat = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
              gl_FragColor = vec4(0.1, 0.7, 1.0, 1.0) * intensity * 1.2;
            }
          `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
        });
        const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        pGroup.add(atmosMesh);

        // Swirling Clouds
        const cloudTex = new THREE.CanvasTexture(generateCloudTexture());
        const cloudGeo = new THREE.SphereGeometry(planet.radius * 1.018, 36, 32);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
        });
        const cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
        pGroup.add(cloudsMesh);
        cloudsMeshRef.current = cloudsMesh;

        // Earth Moon
        const moonGeo = new THREE.SphereGeometry(0.65, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(5.2, 1.2, 0);
        pGroup.add(moonMesh);

        // Hotspot Pins
        const shockwaves: THREE.Mesh[] = [];
        EARTH_HOTSPOTS.forEach((hs) => {
          const pos = latLonToVector3(hs.lat, hs.lon, planet.radius);
          const norm = pos.clone().normalize();

          const color =
            hs.domain === 'cryosphere'
              ? 0x38bdf8
              : hs.domain === 'biosphere'
              ? 0x22c55e
              : hs.domain === 'hydrosphere'
              ? 0x3b82f6
              : 0xef4444;

          const isSelected = selectedHotspotId === hs.id;
          const pinGeo = new THREE.SphereGeometry(isSelected ? 0.22 : 0.14, 12, 12);
          const pinMat = new THREE.MeshBasicMaterial({ color: isSelected ? 0xffffff : color });
          const pin = new THREE.Mesh(pinGeo, pinMat);
          pin.position.copy(pos.clone().add(norm.clone().multiplyScalar(0.12)));
          pin.userData = { isHotspot: true, data: hs };
          pGroup.add(pin);

          const ringGeo = new THREE.RingGeometry(0.12, 0.22, 24);
          const ringMat = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.copy(pos.clone().add(norm.clone().multiplyScalar(0.04)));
          ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), norm);
          ring.userData = { progress: Math.random(), maxScale: 3.5 };
          pGroup.add(ring);
          shockwaves.push(ring);
        });
        shockwavesRef.current = shockwaves;
      } else {
        const pGeo = new THREE.SphereGeometry(planet.radius, 32, 24);
        const pMat = new THREE.MeshStandardMaterial({
          color: planet.color,
          roughness: 0.8,
          metalness: 0.1,
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.userData = { isPlanet: true, data: planet };
        pGroup.add(pMesh);

        if (planet.hasRings && planet.ringInnerRadius && planet.ringOuterRadius) {
          const rGeo = new THREE.RingGeometry(planet.ringInnerRadius, planet.ringOuterRadius, 48);
          const rMat = new THREE.MeshStandardMaterial({
            color: 0xfef08a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
          });
          const rMesh = new THREE.Mesh(rGeo, rMat);
          rMesh.rotation.x = Math.PI / 2.3;
          pGroup.add(rMesh);
        }
      }

      animatedPlanets.push({
        mesh: pGroup,
        data: planet,
        angle: (planet.orbitDistance * 47) % (Math.PI * 2),
      });
    });

    // 6. Asteroid Belt
    const asteroidCount = 2000;
    const astGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const astMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
    const asteroidInstanced = new THREE.InstancedMesh(astGeo, astMat, asteroidCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 14;
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

    // 7. Earth Interior Cutaway
    const structureGroup = new THREE.Group();
    structureGroup.visible = false;
    scene.add(structureGroup);
    structureGroupRef.current = structureGroup;

    const earthR = 2.4;
    const crustGeo = new THREE.SphereGeometry(earthR, 36, 24, 0, Math.PI * 1.5);
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x166534, side: THREE.DoubleSide });
    structureGroup.add(new THREE.Mesh(crustGeo, crustMat));

    const mantleGeo = new THREE.SphereGeometry(earthR * 0.82, 32, 24, 0, Math.PI * 1.5);
    const mantleMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, side: THREE.DoubleSide });
    structureGroup.add(new THREE.Mesh(mantleGeo, mantleMat));

    const outerCoreGeo = new THREE.SphereGeometry(earthR * 0.52, 24, 20, 0, Math.PI * 1.5);
    const outerCoreMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    structureGroup.add(new THREE.Mesh(outerCoreGeo, outerCoreMat));

    const innerCoreGeo = new THREE.SphereGeometry(earthR * 0.24, 20, 20);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    structureGroup.add(new THREE.Mesh(innerCoreGeo, innerCoreMat));

    // 8. User Mouse Orbit & Drag Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        // User is taking manual control: cancel any active camera fly-to animation!
        orbitStateRef.current.isTransitioning = false;

        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;

        // Smooth spherical angle rotation
        orbitStateRef.current.theta -= dx * 0.005;
        orbitStateRef.current.phi = Math.min(
          Math.PI * 0.48,
          Math.max(0.08, orbitStateRef.current.phi - dy * 0.005)
        );

        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        // Hover Detection
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let foundHover = false;
        for (const hit of intersects) {
          if (hit.object.userData?.isHotspot) {
            setHoveredLabel(hit.object.userData.data.name);
            container.style.cursor = 'pointer';
            foundHover = true;
            break;
          } else if (hit.object.userData?.isPlanet) {
            setHoveredLabel(hit.object.userData.data.name);
            container.style.cursor = 'pointer';
            foundHover = true;
            break;
          }
        }
        if (!foundHover) {
          setHoveredLabel(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      // Click detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      for (const hit of intersects) {
        if (hit.object.userData?.isHotspot) {
          soundManager.playClick();
          onSelectHotspot(hit.object.userData.data);
          return;
        } else if (hit.object.userData?.isPlanet) {
          soundManager.playClick();
          onSelectPlanet(hit.object.userData.data);
          return;
        }
      }
    };

    // User Mouse Wheel Zoom (Completely under user control)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitStateRef.current.isTransitioning = false; // User took control!

      const zoomSpeed = orbitStateRef.current.radius * 0.0016;
      const minR = viewMode === 'solar_system' ? 25 : 5;
      const maxR = viewMode === 'solar_system' ? 420 : 55;
      const newR = orbitStateRef.current.radius + e.deltaY * zoomSpeed;

      orbitStateRef.current.radius = Math.min(maxR, Math.max(minR, newR));
      orbitStateRef.current.targetRadius = orbitStateRef.current.radius;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 9. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // If transitioning (e.g. fly-to mode), smoothly damp towards target values
      const st = orbitStateRef.current;
      if (st.isTransitioning) {
        st.radius += (st.targetRadius - st.radius) * 0.06;
        st.phi += (st.targetPhi - st.phi) * 0.06;
        st.target.lerp(st.targetLookAt, 0.06);

        if (Math.abs(st.radius - st.targetRadius) < 0.25 && st.target.distanceTo(st.targetLookAt) < 0.2) {
          st.isTransitioning = false;
        }
      } else if (autoRotate && !isDragging) {
        st.theta += 0.001; // Gentle ambient orbital spin
      }

      // Compute camera position from spherical coordinates around target
      const r = st.radius;
      const p = st.phi;
      const t = st.theta;
      const cx = st.target.x + r * Math.sin(p) * Math.sin(t);
      const cy = st.target.y + r * Math.cos(p);
      const cz = st.target.z + r * Math.sin(p) * Math.cos(t);

      camera.position.set(cx, cy, cz);
      camera.lookAt(st.target);

      // Rotate Sun
      sunMesh.rotation.y += 0.002;

      // Orbit Planets
      animatedPlanets.forEach((pl) => {
        if (autoRotate && viewMode === 'solar_system') {
          pl.angle += pl.data.orbitSpeed * delta * 0.7;
          pl.mesh.position.x = Math.cos(pl.angle) * pl.data.orbitDistance;
          pl.mesh.position.z = Math.sin(pl.angle) * pl.data.orbitDistance;
        }
        pl.mesh.rotation.y += pl.data.rotationSpeed;
      });

      // Animate Clouds
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0006;
      }

      // Animate Asteroid Belt
      asteroidInstanced.rotation.y += 0.0004;

      // Animate Shockwaves
      shockwavesRef.current.forEach((sw) => {
        sw.userData.progress = (sw.userData.progress + delta * 0.8) % 1.0;
        const prog = sw.userData.progress;
        const s = 1 + prog * (sw.userData.maxScale - 1);
        sw.scale.set(s, s, 1);
        if (sw.material instanceof THREE.MeshBasicMaterial) {
          sw.material.opacity = Math.max(0, 0.9 * (1 - prog));
        }
      });

      // Rotate Starfield subtly
      stars.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [onSelectPlanet, onSelectHotspot, currentYear, viewMode, autoRotate, selectedHotspotId]);

  // Sync Structure Mode
  useEffect(() => {
    if (structureGroupRef.current && earthGroupRef.current) {
      if (viewMode === 'structure') {
        structureGroupRef.current.visible = true;
        structureGroupRef.current.position.copy(earthGroupRef.current.position);
        earthGroupRef.current.visible = false;
      } else {
        structureGroupRef.current.visible = false;
        earthGroupRef.current.visible = true;
      }
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hover Tooltip */}
      {hoveredLabel && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 shadow-2xl text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{hoveredLabel}</span>
        </div>
      )}

      {/* Mode Watermark Indicator */}
      <div className="absolute top-6 right-6 pointer-events-none z-10 hidden sm:flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              viewMode === 'solar_system'
                ? 'bg-amber-400'
                : viewMode === 'earth_focus'
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
            } animate-pulse`}
          ></span>
          {viewMode === 'solar_system'
            ? 'Solar System Overview (Milky Way & Asteroid Belt)'
            : viewMode === 'earth_focus'
            ? 'Earth System Trend Detective (NASA Satellites)'
            : 'Earth Interior Structure Cutaway'}
        </span>
      </div>

      {/* Manual Zoom & Navigation Dock */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.8)}
          className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(1.25)}
          className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Orbit Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setAutoRotate(!autoRotate);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all ${
            autoRotate
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Planetary Orbit Animation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>Orbit: {autoRotate ? 'ON' : 'OFF'}</span>
        </button>

        {/* Grid Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setShowGrid(!showGrid);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold backdrop-blur-md border transition-all ${
            showGrid
              ? 'bg-slate-900/80 text-cyan-300 border-cyan-500/30'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Orbital Plane Coordinates"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
      </div>
    </div>
  );
};
export default ThreeSpaceSystem;
