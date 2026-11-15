import type { FC } from 'react';
import type { EarthSystemTrend } from '../../types/earthSystem';
import { calculateTrendCorrelation } from './inspectorMath';
import { TrendSparklineCanvas } from './TrendSparklineCanvas';

interface CorrelationTabPanelProps {
  trend: EarthSystemTrend;
  otherTrends: EarthSystemTrend[];
  compareTrend: EarthSystemTrend | undefined;
  currentYear: number;
  onSelectCompareTrend: (trendId: string) => void;
}

/** Multi-variable cross-correlation engine tab with dual sparkline and Pearson statistics. */
export const CorrelationTabPanel: FC<CorrelationTabPanelProps> = ({
  trend,
  otherTrends,
  compareTrend,
  currentYear,
  onSelectCompareTrend,
}) => {
  const correlationStats = calculateTrendCorrelation(trend, compareTrend);

  return (
    <div className="space-y-3 animate-fade-in text-xs font-space">
      <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
        <span className="text-[10px] font-orbitron font-bold text-indigo-900 uppercase tracking-wider block">
          Select 2nd Comparison Variable
        </span>

        <select
          value={compareTrend?.id ?? ''}
          onChange={(e) => onSelectCompareTrend(e.target.value)}
          className="w-full p-2 rounded-xl bg-white border border-indigo-200 text-xs font-space font-bold text-slate-800"
        >
          {otherTrends.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.metricUnit})
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 space-y-1 shadow-xs">
        <div className="flex items-center justify-between text-[9px] font-space font-bold text-slate-500">
          <span className="text-[#0369A1]">Solid Line: {trend.name.split(' ')[0]}</span>
          <span className="text-slate-500">
            Dashed Line: {compareTrend?.name.split(' ')[0]}
          </span>
        </div>
        <TrendSparklineCanvas
          trend={trend}
          compareTrend={compareTrend}
          currentYear={currentYear}
        />
      </div>

      <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-orbitron font-bold uppercase text-slate-400">
            Pearson Correlation (r)
          </span>
          <span className="font-orbitron font-black text-sm text-[#0369A1]">
            r = {correlationStats.r}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-orbitron font-bold uppercase text-slate-400">
            Goodness of Fit (R²)
          </span>
          <span className="font-orbitron font-black text-sm text-[#15803D]">
            R² = {correlationStats.r2}
          </span>
        </div>

        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 leading-snug">
          <span className="font-orbitron font-bold text-[9px] text-[#0369A1] uppercase block mb-0.5">
            Physical Coupling Analysis
          </span>
          {correlationStats.lag}
        </div>
      </div>
    </div>
  );
};
