import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Calendar } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import type { EarthSystemTrend, EarthTrendDomain } from '../types/earthSystem';

interface EarthTimelineScrubberProps {
  currentYear: number;
  onSetYear: (year: number) => void;
  selectedDomain: EarthTrendDomain;
  onSelectDomain: (domain: EarthTrendDomain) => void;
  currentTrend: EarthSystemTrend;
}

export const EarthTimelineScrubber: React.FC<EarthTimelineScrubberProps> = ({
  currentYear,
  onSetYear,
  selectedDomain,
  onSelectDomain,
  currentTrend,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Playback timer (1980 to 2026)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const next = currentYear >= 2026 ? 1980 : currentYear + 1;
      if (next % 5 === 0) {
        soundManager.playClick();
      }
      onSetYear(next);
    }, 450 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentYear, onSetYear]);

  const handleTogglePlay = () => {
    soundManager.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    soundManager.playClick();
    onSetYear(Math.min(2026, currentYear + 1));
  };

  const handlePrev = () => {
    soundManager.playClick();
    onSetYear(Math.max(1980, currentYear - 1));
  };

  // Find anomaly for active year
  const pt = currentTrend.timeSeries.find((p) => p.year === currentYear) || currentTrend.timeSeries[0];

  const domains: { id: EarthTrendDomain; label: string }[] = [
    { id: 'all', label: 'All Domains' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'cryosphere', label: 'Ice Sheets' },
    { id: 'hydrosphere', label: 'Sea Level' },
    { id: 'atmosphere', label: 'CO₂ Carbon' },
    { id: 'biosphere', label: 'Vegetation' },
  ];

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex flex-col gap-2 select-none font-sans">
      {/* Domain Category Filter Tabs (Glassmorphic Eco-Tracker Light Mode) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-lg shadow-slate-200/50 mx-auto max-w-fit">
        {domains.map((dom) => {
          const isActive = selectedDomain === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => {
                soundManager.playClick();
                onSelectDomain(dom.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all ${
                isActive
                  ? 'bg-[#0369A1] text-white shadow-sm shadow-sky-900/15'
                  : 'bg-slate-50/80 hover:bg-sky-50 text-slate-600 hover:text-[#0369A1]'
              }`}
            >
              {dom.label}
            </button>
          );
        })}
      </div>

      {/* Main Scrubber Control Bar */}
      <div className="w-full px-4 py-2.5 bg-white/75 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-800">
        {/* Play / Pause / Jump Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
            title="Step 1 Year Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#0369A1] hover:bg-[#025684] text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs"
            title="Step 1 Year Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Multiplier */}
          <button
            onClick={() => {
              soundManager.playClick();
              setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 5 : 1);
            }}
            className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] text-[10px] font-bold shadow-xs"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Center Year Slider */}
        <div className="flex-1 w-full flex flex-col gap-1 px-2">
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={1980}
              max={2026}
              value={currentYear}
              onChange={(e) => onSetYear(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0369A1]"
            />
          </div>

          <div className="flex justify-between text-[10px] font-space text-slate-400 font-medium">
            <span>1980 (Baseline)</span>
            <span className="text-[#0369A1] font-orbitron font-extrabold flex items-center gap-1 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Year {currentYear}
            </span>
            <span>2026 (Present Day)</span>
          </div>
        </div>

        {/* Metric Readout for Active Year */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 shrink-0">
          <span className="text-slate-500 font-space font-medium">{currentTrend.name.split(' ')[0]}:</span>
          <span className="text-[#15803D] font-orbitron font-black text-sm">
            {pt.value} {currentTrend.metricUnit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EarthTimelineScrubber;
