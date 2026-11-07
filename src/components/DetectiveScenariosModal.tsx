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
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-8 md:bottom-8 md:w-[560px] z-40 animate-fade-in select-none font-sans">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-800 max-h-[85vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-[#0369A1] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#0369A1]" />
              Earth Trend Detective Case
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {current.caseNumber} ({currentIdx + 1}/{DETECTIVE_SCENARIOS.length})
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Title & Domain */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
            {current.title}
          </h3>
          <p className="text-xs font-semibold text-[#0369A1] mt-1">
            {current.subtitle}
          </p>
        </div>

        {/* 4 Core NASA Detective Answers */}
        <div className="space-y-2.5 text-xs">
          {/* 1. What */}
          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80">
            <span className="text-[#0369A1] font-bold block text-[10px] uppercase">
              1. What is Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.whatIsChanging}
            </p>
          </div>

          {/* 2. Where */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-amber-800 font-bold block text-[10px] uppercase">
              2. Where is it Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.whereIsChanging}
            </p>
          </div>

          {/* 3. How Much */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-700 font-bold block text-[10px] uppercase">
              3. How Much is it Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.howMuchIsChanging}
            </p>
          </div>

          {/* 4. Significant? */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
            <span className="text-[#15803D] font-bold block text-[10px] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              4. Is this change what scientists call "Significant"?
            </span>
            <p className="text-emerald-950 font-medium text-xs mt-1 leading-relaxed">
              {current.isSignificant}
            </p>
          </div>
        </div>

        {/* Evidence Points */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
          <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
            Satellite Evidence Trail:
          </span>
          {current.evidencePoints.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
              <p>{ev}</p>
            </div>
          ))}
        </div>

        {/* Detective Verdict Callout */}
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200/80 text-xs text-[#0369A1] font-bold">
          {current.detectiveVerdict}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const match = trends.find((t) => t.domain === current.domain);
              if (match) {
                soundManager.sonifyTrend(match.currentValue, match.domain);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0369A1] border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-[#0369A1]" />
            <span>Sonify Evidence</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Case File Segmented Tabs (NO DOTS) */}
            <div className="flex items-center gap-1.5 px-2">
              {DETECTIVE_SCENARIOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyScenario(idx)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                    idx === currentIdx
                      ? 'bg-[#0369A1] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  Case 0{idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIdx === DETECTIVE_SCENARIOS.length - 1}
              className="p-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
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
