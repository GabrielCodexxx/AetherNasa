import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PlanetType } from '../../types/earthSystem';
import { soundManager } from '../../utils/soundEffects';

interface PlanetHudHeaderProps {
  planetName: string;
  planetType: PlanetType;
  isStructureMode: boolean;
  onExitStructure: () => void;
  onPrevPlanet: () => void;
  onNextPlanet: () => void;
  onClose: () => void;
}

const NAV_ICON_BTN_CLASS =
  'p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] hover:border-sky-300 transition-all shadow-xs';

/** Top header bar for the PlanetHUD card with title and quick planet navigation controls. */
export const PlanetHudHeader: React.FC<PlanetHudHeaderProps> = ({
  planetName,
  planetType,
  isStructureMode,
  onExitStructure,
  onPrevPlanet,
  onNextPlanet,
  onClose,
}) => (
  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
    {isStructureMode && (
      <button
        onClick={() => {
          soundManager.playClick();
          onExitStructure();
        }}
        className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#0369A1] hover:bg-sky-50 transition-all flex items-center justify-center shrink-0 shadow-xs"
        title="Return to Planetary View"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    )}

    <div className="flex-1">
      <h2 className="text-2xl sm:text-3xl font-orbitron font-black tracking-widest text-slate-900 uppercase">
        {planetName}
      </h2>
      <p className="text-[11px] font-orbitron tracking-widest text-[#0369A1] uppercase font-bold">
        {planetType === 'star' ? 'STAR' : 'PLANET'}
      </p>
    </div>

    <div className="flex items-center gap-1">
      <button
        onClick={() => {
          soundManager.playClick();
          onPrevPlanet();
        }}
        className={NAV_ICON_BTN_CLASS}
        title="Previous Planet"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          soundManager.playClick();
          onNextPlanet();
        }}
        className={NAV_ICON_BTN_CLASS}
        title="Next Planet"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
        className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 transition-all shadow-xs ml-1"
        title="Close Dossier"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
