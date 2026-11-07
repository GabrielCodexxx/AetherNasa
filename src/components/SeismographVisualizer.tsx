import React, { useRef, useEffect } from 'react';
import type { MoonquakeEvent } from '../types/moonquake';
import { Activity, Volume2, ShieldAlert } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SeismographVisualizerProps {
  event: MoonquakeEvent | null;
}

export const SeismographVisualizer: React.FC<SeismographVisualizerProps> = ({ event }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Seismogram Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !event) return;
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

      // Dark seismic grid background
      ctx.fillStyle = '#050a17';
      ctx.fillRect(0, 0, w, h);

      // Subtle horizontal baseline and amplitude grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 20; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Center Baseline
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Seismic Trace
      const color =
        event.category === 'shallow'
          ? '#ef4444' // Red
          : event.category === 'deep'
          ? '#a855f7' // Purple
          : event.category === 'artificial_impact'
          ? '#06b6d4' // Cyan
          : '#eab308'; // Yellow

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const wave = event.waveformData;
      for (let x = 0; x < w; x++) {
        const waveIdx = Math.floor((x + offset) % wave.length);
        const amp = wave[waveIdx] * 1.5;
        const y = midY + amp;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Stylized recording needle on the right
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(w - 20, midY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [event]);

  if (!event) {
    return (
      <div className="bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-6 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center min-h-[220px]">
        <Activity className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
        <span>SELECT A MOONQUAKE FROM THE 3D GLOBE OR LIST TO VIEW SEISMOGRAM TELEMETRY</span>
      </div>
    );
  }

  const handleSonify = () => {
    soundManager.sonifyMoonquake(event.magnitude, event.category);
  };

  return (
    <div className="bg-slate-950/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              APSE SEISMIC TELEMETRY CHANNEL &bull; {event.category.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-black text-white">{event.name}</h3>
          <p className="text-xs text-slate-400 font-mono">
            Recorded: <span className="text-slate-300">{event.dateStr}</span> &bull; Depth:{' '}
            <span className="text-cyan-300 font-bold">{event.depthKm} km</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sonification Button */}
          <button
            onClick={handleSonify}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all"
            title="Convert seismogram vibrations into audible acoustic sound"
          >
            <Volume2 className="w-4 h-4" />
            <span>Sonify Seismic Wave</span>
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800">
        <canvas
          ref={canvasRef}
          width={760}
          height={140}
          className="w-full h-auto block"
        />

        {/* Live Overlay Chips */}
        <div className="absolute top-2 left-3 flex items-center gap-2 text-[10px] font-mono">
          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
            CH-Z Ground Accel: &plusmn;{(event.magnitude * 2.3).toFixed(1)} &mu;m/s&sup2;
          </span>
          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-cyan-300 border border-slate-800">
            Ringing: {event.durationMinutes} mins
          </span>
        </div>
      </div>

      {/* Key Science Insight Box: Moonquake vs Earthquake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="font-bold text-amber-400 block font-mono">
            Why Moonquakes Ring for Minutes:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Unlike Earth rocks soaked in groundwater that quickly absorb seismic energy within 60 seconds, 
            the lunar crust is completely dry and heavily fractured by billions of impacts. 
            Seismic waves bounce endlessly through the dry rigid rock, ringing the Moon like a tuning fork!
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="font-bold text-rose-400 block font-mono flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Artemis Base Camp Risk: {event.artemisRisk}</span>
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {event.artemisRisk === 'CRITICAL'
              ? 'Shallow moonquakes can cause severe structural fatigue to pressurized habitat domes and trigger loose regolith landslides on crater slopes.'
              : 'Deep moonquakes occur deep in the mantle (~700-900km) and pose minimal hazard to surface habitats.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeismographVisualizer;
