import React from 'react';
import { CheckCircle2, ShieldCheck, Award, AlertTriangle } from 'lucide-react';
import type { DetectiveScenario } from '../../types/earthSystem';

interface ScenarioEvidencePanelProps {
  scenario: DetectiveScenario;
  selectedVerdict: string | undefined;
  isSolved: boolean;
  onChooseVerdict: (verdict: 'significant' | 'noise') => void;
}

export const ScenarioEvidencePanel: React.FC<ScenarioEvidencePanelProps> = ({
  scenario,
  selectedVerdict,
  isSolved,
  onChooseVerdict,
}) => {
  const questionCards = [
    {
      label: '1. What is Changing?',
      value: scenario.whatIsChanging,
      box: 'bg-sky-50/80 border-sky-200/80',
      title: 'text-[#0369A1]',
    },
    {
      label: '2. Where is it Changing?',
      value: scenario.whereIsChanging,
      box: 'bg-amber-50/80 border-amber-200/80',
      title: 'text-amber-800',
    },
    {
      label: '3. How Much is it Changing?',
      value: scenario.howMuchIsChanging,
      box: 'bg-slate-50 border-slate-200/80',
      title: 'text-slate-700',
    },
  ];

  return (
    <>
      <div>
        <h3 className="text-xl font-orbitron font-black text-slate-900 leading-tight">
          {scenario.title}
        </h3>
        <p className="text-xs font-space font-semibold text-[#0369A1] mt-1">
          {scenario.subtitle}
        </p>
      </div>

      <div className="space-y-2.5 text-xs font-space">
        {questionCards.map((card) => (
          <div key={card.label} className={`p-3.5 rounded-2xl border ${card.box}`}>
            <span className={`${card.title} font-bold block text-[10px] uppercase font-orbitron`}>
              {card.label}
            </span>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">{card.value}</p>
          </div>
        ))}

        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
          <span className="text-[#15803D] font-bold block text-[10px] uppercase font-orbitron flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            4. Is this change what scientists call "Significant"?
          </span>
          <p className="text-emerald-950 font-medium text-xs mt-1 leading-relaxed">
            {scenario.isSignificant}
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 font-space">
        <span className="font-orbitron font-bold text-[10px] uppercase text-slate-400 block mb-1">
          Satellite Evidence Trail:
        </span>
        {scenario.evidencePoints.map((ev, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
            <p>{ev}</p>
          </div>
        ))}
      </div>

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
            onClick={() => onChooseVerdict('noise')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedVerdict === 'noise'
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
            onClick={() => onChooseVerdict('significant')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedVerdict === 'significant'
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
    </>
  );
};
