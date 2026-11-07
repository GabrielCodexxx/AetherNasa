import React, { useState } from 'react';
import {
  Globe,
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
  selectedPlanetId,
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
    <header className="absolute top-0 inset-x-0 z-30 p-3 sm:p-5 pointer-events-none select-none">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Top-Left Brand & Mission Control Pill */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-2xl px-4 py-2 shadow-2xl">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/40">
              <Globe className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border border-slate-950"></span>
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-wider text-white font-mono">
                EARTH DETECTIVE
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                NASA 2026
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              SOLAR SYSTEM & EARTH TREND DETECTIVE
            </p>
          </div>

          {/* Planet Switcher Quick Dropdown */}
          <div className="pl-2 border-l border-slate-800">
            <select
              value={selectedPlanetId}
              onChange={(e) => {
                const p = SOLAR_PLANETS.find((item) => item.id === e.target.value);
                if (p) {
                  soundManager.playClick();
                  onSelectPlanet(p);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-800/60 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer hover:bg-slate-850"
            >
              {SOLAR_PLANETS.map((planet) => (
                <option key={planet.id} value={planet.id}>
                  {planet.id === 'sun'
                    ? '☀️ The Sun'
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

          {/* Case Files Scenario Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenScenarios();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase bg-slate-900 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all"
            title="Investigate Forensic Divergence Scenarios"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Case Files</span>
          </button>
        </div>

        {/* Top-Right Mission Control Utility HUD */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-2xl p-1.5 sm:p-2 shadow-2xl">
          {/* Sound / Sonification Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-500"
            title="Supabase Investigation Logbook"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Detective Log</span>
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/40 transition-all"
            title="NASA Science & Satellite Fleet Briefing"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">NASA Fleet</span>
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default EarthSystemHeader;
