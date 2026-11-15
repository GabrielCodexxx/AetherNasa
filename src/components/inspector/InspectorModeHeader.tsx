import type { FC } from 'react';
import {
  Activity,
  Link2,
  ShieldCheck,
  SlidersHorizontal,
  Split,
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import type { InspectorTab, SignificanceAlpha } from './types';

interface InspectorModeHeaderProps {
  trendName: string;
  metricUnit: string;
  currentYear: number;
  activeTab: InspectorTab;
  significanceAlpha: SignificanceAlpha;
  onSelectTab: (tab: InspectorTab) => void;
  onSelectAlpha: (alpha: SignificanceAlpha) => void;
}

interface ModeTabOption {
  id: InspectorTab;
  label: string;
  Icon: typeof Activity;
  activeClass: string;
}

const MODE_TABS: readonly ModeTabOption[] = [
  {
    id: 'synthesis',
    label: 'Synthesis',
    Icon: Activity,
    activeClass: 'bg-white text-[#0369A1] shadow-xs',
  },
  {
    id: 'divergence',
    label: 'Divergence',
    Icon: Split,
    activeClass: 'bg-white text-[#15803D] shadow-xs',
  },
  {
    id: 'correlation',
    label: 'Cross-Corr',
    Icon: Link2,
    activeClass: 'bg-white text-indigo-700 shadow-xs',
  },
];

const ALPHA_OPTIONS: readonly SignificanceAlpha[] = ['0.05', '0.01', '0.001'];

/** Top mode switcher, active variable header, and p-value significance sieve filter bar. */
export const InspectorModeHeader: FC<InspectorModeHeaderProps> = ({
  trendName,
  metricUnit,
  currentYear,
  activeTab,
  significanceAlpha,
  onSelectTab,
  onSelectAlpha,
}) => {
  return (
    <>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          {MODE_TABS.map(({ id, label, Icon, activeClass }) => (
            <button
              key={id}
              onClick={() => {
                soundManager.playClick();
                onSelectTab(id);
              }}
              className={`px-2 py-1 rounded-lg text-[9px] font-orbitron font-bold uppercase transition-all flex items-center gap-1 ${
                activeTab === id ? activeClass : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <span className="px-2 py-0.5 rounded-md text-[9px] font-orbitron font-bold uppercase bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#15803D]" />
          p &lt; {significanceAlpha}
        </span>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-orbitron font-extrabold text-slate-900 leading-tight">
          {trendName}
        </h3>
        <p className="text-xs font-space font-medium text-slate-500 mt-1">
          Unit: <span className="text-[#0369A1] font-bold">{metricUnit}</span> • Year:{' '}
          <span className="text-slate-900 font-bold">{currentYear}</span>
        </p>
      </div>

      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-space font-bold uppercase text-slate-500">
          <span className="flex items-center gap-1 text-[#0369A1]">
            <SlidersHorizontal className="w-3 h-3" />
            Significance Sieve (p-Value Noise Filter)
          </span>
          <span className="font-mono text-emerald-700 font-bold">SNR: 4.8σ</span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {ALPHA_OPTIONS.map((alpha) => (
            <button
              key={alpha}
              onClick={() => {
                soundManager.playClick();
                onSelectAlpha(alpha);
              }}
              className={`py-1 rounded-lg text-[9px] font-orbitron font-bold uppercase transition-all ${
                significanceAlpha === alpha
                  ? 'bg-[#0369A1] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              α = {alpha}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
