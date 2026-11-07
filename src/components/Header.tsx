import React, { useState } from 'react';
import { Rocket, Moon, Globe, Volume2, VolumeX, Play, Pause, ShieldAlert, Award, Trophy, Compass } from 'lucide-react';
import type { OutpostLocation } from '../types/trainer';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  location: OutpostLocation;
  missionTime: number;
  isPaused: boolean;
  speed: 1 | 2 | 5;
  activeCrisis: boolean;
  onSwitchLocation: (loc: OutpostLocation) => void;
  onTogglePause: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
  onOpenAcademy: () => void;
  onOpenLeaderboard: () => void;
  onOpenBriefing: () => void;
  onTriggerCrisis: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  missionTime,
  isPaused,
  speed,
  activeCrisis,
  onSwitchLocation,
  onTogglePause,
  onSetSpeed,
  onOpenAcademy,
  onOpenLeaderboard,
  onOpenBriefing,
  onTriggerCrisis,
}) => {
  const [muted, setMuted] = useState(soundManager.isMuted());

  const toggleAudio = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundManager.playBeep(880, 0.05);
  };

  const formatMET = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `T+${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur-xl px-4 py-3 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: NASA Artemis Aerospace Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                AETHER
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 rounded px-1.5 py-0.5 tracking-wider">
                NASA SPACE APPS 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">JUNIOR ASTRONAUT TRAINER</span>
              <span>&bull;</span>
              <span className="text-cyan-400 font-bold">{formatMET(missionTime)}</span>
            </div>
          </div>
        </div>

        {/* Center: Mission Theater Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => onSwitchLocation('lunar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location === 'lunar'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lunar Base Camp</span>
          </button>
          <button
            onClick={() => onSwitchLocation('mars')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location === 'mars'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-rose-500/20 border border-rose-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>Mars Jezero Hab</span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mission Scenario Briefing Modal Trigger */}
          <button
            onClick={onOpenBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/50 rounded-lg text-xs font-semibold text-cyan-300 transition-all shadow-sm shadow-cyan-950/40"
            title="Read Mission Scenario & Scientific Architecture"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Scenario Briefing</span>
          </button>

          {/* Emergency Crisis Drill */}
          <button
            onClick={onTriggerCrisis}
            disabled={activeCrisis}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeCrisis
                ? 'bg-red-950/70 text-red-300 border-red-500/60 animate-pulse'
                : 'bg-red-950/30 text-red-300 border-red-800/40 hover:bg-red-900/40'
            }`}
            title="Trigger space weather crisis simulation"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Crisis Drill</span>
          </button>

          {/* Time Speed */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={onTogglePause}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
              title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            {([1, 2, 5] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-2 py-1 text-xs font-mono font-bold rounded ${
                  speed === s ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Badges */}
          <button
            onClick={onOpenAcademy}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs font-medium text-slate-200 hover:text-white transition-all"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Badges</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-lg text-xs font-medium text-slate-200 hover:text-white transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Rankings</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleAudio}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white"
            title={muted ? 'Unmute audio' : 'Mute audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
