import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { PlanetData, HotspotMarker, SystemViewMode } from '../types/earthSystem';
import { SOLAR_PLANETS, EARTH_HOTSPOTS } from '../utils/earthSystemData';
import { soundManager } from '../utils/soundEffects';
import { RotateCw, Grid, Globe, ZoomIn, ZoomOut } from 'lucide-react';

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

// Procedural Photorealistic Planet Texture Generators (Canvas-Based)
function generateMercuryCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 1024, 512);

  // Basalt craters and scarps
  for (let i = 0; i < 280; i++) {
    const x = (i * 173) % 1024;
    const y = (i * 97) % 512;
    const r = (i % 9) + 2;

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI);
    ctx.stroke();
  }

  // Caloris Basin
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(420, 260, 65, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function generateVenusCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth sulfuric acid clouds in yellow-cream tones
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.2, '#fde047');
  grad.addColorStop(0.5, '#eab308');
  grad.addColorStop(0.8, '#facc15');
  grad.addColorStop(1, '#fef08a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Atmospheric swirl streaks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 12;
  for (let i = 0; i < 24; i++) {
    const y = i * 22;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(340, y + 25, 680, y - 25, 1024, y);
    ctx.stroke();
  }

  return canvas;
}

function generateMarsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Red iron oxide rust base
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(0, 0, 1024, 512);

  // Dark volcanic basalt patches (Syrtis Major, Valles Marineris)
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.ellipse(450, 260, 140, 75, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(750, 310, 200, 45, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Bright polar ice caps (Carbon dioxide & water ice)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 32);
  ctx.fillRect(0, 480, 1024, 32);

  return canvas;
}

function generateJupiterCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Alternating gas belts and zones (cream, tan, reddish-brown, white)
  const bandColors = [
    '#78350f', '#d97706', '#fef3c7', '#92400e', '#fed7aa',
    '#b45309', '#fef3c7', '#7c2d12', '#ea580c', '#fef3c7',
    '#9a3412', '#fdba74', '#78350f',
  ];

  const bandH = 512 / bandColors.length;
  bandColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandH, 1024, bandH + 2);

    // Turbulent cloud boundary waviness
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, i * bandH);
    for (let x = 0; x < 1024; x += 30) {
      ctx.lineTo(x, i * bandH + Math.sin(x * 0.05 + i) * 6);
    }
    ctx.stroke();
  });

  // The Great Red Spot (Centuries-old anticyclonic storm)
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.ellipse(620, 340, 42, 26, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  return canvas;
}

function generateSaturnCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Golden cream atmospheric bands
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.3, '#fde047');
  grad.addColorStop(0.5, '#eab308');
  grad.addColorStop(0.7, '#fde047');
  grad.addColorStop(1, '#fef08a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.strokeStyle = 'rgba(161, 98, 7, 0.35)';
  ctx.lineWidth = 8;
  for (let y = 30; y < 512; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  return canvas;
}

function generateSaturnRingCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Concentric ring texture with Cassini Division gap
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, 'rgba(254, 240, 138, 0)');
  grad.addColorStop(0.15, 'rgba(254, 240, 138, 0.85)'); // C Ring
  grad.addColorStop(0.45, 'rgba(250, 204, 21, 0.95)');  // B Ring
  grad.addColorStop(0.58, 'rgba(10, 10, 15, 0.05)');    // Cassini Division Gap!
  grad.addColorStop(0.68, 'rgba(253, 224, 71, 0.88)');  // A Ring
  grad.addColorStop(0.92, 'rgba(254, 240, 138, 0.55)'); // F Ring
  grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  return canvas;
}

function generateUranusCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#7dd3fc');
  grad.addColorStop(0.5, '#38bdf8');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  return canvas;
}

function generateNeptuneCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#1d4ed8');
  grad.addColorStop(0.4, '#2563eb');
  grad.addColorStop(0.8, '#1e40af');
  grad.addColorStop(1, '#172554');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // White methane cirrus storms
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 140);
  ctx.lineTo(240, 145);
  ctx.stroke();

  // Great Dark Spot
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(320, 110, 28, 16, -0.1, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
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

  // 1. Deep Ocean Base
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

  // South America & Amazon
  drawContinent(680, 640, 160, 240, 0.25, '#166534');

  // Eurasia
  drawContinent(1200, 320, 360, 180, 0.05);
  drawContinent(1480, 340, 260, 160, -0.1);

  // Africa & Sahara
  drawContinent(1080, 520, 180, 220, 0.1, '#ca8a04');
  drawContinent(1100, 640, 140, 160, 0.0, '#15803d');

  // Australia
  drawContinent(1620, 680, 130, 90, 0.15, '#b45309');

  // Polar Ice Caps
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

  // Greenland
  drawContinent(820, 190, 90, 110, -0.15, '#f8fafc');

  return { diffuse: dCanvas, bump: bCanvas };
}

// Procedural Clouds
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

  // Spherical Orbit & Camera Controller
  const orbitStateRef = useRef({
    target: new THREE.Vector3(0, 0, 0),
    radius: 180,
    theta: 0.2,
    phi: Math.PI / 3.4,
    isTransitioning: false,
    targetRadius: 180,
    targetTheta: 0.2,
    targetPhi: Math.PI / 3.4,
    targetLookAt: new THREE.Vector3(0, 0, 0),
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetsGroupRef = useRef<THREE.Group | null>(null);
  const planetMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const structureGroupRef = useRef<THREE.Group | null>(null);
  const buildStructureRef = useRef<((planet: PlanetData) => void) | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);

  // Projected 3D Callout Badges for Structure Cutaway (matching User's Image 3)
  interface StructureCallout {
    name: string;
    subtitle: string;
    composition: string;
    color: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }
  const [structureCallouts, setStructureCallouts] = useState<StructureCallout[]>([]);

  // Smooth fly-to targeting
  const triggerFlyTo = useCallback(
    (targetPos: THREE.Vector3, distance: number, elevation: number = Math.PI / 3.4) => {
      orbitStateRef.current.targetLookAt.copy(targetPos);
      orbitStateRef.current.targetRadius = distance;
      orbitStateRef.current.targetPhi = elevation;
      orbitStateRef.current.isTransitioning = true;
    },
    []
  );

  // React to ViewMode changes or selectedPlanetId changes
  useEffect(() => {
    const selectedObj = planetMeshesRef.current.get(selectedPlanetId);
    const targetPos = selectedObj ? selectedObj.position.clone() : new THREE.Vector3(0, 0, 0);
    const planetData = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[0];

    if (viewMode === 'solar_system') {
      triggerFlyTo(new THREE.Vector3(0, 0, 0), 180, Math.PI / 3.2);
    } else if (viewMode === 'planet_focus' || viewMode === 'earth_focus') {
      triggerFlyTo(targetPos, planetData.radius * 3.4 + 4, Math.PI / 2.5);
    } else if (viewMode === 'structure') {
      triggerFlyTo(targetPos, planetData.radius * 3.8 + 5, Math.PI / 2.3);
    } else if (viewMode === 'night_sky') {
      triggerFlyTo(targetPos, planetData.radius * 1.5, Math.PI * 0.15); // Look up into deep space!
    }
  }, [viewMode, selectedPlanetId, triggerFlyTo]);

  // Zoom controls (+ and -)
  const handleZoom = (factor: number) => {
    soundManager.playClick();
    orbitStateRef.current.isTransitioning = false;
    const minR = viewMode === 'solar_system' ? 25 : 5;
    const maxR = viewMode === 'solar_system' ? 420 : 60;
    const newR = orbitStateRef.current.radius * factor;
    orbitStateRef.current.radius = Math.min(maxR, Math.max(minR, newR));
    orbitStateRef.current.targetRadius = orbitStateRef.current.radius;
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer (Glassmorphic Eco-Tracker Light Palette)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.0009);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      3500
    );
    camera.position.set(0, 75, 175);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Starfield & Milky Way
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 550 + Math.random() * 850;
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
    const mwCount = 2000;
    const mwGeo = new THREE.BufferGeometry();
    const mwPositions = new Float32Array(mwCount * 3);
    const mwColors = new Float32Array(mwCount * 3);

    for (let i = 0; i < mwCount; i++) {
      const angle = (i / mwCount) * Math.PI * 2;
      const radius = 680 + (Math.random() - 0.5) * 140;
      const y = (Math.random() - 0.5) * 95;
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
      size: 4.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const milkyWay = new THREE.Points(mwGeo, mwMat);
    scene.add(milkyWay);

    // Dedicated array of pickable meshes (15 objects instead of 10,000 for instant 60 FPS raycasting)
    const pickableTargets: THREE.Object3D[] = [];

    // 3. Central Sun with Radiant Corona
    const sunData = SOLAR_PLANETS[0];
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { isPlanet: true, data: sunData };
    scene.add(sunMesh);
    planetMeshesRef.current.set(sunData.id, sunMesh);
    pickableTargets.push(sunMesh);

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

    const sunLight = new THREE.PointLight(0xfff8eb, 4.5, 700, 0.5);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    // 4. Ecliptic Coordinate Grid (Deep Ocean Blue & Soft Slate)
    const gridHelper = new THREE.PolarGridHelper(160, 16, 8, 64, 0x0369a1, 0xcbd5e1);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // 5. Planets Group
    const planetsGroup = new THREE.Group();
    scene.add(planetsGroup);
    planetsGroupRef.current = planetsGroup;

    const animatedPlanets: {
      mesh: THREE.Group;
      data: PlanetData;
      angle: number;
    }[] = [];

    // Helper map of procedural textures
    const textureMap: Record<string, HTMLCanvasElement> = {
      mercury: generateMercuryCanvas(),
      venus: generateVenusCanvas(),
      mars: generateMarsCanvas(),
      jupiter: generateJupiterCanvas(),
      saturn: generateSaturnCanvas(),
      uranus: generateUranusCanvas(),
      neptune: generateNeptuneCanvas(),
    };

    SOLAR_PLANETS.slice(1).forEach((planet) => {
      // Orbital ellipse path line
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
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Planet container with realistic NON-ALIGNED starting angle!
      const pGroup = new THREE.Group();
      const initAngle = planet.initialAngle || 0;
      pGroup.position.set(
        Math.cos(initAngle) * planet.orbitDistance,
        0,
        Math.sin(initAngle) * planet.orbitDistance
      );
      planetsGroup.add(pGroup);
      planetMeshesRef.current.set(planet.id, pGroup);

      if (planet.id === 'earth') {
        // Detailed Photorealistic Earth
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
        pickableTargets.push(earthMesh);

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

        // Earth's Moon
        const moonGeo = new THREE.SphereGeometry(0.65, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(5.2, 1.2, 0);
        pGroup.add(moonMesh);

        // Hotspot Telemetry Needles on Earth (Clean Architectural Beacons - NO DOTS)
        EARTH_HOTSPOTS.forEach((hs) => {
          const pos = latLonToVector3(hs.lat, hs.lon, planet.radius);
          const norm = pos.clone().normalize();

          const color =
            hs.domain === 'cryosphere'
              ? 0x0284c7
              : hs.domain === 'biosphere'
              ? 0x15803d
              : hs.domain === 'hydrosphere'
              ? 0x0369a1
              : 0xdc2626;

          const isSelected = selectedHotspotId === hs.id;
          // Sleek 3D telemetry station needle (architectural, not a dot)
          const needleGeo = new THREE.CylinderGeometry(0.02, 0.08, isSelected ? 0.65 : 0.45, 8);
          const needleMat = new THREE.MeshStandardMaterial({
            color: isSelected ? 0x0369a1 : color,
            roughness: 0.25,
            metalness: 0.4,
          });
          const needle = new THREE.Mesh(needleGeo, needleMat);
          needle.position.copy(pos.clone().add(norm.clone().multiplyScalar(0.22)));
          needle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
          needle.userData = { isHotspot: true, data: hs };
          pGroup.add(needle);
          pickableTargets.push(needle);
        });
      } else {
        // Other Planets with Real Procedural Textures
        const tex = textureMap[planet.id];
        const pGeo = new THREE.SphereGeometry(planet.radius, 40, 32);
        const pMat = new THREE.MeshStandardMaterial({
          map: tex ? new THREE.CanvasTexture(tex) : undefined,
          color: tex ? 0xffffff : planet.color,
          roughness: 0.75,
          metalness: 0.05,
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.userData = { isPlanet: true, data: planet };
        pGroup.add(pMesh);
        pickableTargets.push(pMesh);

        // Saturn Rings with Transparent Cassini Division
        if (planet.hasRings && planet.ringInnerRadius && planet.ringOuterRadius) {
          const ringCanvas = generateSaturnRingCanvas();
          const ringTex = new THREE.CanvasTexture(ringCanvas);
          ringTex.rotation = Math.PI / 2;

          const rGeo = new THREE.RingGeometry(planet.ringInnerRadius, planet.ringOuterRadius, 64);
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

      animatedPlanets.push({
        mesh: pGroup,
        data: planet,
        angle: initAngle,
      });
    });

    // 6. 3D Asteroid Belt (Toroidal Cloud between Mars and Jupiter)
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

    // 7. Dynamic 3D Structure Cutaway (Builds solid cross-section layers - matching Image 3)
    const structureGroup = new THREE.Group();
    structureGroup.visible = false;
    scene.add(structureGroup);
    structureGroupRef.current = structureGroup;

    // Helper to rebuild cutaway layers whenever selected planet or viewMode changes
    const buildStructureLayers = (targetPlanet: PlanetData) => {
      structureGroup.clear();
      const r = targetPlanet.radius;
      const layers = targetPlanet.layers;

      // 1. Outer 3/4 sphere shell (planet map surface)
      let outerTex: THREE.Texture | undefined;
      if (targetPlanet.id === 'earth') {
        const { diffuse } = generateEarthTexture(0.5);
        outerTex = new THREE.CanvasTexture(diffuse);
      } else if (textureMap[targetPlanet.id]) {
        outerTex = new THREE.CanvasTexture(textureMap[targetPlanet.id]);
      }

      const outerGeo = new THREE.SphereGeometry(r, 48, 36, 0, Math.PI * 1.5);
      const outerMat = new THREE.MeshStandardMaterial({
        map: outerTex,
        color: outerTex ? 0xffffff : targetPlanet.color,
        roughness: 0.65,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      structureGroup.add(outerMesh);

      // 2. Stepped concentric inner shells (Mantle, Outer Core, Inner Core)
      for (let i = 1; i < layers.length; i++) {
        const layer = layers[i];
        const shellR = Math.max(0.2, r * layer.thicknessRadius);
        const shellGeo = new THREE.SphereGeometry(shellR, 36, 24, 0, Math.PI * 1.5);
        const isCore = i === layers.length - 1;
        const isOuterCore = i === layers.length - 2;

        const shellMat = new THREE.MeshStandardMaterial({
          color: layer.color,
          emissive: isCore ? 0xffaa00 : isOuterCore ? 0xff4400 : 0x000000,
          emissiveIntensity: isCore ? 0.75 : isOuterCore ? 0.35 : 0,
          roughness: isCore ? 0.2 : 0.65,
          side: THREE.DoubleSide,
        });
        const shellMesh = new THREE.Mesh(shellGeo, shellMat);
        structureGroup.add(shellMesh);
      }

      // 3. Flat Cut Faces (Wedge Caps) on Face 1 (phi = 0) and Face 2 (phi = 1.5 * PI)
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const rOuter = r * layer.thicknessRadius;
        const rInner = i < layers.length - 1 ? r * layers[i + 1].thicknessRadius : 0;
        const isCore = i === layers.length - 1;
        const isOuterCore = i === layers.length - 2;

        const capMat = new THREE.MeshStandardMaterial({
          color: layer.color,
          emissive: isCore ? 0xffaa00 : isOuterCore ? 0xff4400 : 0x000000,
          emissiveIntensity: isCore ? 0.75 : isOuterCore ? 0.35 : 0,
          roughness: isCore ? 0.2 : 0.75,
          side: THREE.DoubleSide,
        });

        // Face 1: In XY plane, theta from -PI/2 to +PI/2 (South pole to North pole, x >= 0)
        const geo1 =
          rInner === 0
            ? new THREE.CircleGeometry(rOuter, 36, -Math.PI / 2, Math.PI)
            : new THREE.RingGeometry(rInner, rOuter, 36, 1, -Math.PI / 2, Math.PI);
        const cap1 = new THREE.Mesh(geo1, capMat);
        structureGroup.add(cap1);

        // Face 2: In ZY plane (rotated by -PI/2 around Y, z <= 0)
        const geo2 =
          rInner === 0
            ? new THREE.CircleGeometry(rOuter, 36, -Math.PI / 2, Math.PI)
            : new THREE.RingGeometry(rInner, rOuter, 36, 1, -Math.PI / 2, Math.PI);
        const cap2 = new THREE.Mesh(geo2, capMat);
        cap2.rotation.y = -Math.PI / 2;
        structureGroup.add(cap2);
      }

      // 4. Radiant Core Light
      const coreLight = new THREE.PointLight(0xffaa00, 3.2, r * 5);
      structureGroup.add(coreLight);

      // Angled tilt so the cutaway wedge faces the user
      structureGroup.rotation.y = 0.4;
      structureGroup.rotation.x = 0.12;
    };

    buildStructureRef.current = buildStructureLayers;

    const currentPlanet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[3];
    buildStructureLayers(currentPlanet);

    // 8. User Mouse Orbit & Drag Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    let lastRaycastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        orbitStateRef.current.isTransitioning = false;

        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;

        orbitStateRef.current.theta -= dx * 0.005;
        orbitStateRef.current.phi = Math.min(
          Math.PI * 0.48,
          Math.max(0.08, orbitStateRef.current.phi - dy * 0.005)
        );

        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        const now = performance.now();
        if (now - lastRaycastTime > 45) {
          lastRaycastTime = now;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(pickableTargets, false);
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
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pickableTargets, false);
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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitStateRef.current.isTransitioning = false;

      const zoomSpeed = orbitStateRef.current.radius * 0.0016;
      const minR = viewMode === 'solar_system' ? 25 : 5;
      const maxR = viewMode === 'solar_system' ? 420 : 60;
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
    let lastCalloutUpdate = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const st = orbitStateRef.current;
      if (st.isTransitioning) {
        st.radius += (st.targetRadius - st.radius) * 0.06;
        st.phi += (st.targetPhi - st.phi) * 0.06;
        st.target.lerp(st.targetLookAt, 0.06);

        if (Math.abs(st.radius - st.targetRadius) < 0.25 && st.target.distanceTo(st.targetLookAt) < 0.2) {
          st.isTransitioning = false;
        }
      } else if (autoRotate && !isDragging) {
        st.theta += 0.001;
      }

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

      // Rotate Starfield subtly
      stars.rotation.y += 0.0001;

      // Calculate 3D Callout Positions for Structure Cutaway (throttled to 80ms - zero UI stutter)
      if (viewMode === 'structure' && structureGroupRef.current && container) {
        const now = performance.now();
        if (now - lastCalloutUpdate > 80) {
          lastCalloutUpdate = now;
          const curPlanet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[3];
          const pr = curPlanet.radius;
          const cw = container.clientWidth;
          const ch = container.clientHeight;
          const callouts: StructureCallout[] = [];

          curPlanet.layers.forEach((layer, idx) => {
            const rOuter = pr * layer.thicknessRadius;
            const rInner =
              idx < curPlanet.layers.length - 1
                ? pr * curPlanet.layers[idx + 1].thicknessRadius
                : 0;
            const rMid = (rOuter + rInner) / 2;

            const ptLocal = new THREE.Vector3(rMid * 0.92, rMid * 0.22, 0.04);
            const ptWorld = ptLocal.applyMatrix4(structureGroupRef.current!.matrixWorld);
            ptWorld.project(camera);

            if (ptWorld.z < 1) {
              const startX = (ptWorld.x * 0.5 + 0.5) * cw;
              const startY = (-ptWorld.y * 0.5 + 0.5) * ch;

              // Anchor to the right of cutaway
              const endX = Math.min(cw - 240, Math.max(startX + 90, cw * 0.62));
              const endY = Math.max(100, Math.min(ch - 140, startY + (idx - 1.5) * 44));

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
          setStructureCallouts(callouts);
        }
      }

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
  }, [onSelectPlanet, onSelectHotspot, currentYear, viewMode, autoRotate, selectedHotspotId, selectedPlanetId]);

  // Sync Structure Mode with Selected Planet position and rebuild layers
  useEffect(() => {
    if (structureGroupRef.current) {
      if (viewMode === 'structure') {
        const selectedObj = planetMeshesRef.current.get(selectedPlanetId);
        const targetPlanet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[3];
        if (buildStructureRef.current) {
          buildStructureRef.current(targetPlanet);
        }
        if (selectedObj) {
          structureGroupRef.current.position.copy(selectedObj.position);
          structureGroupRef.current.visible = true;
          selectedObj.visible = false;
        }
      } else {
        structureGroupRef.current.visible = false;
        planetMeshesRef.current.forEach((mesh) => {
          mesh.visible = true;
        });
        setStructureCallouts([]);
      }
    }
  }, [viewMode, selectedPlanetId]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Structure Cutaway Callout Annotations Overlay (Precision Eco-Tracker - NO DOTS) */}
      {viewMode === 'structure' && structureCallouts.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <svg className="w-full h-full">
            {structureCallouts.map((c, i) => (
              <g key={i}>
                {/* 3D Surface Anchor Diamond (Precision Geometric Marker - NO DOTS) */}
                <rect
                  x={c.startX - 3.5}
                  y={c.startY - 3.5}
                  width={7}
                  height={7}
                  fill={c.color}
                  transform={`rotate(45 ${c.startX} ${c.startY})`}
                />

                {/* Angled Leader Line */}
                <polyline
                  points={`${c.startX},${c.startY} ${c.startX + 28},${c.endY} ${c.endX},${c.endY}`}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={1.6}
                  strokeDasharray="4,2"
                  opacity={0.85}
                />
                <rect
                  x={c.endX - 2}
                  y={c.endY - 2}
                  width={4}
                  height={4}
                  fill={c.color}
                />
              </g>
            ))}
          </svg>

          {/* Callout Cards (Precision Glassmorphic Light Mode) */}
          {structureCallouts.map((c, i) => (
            <div
              key={i}
              className="absolute pointer-events-none font-sans transition-transform duration-75 select-none"
              style={{
                left: `${c.endX + 10}px`,
                top: `${c.endY - 26}px`,
              }}
            >
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-lg shadow-slate-200/60 max-w-[240px]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-3.5 rounded-xs shrink-0"
                    style={{ backgroundColor: c.color }}
                  ></span>
                  <span className="text-xs font-black tracking-tight text-slate-900 uppercase truncate">
                    {c.name}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0369A1] mt-0.5">
                  {c.subtitle}
                </div>
                <div className="text-[9px] text-slate-500 truncate">
                  {c.composition}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating 3D Hover Tooltip (Clean Static Card) */}
      {hoveredLabel && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-200/50 text-xs font-bold text-slate-900 flex items-center gap-2 animate-fade-in font-sans">
          <Globe className="w-3.5 h-3.5 text-[#0369A1]" />
          <span>{hoveredLabel}</span>
        </div>
      )}

      {/* Manual Zoom & Navigation Dock (Glassmorphic Light Mode) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-200/50 font-sans">
        <button
          onClick={() => handleZoom(0.8)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(1.25)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setAutoRotate(!autoRotate);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            autoRotate
              ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900'
          }`}
          title="Toggle Planetary Orbit Animation"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Orbit: {autoRotate ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowGrid(!showGrid);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            showGrid
              ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900'
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
