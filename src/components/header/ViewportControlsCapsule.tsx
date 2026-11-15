import React from 'react';
import { Compass, Grid, Layers, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import {
  CAPSULE_SURFACE_CLASS,
  VIEWPORT_ICON_BTN_CLASS,
  VIEWPORT_TOGGLE_BASE_CLASS,
  VIEWPORT_TOGGLE_INACTIVE_CLASS,
} from './headerStyles';

interface ViewportControlsCapsuleProps {
  planetName?: string;
  isPlanetHudOpen: boolean;
  onTogglePlanetHud?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  autoRotate: boolean;
  onToggleAutoRotate?: () => void;
  showGrid: boolean;
  onToggleGrid?: () => void;
  showDivergenceLens: boolean;
  onToggleDivergenceLens?: () => void;
}

/** Left header capsule for 3D viewport zoom, orbit, grid, divergence lens, and dossier toggle. */
export const ViewportControlsCapsule: React.FC<ViewportControlsCapsuleProps> = ({
  planetName,
  isPlanetHudOpen,
  onTogglePlanetHud,
  onZoomIn,
  onZoomOut,
  autoRotate,
  onToggleAutoRotate,
  showGrid,
  onToggleGrid,
  showDivergenceLens,
  onToggleDivergenceLens,
}) => (
  <div className={`${CAPSULE_SURFACE_CLASS} shrink-0 gap-1 sm:gap-1.5 p-1.5 sm:p-2`}>
    {!isPlanetHudOpen && onTogglePlanetHud && (
      <>
        <button
          onClick={() => {
            soundManager.playClick();
            onTogglePlanetHud();
          }}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-[#0369A1] border border-slate-200/90 text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all shadow-xs"
          title="Open Planetary Dossier"
        >
          <Compass className="w-3.5 h-3.5 text-[#0369A1]" />
          <span className="hidden xl:inline">{planetName || 'Planet'} </span>
          <span>Dossier</span>
        </button>
        <div className="w-px h-5 bg-slate-200 mx-0.5 hidden sm:block" />
      </>
    )}

    {onZoomIn && (
      <button
        onClick={() => {
          soundManager.playClick();
          onZoomIn();
        }}
        className={VIEWPORT_ICON_BTN_CLASS}
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    )}

    {onZoomOut && (
      <button
        onClick={() => {
          soundManager.playClick();
          onZoomOut();
        }}
        className={VIEWPORT_ICON_BTN_CLASS}
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
    )}

    {onToggleAutoRotate && (
      <button
        onClick={() => {
          soundManager.playClick();
          onToggleAutoRotate();
        }}
        className={`${VIEWPORT_TOGGLE_BASE_CLASS} font-bold ${
          autoRotate
            ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
            : VIEWPORT_TOGGLE_INACTIVE_CLASS
        }`}
        title="Toggle Planetary Orbit Animation"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Orbit: </span>
        <span>{autoRotate ? 'ON' : 'OFF'}</span>
      </button>
    )}

    {onToggleGrid && (
      <button
        onClick={() => {
          soundManager.playClick();
          onToggleGrid();
        }}
        className={`${VIEWPORT_TOGGLE_BASE_CLASS} font-bold ${
          showGrid
            ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
            : VIEWPORT_TOGGLE_INACTIVE_CLASS
        }`}
        title="Toggle Orbital Plane Coordinates"
      >
        <Grid className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Grid</span>
      </button>
    )}

    {onToggleDivergenceLens && (
      <button
        onClick={() => {
          soundManager.playClick();
          onToggleDivergenceLens();
        }}
        className={`${VIEWPORT_TOGGLE_BASE_CLASS} font-orbitron font-bold ${
          showDivergenceLens
            ? 'bg-emerald-50 text-[#15803D] border border-emerald-300 shadow-xs'
            : VIEWPORT_TOGGLE_INACTIVE_CLASS
        }`}
        title="Toggle Dual-Pole Regional Divergence 3D Heatmap"
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden xl:inline">Divergence: </span>
        <span className="hidden sm:inline">Lens</span>
      </button>
    )}
  </div>
);
