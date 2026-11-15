import React from 'react';
import { Orbit, Telescope } from 'lucide-react';
import type { SystemViewMode } from '../../types/earthSystem';
import { soundManager } from '../../utils/soundEffects';

interface PlanetHudFooterProps {
  viewMode: SystemViewMode;
  onNextPlanet: () => void;
  onChangeViewMode: (mode: SystemViewMode) => void;
}

interface FooterTileConfig {
  id: string;
  label: string;
  title: string;
  buttonClass: string;
  badgeClass: string;
  labelClass: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const TILE_BASE_CLASS =
  'flex flex-col items-center justify-center p-2 rounded-2xl border transition-all group shadow-xs';
const BADGE_BASE_CLASS =
  'w-8 h-8 rotate-45 rounded-lg border flex items-center justify-center mb-2 group-hover:scale-105 transition-all';

/** Bottom three-column action bar for switching planets and toggling sky/system views. */
export const PlanetHudFooter: React.FC<PlanetHudFooterProps> = ({
  viewMode,
  onNextPlanet,
  onChangeViewMode,
}) => {
  const tiles: FooterTileConfig[] = [
    {
      id: 'switch',
      label: 'SWITCH',
      title: 'Switch to Next Planet',
      buttonClass: 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50/60',
      badgeClass: 'bg-sky-100/70 border-sky-200 text-[#0369A1]',
      labelClass: 'text-slate-700 group-hover:text-[#0369A1]',
      icon: <span className="-rotate-45 font-orbitron font-bold text-xs">&lt;&gt;</span>,
      onClick: onNextPlanet,
    },
    {
      id: 'night_sky',
      label: 'NIGHT SKY',
      title: 'View Deep Space Night Sky',
      buttonClass:
        viewMode === 'night_sky'
          ? 'bg-sky-100 border-[#0369A1] text-[#0369A1]'
          : 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 text-slate-700',
      badgeClass: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      labelClass: 'group-hover:text-[#0369A1]',
      icon: <Telescope className="-rotate-45 w-4 h-4" />,
      onClick: () => onChangeViewMode(viewMode === 'night_sky' ? 'solar_system' : 'night_sky'),
    },
    {
      id: 'solar_system',
      label: 'SYSTEM',
      title: 'Return to Solar System View',
      buttonClass:
        viewMode === 'solar_system'
          ? 'bg-emerald-50 border-[#15803D] text-[#15803D]'
          : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-slate-700',
      badgeClass: 'bg-emerald-50 border-emerald-200 text-[#15803D]',
      labelClass: 'group-hover:text-[#15803D]',
      icon: <Orbit className="-rotate-45 w-4 h-4" />,
      onClick: () => onChangeViewMode('solar_system'),
    },
  ];

  return (
    <div className="pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          onClick={() => {
            soundManager.playClick();
            tile.onClick();
          }}
          className={`${TILE_BASE_CLASS} ${tile.buttonClass}`}
          title={tile.title}
        >
          <div className={`${BADGE_BASE_CLASS} ${tile.badgeClass}`}>{tile.icon}</div>
          <span className={`font-orbitron text-[9px] font-bold tracking-wider ${tile.labelClass}`}>
            {tile.label}
          </span>
        </button>
      ))}
    </div>
  );
};
