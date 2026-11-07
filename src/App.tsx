import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { ResourceDashboard } from './components/ResourceDashboard';
import { CrisisModal } from './components/CrisisModal';
import { useMissionSimulation } from './engine/useMissionSimulation';
import { CADET_BADGES } from './utils/nasaData';
import type { CadetBadge } from './types/trainer';
import { Loader2 } from 'lucide-react';

// Code-split chunks using React.lazy for high-performance chunking
const OutpostMap = lazy(() => import('./components/OutpostMap'));
const EvaMiniGame = lazy(() => import('./components/EvaMiniGame'));
const CadetAcademy = lazy(() => import('./components/CadetAcademy'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));

// Sci-Fi Telemetry Fallback Loader for Suspense chunks
function TelemetryChunkLoader({ title }: { title: string }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">NASA SUB-SYSTEM LOADING</div>
      <p className="text-xs text-slate-400 mt-1">{title}</p>
    </div>
  );
}

export function App() {
  const { state, actions } = useMissionSimulation('lunar');
  const [badges, setBadges] = useState<CadetBadge[]>(CADET_BADGES);

  // Modal view states
  const [showEva, setShowEva] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Badge unlock helper
  const unlockBadge = (id: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === id ? { ...b, unlocked: true } : b))
    );
  };

  // Check automated badge achievements
  if (!badges.find((b) => b.id === 'badge-closed-loop')?.unlocked) {
    if (state.deltas.oxygen > 0 && state.deltas.water > 0) {
      unlockBadge('badge-closed-loop');
    }
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top NASA Mission Control Header */}
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
        onTriggerCrisis={actions.triggerRandomCrisis}
      />

      {/* Main Mission Control Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Core ECLSS Resource Dashboard */}
        <ResourceDashboard
          resources={state.resources}
          deltas={state.deltas}
          stabilityScore={state.stabilityScore}
        />

        {/* Code-Split Modular Outpost Habitat Architecture */}
        <Suspense fallback={<TelemetryChunkLoader title="Initializing Habitat Telemetry & Life Support Grid..." />}>
          <OutpostMap
            location={state.location}
            modules={state.modules}
            onToggleStatus={actions.toggleModuleStatus}
            onRepair={actions.repairModule}
            onLaunchEVA={() => setShowEva(true)}
          />
        </Suspense>
      </main>

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
