import React from 'react';
import { BookOpen, ChevronRight, Compass, Globe, Layers } from 'lucide-react';
import type { PlanetData, SystemViewMode } from '../../types/earthSystem';
import { soundManager } from '../../utils/soundEffects';

interface PlanetDossierPanelProps {
  planet: PlanetData;
  viewMode: SystemViewMode;
  onChangeViewMode: (mode: SystemViewMode) => void;
  onOpenEncyclopedia: () => void;
}

const ACTION_BTN_BASE =
  'w-full py-3 px-4 rounded-2xl font-orbitron font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between border';

/** Standard planetary dossier body with primary action buttons and quick stats grid. */
export const PlanetDossierPanel: React.FC<PlanetDossierPanelProps> = ({
  planet,
  viewMode,
  onChangeViewMode,
  onOpenEncyclopedia,
}) => {
  const isDetectiveActive = viewMode === 'earth_focus' || viewMode === 'planet_focus';
  const focusMode: SystemViewMode = planet.id === 'earth' ? 'earth_focus' : 'planet_focus';

  const quickStats = [
    { label: 'Mean Surface Temp', value: planet.meanTempC, valueClass: 'text-amber-700' },
    { label: 'Surface Gravity', value: planet.gravity, valueClass: 'text-slate-900' },
    { label: 'Day Length', value: planet.dayLength, valueClass: 'text-[#0369A1]' },
    { label: 'Known Moons', value: planet.moonsCount, valueClass: 'text-slate-900' },
  ];

  return (
    <div className="space-y-4">
      <p className="font-space text-xs text-slate-600 leading-relaxed">{planet.description}</p>

      <div className="space-y-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onChangeViewMode(viewMode === focusMode ? 'solar_system' : focusMode);
          }}
          className={`${ACTION_BTN_BASE} ${
            isDetectiveActive
              ? 'bg-[#0369A1] text-white border-transparent shadow-md shadow-sky-900/20'
              : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border-slate-200 hover:border-sky-300'
          }`}
        >
          <span className="flex items-center gap-2">
            {planet.id === 'earth' ? (
              <Globe className="w-4 h-4 text-sky-500" />
            ) : (
              <Compass className="w-4 h-4 text-sky-500" />
            )}
            <span>
              {planet.id === 'earth' ? 'EARTH DETECTIVE' : `${planet.name} DETECTIVE`}
            </span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenEncyclopedia();
          }}
          className={`${ACTION_BTN_BASE} bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#15803D] border-slate-200 hover:border-emerald-300 shadow-xs`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#15803D]" />
            <span>ENCYCLOPEDIA</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onChangeViewMode('structure');
          }}
          className={`${ACTION_BTN_BASE} bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200 hover:border-amber-300 shadow-xs`}
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>STRUCTURE</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs"
          >
            <span className="font-space text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
              {stat.label}
            </span>
            <span className={`font-orbitron font-extrabold text-xs ${stat.valueClass}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
