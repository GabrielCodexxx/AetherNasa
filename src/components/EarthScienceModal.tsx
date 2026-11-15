import React, { useState } from 'react';
import { BookOpen, Orbit, Layers, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { ModalShell } from './modals/ModalShell';
import { EarthScienceTabs, type EarthScienceTabId } from './modals/EarthScienceTabs';

interface EarthScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCIENCE_TABS: Array<{
  id: EarthScienceTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'divergence', label: 'Regional Trend Divergence', icon: Layers },
  { id: 'significance', label: 'Statistical Significance (p < 0.001)', icon: ShieldCheck },
  { id: 'fleet', label: 'NASA Earth Observing Fleet', icon: Orbit },
];

export const EarthScienceModal: React.FC<EarthScienceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<EarthScienceTabId>('divergence');

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
      headerClassName="p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70"
      closeIconClassName="w-6 h-6"
      headerMeta={{
        icon: <BookOpen className="w-5 h-5" />,
        title: 'EARTH SYSTEM TREND DETECTIVE MANUAL',
        subtitle: (
          <p className="text-xs text-slate-500 font-medium">
            NASA Earth Science Division Reference & Statistical Methodology
          </p>
        ),
      }}
      footer={
        <>
          <span>NASA Earthdata & EOSDIS Certified</span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white font-bold transition-all shadow-sm"
          >
            Acknowledge & Close
          </button>
        </>
      }
    >
      <div className="flex border-b border-slate-200/80 bg-slate-50/40 px-6 pt-3 gap-2 overflow-x-auto">
        {SCIENCE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                isActive
                  ? 'border-[#0369A1] text-[#0369A1] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <EarthScienceTabs activeTab={activeTab} />
    </ModalShell>
  );
};

export default EarthScienceModal;
