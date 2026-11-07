import React, { useState } from 'react';
import {
  Globe,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Database,
} from 'lucide-react';
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
    <header className="absolute top-0 inset-x-0 z-30 p-3 sm:p-5 pointer-events-none select-none font-sans">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Top-Left Brand & Planet Switcher (Glassmorphic Eco-Tracker Light Mode) */}
        <div className="pointer-events-auto flex items-center gap-3 bg-white/75 backdrop-blur-xl border border-white/80 rounded-2xl px-4 py-2.5 shadow-lg shadow-slate-200/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0369A1] to-[#15803D] flex items-center justify-center shadow-md shadow-sky-900/15">
            <Globe className="w-4 h-4 text-white" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
                EARTH DETECTIVE
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200/80 uppercase">
                NASA 2026
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Earth System Trend Detective • Eco-Tracker
            </p>
          </div>

          {/* Planet Switcher Quick Dropdown */}
          <div className="pl-2 border-l border-slate-200">
            <select
              value={selectedPlanetId}
              onChange={(e) => {
                const p = SOLAR_PLANETS.find((item) => item.id === e.target.value);
                if (p) {
                  soundManager.playClick();
                  onSelectPlanet(p);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-[#0369A1] focus:outline-none focus:border-[#0369A1] cursor-pointer hover:bg-sky-50/50 transition-colors"
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

          {/* Case Files Forensic Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenScenarios();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border border-slate-200 hover:border-sky-300 transition-all shadow-sm"
            title="Investigate Forensic Divergence Scenarios"
          >
            <Search className="w-3.5 h-3.5 text-[#0369A1]" />
            <span>Case Files</span>
          </button>
        </div>

        {/* Top-Right Mission Control Utility HUD */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/75 backdrop-blur-xl border border-white/80 rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-slate-200/50">
          {/* Sound / Sonification Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
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
            <span className="hidden sm:inline">{!isMuted ? 'Audio ON' : 'Muted'}</span>
          </button>

          {/* Cloud Database / Detective Logbook Sync (Static green dot - NO pinging) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLogbook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#15803D] border border-slate-200 hover:border-emerald-300 transition-all"
            title="Supabase Investigation Logbook"
          >
            <Database className="w-3.5 h-3.5 text-[#15803D]" />
            <span className="hidden sm:inline">Detective Log</span>
          </button>

          {/* NASA Fleet Briefing (Clean static icon - NO yellow sparkle badge) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBriefing();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0369A1] text-white hover:bg-[#025684] shadow-sm shadow-sky-900/20 transition-all"
            title="NASA Science & Satellite Fleet Briefing"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">NASA Fleet</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default EarthSystemHeader;
