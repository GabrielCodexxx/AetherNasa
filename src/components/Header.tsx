import React, { useState } from 'react';
import { Activity, BookOpen, Volume2, VolumeX, Database, Radio, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { isSupabaseConfigured } from '../services/supabase';

interface HeaderProps {
  onOpenBriefing: () => void;
  onOpenLogbook: () => void;
  totalQuakes: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBriefing,
  onOpenLogbook,
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
    <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
                MOONQUAKE MAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">2.0</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                NASA Space Apps
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Apollo Passive Seismic Experiment (APSE) • 1969–1977 Dataset
            </p>
          </div>
        </div>

        {/* Global Telemetry Badges & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Catalog stats */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
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
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900/40'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-500 shadow-sm"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Seismic Log</span>
            {isSupabaseConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            )}
          </button>

          {/* Educational Science Briefing Modal Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBriefing();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40 transition-all transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Science Briefing</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
