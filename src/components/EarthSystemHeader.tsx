import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Database,
  Compass,
  FileText,
  RotateCw,
  Grid,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import aetherLogo from '../assets/images/logo/AetherLogo.jpg';
import { soundManager } from '../utils/soundEffects';
import { SOLAR_PLANETS } from '../utils/earthSystemData';
import type { SystemViewMode, PlanetData } from '../types/earthSystem';

interface EarthSystemHeaderProps {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  onChangeViewMode: (mode: SystemViewMode) => void;
  onSelectPlanet: (planet: PlanetData) => void;
  onOpenBriefing: () => void;
  onOpenLogbook: () => void;
  onOpenScenarios: () => void;
  onOpenPlanetology?: () => void;
  onOpenReport?: () => void;
  // Left 3D Viewport & Dossier Controls
  planetName?: string;
  isPlanetHudOpen?: boolean;
  onTogglePlanetHud?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  showDivergenceLens?: boolean;
  onToggleDivergenceLens?: () => void;
}

export const EarthSystemHeader: React.FC<EarthSystemHeaderProps> = ({
  selectedPlanetId,
  onSelectPlanet,
  onOpenBriefing,
  onOpenLogbook,
  onOpenScenarios,
  onOpenPlanetology,
  onOpenReport,
  planetName,
  isPlanetHudOpen = false,
  onTogglePlanetHud,
  onZoomIn,
  onZoomOut,
  autoRotate = true,
  onToggleAutoRotate,
  showGrid = true,
  onToggleGrid,
  showDivergenceLens = false,
  onToggleDivergenceLens,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    soundManager.setMuted(next);
    setIsMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  return (
    <header className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-4 pointer-events-none select-none font-sans">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* 1. LEFT CAPSULE: 3D Viewport Controls & Planet Dossier */}
        <div className="pointer-events-auto shrink-0 flex items-center gap-1 sm:gap-1.5 bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 sm:p-2 shadow-xl shadow-slate-200/50">
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
              className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
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
              className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
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
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                autoRotate
                  ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900'
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
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showGrid
                  ? 'bg-sky-50 text-[#0369A1] border border-sky-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900'
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
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all ${
                showDivergenceLens
                  ? 'bg-emerald-50 text-[#15803D] border border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900'
              }`}
              title="Toggle Dual-Pole Regional Divergence 3D Heatmap"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Divergence: </span>
              <span className="hidden sm:inline">Lens</span>
            </button>
          )}
        </div>

        {/* 2. CENTER CAPSULE: Brand & Planet Switcher (Centered in Flex Space - Never Overlaps) */}
        <div className="flex-1 flex justify-center min-w-0">
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 shadow-xl shadow-slate-200/50">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200/90 overflow-hidden flex items-center justify-center shadow-xs shrink-0 p-1">
              <img
                src={aetherLogo}
                alt="Planet Detective Insignia Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-orbitron font-extrabold tracking-wider text-slate-900 whitespace-nowrap">
                  PLANET DETECTIVE
                </h1>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-orbitron font-bold bg-emerald-50 text-[#15803D] border border-emerald-200/80 uppercase">
                  NASA 2026
                </span>
              </div>
              <p className="text-[10px] font-space text-slate-500 font-medium hidden 2xl:block">
                Planetary System Trend Detective • Eco-Tracker
              </p>
            </div>

            {/* Planet Switcher Quick Dropdown */}
            <div className="pl-1.5 sm:pl-2 border-l border-slate-200 shrink-0">
              <select
                value={selectedPlanetId}
                onChange={(e) => {
                  const p = SOLAR_PLANETS.find((item) => item.id === e.target.value);
                  if (p) {
                    soundManager.playClick();
                    onSelectPlanet(p);
                  }
                }}
                className="px-2 sm:px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-orbitron font-bold text-[#0369A1] focus:outline-none focus:border-[#0369A1] cursor-pointer hover:bg-sky-50/50 transition-colors"
              >
                {SOLAR_PLANETS.map((planet) => (
                  <option key={planet.id} value={planet.id}>
                    {planet.id === 'sun'
                      ? '☀️ Sun'
                      : planet.id === 'earth'
                      ? '🌍 Earth'
                      : planet.id === 'mars'
                      ? '🔴 Mars'
                      : planet.id === 'jupiter'
                      ? '🪐 Jupiter'
                      : planet.id === 'saturn'
                      ? '🪐 Saturn'
                      : planet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Files Forensic Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenScenarios();
              }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border border-slate-200 hover:border-sky-300 transition-all shadow-xs shrink-0"
              title="Investigate Forensic Divergence Scenarios"
            >
              <Search className="w-3.5 h-3.5 text-[#0369A1]" />
              <span>Case Files</span>
            </button>

            {/* Feature 5: Comparative Planetology Lab */}
            {onOpenPlanetology && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenPlanetology();
                }}
                className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-all shadow-xs shrink-0"
                title="Compare Earth vs Venus vs Mars"
              >
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Planetology</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. RIGHT CAPSULE: Mission Control Utility HUD */}
        <div className="pointer-events-auto shrink-0 flex items-center gap-1 sm:gap-1.5 bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 sm:p-2 shadow-xl shadow-slate-200/50">
          {/* Feature 7: Official Technical Memo Report */}
          {onOpenReport && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenReport();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-orbitron font-semibold bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border border-slate-200 hover:border-sky-300 transition-all shadow-xs"
              title="Generate Official NASA Technical Briefing Memo"
            >
              <FileText className="w-3.5 h-3.5 text-[#0369A1]" />
              <span>Memo</span>
            </button>
          )}

          {/* Sound / Sonification Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-orbitron font-semibold border transition-all ${
              !isMuted
                ? 'bg-sky-50 text-[#0369A1] border-sky-200 hover:bg-sky-100/60'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-900'
            }`}
            title="Procedural Earth & Space Audio Synthesizer"
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4 text-[#0369A1]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden sm:inline">{!isMuted ? 'Audio' : 'Muted'}</span>
          </button>

          {/* Cloud Database / Detective Logbook Sync (NO DOTS) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLogbook();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-orbitron font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#15803D] border border-slate-200 hover:border-emerald-300 transition-all"
            title="Supabase Investigation Logbook"
          >
            <Database className="w-3.5 h-3.5 text-[#15803D]" />
            <span className="hidden sm:inline">Logbook</span>
          </button>

          {/* NASA Fleet Briefing */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBriefing();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold bg-[#0369A1] text-white hover:bg-[#025684] shadow-sm shadow-sky-900/20 transition-all"
            title="NASA Science & Satellite Fleet Briefing"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fleet</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default EarthSystemHeader;
