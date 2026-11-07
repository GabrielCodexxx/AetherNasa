import React from 'react';
import type { MoonquakeEvent, MoonquakeCategory } from '../types/moonquake';
import { Search } from 'lucide-react';

interface MoonquakeFilterBarProps {
  events: MoonquakeEvent[];
  selectedCategory: MoonquakeCategory | 'all';
  minMagnitude: number;
  searchQuery: string;
  selectedEventId: string | null;
  onSelectCategory: (cat: MoonquakeCategory | 'all') => void;
  onSetMinMagnitude: (val: number) => void;
  onSetSearchQuery: (query: string) => void;
  onSelectEvent: (ev: MoonquakeEvent) => void;
}

export const MoonquakeFilterBar: React.FC<MoonquakeFilterBarProps> = ({
  events,
  selectedCategory,
  minMagnitude,
  searchQuery,
  selectedEventId,
  onSelectCategory,
  onSetMinMagnitude,
  onSetSearchQuery,
  onSelectEvent,
}) => {
  const categories: { id: MoonquakeCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Quakes', count: events.length },
    { id: 'shallow', label: 'Shallow (Tectonic)', count: events.filter((e) => e.category === 'shallow').length },
    { id: 'deep', label: 'Deep (Tidal)', count: events.filter((e) => e.category === 'deep').length },
    { id: 'artificial_impact', label: 'Apollo Impacts', count: events.filter((e) => e.category === 'artificial_impact').length },
    { id: 'thermal', label: 'Thermal', count: events.filter((e) => e.category === 'thermal').length },
  ];

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    if (ev.magnitude < minMagnitude) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ev.name.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* Category Tabs & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Right controls: Search & Magnitude Slider */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
            />
          </div>

          {/* Magnitude Filter Slider */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Min Mag:</span>
            <span className="text-yellow-400 font-bold w-7 text-right">M {minMagnitude.toFixed(1)}</span>
            <input
              type="range"
              min={1.0}
              max={5.5}
              step={0.5}
              value={minMagnitude}
              onChange={(e) => onSetMinMagnitude(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Event Selector Cards */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
        {filteredEvents.map((ev) => {
          const isSelected = selectedEventId === ev.id;
          const badgeColor =
            ev.category === 'shallow'
              ? 'text-red-400 border-red-500/50 bg-red-950/50'
              : ev.category === 'deep'
              ? 'text-purple-400 border-purple-500/50 bg-purple-950/50'
              : ev.category === 'artificial_impact'
              ? 'text-cyan-400 border-cyan-500/50 bg-cyan-950/50'
              : 'text-yellow-400 border-yellow-500/50 bg-yellow-950/50';

          return (
            <button
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className={`shrink-0 w-64 text-left p-3 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                  {ev.category.replace('_', ' ')}
                </span>
                <span className="text-sm font-black font-mono text-white">M {ev.magnitude}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 truncate">{ev.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {ev.dateStr.split(' ')[0]} {ev.dateStr.split(' ')[1]} &bull; {ev.depthKm} km depth
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoonquakeFilterBar;
