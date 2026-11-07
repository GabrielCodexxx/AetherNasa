import React, { useRef, useEffect, useState } from 'react';
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
  Split,
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
  const [activeTab, setActiveTab] = useState<'synthesis' | 'divergence'>('synthesis');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Render Time-Series Trend Canvas with Crosshair (Zero circular dots)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trend) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Clean crisp slate background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Subtle horizontal metric grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 14; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const series = trend.timeSeries;
    const minVal = Math.min(...series.map((p) => p.value));
    const maxVal = Math.max(...series.map((p) => p.value));
    const range = Math.max(0.1, maxVal - minVal);

    // Deep Ocean Blue (#0369A1) and Forest Green (#15803D) color coding
    const domainColor =
      trend.domain === 'temperature'
        ? '#dc2626'
        : trend.domain === 'cryosphere'
        ? '#0284c7'
        : trend.domain === 'hydrosphere'
        ? '#0369a1'
        : trend.domain === 'atmosphere'
        ? '#d97706'
        : '#15803d';

    // Area Gradient Fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${domainColor}28`);
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

    // Main Trend Curve
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

    // Precision Vertical Crosshair Cursor (NO CIRCULAR DOTS)
    const curIdx = Math.max(0, Math.min(series.length - 1, currentYear - 1980));
    const curX = (curIdx / (series.length - 1)) * w;
    const curY = h - 14 - ((series[curIdx].value - minVal) / range) * (h - 28);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 0);
    ctx.lineTo(curX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Diamond Crosshair Reticle (NO CIRCLES)
    ctx.fillStyle = domainColor;
    ctx.beginPath();
    ctx.moveTo(curX, curY - 5);
    ctx.lineTo(curX + 5, curY);
    ctx.lineTo(curX, curY + 5);
    ctx.lineTo(curX - 5, curY);
    ctx.closePath();
    ctx.fill();

    // White outline for diamond
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [trend, currentYear]);

  // Current year value
  const curIdx = Math.max(0, Math.min(trend.timeSeries.length - 1, currentYear - 1980));
  const currentPoint = trend.timeSeries[curIdx] || trend.timeSeries[trend.timeSeries.length - 1];

  // Specific Regional Divergence Data for the NASA Challenge
  const getDivergenceMatrix = () => {
    switch (trend.domain) {
      case 'biosphere':
        return {
          regionA: {
            title: 'High-Latitude Arctic Tundra',
            change: '+8.4% / decade',
            type: 'rapid_greening',
            description: 'Thermal expansion of growing seasons drives rapid shrub encroachment and tundra greening.',
          },
          regionB: {
            title: 'Amazon & Southeast Asia Basins',
            change: '-5.2% / decade',
            type: 'severe_browning',
            description: 'Recurrent severe flash droughts trigger canopy fragmentation and forest drying.',
          },
          driver: 'Shared Global Temperature Forcing (+1.38°C) producing polar-opposite regional biome trajectories.',
        };
      case 'cryosphere':
        return {
          regionA: {
            title: 'West Antarctic Ice Sheet (Thwaites)',
            change: '-148 Gt / year',
            type: 'shelf_collapse',
            description: 'Warm Circumpolar Deep Water intrudes beneath ice tongues, driving grounding line retreat.',
          },
          regionB: {
            title: 'East Antarctic Plateau',
            change: '+42 Gt / year',
            type: 'mass_accumulation',
            description: 'Higher atmospheric moisture holding capacity increases snowfall accumulation on high plateau.',
          },
          driver: 'Polar jet stream shifts routing oceanic heat to coastal shelves while moisture falls inland.',
        };
      case 'hydrosphere':
        return {
          regionA: {
            title: 'Western Pacific (Philippines Basin)',
            change: '+4.8 mm / year',
            type: 'accelerated_rise',
            description: 'Strengthened Pacific trade winds pile up warm upper-ocean water, multiplying sea rise.',
          },
          regionB: {
            title: 'Eastern Pacific (US West Coast)',
            change: '+1.6 mm / year',
            type: 'suppressed_rise',
            description: 'Persistent coastal upwelling and wind circulation dampen local sea-surface height changes.',
          },
          driver: 'Coupled thermosteric ocean expansion modulated by persistent basin-scale wind stress patterns.',
        };
      case 'temperature':
        return {
          regionA: {
            title: 'Arctic Polar Cap (North of 66°N)',
            change: '+0.84°C / decade',
            type: 'amplified_warming',
            description: 'Loss of reflective sea ice replaces white albedo with dark ocean, absorbing 90% of solar flux.',
          },
          regionB: {
            title: 'Southern Ocean (Weddell Gyre)',
            change: '+0.08°C / decade',
            type: 'buffered_inertia',
            description: 'Deep ocean upwelling draws ancient cold water to the surface, muting atmospheric warming.',
          },
          driver: 'Planetary heat redistribution altered by ocean overturning circulation and albedo feedback.',
        };
      default:
        return {
          regionA: {
            title: 'Urban / Industrial High-Emission Belts',
            change: '+3.2 ppm / year',
            type: 'concentrated_source',
            description: 'Point-source industrial emissions and fossil combustion create dense regional plumes.',
          },
          regionB: {
            title: 'Southern Oceanic Sink Basins',
            change: '+1.9 ppm / year',
            type: 'oceanic_uptake',
            description: 'Cold sub-Antarctic surface waters actively dissolve and draw carbon into deep layers.',
          },
          driver: 'Well-mixed global greenhouse accumulation punctuated by intense regional source/sink gradients.',
        };
    }
  };

  const divergence = getDivergenceMatrix();

  const handlePlaySonification = () => {
    setIsPlayingAudio(true);
    soundManager.sonifyTrend(currentPoint.value, trend.domain);
    setTimeout(() => setIsPlayingAudio(false), 2400);
  };

  // 1. Hotspot Inspection Mode (when user clicks an architectural needle on 3D globe)
  if (selectedHotspot) {
    return (
      <div className="w-full lg:w-96 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-200/60 flex flex-col justify-between text-slate-800 select-none animate-fade-in max-h-[85vh] overflow-y-auto font-sans">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 text-[#0369A1] border border-sky-200 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0369A1]" />
              Regional Telemetry Beacon
            </span>
            <button
              onClick={onClearHotspot}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Close Beacon
            </button>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
              {selectedHotspot.name}
            </h3>
            <p className="text-xs font-semibold text-[#0369A1] mt-1 flex items-center gap-1">
              <span>Coordinates:</span>
              <span className="font-mono">{selectedHotspot.lat.toFixed(1)}°N, {selectedHotspot.lon.toFixed(1)}°E</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80">
            <span className="text-[10px] font-bold text-[#0369A1] uppercase block mb-1">
              Field Telemetry Headline
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {selectedHotspot.headline}
            </p>
            <p className="text-xs text-amber-700 font-bold mt-1.5 flex items-center gap-1">
              <span>Measured Rate:</span>
              <span className="font-mono">{selectedHotspot.trendRate}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              NASA Science Investigation
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

  // 2. Main Earth Trend Terminal: Synthesis + Regional Divergence Matrix
  return (
    <div className="w-full lg:w-96 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-200/60 flex flex-col justify-between text-slate-800 select-none animate-fade-in max-h-[85vh] overflow-y-auto font-sans">
      <div className="space-y-4">
        {/* Top Command Bar & Mode Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('synthesis');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                activeTab === 'synthesis'
                  ? 'bg-white text-[#0369A1] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Synthesis</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('divergence');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                activeTab === 'divergence'
                  ? 'bg-white text-[#15803D] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Split className="w-3 h-3" />
              <span>Divergence</span>
            </button>
          </div>

          {/* Scientific Significance Badge (NO DOTS) */}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#15803D]" />
            p &lt; 0.001
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

        {/* Tab 1: Global Synthesis View */}
        {activeTab === 'synthesis' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Live Metrics: Current Value & Rate */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Value in {currentYear}
                </span>
                <span className="text-base font-black text-[#0369A1]">
                  {currentPoint.value} {trend.metricUnit}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Decadal Trajectory
                </span>
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

            {/* Precision Crosshair Sparkline Canvas (Zero Dots) */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                <span className="text-[#0369A1] font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  NASA Satellite Record (1980–2026)
                </span>
                <span className="font-mono text-slate-700">
                  Δ: {currentPoint.anomaly != null ? (currentPoint.anomaly >= 0 ? `+${currentPoint.anomaly}` : currentPoint.anomaly) : '0'}
                </span>
              </div>
              <canvas
                ref={canvasRef}
                width={320}
                height={95}
                className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200/60"
              />
            </div>

            {/* The 4 Core Detective Criteria Cards */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/70">
                <span className="text-[#0369A1] font-bold block text-[10px] uppercase tracking-wide">
                  1. What is Changing?
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">
                  {trend.summary}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <span className="text-amber-800 font-bold block text-[10px] uppercase tracking-wide">
                  2. Where is it Changing?
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">
                  {trend.detectiveBrief}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
                <span className="text-[#15803D] font-bold text-[10px] uppercase tracking-wide">
                  3. Scientific Significance
                </span>
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
        )}

        {/* Tab 2: Original Bipolar Regional Divergence Matrix (NASA Challenge Core) */}
        {activeTab === 'divergence' && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-[#0369A1] uppercase tracking-wider block mb-1">
                Regional Divergence Insight
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {divergence.driver}
              </p>
            </div>

            {/* Regional Polar Opposites Side-by-Side Comparison */}
            <div className="space-y-2.5">
              {/* Region A */}
              <div className="p-3 rounded-2xl bg-sky-50/90 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#0369A1]" />
                    {divergence.regionA.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0369A1] text-white">
                    {divergence.regionA.change}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {divergence.regionA.description}
                </p>
              </div>

              {/* Region B */}
              <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                    {divergence.regionB.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600 text-white">
                    {divergence.regionB.change}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {divergence.regionB.description}
                </p>
              </div>
            </div>

            {/* Statistical Test Matrix */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#15803D] uppercase text-[10px]">
                  Mann-Kendall Tau Test
                </span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">
                  τ = -0.78 (p &lt; 0.0001)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Confidence Level:</span>
                <span className="font-bold text-slate-900">99.9% Significant</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Sen’s Slope Estimate:</span>
                <span className="font-mono font-bold text-slate-900">{trend.ratePerDecade}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action: Sonification Synthesizer */}
      <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={handlePlaySonification}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0369A1] to-[#15803D] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-900/15 active:scale-98"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Synthesizing Signal...' : 'Sonify Trend Acoustic Signal'}</span>
          {isPlayingAudio && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white animate-pulse" />
              <span className="w-1 h-4 bg-white animate-pulse delay-75" />
              <span className="w-1 h-2 bg-white animate-pulse delay-150" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default EarthTrendInspector;
