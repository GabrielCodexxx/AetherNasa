import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlanetData, SystemViewMode } from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';
import { PlanetHudHeader } from './hud/PlanetHudHeader';
import { PlanetStructurePanel } from './hud/PlanetStructurePanel';
import { PlanetDossierPanel } from './hud/PlanetDossierPanel';
import { PlanetHudFooter } from './hud/PlanetHudFooter';

export interface PlanetHUDProps {
  planet: PlanetData;
  viewMode: SystemViewMode;
  isOpen: boolean;
  onClose: () => void;
  onChangeViewMode: (mode: SystemViewMode) => void;
  onNextPlanet: () => void;
  onPrevPlanet: () => void;
  onOpenEncyclopedia: () => void;
}

export const PlanetHUD: React.FC<PlanetHUDProps> = ({
  planet,
  viewMode,
  isOpen,
  onClose,
  onChangeViewMode,
  onNextPlanet,
  onPrevPlanet,
  onOpenEncyclopedia,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isStructureMode = viewMode === 'structure';

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`absolute top-16 sm:top-20 left-3 sm:left-6 z-30 pointer-events-auto select-none transition-all duration-300 font-sans ${
        isCollapsed ? '-translate-x-[calc(100%-1.75rem)]' : 'translate-x-0'
      }`}
    >
      <div className="relative flex items-center">
        {/* Glassmorphic Eco-Tracker Card with Futuristic Sci-Fi Typography */}
        <div className="w-80 sm:w-96 bg-white/85 backdrop-blur-xl border border-white/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-200/70 text-slate-800 flex flex-col gap-4">
          <PlanetHudHeader
            planetName={planet.name}
            planetType={planet.type}
            isStructureMode={isStructureMode}
            onExitStructure={() =>
              onChangeViewMode(planet.id === 'earth' ? 'earth_focus' : 'solar_system')
            }
            onPrevPlanet={onPrevPlanet}
            onNextPlanet={onNextPlanet}
            onClose={onClose}
          />

          {isStructureMode ? (
            <PlanetStructurePanel layers={planet.layers} />
          ) : (
            <PlanetDossierPanel
              planet={planet}
              viewMode={viewMode}
              onChangeViewMode={onChangeViewMode}
              onOpenEncyclopedia={onOpenEncyclopedia}
            />
          )}

          <PlanetHudFooter
            viewMode={viewMode}
            onNextPlanet={onNextPlanet}
            onChangeViewMode={onChangeViewMode}
          />
        </div>

        {/* Collapsible Edge Tab Handle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="h-16 w-6 -ml-1 rounded-r-xl bg-white/90 border-y border-r border-slate-200 text-slate-600 hover:text-[#0369A1] hover:bg-sky-50 transition-all flex items-center justify-center shadow-md shadow-slate-200"
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PlanetHUD;
