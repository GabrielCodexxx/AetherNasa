import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { OutpostLocation, OutpostModule } from '../types/trainer';
import { RotateCw, Eye, Radio } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ThreeOutpostViewerProps {
  location: OutpostLocation;
  modules: OutpostModule[];
  selectedModuleId: string | null;
  onSelectModule: (id: string) => void;
}

export const ThreeOutpostViewer: React.FC<ThreeOutpostViewerProps> = ({
  location,
  modules,
  selectedModuleId,
  onSelectModule,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(location === 'lunar' ? 0x030712 : 0x1a0705, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 22, 38);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(location === 'lunar' ? 0x223344 : 0x442211, 0.9);
    scene.add(ambientLight);

    // Distant Sun Light
    const sunLight = new THREE.DirectionalLight(location === 'lunar' ? 0xffffff : 0xffccaa, 2.8);
    sunLight.position.set(30, 25, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Core Habitat Glow
    const habGlow = new THREE.PointLight(0x06b6d4, 3, 25);
    habGlow.position.set(0, 4, 0);
    scene.add(habGlow);

    // 3. Planetary Ground Mesh (Crater Rim / Regolith)
    const groundGeo = new THREE.PlaneGeometry(80, 80, 48, 48);
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      // Generate subtle crater ripples
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      const elevation = Math.sin(vx * 0.2) * Math.cos(vy * 0.2) * 1.2 + Math.sin(distFromCenter * 0.3) * 0.8;
      posAttr.setZ(i, elevation);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: location === 'lunar' ? 0x242d3d : 0x7c2d12,
      roughness: 0.95,
      metalness: 0.1,
      wireframe: wireframe,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Background Starfield
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 300;
      starPositions[i + 1] = Math.random() * 150 + 10;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. 3D Outpost Modules Group
    const modulesGroup = new THREE.Group();
    scene.add(modulesGroup);

    const interactiveObjects: THREE.Object3D[] = [];

    // Helper to add interactive metadata to meshes
    const registerModuleMesh = (mesh: THREE.Object3D, id: string, name: string) => {
      mesh.userData = { moduleId: id, moduleName: name };
      interactiveObjects.push(mesh);
    };

    // A. Central Habitation Geodesic Dome (mod-hab)
    const habGeo = new THREE.SphereGeometry(4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const habMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.4,
      roughness: 0.3,
      wireframe: wireframe,
    });
    const habMesh = new THREE.Mesh(habGeo, habMat);
    habMesh.position.set(0, 0, 0);
    habMesh.castShadow = true;
    habMesh.receiveShadow = true;
    registerModuleMesh(habMesh, 'mod-hab', 'Commander Core Habitation Module');
    modulesGroup.add(habMesh);

    // B. Sabatier ECLSS Processor Tower (mod-sabatier)
    const sabatierGeo = new THREE.CylinderGeometry(1.2, 1.4, 6, 16);
    const sabatierMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: wireframe,
    });
    const sabatierMesh = new THREE.Mesh(sabatierGeo, sabatierMat);
    sabatierMesh.position.set(-8, 3, 2);
    sabatierMesh.castShadow = true;
    registerModuleMesh(sabatierMesh, 'mod-sabatier', 'Sabatier ECLSS Reactor');
    modulesGroup.add(sabatierMesh);

    // C. Solar Tracking Wings (mod-solar)
    const solarGroup = new THREE.Group();
    solarGroup.position.set(10, 0, -6);
    const mastGeo = new THREE.CylinderGeometry(0.3, 0.4, 8, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const mastMesh = new THREE.Mesh(mastGeo, mastMat);
    mastMesh.position.y = 4;
    solarGroup.add(mastMesh);

    const panelGeo = new THREE.BoxGeometry(7, 0.1, 2.5);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: wireframe,
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    panelMesh.position.y = 7.5;
    panelMesh.rotation.x = Math.PI / 6;
    panelMesh.castShadow = true;
    solarGroup.add(panelMesh);
    registerModuleMesh(panelMesh, 'mod-solar', 'Deployable Solar Tracking Array');
    modulesGroup.add(solarGroup);

    // D. Kilopower Nuclear Reactor (mod-kilopower)
    const kiloGeo = new THREE.ConeGeometry(2, 5, 8);
    const kiloMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: wireframe,
    });
    const kiloMesh = new THREE.Mesh(kiloGeo, kiloMat);
    kiloMesh.position.set(-6, 2.5, -9);
    kiloMesh.castShadow = true;
    registerModuleMesh(kiloMesh, 'mod-kilopower', 'Kilopower Fission Reactor');
    modulesGroup.add(kiloMesh);

    // E. Hydroponic Greenhouse Dome (mod-hydroponic)
    const hydroGeo = new THREE.SphereGeometry(3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const hydroMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.85,
      wireframe: wireframe,
    });
    const hydroMesh = new THREE.Mesh(hydroGeo, hydroMat);
    hydroMesh.position.set(7, 0, 7);
    hydroMesh.castShadow = true;
    registerModuleMesh(hydroMesh, 'mod-hydroponic', 'Advanced Plant Habitat');
    modulesGroup.add(hydroMesh);

    // F. Sintered Regolith Radiation Arch (mod-shield)
    const shieldGeo = new THREE.TorusGeometry(5, 1.2, 12, 24, Math.PI);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: location === 'lunar' ? 0x64748b : 0x991b1b,
      roughness: 0.9,
      metalness: 0.2,
      wireframe: wireframe,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(0, 0, -2);
    shieldMesh.rotation.z = Math.PI;
    shieldMesh.castShadow = true;
    registerModuleMesh(shieldMesh, 'mod-shield', 'Sintered Regolith Radiation Vault');
    modulesGroup.add(shieldMesh);

    // 6. Interactive Raycasting & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      if (intersects.length > 0) {
        const top = intersects[0].object;
        let root = top;
        while (root.parent && root.parent !== modulesGroup && !root.userData.moduleId) {
          root = root.parent;
        }
        if (root.userData.moduleName) {
          setHoveredName(root.userData.moduleName);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredName(null);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== modulesGroup && !root.userData.moduleId) {
          root = root.parent;
        }
        if (root.userData.moduleId) {
          soundManager.playBeep(980, 0.08);
          onSelectModule(root.userData.moduleId);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 7. Mouse Orbit Controls Logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modulesGroup.rotation.y += deltaX * 0.008;
      ground.rotation.z -= deltaX * 0.008;

      camera.position.y = Math.max(8, Math.min(45, camera.position.y - deltaY * 0.08));
      camera.lookAt(0, 2, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY * 0.02;
      const newDist = camera.position.length() + zoom;
      if (newDist > 18 && newDist < 65) {
        camera.position.multiplyScalar(newDist / camera.position.length());
        camera.lookAt(0, 2, 0);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveDrag);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 8. Animation Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Subtle atmospheric / solar wing rotation
      panelMesh.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
      starField.rotation.y = elapsedTime * 0.005;

      // Pulse active energy glow
      habGlow.intensity = 2.5 + Math.sin(elapsedTime * 3) * 0.6;

      // Status visual indicators: highlight damaged/offline modules
      modules.forEach((mod) => {
        if (mod.id === 'mod-hab') {
          (habMesh.material as THREE.MeshStandardMaterial).emissive =
            selectedModuleId === mod.id
              ? new THREE.Color(0x06b6d4)
              : mod.status === 'damaged'
              ? new THREE.Color(0xef4444)
              : new THREE.Color(0x000000);
          (habMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = mod.status === 'damaged' ? 0.8 : 0.3;
        }
      });

      if (autoRotate && !isDragging) {
        modulesGroup.rotation.y += 0.0025;
        ground.rotation.z -= 0.0025;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, [location, autoRotate, wireframe, selectedModuleId, modules, onSelectModule]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay HUD Bar */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">3D TELEMETRY SENSOR FEED:</span>
          <span className="text-white font-bold uppercase">{location} OUTPOST GRID</span>
        </div>

        {/* Hovered Module Pill */}
        {hoveredName && (
          <div className="bg-cyan-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/50 text-xs font-mono text-cyan-200 animate-fade-in shadow-lg shadow-cyan-950/60 pointer-events-none">
            Target: <span className="font-bold text-white">{hoveredName}</span> (Click to inspect)
          </div>
        )}

        {/* Controls Overlay */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              autoRotate
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Orbital Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Orbit: ON' : 'Orbit: OFF'}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              wireframe
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Hint Overlay */}
      <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[11px] font-mono text-slate-400 pointer-events-none bg-slate-950/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800/60">
        <span>🖱️ Drag to Orbit</span>
        <span>&bull;</span>
        <span>📜 Scroll to Zoom</span>
        <span>&bull;</span>
        <span>🎯 Click 3D Modules to Inspect</span>
      </div>
    </div>
  );
};

export default ThreeOutpostViewer;
