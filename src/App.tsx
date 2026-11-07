import { useState, lazy, Suspense } from 'react';
import { ThreeSpaceSystem } from './components/ThreeSpaceSystem';
import { EarthSystemHeader } from './components/EarthSystemHeader';
import { EarthTrendInspector } from './components/EarthTrendInspector';
import { EarthTimelineScrubber } from './components/EarthTimelineScrubber';
import { DetectiveScenariosModal } from './components/DetectiveScenariosModal';
import {
  EARTH_SYSTEM_TRENDS,
} from './utils/earthSystemData';
import type {
  SystemViewMode,
  PlanetData,
  EarthTrendDomain,
  HotspotMarker,
  DetectiveScenario,
} from './types/earthSystem';

// Code-split modals
const EarthScienceModal = lazy(() => import('./components/EarthScienceModal'));
const DetectiveLogModal = lazy(() => import('./components/DetectiveLogModal'));

export function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<SystemViewMode>('solar_system');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('sun');
  const [selectedTrendId, setSelectedTrendId] = useState<string>(EARTH_SYSTEM_TRENDS[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotMarker | null>(null);

  // Time & Domain Filtering
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedDomain, setSelectedDomain] = useState<EarthTrendDomain>('all');

  // Modals
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showLogbook, setShowLogbook] = useState<boolean>(false);
  const [showScenarios, setShowScenarios] = useState<boolean>(false);

  // Active trend
  const currentTrend =
    EARTH_SYSTEM_TRENDS.find((t) => t.id === selectedTrendId) || EARTH_SYSTEM_TRENDS[0];

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanetId(planet.id);
    if (planet.id === 'earth') {
      setViewMode('earth_focus');
    }
  };

  const handleSelectHotspot = (hotspot: HotspotMarker) => {
    setSelectedHotspot(hotspot);
    // Find matching domain trend
    const match = EARTH_SYSTEM_TRENDS.find((t) => t.domain === hotspot.domain);
    if (match) {
      setSelectedTrendId(match.id);
    }
  };

  const handleSelectScenario = (scenario: DetectiveScenario) => {
    // Handled in Scenario Modal: automatically switches viewMode to earth_focus
    const match = EARTH_SYSTEM_TRENDS.find((t) => t.domain === scenario.domain);
    if (match) {
      setSelectedTrendId(match.id);
    }
    setCurrentYear(scenario.focusYear);
  };

  const handleSelectDomain = (domain: EarthTrendDomain) => {
    setSelectedDomain(domain);
    if (domain !== 'all') {
      const match = EARTH_SYSTEM_TRENDS.find((t) => t.domain === domain);
      if (match) {
        setSelectedTrendId(match.id);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* 1. Full-Screen 3D Universe, Solar System, Asteroid Belt & Earth */}
      <div className="absolute inset-0 z-0">
        <ThreeSpaceSystem
          viewMode={viewMode}
          selectedPlanetId={selectedPlanetId}
          selectedHotspotId={selectedHotspot ? selectedHotspot.id : null}
          currentYear={currentYear}
          onSelectPlanet={handleSelectPlanet}
          onSelectHotspot={handleSelectHotspot}
        />
      </div>

      {/* 2. Top Planetarium Navigation & Mode Switcher HUD */}
      <EarthSystemHeader
        viewMode={viewMode}
        selectedPlanetId={selectedPlanetId}
        onChangeViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'earth_focus' || mode === 'structure') {
            setSelectedPlanetId('earth');
          }
        }}
        onSelectPlanet={handleSelectPlanet}
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenLogbook={() => setShowLogbook(true)}
        onOpenScenarios={() => setShowScenarios(true)}
      />

      {/* 3. Floating Right Telemetry Inspector (Earth Trend Detective Dossier) */}
      <div className="absolute top-24 right-4 sm:right-6 z-20 pointer-events-auto hidden md:block">
        <EarthTrendInspector
          trend={currentTrend}
          selectedHotspot={selectedHotspot}
          currentYear={currentYear}
          onClearHotspot={() => setSelectedHotspot(null)}
          onOpenEncyclopedia={() => setShowBriefing(true)}
        />
      </div>

      {/* 4. Floating Bottom HUD: Timeline Scrubber (1980 - 2026) & Domain Filters */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-30 pointer-events-none flex flex-col items-center">
        <div className="pointer-events-auto w-full max-w-4xl">
          <EarthTimelineScrubber
            currentYear={currentYear}
            onSetYear={setCurrentYear}
            selectedDomain={selectedDomain}
            onSelectDomain={handleSelectDomain}
            currentTrend={currentTrend}
          />
        </div>
      </div>

      {/* 5. Interactive Detective Case Walkthrough */}
      <DetectiveScenariosModal
        isOpen={showScenarios}
        onClose={() => setShowScenarios(false)}
        onSelectScenario={handleSelectScenario}
        onSelectTrend={setSelectedTrendId}
        onChangeViewMode={setViewMode}
        trends={EARTH_SYSTEM_TRENDS}
      />

      {/* 6. Modals (NASA Fleet & Statistical Manual + Supabase Detective Logbook) */}
      <Suspense fallback={null}>
        {showBriefing && (
          <EarthScienceModal
            isOpen={showBriefing}
            onClose={() => setShowBriefing(false)}
          />
        )}
        {showLogbook && (
          <DetectiveLogModal
            isOpen={showLogbook}
            onClose={() => setShowLogbook(false)}
            selectedTrend={currentTrend}
            currentYear={currentYear}
          />
        )}
      </Suspense>
    </div>
  );
}
export default App;
