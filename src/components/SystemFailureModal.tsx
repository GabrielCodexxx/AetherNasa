import React from 'react';
import { AlertOctagon, RotateCcw, Wrench } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SystemFailureModalProps {
  solNumber: number;
  reason: string;
  onRetrySol: () => void;
}

export const SystemFailureModal: React.FC<SystemFailureModalProps> = ({
  solNumber,
  reason,
  onRetrySol,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl shadow-red-950/80 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Warning Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 shadow-xl shadow-red-500/30 animate-pulse">
          <AlertOctagon className="w-10 h-10" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold bg-red-950/60 px-3 py-1 rounded-full border border-red-800">
            ENGINEERING INCIDENT REPORT &bull; SOL {solNumber}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            SYSTEM FAILURE
          </h2>
        </div>

        {/* Constructive Engineering Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Post-Mortem Root Cause Analysis:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {reason}
          </p>
        </div>

        {/* Constructive Pedagogical Message */}
        <p className="text-xs text-slate-400 leading-snug">
          At NASA, every test flight and mission failure provides critical data. 
          Real aerospace engineers analyze the telemetry, adjust the power grid, and try again!
        </p>

        {/* Large Touch Friendly Retry Button */}
        <button
          onClick={() => {
            soundManager.playPlusBeep();
            onRetrySol();
          }}
          className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Retry Sol {solNumber} (Engineers Learn From Failure)</span>
        </button>
      </div>
    </div>
  );
};

export default SystemFailureModal;
