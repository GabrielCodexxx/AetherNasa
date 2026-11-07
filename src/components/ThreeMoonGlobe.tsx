import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { MoonquakeEvent, ApolloStation } from '../types/moonquake';
import { RotateCw, Radio, Layers } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ThreeMoonGlobeProps {
  events: MoonquakeEvent[];
  stations: ApolloStation[];
  selectedEventId: string | null;
  selectedStationId: string | null;
  onSelectEvent: (event: MoonquakeEvent) => void;
  onSelectStation: (station: ApolloStation) => void;
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

export const ThreeMoonGlobe: React.FC<ThreeMoonGlobeProps> = ({
  events,
  stations,
  selectedEventId,
  selectedStationId,
  onSelectEvent,
  onSelectStation,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // References for camera targeting
  const controlsRef = useRef<{
    rotateTo: (lat: number, lon: number) => void;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.008);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(highContrast ? 0x64748b : 0x1e293b, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(50, 20, 30);
    scene.add(sunLight);

    // Backfill light for far side
    const backLight = new THREE.DirectionalLight(0x0284c7, 0.6);
    backLight.position.set(-50, -20, -30);
    scene.add(backLight);

    // 3. Moon Globe Group
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonRadius = 14;

    // Procedural Cratered Lunar Texture Generator
    const generateLunarCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return canvas;

      // Base lunar highlands (light gray)
      ctx.fillStyle = highContrast ? '#1e293b' : '#334155';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dark Lunar Maria Basalt Seas (Near side patches: Procellarum, Imbrium, Tranquillitatis)
      ctx.fillStyle = highContrast ? '#090d16' : '#1e2530';

      // Oceanus Procellarum / Imbrium
      ctx.beginPath();
      ctx.ellipse(320, 220, 180, 120, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Mare Tranquillitatis & Serenitatis
      ctx.beginPath();
      ctx.ellipse(450, 240, 90, 70, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Mare Crisium
      ctx.beginPath();
      ctx.ellipse(560, 210, 45, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Far side South Pole-Aitken Basin
      ctx.beginPath();
      ctx.ellipse(880, 380, 140, 80, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Bright Ray Craters (Tycho, Copernicus)
      ctx.fillStyle = '#cbd5e1';
      for (let i = 0; i < 60; i++) {
        const cx = (i * 137) % canvas.width;
        const cy = (i * 97) % canvas.height;
        const cr = (i % 5) + 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas;
    };

    const moonTexture = new THREE.CanvasTexture(generateLunarCanvas());
    const moonGeo = new THREE.SphereGeometry(moonRadius, 64, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // Subtle Atmospheric Lunar Scatter Rim Glow
    const glowGeo = new THREE.SphereGeometry(moonRadius * 1.018, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // Deep Space Starfield
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 350;
      starPositions[i + 1] = (Math.random() - 0.5) * 350;
      starPositions[i + 2] = (Math.random() - 0.5) * 350;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.65, transparent: true, opacity: 0.75 });
    scene.add(new THREE.Points(starGeo, starMat));

    // 4. Interactive Pins: Apollo Stations & Moonquakes
    const interactiveObjects: THREE.Object3D[] = [];

    // A. Apollo Seismic Stations
    stations.forEach((st) => {
      const pos = latLonToVector3(st.lat, st.lon, moonRadius * 1.02);

      // Station beacon pyramid
      const pinGeo = new THREE.ConeGeometry(0.35, 1.2, 5);
      pinGeo.rotateX(Math.PI / 2);
      const pinMat = new THREE.MeshStandardMaterial({
        color: st.color,
        emissive: st.color,
        emissiveIntensity: 0.8,
        metalness: 0.9,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.lookAt(pos.clone().multiplyScalar(2));
      pin.userData = { type: 'station', data: st };

      moonGroup.add(pin);
      interactiveObjects.push(pin);
    });

    // B. Moonquake Epicenter Markers
    const quakeMarkers: { mesh: THREE.Mesh; event: MoonquakeEvent; ring: THREE.Mesh }[] = [];

    events.forEach((ev) => {
      const pos = latLonToVector3(ev.lat, ev.lon, moonRadius * 1.015);

      const color =
        ev.category === 'shallow'
          ? 0xef4444 // Red
          : ev.category === 'deep'
          ? 0xa855f7 // Purple
          : ev.category === 'artificial_impact'
          ? 0x06b6d4 // Cyan
          : 0xeab308; // Yellow

      // Epicenter sphere
      const size = Math.max(0.3, (ev.magnitude / 5.5) * 0.7);
      const qGeo = new THREE.SphereGeometry(size, 16, 16);
      const qMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      });
      const qMesh = new THREE.Mesh(qGeo, qMat);
      qMesh.position.copy(pos);
      qMesh.userData = { type: 'quake', data: ev };

      // Seismic wave propagation ring
      const ringGeo = new THREE.RingGeometry(size * 1.2, size * 2.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));

      moonGroup.add(qMesh);
      moonGroup.add(ring);

      interactiveObjects.push(qMesh);
      quakeMarkers.push({ mesh: qMesh, event: ev, ring });
    });

    // 5. Raycasting for Click & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);

      if (intersects.length > 0) {
        const top = intersects[0].object;
        if (top.userData.type === 'quake') {
          const ev = top.userData.data as MoonquakeEvent;
          setHoveredLabel(`[M ${ev.magnitude}] ${ev.name} (${ev.category.toUpperCase()})`);
          container.style.cursor = 'pointer';
          return;
        } else if (top.userData.type === 'station') {
          const st = top.userData.data as ApolloStation;
          setHoveredLabel(`Apollo ${st.mission}: ${st.name}`);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredLabel(null);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);

      if (intersects.length > 0) {
        const top = intersects[0].object;
        if (top.userData.type === 'quake') {
          const ev = top.userData.data as MoonquakeEvent;
          soundManager.playClick();
          soundManager.sonifyMoonquake(ev.magnitude, ev.category);
          onSelectEvent(ev);
        } else if (top.userData.type === 'station') {
          const st = top.userData.data as ApolloStation;
          soundManager.playClick();
          onSelectStation(st);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // 6. Smooth Mouse Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      moonGroup.rotation.y += dx * 0.006;
      moonGroup.rotation.x += dy * 0.006;

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY * 0.03;
      camera.position.z = Math.max(22, Math.min(65, camera.position.z + zoom));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveDrag);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Method to rotate globe towards specific coordinate
    controlsRef.current = {
      rotateTo: (lat: number, lon: number) => {
        moonGroup.rotation.y = -((lon + 180) * (Math.PI / 180));
        moonGroup.rotation.x = (lat * (Math.PI / 180));
      },
    };

    // 7. Animation Loop
    let animId: number;
    let tick = 0;

    const animate = () => {
      tick += 1;

      // Animate seismic wave rings
      quakeMarkers.forEach(({ ring, event }) => {
        const isSelected = selectedEventId === event.id;
        const scale = 1 + (Math.sin(tick * 0.08 + event.magnitude) + 1) * (isSelected ? 1.4 : 0.4);
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = isSelected
          ? 0.8
          : 0.35 + Math.sin(tick * 0.05) * 0.2;
      });

      if (autoRotate && !isDragging) {
        moonGroup.rotation.y += 0.0018;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMoveDrag);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [events, stations, selectedEventId, selectedStationId, autoRotate, highContrast, onSelectEvent, onSelectStation]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border-2 border-slate-800 bg-[#02050f] shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">APOLLO PASSIVE SEISMIC EXPERIMENT:</span>
          <span className="text-white font-bold">INTERACTIVE 3D GLOBE</span>
        </div>

        {/* Hovered Tooltip */}
        {hoveredLabel && (
          <div className="bg-slate-900/90 text-cyan-300 border border-cyan-500/50 px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-lg shadow-cyan-950/60 pointer-events-none animate-fade-in">
            {hoveredLabel}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              autoRotate
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Globe Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Orbit: ON' : 'Orbit: OFF'}</span>
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-xl border text-xs transition-all ${
              highContrast
                ? 'bg-amber-950 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Topographic High-Contrast Basalt Shading"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Visual Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-300 pointer-events-none">
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 pointer-events-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500" /> Shallow Quake (Tectonic M5+)
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500" /> Deep Quake (Tidal ~700km)
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" /> Artificial Booster Impact
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400" /> Thermal Expansion
          </span>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hidden sm:block">
          🖱️ Drag to rotate &bull; 📜 Scroll to zoom &bull; 🎯 Click epicenters to inspect
        </div>
      </div>
    </div>
  );
};

export default ThreeMoonGlobe;
