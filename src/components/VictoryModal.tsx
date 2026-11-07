import React, { useEffect } from 'react';
import { Award, Trophy, RotateCcw } from 'lucide-react';
import type { TurnResources } from '../types/trainer';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  finalResources: TurnResources;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  finalResources,
  onRestart,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    soundManager.playVictoryFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-yellow-500 rounded-3xl shadow-2xl shadow-yellow-500/20 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Medal Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center text-yellow-400 shadow-xl shadow-yellow-500/30 animate-bounce">
          <Award className="w-10 h-10" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-yellow-400 font-bold bg-yellow-950/60 px-3 py-1 rounded-full border border-yellow-800">
            10 SOLS SURVIVED &bull; MISSION ACCOMPLISHED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            ARTEMIS COMMANDER GOLD PIN
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            You successfully balanced Solar Power, Oxygen, and Radiation Shielding across all 10 lunar days!
          </p>
        </div>

        {/* Final Outpost Telemetry Stats */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
          <div className="p-2 bg-slate-900 rounded-xl">
            <span className="text-slate-400 block text-[10px]">FINAL POWER</span>
            <span className="text-yellow-400 font-bold text-base">{finalResources.power}%</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl">
            <span className="text-slate-400 block text-[10px]">FINAL OXYGEN</span>
            <span className="text-blue-400 font-bold text-base">{finalResources.oxygen}%</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl">
            <span className="text-slate-400 block text-[10px]">FINAL SHIELD</span>
            <span className="text-emerald-400 font-bold text-base">{finalResources.shielding}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onOpenLeaderboard}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Transmit Score to Supabase Leaderboard</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again from Sol 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
