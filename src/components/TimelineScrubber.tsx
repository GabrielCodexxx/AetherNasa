import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import type { MoonquakeEvent } from '../types/moonquake';

interface TimelineScrubberProps {
  events: MoonquakeEvent[];
  selectedEventId: string | null;
  onSelectEvent: (ev: MoonquakeEvent) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);

  // Find index of currently selected event in sorted list
  const currentIdx = sortedEvents.findIndex((e) => e.id === selectedEventId);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const nextIdx = (safeIdx + 1) % sortedEvents.length;
      const nextEvent = sortedEvents[nextIdx];
      onSelectEvent(nextEvent);
      soundManager.sonifyMoonquake(nextEvent.magnitude, nextEvent.category);
    }, 3200 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, safeIdx, sortedEvents, playbackSpeed, onSelectEvent]);

  const handleTogglePlay = () => {
    soundManager.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    soundManager.playClick();
    const nextIdx = (safeIdx + 1) % sortedEvents.length;
    const ev = sortedEvents[nextIdx];
    onSelectEvent(ev);
    soundManager.sonifyMoonquake(ev.magnitude, ev.category);
  };

  const handlePrev = () => {
    soundManager.playClick();
    const prevIdx = (safeIdx - 1 + sortedEvents.length) % sortedEvents.length;
    const ev = sortedEvents[prevIdx];
    onSelectEvent(ev);
    soundManager.sonifyMoonquake(ev.magnitude, ev.category);
  };

  const currentEvent = sortedEvents[safeIdx];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono select-none">
      {/* Playback Controls & Timestamp */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
          title="Previous Historical Event"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shadow-md ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
              : 'bg-cyan-500 text-slate-950 shadow-cyan-500/20 hover:bg-cyan-400'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
          title="Next Historical Event"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Speed Multiplier */}
        <button
          onClick={() => {
            soundManager.playClick();
            setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 5 : 1);
          }}
          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[10px] font-bold"
        >
          {playbackSpeed}x
        </button>
      </div>

      {/* Center Event Progress Bar with Event Markers */}
      <div className="flex-1 w-full flex flex-col gap-1 px-2">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={sortedEvents.length - 1}
            value={safeIdx}
            onChange={(e) => {
              const idx = Number(e.target.value);
              const ev = sortedEvents[idx];
              onSelectEvent(ev);
              soundManager.sonifyMoonquake(ev.magnitude, ev.category);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Apollo 12 (1969)</span>
          <span className="text-cyan-300 font-bold truncate max-w-[200px]">
            {currentEvent ? currentEvent.dateStr : '1969–1977 APSE'}
          </span>
          <span>Station Shutdown (1977)</span>
        </div>
      </div>

      {/* Current Active Target Display */}
      {currentEvent && (
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
          <span
            className={`w-2 h-2 rounded-full ${
              currentEvent.category === 'shallow'
                ? 'bg-red-400'
                : currentEvent.category === 'deep'
                ? 'bg-purple-400'
                : currentEvent.category === 'artificial_impact'
                ? 'bg-cyan-400'
                : 'bg-yellow-400'
            } animate-ping`}
          ></span>
          <span className="text-white font-bold max-w-[140px] truncate">
            {currentEvent.name}
          </span>
          <span className="text-amber-400 font-bold">M {currentEvent.magnitude}</span>
        </div>
      )}
    </div>
  );
};
export default TimelineScrubber;
