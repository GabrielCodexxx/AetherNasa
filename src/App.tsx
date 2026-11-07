import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { ResourceDashboard } from './components/ResourceDashboard';
import { CrisisModal } from './components/CrisisModal';
import { useMissionSimulation } from './engine/useMissionSimulation';
import { CADET_BADGES } from './utils/nasaData';
import type { CadetBadge } from './types/trainer';
import { Loader2, Box, Grid } from 'lucide-react';

// Code-split chunks using React.lazy
const ThreeOutpostViewer = lazy(() => import('./components/ThreeOutpostViewer'));
const OutpostMap = lazy(() => import('./components/OutpostMap'));
const EvaMiniGame = lazy(() => import('./components/EvaMiniGame'));
const CadetAcademy = lazy(() => import('./components/CadetAcademy'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));
const ScenarioBriefingModal = lazy(() => import('./components/ScenarioBriefingModal'));

// High-tech NASA telemetry loader fallback
function TelemetryChunkLoader({ title }: { title: string }) {
  return (
    <div className="hud-card rounded-2xl p-16 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
      <div className="text-xs font-mono font-bold tracking-widest text-cyan-400">NASA SUB-SYSTEM COMPILING</div>
      <p className="text-xs text-slate-400 font-mono mt-1">{title}</p>
    </div>
  );
}

export function App() {
  const { state, actions } = useMissionSimulation('lunar');
  const [badges, setBadges] = useState<CadetBadge[]>(CADET_BADGES);

  // View state: 3D interactive vs 2D modular grid
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Modals
  const [showBriefing, setShowBriefing] = useState(false);
  const [showEva, setShowEva] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Badge unlock helper
  const unlockBadge = (id: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === id ? { ...b, unlocked: true } : b))
    );
  };

  // Automated badge check
  if (!badges.find((b) => b.id === 'badge-closed-loop')?.unlocked) {
    if (state.deltas.oxygen > 0 && state.deltas.water > 0) {
      unlockBadge('badge-closed-loop');
    }
  }

  // Selected module details
  const activeModule = state.modules.find((m) => m.id === selectedModuleId);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col bg-radar-grid selection:bg-cyan-500 selection:text-black">
      {/* Top Mission Operations Header */}
      <Header
        location={state.location}
        missionTime={state.missionTime}
        isPaused={state.isPaused}
        speed={state.speed}
        activeCrisis={Boolean(state.activeCrisis)}
        onSwitchLocation={actions.switchLocation}
        onTogglePause={() => actions.setIsPaused(!state.isPaused)}
        onSetSpeed={actions.setSpeed}
        onOpenAcademy={() => setShowAcademy(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenBriefing={() => setShowBriefing(true)}
        onTriggerCrisis={actions.triggerRandomCrisis}
      />

      {/* Main Console Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Real-time ECLSS Resource Telemetry Console */}
        <ResourceDashboard
          resources={state.resources}
          deltas={state.deltas}
          stabilityScore={state.stabilityScore}
        />

        {/* Viewport Mode Bar: 3D WebGL vs 2D Schematic Grid */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              VIEWPORT TELEMETRY MODE:
            </span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  viewMode === '3d'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Three.js 3D View</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  viewMode === '2d'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>2D Modular Schematic</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              NOMINAL TELEMETRY SYNC
            </span>
          </div>
        </div>

        {/* Interactive Viewport Container */}
        {viewMode === '3d' ? (
          <Suspense fallback={<TelemetryChunkLoader title="Initializing Three.js WebGL Spatial Engine & Terrains..." />}>
            <ThreeOutpostViewer
              location={state.location}
              modules={state.modules}
              selectedModuleId={selectedModuleId}
              onSelectModule={(id) => setSelectedModuleId(id)}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<TelemetryChunkLoader title="Compiling 2D Habitat Modular Grid..." />}>
            <OutpostMap
              location={state.location}
              modules={state.modules}
              onToggleStatus={actions.toggleModuleStatus}
              onRepair={actions.repairModule}
              onLaunchEVA={() => setShowEva(true)}
            />
          </Suspense>
        )}

        {/* Selected Module Deep-Inspection HUD Drawer */}
        {activeModule && (
          <div className="hud-card rounded-2xl p-4 sm:p-5 border-cyan-500/40 animate-fade-in flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  SELECTED SUB-SYSTEM &bull; {activeModule.category.toUpperCase()}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    activeModule.status === 'operational'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-red-950 text-red-400 border-red-800'
                  }`}
                >
                  {activeModule.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{activeModule.name}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{activeModule.description}</p>
              <p className="text-[11px] text-cyan-300 font-mono mt-1 italic">NASA Benchmark: {activeModule.nasaRef}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => actions.toggleModuleStatus(activeModule.id)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs rounded-xl border border-slate-700 transition-all"
              >
                {activeModule.status === 'operational' ? 'Set Standby' : 'Engage Subsystem'}
              </button>
              <button
                onClick={() => setSelectedModuleId(null)}
                className="px-3 py-2 bg-slate-950 text-slate-400 hover:text-white font-mono text-xs rounded-xl border border-slate-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Scenario Briefing Modal (Educational Explanation) */}
      {showBriefing && (
        <Suspense fallback={<TelemetryChunkLoader title="Decrypting NASA Mission Architecture..." />}>
          <ScenarioBriefingModal
            location={state.location}
            onClose={() => setShowBriefing(false)}
          />
        </Suspense>
      )}

      {/* Emergency Crisis Modal (NASA DONKI & Flight Director Alerts) */}
      {state.activeCrisis && (
        <CrisisModal
          crisis={state.activeCrisis}
          countdown={state.crisisTimer}
          onSelectOption={(option) => {
            if (option.solveCrisis) {
              unlockBadge('badge-solar-commander');
            }
            actions.resolveCrisis(option.effects, option.solveCrisis);
          }}
        />
      )}

      {/* Code-Split EVA Spacewalk Simulator Drill */}
      {showEva && (
        <Suspense fallback={<TelemetryChunkLoader title="Pressurizing Airlock & EMU Spacesuit..." />}>
          <EvaMiniGame
            onClose={() => setShowEva(false)}
            onSuccess={() => {
              unlockBadge('badge-eva-hero');
            }}
          />
        </Suspense>
      )}

      {/* Code-Split Cadet Academy & NASA Badge Gallery */}
      {showAcademy && (
        <Suspense fallback={<TelemetryChunkLoader title="Accessing NASA Flight Records & Badges..." />}>
          <CadetAcademy
            badges={badges}
            crisesResolved={state.crisesResolvedCount}
            missionTime={state.missionTime}
            onClose={() => setShowAcademy(false)}
          />
        </Suspense>
      )}

      {/* Code-Split Supabase Leaderboard */}
      {showLeaderboard && (
        <Suspense fallback={<TelemetryChunkLoader title="Connecting to Supabase Leaderboard..." />}>
          <LeaderboardModal
            currentScore={{
              outpostType: state.location,
              survivalTime: state.missionTime,
              crisesResolved: state.crisesResolvedCount,
              stabilityScore: state.stabilityScore,
            }}
            onClose={() => setShowLeaderboard(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
