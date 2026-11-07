import React, { useRef, useEffect } from 'react';
import type { EarthSystemTrend, HotspotMarker } from '../types/earthSystem';
import {
  Volume2,
  Sparkles,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface EarthTrendInspectorProps {
  trend: EarthSystemTrend;
  selectedHotspot: HotspotMarker | null;
  currentYear: number;
  onClearHotspot: () => void;
  onOpenEncyclopedia: () => void;
}

export const EarthTrendInspector: React.FC<EarthTrendInspectorProps> = ({
  trend,
  selectedHotspot,
  currentYear,
  onClearHotspot,
  onOpenEncyclopedia,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Time-Series Trend Canvas with Regression & Anomaly Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trend) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark sleek background
    ctx.fillStyle = '#050a17';
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 15; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const series = trend.timeSeries;
    const minVal = Math.min(...series.map((p) => p.value));
    const maxVal = Math.max(...series.map((p) => p.value));
    const range = Math.max(0.1, maxVal - minVal);

    // Draw Shaded Trend Area
    const domainColor =
      trend.domain === 'temperature'
        ? '#ef4444' // Red
        : trend.domain === 'cryosphere'
        ? '#38bdf8' // Cyan
        : trend.domain === 'hydrosphere'
        ? '#3b82f6' // Blue
        : trend.domain === 'atmosphere'
        ? '#f59e0b' // Amber
        : '#22c55e'; // Green

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${domainColor}44`);
    grad.addColorStop(1, '#050a1700');

    ctx.beginPath();
    series.forEach((pt, idx) => {
      const x = (idx / (series.length - 1)) * w;
      const y = h - 14 - ((pt.value - minVal) / range) * (h - 28);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Main Trend Line
    ctx.strokeStyle = domainColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    series.forEach((pt, idx) => {
      const x = (idx / (series.length - 1)) * w;
      const y = h - 14 - ((pt.value - minVal) / range) * (h - 28);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Current Year Scrubber Indicator Line
    const curIdx = Math.max(0, Math.min(series.length - 1, currentYear - 1980));
    const curX = (curIdx / (series.length - 1)) * w;
    const curY = h - 14 - ((series[curIdx].value - minVal) / range) * (h - 28);

    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 0);
    ctx.lineTo(curX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current Marker Point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = domainColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [trend, currentYear]);

  // Current year value
  const curIdx = Math.max(0, Math.min(trend.timeSeries.length - 1, currentYear - 1980));
  const currentPoint = trend.timeSeries[curIdx] || trend.timeSeries[trend.timeSeries.length - 1];

  if (selectedHotspot) {
    return (
      <div className="w-full lg:w-96 bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col justify-between text-slate-100 select-none animate-fade-in max-h-[85vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Regional Trend Hotspot
            </span>
            <button
              onClick={onClearHotspot}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold font-mono text-white leading-tight">
              {selectedHotspot.name}
            </h3>
            <p className="text-xs font-mono text-cyan-400 mt-1">
              {selectedHotspot.lat.toFixed(1)}°N, {selectedHotspot.lon.toFixed(1)}°E
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block mb-1">
              Headline Observation
            </span>
            <p className="text-sm font-bold text-white leading-snug">
              {selectedHotspot.headline}
            </p>
            <p className="text-xs text-amber-300 font-mono mt-1 font-bold">
              Rate: {selectedHotspot.trendRate}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
              Field Science Investigation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedHotspot.observationNote}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Telemetry: {selectedHotspot.satelliteSource}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              soundManager.sonifyTrend(currentPoint.value, selectedHotspot.domain);
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Regional Acoustic Signature</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-slate-950/85 backdrop-blur-2xl border-2 border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between text-slate-100 select-none animate-fade-in max-h-[85vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Header with Statistical Significance Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-slate-700 uppercase flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            Earth Trend Variable
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Significant (p &lt; 0.001)
          </span>
        </div>

        {/* Variable Title */}
        <div>
          <h3 className="text-lg font-bold font-mono text-white leading-tight">
            {trend.name}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Unit: <span className="text-cyan-300 font-bold">{trend.metricUnit}</span> • Year: <span className="text-white font-bold">{currentYear}</span>
          </p>
        </div>

        {/* Live Metrics: Current Value, Baseline, Rate */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Value in {currentYear}</span>
            <span className="text-base font-black text-amber-400">
              {currentPoint.value} {trend.metricUnit}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Rate of Change</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              {trend.trendDirection === 'rising' || trend.trendDirection === 'accelerating' ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
              )}
              {trend.ratePerDecade}
            </span>
          </div>
        </div>

        {/* Canvas Time-Series Trend Line (1980 - 2026) */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              NASA Satellite Time-Series (1980–2026)
            </span>
            <span>Delta: {currentPoint.anomaly != null ? (currentPoint.anomaly >= 0 ? `+${currentPoint.anomaly}` : currentPoint.anomaly) : '0'}</span>
          </div>
          <canvas ref={canvasRef} width={320} height={95} className="w-full h-24 rounded-xl bg-[#050a17]" />
        </div>

        {/* The 4 Core Detective Criteria Cards */}
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-cyan-400 font-bold block text-[10px] uppercase">1. What is Changing?</span>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">{trend.summary}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">2. Where & Regional Divergence?</span>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">{trend.detectiveBrief}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-[10px] uppercase">3. Is it Significant?</span>
            <button
              onClick={onOpenEncyclopedia}
              className="text-[11px] font-bold text-white hover:text-cyan-300 flex items-center gap-1 underline"
            >
              <span>{trend.significance}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action: Sonify & Briefing */}
      <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.sonifyTrend(currentPoint.value, trend.domain);
          }}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>Sonify Trend Signal</span>
        </button>
      </div>
    </div>
  );
};
export default EarthTrendInspector;
