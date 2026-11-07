import React, { useState } from 'react';
import { Moon, Volume2, VolumeX, Play, Pause, ShieldAlert, Award, Trophy, Compass, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  missionTime: number;
  isPaused: boolean;
  speed: 1 | 2 | 5;
  activeCrisis: boolean;
  stormsSurvived: number;
  onTogglePause: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
  onOpenAcademy: () => void;
  onOpenLeaderboard: () => void;
  onOpenBriefing: () => void;
  onTriggerCrisis: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  missionTime,
  isPaused,
  speed,
  activeCrisis,
  stormsSurvived,
  onTogglePause,
  onSetSpeed,
  onOpenAcademy,
  onOpenLeaderboard,
  onOpenBriefing,
  onTriggerCrisis,
  onRestart,
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
    <header className="border-b border-amber-900/40 bg-slate-950/90 backdrop-blur-xl px-4 py-3 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-400/40">
            <Moon className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                LUNAR RESOURCE MANAGER
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 rounded px-1.5 py-0.5 tracking-wider">
                NASA SPACE APPS 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">3-RESOURCE SURVIVAL SIM</span>
              <span>&bull;</span>
              <span className="text-amber-400 font-bold">{formatMET(missionTime)}</span>
              <span>&bull;</span>
              <span className="text-cyan-400">Storms Deflected: {stormsSurvived}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mission Scenario Briefing Modal */}
          <button
            onClick={onOpenBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 border border-amber-500/50 hover:bg-amber-900/50 rounded-lg text-xs font-semibold text-amber-300 transition-all shadow-sm"
            title="Read Scenario Explanation & Why 3 Resources Wins"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Scenario Explanation</span>
          </button>

          {/* Trigger Solar Storm Drill */}
          <button
            onClick={onTriggerCrisis}
            disabled={activeCrisis}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeCrisis
                ? 'bg-red-950/80 text-red-300 border-red-500/60 animate-pulse'
                : 'bg-red-950/30 text-red-300 border-red-800/40 hover:bg-red-900/40'
            }`}
            title="Simulate a Solar Storm flare"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Solar Storm Drill</span>
          </button>

          {/* Time Warp Speed */}
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
                  speed === s ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white"
            title="Restart Mission"
          >
            <RotateCcw className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>

          {/* Badges */}
          <button
            onClick={onOpenAcademy}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg text-xs font-medium text-slate-200 hover:text-white transition-all"
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
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
