import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { ThreeMoonGlobe } from './components/ThreeMoonGlobe';
import { SeismographVisualizer } from './components/SeismographVisualizer';
import { MoonquakeFilterBar } from './components/MoonquakeFilterBar';
import { MOONQUAKE_CATALOG, APOLLO_STATIONS } from './utils/moonquakeData';
import type { MoonquakeEvent, ApolloStation, MoonquakeCategory } from './types/moonquake';
import { soundManager } from './utils/soundEffects';
import {
  MapPin,
  Calendar,
  Volume2,
  Sparkles,
} from 'lucide-react';

// Code-split modals for optimal performance
const ArtemisScienceModal = lazy(() => import('./components/ArtemisScienceModal'));
const SeismicLogModal = lazy(() => import('./components/SeismicLogModal'));

export function App() {
  const [selectedEvent, setSelectedEvent] = useState<MoonquakeEvent | null>(
    MOONQUAKE_CATALOG[0] // Defaults to the 1972 M 5.5 Great Quake
  );
  const [selectedStation, setSelectedStation] = useState<ApolloStation | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<MoonquakeCategory | 'all'>('all');
  const [minMagnitude, setMinMagnitude] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showLogbook, setShowLogbook] = useState<boolean>(false);

  // Filter events based on active category, magnitude, and search
  const filteredEvents = MOONQUAKE_CATALOG.filter((ev) => {
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    if (ev.magnitude < minMagnitude) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.name.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.scienceNote.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectEvent = (event: MoonquakeEvent) => {
    soundManager.playClick();
    setSelectedEvent(event);
    setSelectedStation(null);
  };

  const handleSelectStation = (station: ApolloStation) => {
    soundManager.playClick();
    setSelectedStation(station);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Global Navigation & Telemetry Header */}
      <Header
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenLogbook={() => setShowLogbook(true)}
        totalQuakes={MOONQUAKE_CATALOG.length}
        filteredCount={filteredEvents.length}
      />

      {/* 2. Main Exploration Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Upper Stage: 3D Globe + Event Telemetry Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left/Center: Interactive Three.js 3D Lunar Globe (8 cols) */}
          <div className="lg:col-span-8 h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative bg-slate-950">
            <ThreeMoonGlobe
              events={filteredEvents}
              stations={APOLLO_STATIONS}
              selectedEventId={selectedEvent ? selectedEvent.id : null}
              selectedStationId={selectedStation ? selectedStation.id : null}
              onSelectEvent={handleSelectEvent}
              onSelectStation={handleSelectStation}
            />
          </div>

          {/* Right: Selected Event or Station Telemetry Inspector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {selectedStation ? (
              /* Selected Station Inspector Card */
              <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      APSE Seismic Station
                    </span>
                    <button
                      onClick={() => setSelectedStation(null)}
                      className="text-xs font-mono text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-mono text-white">
                      {selectedStation.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Mission: <span className="text-cyan-300 font-bold">{selectedStation.mission}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Coordinates</span>
                      <span className="text-white font-bold">
                        {selectedStation.lat.toFixed(2)}°N, {selectedStation.lon.toFixed(2)}°E
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Deployed Date</span>
                      <span className="text-emerald-400 font-bold">{selectedStation.deployedDate}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                      Sensor Payload
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedStation.seismometerType}. Powered continuously for up to 8 years by the SNAP-27 radioisotope thermoelectric generator (RTG).
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      if (selectedEvent) {
                        soundManager.sonifyMoonquake(selectedEvent.magnitude, selectedEvent.category);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Ping Seismometer Audio</span>
                  </button>
                </div>
              </div>
            ) : selectedEvent ? (
              /* Selected Moonquake Telemetry Card */
              <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                        selectedEvent.category === 'shallow'
                          ? 'bg-red-950 text-red-300 border-red-700/60'
                          : selectedEvent.category === 'deep'
                          ? 'bg-purple-950 text-purple-300 border-purple-700/60'
                          : selectedEvent.category === 'artificial_impact'
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                          : 'bg-yellow-950 text-yellow-300 border-yellow-700/60'
                      }`}
                    >
                      {selectedEvent.category.replace('_', ' ')} Quake
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        selectedEvent.artemisRisk === 'CRITICAL'
                          ? 'bg-rose-900/70 text-rose-200 border border-rose-600'
                          : selectedEvent.artemisRisk === 'MODERATE'
                          ? 'bg-amber-900/70 text-amber-200 border border-amber-600'
                          : 'bg-emerald-900/70 text-emerald-200 border border-emerald-600'
                      }`}
                    >
                      Artemis Risk: {selectedEvent.artemisRisk}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-mono text-white leading-snug">
                      {selectedEvent.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {selectedEvent.dateStr}
                    </p>
                  </div>

                  {/* Magnitude & Depth metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px] uppercase">Magnitude</span>
                      <span className="text-base font-black text-amber-400">
                        M {selectedEvent.magnitude}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px] uppercase">Depth</span>
                      <span className="text-sm font-bold text-white">
                        {selectedEvent.depthKm} km
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px] uppercase">Duration</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {selectedEvent.durationMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                    {selectedEvent.description}
                  </p>

                  {/* Science Note */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs">
                    <span className="font-mono font-bold text-indigo-300 uppercase text-[10px] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3 h-3" />
                      NASA Science Insight
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedEvent.scienceNote}
                    </p>
                  </div>
                </div>

                {/* Bottom Action: Sonify Waveform */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.sonifyMoonquake(selectedEvent.magnitude, selectedEvent.category);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio Sonification</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs gap-2">
                <MapPin className="w-8 h-8 text-slate-600" />
                <p>Click any seismic epicenter marker or Apollo station on the 3D globe to inspect telemetry.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Interactive Filter Bar */}
        <MoonquakeFilterBar
          events={MOONQUAKE_CATALOG}
          selectedCategory={selectedCategory}
          minMagnitude={minMagnitude}
          searchQuery={searchQuery}
          selectedEventId={selectedEvent ? selectedEvent.id : null}
          onSelectCategory={(cat) => {
            soundManager.playClick();
            setSelectedCategory(cat);
          }}
          onSetMinMagnitude={setMinMagnitude}
          onSetSearchQuery={setSearchQuery}
          onSelectEvent={handleSelectEvent}
        />

        {/* 4. Real-time Seismograph Waveform & Acoustic Sonifier */}
        <SeismographVisualizer event={selectedEvent} />
      </main>

      {/* 5. Modals with React.Suspense Code-Splitting */}
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

      {/* 6. Footer & Open Science Attributions */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs font-mono text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>NASA Space Apps Challenge 2026</span>
          <span>•</span>
          <span className="text-slate-400">Make a Moonquake Map 2.0</span>
          <span>•</span>
          <span>Apollo Passive Seismic Network (APSE)</span>
        </p>
      </footer>
    </div>
  );
}
export default App;
