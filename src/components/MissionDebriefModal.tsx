import React, { useEffect } from 'react';
import { CheckCircle2, AlertOctagon, RotateCcw, ArrowRight, Star, Battery } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MissionDebriefModalProps {
  status: 'success' | 'failure';
  levelName: string;
  batteryRemaining: number;
  maxBattery: number;
  starsCollected: number;
  targetStars: number;
  failureReason?: string;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
}

export const MissionDebriefModal: React.FC<MissionDebriefModalProps> = ({
  status,
  levelName,
  batteryRemaining,
  maxBattery,
  starsCollected,
  targetStars,
  failureReason,
  isLastLevel,
  onNextLevel,
  onRetry,
}) => {
  const isSuccess = status === 'success';

  useEffect(() => {
    if (isSuccess) {
      soundManager.playSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundManager.playFailure();
    }
  }, [isSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl border-2 shadow-2xl p-6 sm:p-8 text-center space-y-6 ${
          isSuccess
            ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/20'
            : 'bg-slate-900 border-red-500 shadow-red-500/20'
        }`}
      >
        {/* Status Icon */}
        <div
          className={`w-20 h-20 mx-auto rounded-3xl border-2 flex items-center justify-center shadow-xl animate-bounce ${
            isSuccess
              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400 shadow-emerald-500/30'
              : 'bg-red-500/20 border-red-500/60 text-red-400 shadow-red-500/30'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-10 h-10" /> : <AlertOctagon className="w-10 h-10" />}
        </div>

        {/* Title */}
        <div>
          <span
            className={`text-[11px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
              isSuccess
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-red-950/80 text-red-300 border-red-800'
            }`}
          >
            {levelName} &bull; {isSuccess ? 'DEBRIEF: SUCCESS' : 'DEBRIEF: SYSTEM FAILURE'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            {isSuccess ? (isLastLevel ? 'GRAND MISSION COMPLETE! 🏆' : 'MISSION SUCCESS!') : 'POWER FAILURE'}
          </h2>
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-left">
          {isSuccess ? (
            <>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-yellow-400" /> Battery Remaining:
                </span>
                <span className="text-yellow-400 font-bold text-sm">
                  {batteryRemaining} / {maxBattery} pts
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-cyan-400 fill-cyan-400/30" /> Water Ice Scans:
                </span>
                <span className="text-cyan-300 font-bold text-sm">
                  {starsCollected} / {targetStars} Stars ⭐
                </span>
              </div>

              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                Excellent algorithmic planning! Your command sequence navigated the terrain within budget limits.
              </p>
            </>
          ) : (
            <>
              <span className="text-xs font-mono font-bold text-red-400 uppercase block">
                Engineering Incident Report:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {failureReason ||
                  'The rover exhausted its battery before reaching the primary objective tile. You may need to route through Solar Ridges to recharge or avoid high-friction regolith sand.'}
              </p>
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                NASA Principle: Engineers learn from telemetry failure. Analyze where power was lost and re-plan!
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isSuccess ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLastLevel ? 'View Grand Mission Badge' : 'Next Lunar Sector'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Route (Re-program Sequence)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionDebriefModal;
