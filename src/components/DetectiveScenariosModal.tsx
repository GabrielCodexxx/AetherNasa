import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { DETECTIVE_SCENARIOS } from '../utils/earthSystemData';
import { soundManager } from '../utils/soundEffects';
import type { DetectiveScenario, SystemViewMode, EarthSystemTrend } from '../types/earthSystem';

interface DetectiveScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DetectiveScenario) => void;
  onSelectTrend: (trendId: string) => void;
  onChangeViewMode: (mode: SystemViewMode) => void;
  trends: EarthSystemTrend[];
}

export const DetectiveScenariosModal: React.FC<DetectiveScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onSelectTrend,
  onChangeViewMode,
  trends,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const current = DETECTIVE_SCENARIOS[currentIdx];

  const handleApplyScenario = (index: number) => {
    setCurrentIdx(index);
    const sc = DETECTIVE_SCENARIOS[index];
    onChangeViewMode('earth_focus');
    onSelectScenario(sc);

    // Map domain to trend
    const match = trends.find((t) => t.domain === sc.domain);
    if (match) {
      onSelectTrend(match.id);
      soundManager.sonifyTrend(match.currentValue, match.domain);
    } else {
      soundManager.playSignificanceAlert();
    }
  };

  const handleNext = () => {
    if (currentIdx < DETECTIVE_SCENARIOS.length - 1) {
      handleApplyScenario(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      handleApplyScenario(currentIdx - 1);
    }
  };

  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-8 md:bottom-8 md:w-[560px] z-40 animate-fade-in select-none">
      <div className="bg-slate-950/92 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[85vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Earth System Trend Detective
            </span>
            <span className="text-xs font-mono text-slate-400">
              {current.caseNumber} ({currentIdx + 1}/{DETECTIVE_SCENARIOS.length})
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Title & Domain */}
        <div>
          <h3 className="text-xl font-bold font-mono text-white leading-tight">
            {current.title}
          </h3>
          <p className="text-xs font-mono text-cyan-400 mt-1">
            {current.subtitle}
          </p>
        </div>

        {/* 4 Core NASA Detective Answers */}
        <div className="space-y-2.5 text-xs font-mono">
          {/* 1. What */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-[10px] uppercase">
              1. What is Changing?
            </span>
            <p className="text-slate-200 font-sans text-xs mt-1">
              {current.whatIsChanging}
            </p>
          </div>

          {/* 2. Where */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">
              2. Where is it Changing?
            </span>
            <p className="text-slate-200 font-sans text-xs mt-1">
              {current.whereIsChanging}
            </p>
          </div>

          {/* 3. How Much */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-rose-400 font-bold block text-[10px] uppercase">
              3. How Much is it Changing?
            </span>
            <p className="text-slate-200 font-sans text-xs mt-1">
              {current.howMuchIsChanging}
            </p>
          </div>

          {/* 4. Significant? */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-emerald-400 font-bold block text-[10px] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              4. Is this change what scientists call "Significant"?
            </span>
            <p className="text-emerald-200/90 font-sans text-xs mt-1">
              {current.isSignificant}
            </p>
          </div>
        </div>

        {/* Evidence Points */}
        <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 space-y-1.5 font-sans">
          <span className="font-mono font-bold text-[10px] uppercase text-slate-400 block mb-1">
            Satellite Evidence Trail:
          </span>
          {current.evidencePoints.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <p>{ev}</p>
            </div>
          ))}
        </div>

        {/* Detective Verdict Callout */}
        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono text-cyan-200 font-bold">
          {current.detectiveVerdict}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const match = trends.find((t) => t.domain === current.domain);
              if (match) {
                soundManager.sonifyTrend(match.currentValue, match.domain);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Sonify Evidence</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {DETECTIVE_SCENARIOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyScenario(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIdx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIdx === DETECTIVE_SCENARIOS.length - 1}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetectiveScenariosModal;
