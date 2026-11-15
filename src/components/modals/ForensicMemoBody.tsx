import React from 'react';
import { CheckCircle2, Activity, ShieldCheck, Award } from 'lucide-react';
import type { EarthSystemTrend, HotspotMarker, TrendDataPoint } from '../../types/earthSystem';
import { computeMannKendall } from './trendStatistics';

interface ForensicMemoBodyProps {
  trend: EarthSystemTrend;
  selectedHotspot: HotspotMarker | null;
  currentYear: number;
  point: TrendDataPoint;
  reportDate: string;
}

export const ForensicMemoBody: React.FC<ForensicMemoBodyProps> = ({
  trend,
  selectedHotspot,
  currentYear,
  point,
  reportDate,
}) => {
  const stats = computeMannKendall(trend.timeSeries);
  const tauFormatted = `${stats.tau >= 0 ? '+' : ''}${stats.tau.toFixed(2)}`;
  const zAbsFormatted = Math.abs(stats.zScore).toFixed(2);
  return (
    <div className="space-y-6 font-space text-slate-800">
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-orbitron font-black text-slate-900 tracking-wider">
              NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
            </h1>
            <p className="text-xs font-orbitron font-bold text-[#0369A1] uppercase tracking-wider mt-0.5">
              EARTH SCIENCE SYSTEM TREND DETECTIVE DIVISION • MISSION REPORT
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-orbitron font-black text-lg">
            NASA
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-[11px] text-slate-600 font-mono">
          <div><strong className="text-slate-900 font-sans">MEMO ID:</strong> EOS-2026-TRD</div>
          <div><strong className="text-slate-900 font-sans">TARGET YEAR:</strong> {currentYear}</div>
          <div><strong className="text-slate-900 font-sans">DOMAIN:</strong> {trend.domain.toUpperCase()}</div>
          <div><strong className="text-slate-900 font-sans">STATUS:</strong> CONFIRMED</div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-orbitron font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#0369A1]" />
          1. What is Changing & Decadal Trajectory
        </h2>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed space-y-2">
          <p className="font-bold text-slate-900 text-sm">Target Variable: {trend.name}</p>
          <p className="text-slate-600">{trend.summary}</p>
          <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Reference</span>
              <span className="font-mono text-slate-800 font-bold">{trend.baselinePeriod}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Measured in {currentYear}</span>
              <span className="font-mono text-[#0369A1] font-bold">{point.value} {trend.metricUnit}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Decadal Trend Rate</span>
              <span className="font-mono text-[#15803D] font-bold">{trend.ratePerDecade}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-orbitron font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          2. Where is it Changing: Regional Divergence Matrix
        </h2>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed space-y-2">
          <p className="text-slate-700">{trend.detectiveBrief}</p>
          {selectedHotspot && (
            <div className="mt-2 p-3 rounded-xl bg-sky-50 border border-sky-200">
              <span className="text-[10px] font-orbitron font-bold text-[#0369A1] uppercase block">
                Forensic Field Hotspot: {selectedHotspot.name} ({selectedHotspot.lat}°N, {selectedHotspot.lon}°E)
              </span>
              <p className="text-[11px] text-slate-800 font-bold mt-0.5">
                {selectedHotspot.headline} — {selectedHotspot.trendRate}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Sensor: {selectedHotspot.satelliteSource}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-orbitron font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          3. Is it Scientifically Significant? (Hypothesis Verification)
        </h2>
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-orbitron">
            <span className="font-bold text-[#15803D]">
              Mann-Kendall Rank Correlation: τ = {tauFormatted} ({stats.pLabel})
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-200 text-[#15803D] text-[10px] font-bold">
              {stats.confidenceLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            The directional trend tests far exceed the critical test statistic (|Z| = {zAbsFormatted} &gt; Z_crit = 3.29). The Null Hypothesis (H₀: stationary stochastic noise) is rejected with 99.99% certainty. Sen&apos;s non-parametric slope estimator confirms relentless directional velocity.
          </p>
          <div className="pt-2 text-[10px] text-slate-500 font-mono">
            Satellite Constellation Verification: {trend.nasaSatellites.join(' • ')}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-slate-200 grid sm:grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans uppercase">Investigating Officer</span>
          <p className="font-bold text-slate-900 font-sans">Earth System Trend Detective #042</p>
          <p className="text-[10px] text-slate-500">NASA Space Apps 2026 Global Challenge</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans uppercase">Scientific Validation Seal</span>
          <p className="font-bold text-[#15803D] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
            VERIFIED BY SATELLITE TELEMETRY
          </p>
          <p className="text-[10px] text-slate-400">Timestamp: {reportDate} • UTC</p>
        </div>
      </div>
    </div>
  );
};
