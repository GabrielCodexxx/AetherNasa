import React, { useState } from 'react';
import { Bot, Volume2, VolumeX, GraduationCap, Headphones, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  currentLevelIndex: number;
  totalLevels: number;
  totalStars: number;
  onSelectLevel: (index: number) => void;
  onOpenTeachersGuide: () => void;
  onOpenLeaderboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevelIndex,
  totalLevels,
  totalStars,
  onSelectLevel,
  onOpenTeachersGuide,
  onOpenLeaderboard,
}) => {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [humming, setHumming] = useState(false);

  const toggleAudio = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundManager.playClickTile();
  };

  const toggleHum = () => {
    const active = soundManager.toggleAmbientHum();
    setHumming(active);
  };

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur-xl px-4 py-3 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-400/40">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                ROVER ROUTE PLANNER
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded px-1.5 py-0.5 tracking-wider">
                NASA SPACE APPS 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">LUNAR ALGORITHMIC PATHFINDER</span>
              <span>&bull;</span>
              <span className="text-cyan-400 font-bold">Total Stars: {totalStars} ⭐</span>
            </div>
          </div>
        </div>

        {/* Center: Sector Navigation */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-inner text-xs font-mono">
          <button
            onClick={() => onSelectLevel(Math.max(0, currentLevelIndex - 1))}
            disabled={currentLevelIndex === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
            title="Previous Sector"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-bold text-white">
            Sector {currentLevelIndex + 1} of {totalLevels}
          </span>

          <button
            onClick={() => onSelectLevel(Math.min(totalLevels - 1, currentLevelIndex + 1))}
            disabled={currentLevelIndex === totalLevels - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
            title="Next Sector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Teacher's Guide (Huge Hackathon Winner Feature) */}
          <button
            onClick={onOpenTeachersGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 hover:border-emerald-400 rounded-xl text-xs font-bold text-emerald-300 transition-all shadow-md shadow-emerald-950/40"
            title="Open 4th-6th Grade Classroom Teacher's Guide & Lesson Plan"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Teacher's Guide</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-all"
            title="View Supabase Global Flight Scores"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Rankings</span>
          </button>

          {/* Ambient Hum Drone Toggle */}
          <button
            onClick={toggleHum}
            className={`p-2 rounded-xl border text-xs transition-all ${
              humming
                ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={humming ? 'Turn off low space drone hum' : 'Turn on low space drone hum'}
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Sound FX Mute */}
          <button
            onClick={toggleAudio}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white"
            title={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
