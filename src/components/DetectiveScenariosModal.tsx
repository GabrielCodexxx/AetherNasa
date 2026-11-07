import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { DETECTIVE_SCENARIOS, EARTH_SYSTEM_TRENDS } from '../utils/earthSystemData';
import type { DetectiveScenario } from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';

interface DetectiveScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DetectiveScenario) => void;
  onSelectTrend?: (trendId: string) => void;
  onChangeViewMode?: (viewMode: any) => void;
  trends?: any[];
}

export const DetectiveScenariosModal: React.FC<DetectiveScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [solvedCases, setSolvedCases] = useState<Record<number, boolean>>({});
  const [selectedVerdict, setSelectedVerdict] = useState<Record<number, string>>({});
  const trends = EARTH_SYSTEM_TRENDS;

  if (!isOpen) return null;

  const current = DETECTIVE_SCENARIOS[currentIdx];

  const handleNext = () => {
    if (currentIdx < DETECTIVE_SCENARIOS.length - 1) {
      soundManager.playClick();
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      onSelectScenario(DETECTIVE_SCENARIOS[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      soundManager.playClick();
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      onSelectScenario(DETECTIVE_SCENARIOS[prevIdx]);
    }
  };

  const handleApplyScenario = (idx: number) => {
    soundManager.playClick();
    setCurrentIdx(idx);
    onSelectScenario(DETECTIVE_SCENARIOS[idx]);
  };

  const handleChooseVerdict = (verdict: 'significant' | 'noise') => {
    soundManager.playClick();
    setSelectedVerdict({ ...selectedVerdict, [currentIdx]: verdict });
    if (verdict === 'significant') {
      soundManager.playSignificanceAlert();
      setSolvedCases({ ...solvedCases, [currentIdx]: true });
    }
  };

  const isSolved = solvedCases[currentIdx];

  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-8 md:bottom-8 md:w-[580px] z-40 animate-fade-in select-none font-sans">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-800 max-h-[85vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-[#0369A1] text-xs font-orbitron font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#0369A1]" />
              Case File 0{currentIdx + 1}
            </span>
            <span className="text-xs font-orbitron font-semibold text-slate-400">
              {current.caseNumber} ({currentIdx + 1}/{DETECTIVE_SCENARIOS.length})
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Case Title & Domain */}
        <div>
          <h3 className="text-xl font-orbitron font-black text-slate-900 leading-tight">
            {current.title}
          </h3>
          <p className="text-xs font-space font-semibold text-[#0369A1] mt-1">
            {current.subtitle}
          </p>
        </div>

        {/* 4 Core NASA Detective Answers */}
        <div className="space-y-2.5 text-xs font-space">
          {/* 1. What */}
          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80">
            <span className="text-[#0369A1] font-bold block text-[10px] uppercase font-orbitron">
              1. What is Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.whatIsChanging}
            </p>
          </div>

          {/* 2. Where */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-amber-800 font-bold block text-[10px] uppercase font-orbitron">
              2. Where is it Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.whereIsChanging}
            </p>
          </div>

          {/* 3. How Much */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-700 font-bold block text-[10px] uppercase font-orbitron">
              3. How Much is it Changing?
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              {current.howMuchIsChanging}
            </p>
          </div>

          {/* 4. Significant? */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
            <span className="text-[#15803D] font-bold block text-[10px] uppercase font-orbitron flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              4. Is this change what scientists call "Significant"?
            </span>
            <p className="text-emerald-950 font-medium text-xs mt-1 leading-relaxed">
              {current.isSignificant}
            </p>
          </div>
        </div>

        {/* Evidence Points */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 font-space">
          <span className="font-orbitron font-bold text-[10px] uppercase text-slate-400 block mb-1">
            Satellite Evidence Trail:
          </span>
          {current.evidencePoints.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
              <p>{ev}</p>
            </div>
          ))}
        </div>

        {/* Interactive Forensic Verdict Challenge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold uppercase text-slate-700 tracking-wider">
              Submit Your Forensic Verdict:
            </span>
            {isSolved && (
              <span className="px-2 py-0.5 rounded text-[9px] font-orbitron font-bold uppercase bg-emerald-100 text-[#15803D] flex items-center gap-1">
                <Award className="w-3 h-3" />
                Case Solved
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-xs font-space">
            <button
              onClick={() => handleChooseVerdict('noise')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedVerdict[currentIdx] === 'noise'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>Stochastic Noise</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Natural unforced oscillation</p>
            </button>

            <button
              onClick={() => handleChooseVerdict('significant')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedVerdict[currentIdx] === 'significant'
                  ? 'bg-emerald-50 border-emerald-400 text-[#15803D] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                <span>True Divergence</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Statistically significant (p &lt; 0.001)</p>
            </button>
          </div>

          {isSolved && (
            <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200 text-xs text-[#15803D] font-bold font-orbitron flex items-center gap-2">
              <Award className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>OFFICIAL VERDICT CONFIRMED: NASA Detective Badge Awarded!</span>
            </div>
          )}
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
            className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0369A1] border border-sky-200 text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all shadow-xs"
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
                  className={`px-2.5 py-1 rounded-md text-[10px] font-orbitron font-bold uppercase transition-all ${
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
