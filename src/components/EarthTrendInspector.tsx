import React, { useRef, useEffect } from 'react';
import type { EarthSystemTrend, HotspotMarker } from '../types/earthSystem';
import {
  Volume2,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Radio,
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

  // Render Time-Series Trend Canvas (Light Mode Clean Palette)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trend) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Light frosted background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid Lines
    ctx.strokeStyle = '#e2e8f0';
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

    // Deep Ocean Blue (#0369A1) and Forest Green (#15803D) trend colors
    const domainColor =
      trend.domain === 'temperature'
        ? '#dc2626' // Rose Red
        : trend.domain === 'cryosphere'
        ? '#0284c7' // Glacier Blue
        : trend.domain === 'hydrosphere'
        ? '#0369a1' // Deep Ocean Blue
        : trend.domain === 'atmosphere'
        ? '#d97706' // Amber
        : '#15803d'; // Forest Green

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${domainColor}33`);
    grad.addColorStop(1, '#f8fafc00');

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
    ctx.lineWidth = 2.4;
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

    ctx.strokeStyle = '#0f172a';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 0);
    ctx.lineTo(curX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current Marker Point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = domainColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }, [trend, currentYear]);

  // Current year value
  const curIdx = Math.max(0, Math.min(trend.timeSeries.length - 1, currentYear - 1980));
  const currentPoint = trend.timeSeries[curIdx] || trend.timeSeries[trend.timeSeries.length - 1];

  if (selectedHotspot) {
    return (
      <div className="w-full lg:w-96 bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-xl shadow-slate-200/60 flex flex-col justify-between text-slate-800 select-none animate-fade-in max-h-[85vh] overflow-y-auto font-sans">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0369A1] border border-sky-200/80 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0369A1]" />
              Regional Trend Hotspot
            </span>
            <button
              onClick={onClearHotspot}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
              {selectedHotspot.name}
            </h3>
            <p className="text-xs font-semibold text-[#0369A1] mt-1">
              {selectedHotspot.lat.toFixed(1)}°N, {selectedHotspot.lon.toFixed(1)}°E
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80">
            <span className="text-[10px] font-bold text-[#0369A1] uppercase block mb-1">
              Headline Observation
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {selectedHotspot.headline}
            </p>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Rate: {selectedHotspot.trendRate}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Field Science Investigation
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {selectedHotspot.observationNote}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#0369A1] shrink-0" />
            <span>Telemetry: {selectedHotspot.satelliteSource}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              soundManager.sonifyTrend(currentPoint.value, selectedHotspot.domain);
            }}
            className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100/70 text-[#0369A1] border border-sky-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Regional Acoustic Signature</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-xl shadow-slate-200/60 flex flex-col justify-between text-slate-800 select-none animate-fade-in max-h-[85vh] overflow-y-auto font-sans">
      <div className="space-y-4">
        {/* Header with Statistical Significance Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-[#0369A1] border border-sky-200 uppercase flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#0369A1]" />
            Earth Trend Variable
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#15803D]" />
            Significant (p &lt; 0.001)
          </span>
        </div>

        {/* Variable Title */}
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
            {trend.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Unit: <span className="text-[#0369A1] font-bold">{trend.metricUnit}</span> • Year:{' '}
            <span className="text-slate-900 font-bold">{currentYear}</span>
          </p>
        </div>

        {/* Live Metrics: Current Value & Rate */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Value in {currentYear}</span>
            <span className="text-base font-black text-[#0369A1]">
              {currentPoint.value} {trend.metricUnit}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate of Change</span>
            <span className="text-xs font-bold text-[#15803D] flex items-center gap-1 mt-0.5">
              {trend.trendDirection === 'rising' || trend.trendDirection === 'accelerating' ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-600" />
              )}
              {trend.ratePerDecade}
            </span>
          </div>
        </div>

        {/* Canvas Time-Series Trend Line (1980 - 2026) */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <span className="text-[#0369A1] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              NASA Satellite Series (1980–2026)
            </span>
            <span>Delta: {currentPoint.anomaly != null ? (currentPoint.anomaly >= 0 ? `+${currentPoint.anomaly}` : currentPoint.anomaly) : '0'}</span>
          </div>
          <canvas ref={canvasRef} width={320} height={95} className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200/60" />
        </div>

        {/* The 4 Core Detective Criteria Cards */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/70">
            <span className="text-[#0369A1] font-bold block text-[10px] uppercase tracking-wide">1. What is Changing?</span>
            <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">{trend.summary}</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
            <span className="text-amber-800 font-bold block text-[10px] uppercase tracking-wide">2. Where & Regional Divergence?</span>
            <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">{trend.detectiveBrief}</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
            <span className="text-[#15803D] font-bold text-[10px] uppercase tracking-wide">3. Is it Significant?</span>
            <button
              onClick={onOpenEncyclopedia}
              className="text-[11px] font-bold text-slate-900 hover:text-[#0369A1] flex items-center gap-1 underline"
            >
              <span>{trend.significance}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action: Sonify & Briefing */}
      <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.sonifyTrend(currentPoint.value, trend.domain);
          }}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0369A1] to-[#15803D] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-900/15 active:scale-98"
        >
          <Volume2 className="w-4 h-4" />
          <span>Sonify Trend Signal</span>
        </button>
      </div>
    </div>
  );
};

export default EarthTrendInspector;
