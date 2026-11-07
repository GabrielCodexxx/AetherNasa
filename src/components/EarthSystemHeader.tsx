import React, { useState } from 'react';
import {
  Globe,
  Orbit,
  Layers,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Database,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { isSupabaseConfigured } from '../services/supabase';
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
}

export const EarthSystemHeader: React.FC<EarthSystemHeaderProps> = ({
  viewMode,
  selectedPlanetId,
  onChangeViewMode,
  onSelectPlanet,
  onOpenBriefing,
  onOpenLogbook,
  onOpenScenarios,
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
    <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 pointer-events-none select-none">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Top-Left Planetarium Title & Mode Switcher HUD */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 min-w-[300px] max-w-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
                <Globe className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                  EARTH DETECTIVE
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                  NASA 2026
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                SOLAR SYSTEM & EARTH TREND DETECTIVE
              </p>
            </div>
          </div>

          {/* Sci-Fi Mode Navigation Tabs (Solar System Scope Style) */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('solar_system');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                viewMode === 'solar_system'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Solar System</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('earth_focus');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                viewMode === 'earth_focus'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Earth Focus</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('structure');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                viewMode === 'structure'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Structure</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenScenarios();
              }}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-slate-900/90 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Case Files</span>
            </button>
          </div>
        </div>

        {/* Top-Right Mission Control Utility HUD */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2 shadow-xl">
          {/* Planet Switcher Quick Dropdown */}
          <select
            value={selectedPlanetId}
            onChange={(e) => {
              const p = SOLAR_PLANETS.find((item) => item.id === e.target.value);
              if (p) {
                soundManager.playClick();
                onSelectPlanet(p);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {SOLAR_PLANETS.map((planet) => (
              <option key={planet.id} value={planet.id}>
                {planet.name}
              </option>
            ))}
          </select>

          {/* Sound / Sonification Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
              !isMuted
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-600/60 hover:bg-cyan-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Procedural Earth & Space Audio Synthesizer"
          >
            {!isMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{!isMuted ? 'Audio ON' : 'Muted'}</span>
          </button>

          {/* Cloud Database / Detective Logbook Sync */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLogbook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-500"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Detective Log</span>
            {isSupabaseConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            )}
          </button>

          {/* Encyclopedia Modal Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBriefing();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/40 transition-all"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>NASA Fleet</span>
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default EarthSystemHeader;
