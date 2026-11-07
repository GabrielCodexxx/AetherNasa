import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { ThreeMoonGlobe, type GlobeViewMode } from './components/ThreeMoonGlobe';
import { TelemetryInspector } from './components/TelemetryInspector';
import { TimelineScrubber } from './components/TimelineScrubber';
import { ScenarioWalkthrough } from './components/ScenarioWalkthrough';
import { MOONQUAKE_CATALOG, APOLLO_STATIONS } from './utils/moonquakeData';
import type { MoonquakeEvent, ApolloStation, MoonquakeCategory } from './types/moonquake';
import { soundManager } from './utils/soundEffects';

// Code-split modals
const ArtemisScienceModal = lazy(() => import('./components/ArtemisScienceModal'));
const SeismicLogModal = lazy(() => import('./components/SeismicLogModal'));

export function App() {
  const [selectedEvent, setSelectedEvent] = useState<MoonquakeEvent | null>(
    MOONQUAKE_CATALOG[0] // Defaults to the 1972 M 5.5 Great Quake
  );
  const [selectedStation, setSelectedStation] = useState<ApolloStation | null>(null);

  // View Mode: 'surface' or 'structure' (cutaway)
  const [viewMode, setViewMode] = useState<GlobeViewMode>('surface');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<MoonquakeCategory | 'all'>('all');
  const [minMagnitude, setMinMagnitude] = useState<number>(1.0);

  // Modals & Panels
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showLogbook, setShowLogbook] = useState<boolean>(false);
  const [showScenarios, setShowScenarios] = useState<boolean>(false);

  // Filter events based on active category and magnitude
  const filteredEvents = MOONQUAKE_CATALOG.filter((ev) => {
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    if (ev.magnitude < minMagnitude) return false;
    return true;
  });

  const handleSelectEvent = (event: MoonquakeEvent) => {
    setSelectedEvent(event);
    setSelectedStation(null);
  };

  const handleSelectStation = (station: ApolloStation) => {
    setSelectedStation(station);
  };

  const categories: { id: MoonquakeCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: MOONQUAKE_CATALOG.length },
    { id: 'shallow', label: 'Shallow (M5+)', count: MOONQUAKE_CATALOG.filter((e) => e.category === 'shallow').length },
    { id: 'deep', label: 'Deep Tidal', count: MOONQUAKE_CATALOG.filter((e) => e.category === 'deep').length },
    { id: 'artificial_impact', label: 'Impacts', count: MOONQUAKE_CATALOG.filter((e) => e.category === 'artificial_impact').length },
    { id: 'thermal', label: 'Thermal', count: MOONQUAKE_CATALOG.filter((e) => e.category === 'thermal').length },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* 1. Full-Screen 3D Universe & Moon Globe Viewport */}
      <div className="absolute inset-0 z-0">
        <ThreeMoonGlobe
          events={filteredEvents}
          stations={APOLLO_STATIONS}
          selectedEventId={selectedEvent ? selectedEvent.id : null}
          selectedStationId={selectedStation ? selectedStation.id : null}
          viewMode={viewMode}
          onSelectEvent={handleSelectEvent}
          onSelectStation={handleSelectStation}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* 2. Top Navigation & Planetarium Header HUD */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'structure') {
            // Find a deep moonquake to showcase the mantle focus
            const deepQuake = MOONQUAKE_CATALOG.find((e) => e.category === 'deep');
            if (deepQuake) setSelectedEvent(deepQuake);
          }
        }}
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenLogbook={() => setShowLogbook(true)}
        onOpenScenarios={() => setShowScenarios(true)}
        totalQuakes={MOONQUAKE_CATALOG.length}
        filteredCount={filteredEvents.length}
      />

      {/* 3. Floating Right Telemetry Dossier Panel */}
      <div className="absolute top-24 right-4 sm:right-6 z-20 pointer-events-auto hidden md:block">
        <TelemetryInspector
          selectedEvent={selectedEvent}
          selectedStation={selectedStation}
          onClearStation={() => setSelectedStation(null)}
          onOpenBriefing={() => setShowBriefing(true)}
        />
      </div>

      {/* 4. Floating Bottom HUD: Timeline Scrubber & Filter Dock */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-30 pointer-events-none flex flex-col items-center gap-2.5">
        {/* Category Pills & Search Filter Bar */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl max-w-3xl">
          <div className="flex items-center gap-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">Min Mag:</span>
            <span className="text-[10px] font-mono text-yellow-400 font-bold w-6">M {minMagnitude.toFixed(1)}</span>
            <input
              type="range"
              min={1.0}
              max={5.5}
              step={0.5}
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(Number(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
          </div>
        </div>

        {/* Chronological Timeline Player & Scrubber (1969 - 1977) */}
        <div className="pointer-events-auto w-full max-w-4xl">
          <TimelineScrubber
            events={filteredEvents}
            selectedEventId={selectedEvent ? selectedEvent.id : null}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      {/* 5. Interactive Scenario Walkthrough Overlay */}
      <ScenarioWalkthrough
        isOpen={showScenarios}
        onClose={() => setShowScenarios(false)}
        onSelectEvent={handleSelectEvent}
        onChangeViewMode={setViewMode}
        events={MOONQUAKE_CATALOG}
      />

      {/* 6. Modals (Science Encyclopedia & Cloud Logbook) */}
      <Suspense fallback={null}>
        {showBriefing && (
          <ArtemisScienceModal
            isOpen={showBriefing}
            onClose={() => setShowBriefing(false)}
          />
        )}
        {showLogbook && (
          <SeismicLogModal
            isOpen={showLogbook}
            onClose={() => setShowLogbook(false)}
            selectedEvent={selectedEvent}
          />
        )}
      </Suspense>
    </div>
  );
}
export default App;
