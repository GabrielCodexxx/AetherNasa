import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe } from 'lucide-react';
import type {
  HotspotMarker,
  NasaSatelliteMission,
  PlanetData,
  SystemViewMode,
} from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';
import { updateHotspotBeaconSelection } from './space/earthOverlays';
import { clampAndSetOrbitRadius } from './space/orbitInputController';
import { mountSpaceScene } from './space/spaceSceneController';
import { StructureCalloutsOverlay } from './space/StructureCalloutsOverlay';
import { syncViewModeAndStructure } from './space/viewModeSync';
import type {
  OrbitControllerState,
  SpaceLiveState,
  SpaceSceneHandles,
  StructureCalloutState,
} from './space/types';

export interface ThreeSpaceSystemProps {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  selectedHotspotId: string | null;
  currentYear: number;
  onSelectPlanet: (planet: PlanetData) => void;
  onSelectHotspot: (hotspot: HotspotMarker) => void;
  onSelectSatellite?: (satellite: NasaSatelliteMission) => void;
  autoRotate?: boolean;
  showGrid?: boolean;
  showDivergenceLens?: boolean;
  zoomInRef?: React.MutableRefObject<(() => void) | null>;
  zoomOutRef?: React.MutableRefObject<(() => void) | null>;
}

export const ThreeSpaceSystem: React.FC<ThreeSpaceSystemProps> = ({
  viewMode,
  selectedPlanetId,
  selectedHotspotId,
  currentYear: _currentYear,
  onSelectPlanet,
  onSelectHotspot,
  onSelectSatellite,
  autoRotate = true,
  showGrid = true,
  showDivergenceLens = false,
  zoomInRef,
  zoomOutRef,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [calloutState, setCalloutState] = useState<StructureCalloutState>({
    planetId: '',
    items: [],
  });

  const orbitStateRef = useRef<OrbitControllerState>({
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

  const liveRef = useRef<SpaceLiveState>({
    viewMode,
    selectedPlanetId,
    selectedHotspotId,
    autoRotate,
    showGrid,
    showDivergenceLens,
    callbacks: { onSelectPlanet, onSelectHotspot, onSelectSatellite },
    isDragging: false,
    lastCalloutUpdate: 0,
    calloutActive: false,
  });

  const handlesRef = useRef<SpaceSceneHandles | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    return mountSpaceScene({
      container,
      orbitStateRef,
      liveRef,
      handlesRef,
      setHoveredLabel,
      setCalloutState,
    });
  }, []);

  useEffect(() => {
    liveRef.current.callbacks = { onSelectPlanet, onSelectHotspot, onSelectSatellite };
  }, [onSelectPlanet, onSelectHotspot, onSelectSatellite]);

  useEffect(() => {
    liveRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    liveRef.current.showGrid = showGrid;
    if (handlesRef.current) {
      handlesRef.current.gridHelper.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    liveRef.current.showDivergenceLens = showDivergenceLens;
    if (handlesRef.current?.divergenceMesh) {
      handlesRef.current.divergenceMesh.visible = showDivergenceLens;
    }
  }, [showDivergenceLens]);

  useEffect(() => {
    liveRef.current.selectedHotspotId = selectedHotspotId;
    if (handlesRef.current) {
      updateHotspotBeaconSelection(handlesRef.current.hotspotBeacons, selectedHotspotId);
    }
  }, [selectedHotspotId]);

  useEffect(() => {
    syncViewModeAndStructure({
      viewMode,
      selectedPlanetId,
      orbitState: orbitStateRef.current,
      live: liveRef.current,
      handles: handlesRef.current,
    });
  }, [viewMode, selectedPlanetId]);

  const handleZoom = useCallback((factor: number) => {
    soundManager.playClick();
    clampAndSetOrbitRadius(
      orbitStateRef.current,
      liveRef.current.viewMode,
      orbitStateRef.current.radius * factor
    );
  }, []);

  useEffect(() => {
    if (zoomInRef) zoomInRef.current = () => handleZoom(0.8);
    if (zoomOutRef) zoomOutRef.current = () => handleZoom(1.25);
  }, [zoomInRef, zoomOutRef, handleZoom]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {viewMode === 'structure' && calloutState.planetId === selectedPlanetId && (
        <StructureCalloutsOverlay callouts={calloutState.items} />
      )}

      {hoveredLabel && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-200/50 text-xs font-bold text-slate-900 flex items-center gap-2 animate-fade-in font-sans">
          <Globe className="w-3.5 h-3.5 text-[#0369A1]" />
          <span>{hoveredLabel}</span>
        </div>
      )}
    </div>
  );
};

export default ThreeSpaceSystem;
