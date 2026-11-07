import { useState, lazy, Suspense } from 'react';
import { ThreeSpaceSystem } from './components/ThreeSpaceSystem';
import { EarthSystemHeader } from './components/EarthSystemHeader';
import { PlanetHUD } from './components/PlanetHUD';
import { EarthTrendInspector } from './components/EarthTrendInspector';
import { EarthTimelineScrubber } from './components/EarthTimelineScrubber';
import { DetectiveScenariosModal } from './components/DetectiveScenariosModal';
import {
  EARTH_SYSTEM_TRENDS,
  SOLAR_PLANETS,
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
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [selectedTrendId, setSelectedTrendId] = useState<string>(EARTH_SYSTEM_TRENDS[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotMarker | null>(null);

  // Time & Domain Filtering
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedDomain, setSelectedDomain] = useState<EarthTrendDomain>('all');

  // Modals
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showLogbook, setShowLogbook] = useState<boolean>(false);
  const [showScenarios, setShowScenarios] = useState<boolean>(false);

  // Active planet & trend
  const currentPlanet =
    SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_PLANETS[3];
  const currentTrend =
    EARTH_SYSTEM_TRENDS.find((t) => t.id === selectedTrendId) || EARTH_SYSTEM_TRENDS[0];

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanetId(planet.id);
    if (planet.id === 'earth' && viewMode !== 'structure') {
      setViewMode('earth_focus');
    }
  };

  const handleNextPlanet = () => {
    const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === selectedPlanetId);
    const nextIndex = (currentIndex + 1) % SOLAR_PLANETS.length;
    const nextPlanet = SOLAR_PLANETS[nextIndex];
    setSelectedPlanetId(nextPlanet.id);
  };

  const handlePrevPlanet = () => {
    const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === selectedPlanetId);
    const prevIndex = (currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
    const prevPlanet = SOLAR_PLANETS[prevIndex];
    setSelectedPlanetId(prevPlanet.id);
  };

  const handleSelectHotspot = (hotspot: HotspotMarker) => {
    setSelectedHotspot(hotspot);
    const match = EARTH_SYSTEM_TRENDS.find((t) => t.domain === hotspot.domain);
    if (match) {
      setSelectedTrendId(match.id);
    }
  };

  const handleSelectScenario = (scenario: DetectiveScenario) => {
    setSelectedPlanetId('earth');
    setViewMode('earth_focus');
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

  const isStructureMode = viewMode === 'structure';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f8fafc] text-slate-800 select-none font-sans">
      {/* Large, blurred abstract gradients of Deep Ocean Blue (#0369A1) and Forest Green (#15803D) in the deep background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[12%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-sky-200/50 blur-[130px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/40 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-teal-100/50 blur-[150px]" />
        <div className="absolute top-[60%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      {/* 1. Full-Screen 3D Universe, Solar System, Asteroid Belt, Earth & Structure Cutaway */}
      <div className="absolute inset-0 z-10">
        <ThreeSpaceSystem
          viewMode={viewMode}
          selectedPlanetId={selectedPlanetId}
          selectedHotspotId={selectedHotspot ? selectedHotspot.id : null}
          currentYear={currentYear}
          onSelectPlanet={handleSelectPlanet}
          onSelectHotspot={handleSelectHotspot}
        />
      </div>

      {/* 2. Sleek Top Bar HUD: Title, Planet Dropdown, Sound, Logbook & Briefing */}
      <EarthSystemHeader
        viewMode={viewMode}
        selectedPlanetId={selectedPlanetId}
        onChangeViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'earth_focus') {
            setSelectedPlanetId('earth');
          }
        }}
        onSelectPlanet={handleSelectPlanet}
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenLogbook={() => setShowLogbook(true)}
        onOpenScenarios={() => setShowScenarios(true)}
      />

      {/* 3. Left Sci-Fi Planetary HUD (Matching User's Image 2 & Image 3) */}
      <PlanetHUD
        planet={currentPlanet}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onNextPlanet={handleNextPlanet}
        onPrevPlanet={handlePrevPlanet}
        onOpenEncyclopedia={() => setShowBriefing(true)}
      />

      {/* 4. Floating Right Telemetry Inspector (Earth Trend Detective Dossier) */}
      {!isStructureMode && (
        <div className="absolute top-20 right-4 sm:right-6 z-20 pointer-events-auto hidden md:block">
          <EarthTrendInspector
            trend={currentTrend}
            selectedHotspot={selectedHotspot}
            currentYear={currentYear}
            onClearHotspot={() => setSelectedHotspot(null)}
            onOpenEncyclopedia={() => setShowBriefing(true)}
          />
        </div>
      )}

      {/* 5. Floating Bottom HUD: Timeline Scrubber (1980 - 2026) & Domain Filters */}
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

      {/* 6. Interactive Detective Case Walkthrough */}
      <DetectiveScenariosModal
        isOpen={showScenarios}
        onClose={() => setShowScenarios(false)}
        onSelectScenario={handleSelectScenario}
        onSelectTrend={setSelectedTrendId}
        onChangeViewMode={setViewMode}
        trends={EARTH_SYSTEM_TRENDS}
      />

      {/* 7. Modals (NASA Fleet & Statistical Manual + Supabase Detective Logbook) */}
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
