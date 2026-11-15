import React, { useState } from 'react';
import { BookOpen, Database, FileText, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { CAPSULE_SURFACE_CLASS } from './headerStyles';

interface MissionUtilityCapsuleProps {
  onOpenBriefing: () => void;
  onOpenLogbook: () => void;
  onOpenReport?: () => void;
}

/** Right header capsule for technical memo, audio toggle, investigation logbook, and NASA fleet briefing. */
export const MissionUtilityCapsule: React.FC<MissionUtilityCapsuleProps> = ({
  onOpenBriefing,
  onOpenLogbook,
  onOpenReport,
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
    <div className={`${CAPSULE_SURFACE_CLASS} shrink-0 gap-1 sm:gap-1.5 p-1.5 sm:p-2`}>
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
  );
};
