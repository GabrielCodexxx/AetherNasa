import type { FC } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { EarthSystemTrend } from '../../types/earthSystem';
import { getDivergenceMatrix } from './divergenceData';
import { calculateMannKendallStats } from './mannKendall';
import type { DivergenceRegion } from './types';

interface DivergenceTabPanelProps {
  trend: EarthSystemTrend;
}

interface DivergenceRegionCardProps {
  region: DivergenceRegion;
  tone: 'sky' | 'rose';
}

const TONE_STYLES = {
  sky: {
    container: 'bg-sky-50/90 border-sky-200',
    icon: 'text-[#0369A1]',
    badge: 'bg-[#0369A1] text-white',
    Icon: ArrowUpRight,
  },
  rose: {
    container: 'bg-rose-50/90 border-rose-200',
    icon: 'text-rose-600',
    badge: 'bg-rose-600 text-white',
    Icon: ArrowDownRight,
  },
} as const;

const DivergenceRegionCard: FC<DivergenceRegionCardProps> = ({ region, tone }) => {
  const { container, icon, badge, Icon } = TONE_STYLES[tone];
  return (
    <div className={`p-3 rounded-2xl border space-y-1 ${container}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 font-space">
          <Icon className={`w-3.5 h-3.5 ${icon}`} />
          {region.title}
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold uppercase ${badge}`}>
          {region.change}
        </span>
      </div>
      <p className="text-[11px] font-space text-slate-600 leading-relaxed">
        {region.description}
      </p>
    </div>
  );
};

/** Displays bipolar regional divergence comparisons and Mann-Kendall statistical test metrics. */
export const DivergenceTabPanel: FC<DivergenceTabPanelProps> = ({ trend }) => {
  const divergence = getDivergenceMatrix(trend.domain);
  const mkStats = calculateMannKendallStats(trend.timeSeries);

  return (
    <div className="space-y-3.5 animate-fade-in">
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <span className="text-[10px] font-orbitron font-bold text-[#0369A1] uppercase tracking-wider block mb-1">
          Regional Divergence Insight
        </span>
        <p className="text-xs font-space text-slate-600 leading-relaxed">
          {divergence.driver}
        </p>
      </div>

      <div className="space-y-2.5">
        <DivergenceRegionCard region={divergence.regionA} tone="sky" />
        <DivergenceRegionCard region={divergence.regionB} tone="rose" />
      </div>

      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-orbitron font-bold text-[#15803D] uppercase text-[10px]">
            Mann-Kendall Tau Test
          </span>
          <span className="font-mono font-bold text-slate-800 text-[11px]">
            τ = {mkStats.tau.toFixed(2)} ({mkStats.pLabel})
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-space">
          <span>Confidence Level:</span>
          <span className="font-bold text-slate-900">{mkStats.confidenceLabel}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-space">
          <span>Sen’s Slope Estimate:</span>
          <span className="font-mono font-bold text-slate-900">{trend.ratePerDecade}</span>
        </div>
      </div>
    </div>
  );
};
