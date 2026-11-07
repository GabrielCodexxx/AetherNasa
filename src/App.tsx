import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { HazardBriefingBanner } from './components/HazardBriefingBanner';
import { LunarOutpost2DView } from './components/LunarOutpost2DView';
import { TurnAllocationControls } from './components/TurnAllocationControls';
import { SOL_CAMPAIGN } from './utils/nasaData';
import type { TurnResources } from './types/trainer';
import { soundManager } from './utils/soundEffects';

// Code-split modals
const SystemFailureModal = lazy(() => import('./components/SystemFailureModal'));
const VictoryModal = lazy(() => import('./components/VictoryModal'));
const ScenarioBriefingModal = lazy(() => import('./components/ScenarioBriefingModal'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));

export function App() {
  // Turn-based State: Sol 1 to 10
  const [solIndex, setSolIndex] = useState(0); // 0 = Sol 1, 9 = Sol 10
  const currentHazard = SOL_CAMPAIGN[solIndex];

  // The 3 Core Resources
  const [resources, setResources] = useState<TurnResources>({
    power: 60,     // Primary currency (0-100% Yellow)
    oxygen: 80,    // Life Support (0-100% Blue)
    shielding: 80, // Base Integrity (0-100% Green)
  });

  // Snapshot at start of Sol for constructive retry
  const [solStartResources, setSolStartResources] = useState<TurnResources>({
    power: 60,
    oxygen: 80,
    shielding: 80,
  });

  // Current turn allocations
  const [o2Boosts, setO2Boosts] = useState(0);
  const [shieldBoosts, setShieldBoosts] = useState(0);

  // Game Status
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [stormsSurvived, setStormsSurvived] = useState(0);

  // Modals
  const [showBriefing, setShowBriefing] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);

  // Handle End Day / Execute Sol
  const handleEndDay = () => {
    // 1. Calculate Power Spent
    const powerSpent = o2Boosts * 10 + shieldBoosts * 15;
    const remainingPowerBeforeGen = resources.power - powerSpent;

    // 2. Calculate New Resource Values
    const finalPower = Math.min(100, Math.max(0, remainingPowerBeforeGen + currentHazard.solarGeneration));
    const finalOxygen = Math.min(100, Math.max(0, resources.oxygen - currentHazard.o2Depletion + o2Boosts * 15));
    const finalShielding = Math.min(100, Math.max(0, resources.shielding - currentHazard.shieldDepletion + shieldBoosts * 20));

    // 3. Constructive Failure Checks
    if (finalPower <= 0) {
      soundManager.playFailureTone();
      setFailureReason(
        `Your batteries completely drained to 0%! Today you spent ${powerSpent}% power, but the panels only generated ${currentHazard.solarGeneration}%. In low-light conditions, ration your power carefully!`
      );
      return;
    }

    if (finalOxygen <= 0) {
      soundManager.playFailureTone();
      setFailureReason(
        `Your crew ran out of breathable air! Astronauts naturally consume ${currentHazard.o2Depletion}% oxygen every Sol. You must allocate at least one 10% power boost to the oxygen generator to replenish air.`
      );
      return;
    }

    if (finalShielding <= 0) {
      soundManager.playFailureTone();
      setFailureReason(
        `Your deflector shield collapsed under space radiation! Today's hazard dealt ${currentHazard.shieldDepletion}% damage to your shields. When a solar storm hits, you must route extra power to shields!`
      );
      return;
    }

    // 4. Sol Survived Successfully!
    const nextResources = {
      power: finalPower,
      oxygen: finalOxygen,
      shielding: finalShielding,
    };

    setResources(nextResources);

    if (currentHazard.type === 'solar_storm') {
      setStormsSurvived((s) => s + 1);
    }

    // 5. Check 10-Sol Victory
    if (solIndex >= SOL_CAMPAIGN.length - 1) {
      setIsVictory(true);
    } else {
      // Advance to next Sol
      setSolIndex((idx) => idx + 1);
      setSolStartResources(nextResources);
      setO2Boosts(0);
      setShieldBoosts(0);
    }
  };

  // Constructive Failure Retry: restore start of that exact Sol
  const handleRetrySol = () => {
    setResources(solStartResources);
    setO2Boosts(0);
    setShieldBoosts(0);
    setFailureReason(null);
  };

  // Restart entire 10-Sol campaign
  const handleRestartCampaign = () => {
    setSolIndex(0);
    const initial = { power: 60, oxygen: 80, shielding: 80 };
    setResources(initial);
    setSolStartResources(initial);
    setO2Boosts(0);
    setShieldBoosts(0);
    setFailureReason(null);
    setIsVictory(false);
    setStormsSurvived(0);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col bg-radar-grid selection:bg-yellow-500 selection:text-black">
      {/* Header */}
      <Header
        missionTime={solIndex + 1}
        isPaused={isPaused}
        speed={speed}
        activeCrisis={currentHazard.type === 'solar_storm'}
        stormsSurvived={stormsSurvived}
        onTogglePause={() => setIsPaused(!isPaused)}
        onSetSpeed={setSpeed}
        onOpenAcademy={() => setShowBriefing(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenBriefing={() => setShowBriefing(true)}
        onTriggerCrisis={() => {}}
        onRestart={handleRestartCampaign}
      />

      {/* Main Game Board */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Phase 1: Daily Mission Briefing Banner */}
        <HazardBriefingBanner
          hazard={currentHazard}
          solNumber={solIndex + 1}
        />

        {/* 2D Flat Vector Visual Lunar Outpost View */}
        <LunarOutpost2DView
          resources={resources}
          hazard={currentHazard}
          solNumber={solIndex + 1}
        />

        {/* Phase 2 & 3: Turn Allocation Controls with + / - Buttons */}
        <TurnAllocationControls
          resources={resources}
          hazard={currentHazard}
          solNumber={solIndex + 1}
          o2Boosts={o2Boosts}
          shieldBoosts={shieldBoosts}
          onAddO2={() => setO2Boosts((b) => b + 1)}
          onRemoveO2={() => setO2Boosts((b) => Math.max(0, b - 1))}
          onAddShield={() => setShieldBoosts((b) => b + 1)}
          onRemoveShield={() => setShieldBoosts((b) => Math.max(0, b - 1))}
          onEndDay={handleEndDay}
        />
      </main>

      {/* Constructive Failure Modal (Engineers Learn From Failure) */}
      {failureReason && (
        <Suspense fallback={<div />}>
          <SystemFailureModal
            solNumber={solIndex + 1}
            reason={failureReason}
            onRetrySol={handleRetrySol}
          />
        </Suspense>
      )}

      {/* 10-Sol Victory Modal */}
      {isVictory && (
        <Suspense fallback={<div />}>
          <VictoryModal
            finalResources={resources}
            onRestart={handleRestartCampaign}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        </Suspense>
      )}

      {/* Scenario Explanation Briefing Modal */}
      {showBriefing && (
        <Suspense fallback={<div />}>
          <ScenarioBriefingModal
            onClose={() => setShowBriefing(false)}
          />
        </Suspense>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Suspense fallback={<div />}>
          <LeaderboardModal
            currentScore={{
              outpostType: 'lunar',
              survivalTime: (solIndex + 1) * 60,
              crisesResolved: stormsSurvived,
              stabilityScore: Math.round((resources.power + resources.oxygen + resources.shielding) / 3),
            }}
            onClose={() => setShowLeaderboard(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
