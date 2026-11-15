import React from 'react';
import type { PlanetData, SystemViewMode } from '../types/earthSystem';
import { ViewportControlsCapsule } from './header/ViewportControlsCapsule';
import { BrandPlanetCapsule } from './header/BrandPlanetCapsule';
import { MissionUtilityCapsule } from './header/MissionUtilityCapsule';

export interface EarthSystemHeaderProps {
  viewMode: SystemViewMode;
  selectedPlanetId: string;
  onChangeViewMode: (mode: SystemViewMode) => void;
  onSelectPlanet: (planet: PlanetData) => void;
  onOpenBriefing: () => void;
  onOpenLogbook: () => void;
  onOpenScenarios: () => void;
  onOpenPlanetology?: () => void;
  onOpenReport?: () => void;
  // Left 3D Viewport & Dossier Controls
  planetName?: string;
  isPlanetHudOpen?: boolean;
  onTogglePlanetHud?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  showDivergenceLens?: boolean;
  onToggleDivergenceLens?: () => void;
}

export const EarthSystemHeader: React.FC<EarthSystemHeaderProps> = ({
  selectedPlanetId,
  onSelectPlanet,
  onOpenBriefing,
  onOpenLogbook,
  onOpenScenarios,
  onOpenPlanetology,
  onOpenReport,
  planetName,
  isPlanetHudOpen = false,
  onTogglePlanetHud,
  onZoomIn,
  onZoomOut,
  autoRotate = true,
  onToggleAutoRotate,
  showGrid = true,
  onToggleGrid,
  showDivergenceLens = false,
  onToggleDivergenceLens,
}) => (
  <header className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-4 pointer-events-none select-none font-sans">
    <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
      <ViewportControlsCapsule
        planetName={planetName}
        isPlanetHudOpen={isPlanetHudOpen}
        onTogglePlanetHud={onTogglePlanetHud}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        autoRotate={autoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
        showDivergenceLens={showDivergenceLens}
        onToggleDivergenceLens={onToggleDivergenceLens}
      />

      <BrandPlanetCapsule
        selectedPlanetId={selectedPlanetId}
        onSelectPlanet={onSelectPlanet}
        onOpenScenarios={onOpenScenarios}
        onOpenPlanetology={onOpenPlanetology}
      />

      <MissionUtilityCapsule
        onOpenBriefing={onOpenBriefing}
        onOpenLogbook={onOpenLogbook}
        onOpenReport={onOpenReport}
      />
    </div>
  </header>
);

export default EarthSystemHeader;
