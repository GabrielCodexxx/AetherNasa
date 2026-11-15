import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Volume2, Search } from 'lucide-react';
import { DETECTIVE_SCENARIOS, EARTH_SYSTEM_TRENDS } from '../utils/earthSystemData';
import type { DetectiveScenario, EarthSystemTrend, SystemViewMode } from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';
import { ModalShell } from './modals/ModalShell';
import { ScenarioEvidencePanel } from './modals/ScenarioEvidencePanel';

interface DetectiveScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DetectiveScenario) => void;
  onSelectTrend?: (trendId: string) => void;
  onChangeViewMode?: (viewMode: SystemViewMode) => void;
  trends?: EarthSystemTrend[];
}

export const DetectiveScenariosModal: React.FC<DetectiveScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  trends: propTrends,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [solvedCases, setSolvedCases] = useState<Record<number, boolean>>({});
  const [selectedVerdict, setSelectedVerdict] = useState<Record<number, string>>({});
  const trends = propTrends ?? EARTH_SYSTEM_TRENDS;

  const current = DETECTIVE_SCENARIOS[currentIdx];

  const handleSelectIdx = (idx: number) => {
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

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      variant="floating"
      panelClassName="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-800 max-h-[85vh] overflow-y-auto"
      headerClassName="flex items-center justify-between pb-3 border-b border-slate-200"
      closeButtonClassName="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all"
      closeIconClassName="w-4 h-4"
      headerContent={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-[#0369A1] text-xs font-orbitron font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#0369A1]" />
            Case File 0{currentIdx + 1}
          </span>
          <span className="text-xs font-orbitron font-semibold text-slate-400">
            {current.caseNumber} ({currentIdx + 1}/{DETECTIVE_SCENARIOS.length})
          </span>
        </div>
      }
      footerClassName="pt-3 border-t border-slate-200 flex items-center justify-between gap-3"
      footer={
        <>
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
              onClick={() => currentIdx > 0 && handleSelectIdx(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {DETECTIVE_SCENARIOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectIdx(idx)}
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
              onClick={() =>
                currentIdx < DETECTIVE_SCENARIOS.length - 1 && handleSelectIdx(currentIdx + 1)
              }
              disabled={currentIdx === DETECTIVE_SCENARIOS.length - 1}
              className="p-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      }
    >
      <ScenarioEvidencePanel
        scenario={current}
        selectedVerdict={selectedVerdict[currentIdx]}
        isSolved={Boolean(solvedCases[currentIdx])}
        onChooseVerdict={handleChooseVerdict}
      />
    </ModalShell>
  );
};

export default DetectiveScenariosModal;
