import React, { useState } from 'react';
import { Activity, BookOpen, Volume2, VolumeX, Database, Radio, Sparkles, Compass, Layers } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { isSupabaseConfigured } from '../services/supabase';
import type { GlobeViewMode } from './ThreeMoonGlobe';

interface HeaderProps {
  viewMode: GlobeViewMode;
  onChangeViewMode: (mode: GlobeViewMode) => void;
  onOpenBriefing: () => void;
  onOpenLogbook: () => void;
  onOpenScenarios: () => void;
  totalQuakes: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenBriefing,
  onOpenLogbook,
  onOpenScenarios,
  totalQuakes,
  filteredCount,
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
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 min-w-[280px] max-w-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                  THE MOON
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                  NASA APSE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                LUNAR SEISMOLOGY & INTERIOR
              </p>
            </div>
          </div>

          {/* Sci-Fi Mode Navigation Tabs (Inspired by Solar System Scope) */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('surface');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                viewMode === 'surface'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Surface</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('structure');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                viewMode === 'structure'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
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
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scenarios</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenBriefing();
              }}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-slate-900/90 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Encyclopedia</span>
            </button>
          </div>
        </div>

        {/* Top-Right Mission Control Utility HUD */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2 shadow-xl">
          {/* Active Events Counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">Events:</span>
            <span className="font-bold text-white">
              {filteredCount} / {totalQuakes}
            </span>
          </div>

          {/* Sound / Sonification Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio Sonification' : 'Mute Audio Sonification'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
              !isMuted
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-600/60 hover:bg-cyan-900/40 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Procedural Web Audio Seismic Synthesizer"
          >
            {!isMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{!isMuted ? 'Sonification ON' : 'Audio Muted'}</span>
          </button>

          {/* Cloud Database / Logbook Sync */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLogbook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-500"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Seismic Log</span>
            {isSupabaseConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
