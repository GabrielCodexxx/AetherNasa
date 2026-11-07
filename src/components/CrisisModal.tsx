import React from 'react';
import { AlertOctagon, Clock, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import type { CrisisEvent, ChoiceOption } from '../types/trainer';

interface CrisisModalProps {
  crisis: CrisisEvent;
  countdown: number;
  onSelectOption: (option: ChoiceOption) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  crisis,
  countdown,
  onSelectOption,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-2xl shadow-red-950/60 overflow-hidden">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-red-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/30 border border-red-500/50 text-red-300 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                CRITICAL MISSION ALERT &bull; {crisis.source}
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide">{crisis.title}</h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-red-500/50 px-3 py-1.5 rounded-xl font-mono text-red-400">
            <Clock className="w-4 h-4 animate-spin text-red-400" />
            <span className="text-xl font-bold">{countdown}s</span>
          </div>
        </div>

        {/* Content & Description */}
        <div className="p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-5 bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl">
            {crisis.description}
          </p>

          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Select Emergency Protocol (Tactical Trade-Off)</span>
          </h3>

          {/* Decision Choices */}
          <div className="space-y-3">
            {crisis.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onSelectOption(option)}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {option.text}
                    </p>
                    <p className="text-xs text-slate-400">{option.impactDescription}</p>

                    {/* Scientific NASA Fact */}
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 pt-1">
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span className="italic">{option.scientificFact}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
