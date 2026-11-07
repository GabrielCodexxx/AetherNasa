import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { MoonquakeEvent, ApolloStation } from '../types/moonquake';
import { RotateCw, Grid, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export type GlobeViewMode = 'surface' | 'structure';

interface ThreeMoonGlobeProps {
  events: MoonquakeEvent[];
  stations: ApolloStation[];
  selectedEventId: string | null;
  selectedStationId: string | null;
  viewMode: GlobeViewMode;
  onSelectEvent: (event: MoonquakeEvent) => void;
  onSelectStation: (station: ApolloStation) => void;
  onViewModeChange?: (mode: GlobeViewMode) => void;
}

// Convert Lunar Latitude/Longitude to 3D Cartesian coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Procedural High-Fidelity Lunar Surface & Bump Texture Generator
function generatePhotorealisticLunarMaps(): { diffuse: HTMLCanvasElement; bump: HTMLCanvasElement } {
  const width = 2048;
  const height = 1024;

  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = width;
  diffCanvas.height = height;
  const dCtx = diffCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  // 1. Base Lunar Highlands (Anorthosite Rock - Medium bright gray)
  dCtx.fillStyle = '#64748b';
  dCtx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);

  // Simple pseudo-random hash generator for deterministic procedural detail
  const pseudoNoise = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  // Fine regolith roughness
  const imgData = dCtx.getImageData(0, 0, width, height);
  const bumpData = bCtx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const bData = bumpData.data;

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const n = (pseudoNoise(x * 0.05, y * 0.05) - 0.5) * 35;
      for (let dy = 0; dy < 4 && y + dy < height; dy++) {
        for (let dx = 0; dx < 4 && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const val = Math.min(255, Math.max(0, data[idx] + n));
          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val + 5; // Slight cold hue

          const bVal = Math.min(255, Math.max(0, bData[idx] + n * 1.2));
          bData[idx] = bVal;
          bData[idx + 1] = bVal;
          bData[idx + 2] = bVal;
        }
      }
    }
  }
  dCtx.putImageData(imgData, 0, 0);
  bCtx.putImageData(bumpData, 0, 0);

  // 2. Basaltic Dark Lunar Maria (Nearside seas)
  const maria = [
    // Oceanus Procellarum
    { cx: 620, cy: 460, rx: 340, ry: 240, rot: 0.15, darkness: 0.55 },
    // Mare Imbrium
    { cx: 800, cy: 360, rx: 180, ry: 150, rot: -0.1, darkness: 0.58 },
    // Mare Serenitatis
    { cx: 1040, cy: 380, rx: 130, ry: 110, rot: 0.05, darkness: 0.54 },
    // Mare Tranquillitatis
    { cx: 1120, cy: 480, rx: 160, ry: 120, rot: -0.2, darkness: 0.50 },
    // Mare Crisium
    { cx: 1320, cy: 430, rx: 90, ry: 75, rot: 0.1, darkness: 0.48 },
    // Mare Fecunditatis
    { cx: 1240, cy: 560, rx: 120, ry: 90, rot: 0.3, darkness: 0.52 },
    // Mare Nectaris
    { cx: 1120, cy: 620, rx: 80, ry: 70, rot: -0.1, darkness: 0.53 },
    // Mare Nubium & Humorum
    { cx: 720, cy: 620, rx: 130, ry: 100, rot: 0.25, darkness: 0.52 },
    // South Pole-Aitken Basin (Farside)
    { cx: 1780, cy: 780, rx: 220, ry: 140, rot: 0.0, darkness: 0.62 },
  ];

  maria.forEach((m) => {
    // Maria dark basalt gradient
    const grad = dCtx.createRadialGradient(m.cx, m.cy, 20, m.cx, m.cy, Math.max(m.rx, m.ry));
    grad.addColorStop(0, `rgba(22, 28, 38, ${m.darkness})`);
    grad.addColorStop(0.7, `rgba(30, 38, 50, ${m.darkness * 0.85})`);
    grad.addColorStop(1, 'rgba(100, 116, 139, 0)');

    dCtx.save();
    dCtx.translate(m.cx, m.cy);
    dCtx.rotate(m.rot);
    dCtx.scale(m.rx / 100, m.ry / 100);
    dCtx.fillStyle = grad;
    dCtx.beginPath();
    dCtx.arc(0, 0, 100, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.restore();

    // Bump depression for maria
    bCtx.save();
    bCtx.translate(m.cx, m.cy);
    bCtx.rotate(m.rot);
    bCtx.scale(m.rx / 100, m.ry / 100);
    const bGrad = bCtx.createRadialGradient(0, 0, 10, 0, 0, 100);
    bGrad.addColorStop(0, 'rgba(60, 60, 60, 0.4)');
    bGrad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.beginPath();
    bCtx.arc(0, 0, 100, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.restore();
  });

  // 3. Procedural Craters with Raised Rims & Shadows
  const craterSeeds = [
    { x: 920, y: 460, r: 24, name: 'Copernicus' },
    { x: 840, y: 720, r: 28, name: 'Tycho' },
    { x: 700, y: 350, r: 22, name: 'Aristarchus' },
    { x: 1040, y: 280, r: 20, name: 'Plato' },
    { x: 800, y: 480, r: 18, name: 'Eratosthenes' },
    { x: 1020, y: 880, r: 16, name: 'Shackleton' },
  ];

  // Add hundreds of smaller random impact craters
  for (let i = 0; i < 220; i++) {
    const cx = (i * 179) % width;
    const cy = (i * 97 + (i % 7) * 43) % height;
    const cr = (i % 11) + 2.5;
    craterSeeds.push({ x: cx, y: cy, r: cr, name: '' });
  }

  craterSeeds.forEach((c) => {
    // Depressed floor
    dCtx.fillStyle = 'rgba(20, 24, 32, 0.7)';
    dCtx.beginPath();
    dCtx.arc(c.x, c.y, c.r * 0.8, 0, Math.PI * 2);
    dCtx.fill();

    // Raised bright rim (catching sunlight from top-left)
    dCtx.strokeStyle = 'rgba(240, 244, 250, 0.65)';
    dCtx.lineWidth = Math.max(1, c.r * 0.25);
    dCtx.beginPath();
    dCtx.arc(c.x, c.y, c.r, Math.PI * 0.75, Math.PI * 1.75);
    dCtx.stroke();

    // Shadow rim
    dCtx.strokeStyle = 'rgba(10, 12, 16, 0.75)';
    dCtx.beginPath();
    dCtx.arc(c.x, c.y, c.r, Math.PI * 1.75, Math.PI * 0.75);
    dCtx.stroke();

    // Bump map for crater
    bCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    bCtx.lineWidth = Math.max(1, c.r * 0.3);
    bCtx.beginPath();
    bCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.fillStyle = 'rgba(20, 20, 20, 0.85)';
    bCtx.beginPath();
    bCtx.arc(c.x, c.y, c.r * 0.75, 0, Math.PI * 2);
    bCtx.fill();
  });

  // 4. Tycho & Copernicus Bright High-Albedo Ray Systems
  const drawRays = (ox: number, oy: number, numRays: number, length: number) => {
    dCtx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    dCtx.lineWidth = 1.8;
    for (let a = 0; a < numRays; a++) {
      const angle = (a / numRays) * Math.PI * 2 + (pseudoNoise(a, ox) - 0.5) * 0.3;
      const len = length * (0.6 + pseudoNoise(ox, a) * 0.8);
      dCtx.beginPath();
      dCtx.moveTo(ox, oy);
      dCtx.lineTo(ox + Math.cos(angle) * len, oy + Math.sin(angle) * len);
      dCtx.stroke();
    }
  };

  drawRays(840, 720, 36, 450); // Tycho rays covering entire southern hemisphere
  drawRays(920, 460, 24, 220); // Copernicus rays across Oceanus Procellarum

  return { diffuse: diffCanvas, bump: bumpCanvas };
}

export const ThreeMoonGlobe: React.FC<ThreeMoonGlobeProps> = ({
  events,
  stations,
  selectedEventId,
  selectedStationId,
  viewMode,
  onSelectEvent,
  onSelectStation,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // References to 3D components for animation & transitions
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const structureGroupRef = useRef<THREE.Group | null>(null);
  const shockwavesRef = useRef<THREE.Mesh[]>([]);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  // Smoothly rotate the globe to center on a target lat/lon
  const rotateToCoord = useCallback((lat: number, lon: number) => {
    const phi = (lat * Math.PI) / 180;
    const theta = (lon * Math.PI) / 180;
    targetRotationRef.current = {
      x: phi,
      y: -theta - Math.PI / 2,
    };
    setAutoRotate(false);
  }, []);

  // When selected event changes, smoothly fly camera to target
  useEffect(() => {
    if (selectedEventId) {
      const ev = events.find((e) => e.id === selectedEventId);
      if (ev) {
        rotateToCoord(ev.lat, ev.lon);
      }
    }
  }, [selectedEventId, events, rotateToCoord]);

  // When selected station changes, smoothly fly camera to target
  useEffect(() => {
    if (selectedStationId) {
      const sta = stations.find((s) => s.id === selectedStationId);
      if (sta) {
        rotateToCoord(sta.lat, sta.lon);
      }
    }
  }, [selectedStationId, stations, rotateToCoord]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020617, 0.005);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 4, 44);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting (Sunlight + Earthshine Backfill)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffdf5, 3.8);
    sunLight.position.set(65, 30, 45);
    scene.add(sunLight);

    // Cool Earthshine rim light
    const earthLight = new THREE.DirectionalLight(0x0284c7, 0.9);
    earthLight.position.set(-60, -25, -40);
    scene.add(earthLight);

    // 3. Moon Surface Globe Group
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);
    moonGroupRef.current = moonGroup;

    const moonRadius = 14;

    // Generate high-resolution procedural maps
    const { diffuse, bump } = generatePhotorealisticLunarMaps();
    const diffuseTex = new THREE.CanvasTexture(diffuse);
    diffuseTex.wrapS = THREE.ClampToEdgeWrapping;
    diffuseTex.wrapT = THREE.ClampToEdgeWrapping;

    const bumpTex = new THREE.CanvasTexture(bump);
    bumpTex.wrapS = THREE.ClampToEdgeWrapping;
    bumpTex.wrapT = THREE.ClampToEdgeWrapping;

    const moonGeo = new THREE.SphereGeometry(moonRadius, 64, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: diffuseTex,
      bumpMap: bumpTex,
      bumpScale: 0.55,
      roughness: 0.88,
      metalness: 0.04,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // Atmospheric Rayleigh/Fresnel Rim Glow
    const glowGeo = new THREE.SphereGeometry(moonRadius * 1.022, 48, 48);
    const glowMat = new THREE.ShaderMaterial({
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
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.05, 0.75, 1.0, 1.0) * intensity * 0.85;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    moonGroup.add(glowMesh);

    // 4. Structure View: 3D Concentric Layered Cutaway
    const structureGroup = new THREE.Group();
    structureGroup.visible = false;
    scene.add(structureGroup);
    structureGroupRef.current = structureGroup;

    // A. Outer Crust Shell (Cutaway 3/4 sphere)
    const crustGeo = new THREE.SphereGeometry(moonRadius, 48, 36, 0, Math.PI * 1.5);
    const crustMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const crustMesh = new THREE.Mesh(crustGeo, crustMat);
    structureGroup.add(crustMesh);

    // B. Rigid Mantle Layer (Lithosphere 60 - 1000 km)
    const mantleGeo = new THREE.SphereGeometry(moonRadius * 0.75, 40, 30, 0, Math.PI * 1.5);
    const mantleMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Deep blue
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const mantleMesh = new THREE.Mesh(mantleGeo, mantleMat);
    structureGroup.add(mantleMesh);

    // C. Asthenosphere / Partial Melt Layer (1000 - 1400 km)
    const meltGeo = new THREE.SphereGeometry(moonRadius * 0.45, 32, 24, 0, Math.PI * 1.5);
    const meltMat = new THREE.MeshStandardMaterial({
      color: 0xea580c, // Molten orange
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const meltMesh = new THREE.Mesh(meltGeo, meltMat);
    structureGroup.add(meltMesh);

    // D. Metallic Solid Iron Core (Center glowing sphere)
    const coreGeo = new THREE.SphereGeometry(moonRadius * 0.22, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15, // Golden glow
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    structureGroup.add(coreMesh);

    // Cutaway slice face planes
    const sliceMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const sliceGeo1 = new THREE.CircleGeometry(moonRadius, 32, 0, Math.PI);
    const sliceMesh1 = new THREE.Mesh(sliceGeo1, sliceMat);
    sliceMesh1.rotation.y = Math.PI / 2;
    structureGroup.add(sliceMesh1);

    // 5. Celestial Coordinate Grid Lines (Equator & Meridians)
    const gridGroup = new THREE.Group();
    moonGroup.add(gridGroup);

    // Equator Line
    const eqCurve = new THREE.EllipseCurve(0, 0, moonRadius * 1.004, moonRadius * 1.004, 0, Math.PI * 2, false, 0);
    const eqPoints = eqCurve.getPoints(120);
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)));
    const eqMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.35 });
    const eqLine = new THREE.Line(eqGeo, eqMat);
    gridGroup.add(eqLine);

    // Prime Meridian
    const pmGeo = new THREE.BufferGeometry().setFromPoints(eqPoints.map((p) => new THREE.Vector3(0, p.x, p.y)));
    const pmLine = new THREE.Line(pmGeo, eqMat);
    gridGroup.add(pmLine);

    // 6. Deep Space Starfield & Distant Earth
    const starCount = 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 350 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Star color temperatures (white, blue-white, golden amber)
      const colorType = Math.random();
      if (colorType > 0.8) {
        starColors[i * 3] = 0.6;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0; // Blue-white
      } else if (colorType > 0.6) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.6; // Amber
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0; // Crisp white
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Distant Earth in Lunar Sky (Famous Earthrise perspective!)
    const earthRadius = 4.2;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 32, 32);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(-160, 80, -180);
    scene.add(earthMesh);

    // Earth atmosphere halo
    const earthHaloGeo = new THREE.SphereGeometry(earthRadius * 1.15, 24, 24);
    const earthHaloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
    });
    const earthHalo = new THREE.Mesh(earthHaloGeo, earthHaloMat);
    earthMesh.add(earthHalo);

    // 7. Apollo Surface Stations (3D Holographic Towers & Ground Rings)
    const stationGroup = new THREE.Group();
    moonGroup.add(stationGroup);

    stations.forEach((sta) => {
      const pos = latLonToVector3(sta.lat, sta.lon, moonRadius);

      // Station Base Pad
      const padGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 12);
      const padMat = new THREE.MeshBasicMaterial({ color: sta.color });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.copy(pos);
      pad.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      stationGroup.add(pad);

      // Vertical Hologram Laser Line
      const normal = pos.clone().normalize();
      const lineEnd = pos.clone().add(normal.clone().multiplyScalar(2.2));
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, lineEnd]);
      const lineMat = new THREE.LineBasicMaterial({ color: sta.color, linewidth: 2 });
      const laser = new THREE.Line(lineGeo, lineMat);
      stationGroup.add(laser);

      // Top Beacon Crystal
      const beaconGeo = new THREE.OctahedronGeometry(0.3, 0);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(lineEnd);
      beacon.userData = { isStation: true, station: sta };
      stationGroup.add(beacon);
    });

    // 8. Moonquake Epicenters (3D Glowing Marker Pins & Shockwaves)
    const quakesGroup = new THREE.Group();
    moonGroup.add(quakesGroup);

    const shockwaves: THREE.Mesh[] = [];

    events.forEach((ev) => {
      const pos = latLonToVector3(ev.lat, ev.lon, moonRadius);
      const normal = pos.clone().normalize();

      const colorHex =
        ev.category === 'shallow'
          ? 0xef4444 // Red
          : ev.category === 'deep'
          ? 0xa855f7 // Purple
          : ev.category === 'artificial_impact'
          ? 0x06b6d4 // Cyan
          : 0xeab308; // Yellow

      // Epicenter 3D Marker Pin
      const pinGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.75,
        roughness: 0.2,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.4)));
      pin.userData = { isMoonquake: true, event: ev };
      quakesGroup.add(pin);

      // Stem connecting to surface
      const stemEnd = pos.clone().add(normal.clone().multiplyScalar(0.8));
      const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, stemEnd]);
      const stemMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2 });
      const stem = new THREE.Line(stemGeo, stemMat);
      quakesGroup.add(stem);

      // Concentric Expanding Seismic Wave Ring
      const ringGeo = new THREE.RingGeometry(0.3, 0.45, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.06)));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      ring.userData = { baseScale: 1, maxScale: 4.5 + ev.magnitude * 0.8, progress: Math.random() };
      quakesGroup.add(ring);
      shockwaves.push(ring);

      // If in structure view, also plot deep focal point inside mantle!
      if (ev.category === 'deep') {
        const deepPos = latLonToVector3(ev.lat, ev.lon, moonRadius * 0.55); // At 800km depth
        const deepPinGeo = new THREE.SphereGeometry(0.35, 12, 12);
        const deepPinMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
        const deepPin = new THREE.Mesh(deepPinGeo, deepPinMat);
        deepPin.position.copy(deepPos);
        structureGroup.add(deepPin);
      }
    });
    shockwavesRef.current = shockwaves;

    // 9. Interactive Raycasting & Mouse Orbit Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        moonGroup.rotation.y += deltaX * 0.005;
        moonGroup.rotation.x += deltaY * 0.005;

        structureGroup.rotation.y = moonGroup.rotation.y;
        structureGroup.rotation.x = moonGroup.rotation.x;

        prevMousePos = { x: e.clientX, y: e.clientY };
        targetRotationRef.current = null; // Clear auto-fly on user manual drag
      } else {
        // Hover Raycast Detection
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(quakesGroup.children, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.event) {
            setHoveredLabel(
              `${hit.userData.event.name} (M ${hit.userData.event.magnitude})`
            );
            container.style.cursor = 'pointer';
            return;
          }
        }

        const staIntersects = raycaster.intersectObjects(stationGroup.children, true);
        if (staIntersects.length > 0) {
          const hit = staIntersects[0].object;
          if (hit.userData && hit.userData.station) {
            setHoveredLabel(hit.userData.station.name);
            container.style.cursor = 'pointer';
            return;
          }
        }

        setHoveredLabel(null);
        container.style.cursor = 'grab';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      // Check if clicked an item
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(quakesGroup.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.event) {
          soundManager.playClick();
          onSelectEvent(hit.userData.event);
          return;
        }
      }

      const staIntersects = raycaster.intersectObjects(stationGroup.children, true);
      if (staIntersects.length > 0) {
        const hit = staIntersects[0].object;
        if (hit.userData && hit.userData.station) {
          soundManager.playClick();
          onSelectStation(hit.userData.station);
          return;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.min(75, Math.max(20, camera.position.z + e.deltaY * 0.03));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 10. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera/rotation tweening to target lat/lon
      if (targetRotationRef.current) {
        const target = targetRotationRef.current;
        moonGroup.rotation.y += (target.y - moonGroup.rotation.y) * 0.06;
        moonGroup.rotation.x += (target.x - moonGroup.rotation.x) * 0.06;
        structureGroup.rotation.y = moonGroup.rotation.y;
        structureGroup.rotation.x = moonGroup.rotation.x;
      } else if (autoRotate && !isDragging) {
        moonGroup.rotation.y += 0.0018;
        structureGroup.rotation.y = moonGroup.rotation.y;
      }

      // Animate shockwaves
      shockwaves.forEach((sw) => {
        sw.userData.progress = (sw.userData.progress + delta * 0.6) % 1.0;
        const p = sw.userData.progress;
        const currentScale = 1 + p * (sw.userData.maxScale - 1);
        sw.scale.set(currentScale, currentScale, 1);
        if (sw.material instanceof THREE.MeshBasicMaterial) {
          sw.material.opacity = Math.max(0, 0.85 * (1 - p));
        }
      });

      // Animate starfield subtle drift
      starField.rotation.y += 0.0001;

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
  }, [events, stations, autoRotate, onSelectEvent, onSelectStation]);

  // Synchronize ViewMode (Surface vs Structure Cutaway)
  useEffect(() => {
    if (moonGroupRef.current && structureGroupRef.current) {
      if (viewMode === 'structure') {
        moonGroupRef.current.visible = false;
        structureGroupRef.current.visible = true;
      } else {
        moonGroupRef.current.visible = true;
        structureGroupRef.current.visible = false;
      }
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hover Tooltip */}
      {hoveredLabel && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{hoveredLabel}</span>
        </div>
      )}

      {/* Surface vs Structure Indicator Watermark */}
      <div className="absolute top-6 right-6 pointer-events-none z-10 flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${viewMode === 'structure' ? 'bg-amber-400' : 'bg-cyan-400'} animate-pulse`}></span>
          {viewMode === 'structure' ? 'Interior Cutaway Mode (Crust & Mantle)' : 'Planetary Surface Mode'}
        </span>
      </div>

      {/* Quick View Controls Floating Pill */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
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
          title="Toggle Planetary Auto-Orbit"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>Orbit: {autoRotate ? 'ON' : 'OFF'}</span>
        </button>

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
          title="Toggle Lunar Equator & Meridian Grid"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
      </div>

      {/* Quick Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Shallow (M5+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Deep (~800km)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span>Apollo Impact</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span>Thermal</span>
        </div>
      </div>
    </div>
  );
};
export default ThreeMoonGlobe;
