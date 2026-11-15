import type { FC } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import type { EarthSystemTrend, TrendDataPoint } from '../../types/earthSystem';
import { formatAnomalyDelta } from './inspectorMath';
import { TrendSparklineCanvas } from './TrendSparklineCanvas';

interface SynthesisTabPanelProps {
  trend: EarthSystemTrend;
  currentYear: number;
  currentPoint: TrendDataPoint;
  onOpenEncyclopedia: () => void;
}

/** Global synthesis tab showing live value, sparkline canvas, and 3 forensic criteria cards. */
export const SynthesisTabPanel: FC<SynthesisTabPanelProps> = ({
  trend,
  currentYear,
  currentPoint,
  onOpenEncyclopedia,
}) => {
  const isUpwardTrend =
    trend.trendDirection === 'rising' || trend.trendDirection === 'accelerating';

  return (
    <div className="space-y-3.5 animate-fade-in">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-space font-bold tracking-wider">
            Value in {currentYear}
          </span>
          <span className="text-base font-orbitron font-black text-[#0369A1]">
            {currentPoint.value} {trend.metricUnit}
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-space font-bold tracking-wider">
            Decadal Trajectory
          </span>
          <span className="text-xs font-orbitron font-bold text-[#15803D] flex items-center gap-1 mt-0.5">
            {isUpwardTrend ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-sky-600" />
            )}
            {trend.ratePerDecade}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
          <span className="text-[#0369A1] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            NASA Satellite Record (1980–2026)
          </span>
          <span className="font-mono text-slate-700">
            Δ: {formatAnomalyDelta(currentPoint.anomaly)}
          </span>
        </div>
        <TrendSparklineCanvas trend={trend} currentYear={currentYear} />
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/70">
          <span className="text-[#0369A1] font-space font-bold block text-[10px] uppercase tracking-wide">
            1. What is Changing?
          </span>
          <p className="text-[11px] font-space text-slate-700 leading-relaxed mt-0.5">
            {trend.summary}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
          <span className="text-amber-800 font-space font-bold block text-[10px] uppercase tracking-wide">
            2. Where is it Changing?
          </span>
          <p className="text-[11px] font-space text-slate-700 leading-relaxed mt-0.5">
            {trend.detectiveBrief}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
          <span className="text-[#15803D] font-space font-bold text-[10px] uppercase tracking-wide">
            3. Scientific Significance
          </span>
          <button
            onClick={onOpenEncyclopedia}
            className="text-[11px] font-space font-bold text-slate-900 hover:text-[#0369A1] flex items-center gap-1 underline"
          >
            <span>{trend.significance}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
