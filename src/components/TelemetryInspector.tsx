import React, { useRef, useEffect } from 'react';
import type { MoonquakeEvent, ApolloStation } from '../types/moonquake';
import { Volume2, Sparkles, Activity, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TelemetryInspectorProps {
  selectedEvent: MoonquakeEvent | null;
  selectedStation: ApolloStation | null;
  onClearStation: () => void;
  onOpenBriefing: () => void;
}

export const TelemetryInspector: React.FC<TelemetryInspectorProps> = ({
  selectedEvent,
  selectedStation,
  onClearStation,
  onOpenBriefing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Seismogram Waveform Trace inside the telemetry inspector card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedEvent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      offset += 0.8;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Dark background
      ctx.fillStyle = '#050a17';
      ctx.fillRect(0, 0, w, h);

      // Subtle horizontal baseline & grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 15; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#334155';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Seismic Trace
      const color =
        selectedEvent.category === 'shallow'
          ? '#ef4444' // Red
          : selectedEvent.category === 'deep'
          ? '#a855f7' // Purple
          : selectedEvent.category === 'artificial_impact'
          ? '#06b6d4' // Cyan
          : '#eab308'; // Yellow

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      const wave = selectedEvent.waveformData;
      for (let x = 0; x < w; x++) {
        const waveIdx = Math.floor((x + offset) % wave.length);
        const nextIdx = (waveIdx + 1) % wave.length;
        const frac = (x + offset) % 1;

        const val1 = wave[waveIdx];
        const val2 = wave[nextIdx];
        const interpolated = val1 + (val2 - val1) * frac;

        const y = midY - (interpolated / (selectedEvent.magnitude * 18)) * (h * 0.42);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [selectedEvent]);

  if (selectedStation) {
    return (
      <div className="w-full lg:w-96 bg-slate-950/85 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col justify-between text-slate-100 select-none animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              APSE Seismic Station
            </span>
            <button
              onClick={onClearStation}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold font-mono text-white leading-tight">
              {selectedStation.name}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Mission: <span className="text-cyan-300 font-bold">{selectedStation.mission}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Lunar Position</span>
              <span className="text-white font-bold text-[11px]">
                {selectedStation.lat.toFixed(2)}°N, {selectedStation.lon.toFixed(2)}°E
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Deployed Date</span>
              <span className="text-emerald-400 font-bold text-[11px]">{selectedStation.deployedDate}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
              Sensor Instrumentation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedStation.seismometerType}. Powered uninterrupted for up to 8 years by the SNAP-27 nuclear radioisotope thermoelectric generator (RTG).
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (selectedEvent) {
                soundManager.sonifyMoonquake(selectedEvent.magnitude, selectedEvent.category);
              } else {
                soundManager.playClick();
              }
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test Station Acoustic Signal</span>
          </button>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="w-full lg:w-96 bg-slate-950/80 backdrop-blur-2xl border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs gap-3">
        <MapPin className="w-8 h-8 text-slate-600 animate-bounce" />
        <p>Select any lunar epicenter marker or Apollo station on the 3D globe to inspect telemetry dossier.</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-slate-950/85 backdrop-blur-2xl border-2 border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between text-slate-100 select-none animate-fade-in max-h-[85vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Category & Artemis Risk Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
              selectedEvent.category === 'shallow'
                ? 'bg-red-950 text-red-300 border-red-700/60'
                : selectedEvent.category === 'deep'
                ? 'bg-purple-950 text-purple-300 border-purple-700/60'
                : selectedEvent.category === 'artificial_impact'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                : 'bg-yellow-950 text-yellow-300 border-yellow-700/60'
            }`}
          >
            {selectedEvent.category.replace('_', ' ')} Quake
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
              selectedEvent.artemisRisk === 'CRITICAL'
                ? 'bg-rose-900/70 text-rose-200 border border-rose-600'
                : selectedEvent.artemisRisk === 'MODERATE'
                ? 'bg-amber-900/70 text-amber-200 border border-amber-600'
                : 'bg-emerald-900/70 text-emerald-200 border border-emerald-600'
            }`}
          >
            Risk: {selectedEvent.artemisRisk}
          </span>
        </div>

        {/* Title & Date */}
        <div>
          <h3 className="text-lg font-bold font-mono text-white leading-tight">
            {selectedEvent.name}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {selectedEvent.dateStr}
          </p>
        </div>

        {/* Core Metrics: Magnitude, Depth, Duration */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Magnitude</span>
            <span className="text-base font-black text-amber-400">
              M {selectedEvent.magnitude}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Focal Depth</span>
            <span className="text-xs font-bold text-white">
              {selectedEvent.depthKm} km
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Duration</span>
            <span className="text-xs font-bold text-cyan-400">
              {selectedEvent.durationMinutes}m
            </span>
          </div>
        </div>

        {/* Live Seismogram Trace inside Dossier */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Activity className="w-3 h-3 animate-pulse" />
              APSE Seismic Trace
            </span>
            <span>Acc: {(selectedEvent.magnitude * 2.8).toFixed(1)} μm/s²</span>
          </div>
          <canvas
            ref={canvasRef}
            width={320}
            height={85}
            className="w-full h-20 rounded-xl bg-[#050a17]"
          />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 font-sans">
          {selectedEvent.description}
        </p>

        {/* Science Insight */}
        <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-bold text-indigo-300 uppercase text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Planetary Physics Insight
            </span>
            <button
              onClick={onOpenBriefing}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>Briefing</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
            {selectedEvent.scienceNote}
          </p>
        </div>
      </div>

      {/* Action: Play Audio Sonification */}
      <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.sonifyMoonquake(selectedEvent.magnitude, selectedEvent.category);
          }}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>Play Seismic Sonification</span>
        </button>
      </div>
    </div>
  );
};
export default TelemetryInspector;
