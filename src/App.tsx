import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { RoverGrid } from './components/RoverGrid';
import { CommandPanel } from './components/CommandPanel';
import { LEVELS } from './utils/levels';
import type { Coordinate, LevelConfig, TileType } from './types/trainer';
import { soundManager } from './utils/soundEffects';
import { Lightbulb } from 'lucide-react';

// Code-split modals
const TeachersGuideModal = lazy(() => import('./components/TeachersGuideModal'));
const MissionDebriefModal = lazy(() => import('./components/MissionDebriefModal'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));

export function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel: LevelConfig = LEVELS[levelIndex];

  // Path drawing state: begins with start tile
  const [path, setPath] = useState<Coordinate[]>([currentLevel.start]);
  const [roverPos, setRoverPos] = useState<Coordinate>(currentLevel.start);
  const [isExecuting, setIsExecuting] = useState(false);

  // Floating text feedback (e.g. +2 Solar!)
  const [floatingText, setFloatingText] = useState<{ coord: Coordinate; text: string; color: string } | null>(null);

  // Level Results & Modals
  const [debrief, setDebrief] = useState<{
    show: boolean;
    status: 'success' | 'failure';
    failureReason?: string;
    finalBattery: number;
    stars: number;
  } | null>(null);

  const [showTeachersGuide, setShowTeachersGuide] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);

  // Reset path when changing levels
  useEffect(() => {
    setPath([currentLevel.start]);
    setRoverPos(currentLevel.start);
    setIsExecuting(false);
    setFloatingText(null);
    setDebrief(null);
  }, [currentLevel]);

  // Calculate battery & stars in real-time as path is planned
  const calculatePlannedStats = () => {
    let battery = currentLevel.maxBattery;
    let stars = 0;
    const visitedTiles = new Set<string>();

    for (let i = 1; i < path.length; i++) {
      const coord = path[i];
      const key = `${coord.r},${coord.c}`;
      const tile: TileType = currentLevel.grid[coord.r][coord.c];

      if (tile === 'regolith') {
        battery -= 2;
      } else if (tile === 'solar') {
        battery = Math.min(currentLevel.maxBattery, battery - 1 + 2); // Net +1
      } else if (tile === 'ice') {
        battery -= 3;
        if (!visitedTiles.has(key)) {
          stars += 1;
          visitedTiles.add(key);
        }
      } else {
        // Plain basalt or goal
        battery -= 1;
      }
    }

    return {
      plannedBattery: battery,
      plannedStars: stars,
    };
  };

  const { plannedBattery, plannedStars } = calculatePlannedStats();

  // Check if rover reached the objective
  const reachedGoal =
    path.length > 1 &&
    path[path.length - 1].r === currentLevel.goal.r &&
    path[path.length - 1].c === currentLevel.goal.c;

  // Handle clicking tiles to construct/undo route
  const handleTileClick = (coord: Coordinate) => {
    if (isExecuting) return;

    // Cannot walk on boulders
    if (currentLevel.grid[coord.r][coord.c] === 'boulder') {
      soundManager.playError();
      return;
    }

    // Check if clicked tile is already in path
    const existingIdx = path.findIndex((p) => p.r === coord.r && p.c === coord.c);
    if (existingIdx !== -1) {
      if (existingIdx === 0) {
        // Reset to start
        soundManager.playUndoTile();
        setPath([currentLevel.start]);
      } else {
        // Backtrack to clicked tile
        soundManager.playUndoTile();
        setPath(path.slice(0, existingIdx + 1));
      }
      return;
    }

    // Must be adjacent (orthogonal: Up, Down, Left, Right) to the last tile in path
    const last = path[path.length - 1];
    const dr = Math.abs(last.r - coord.r);
    const dc = Math.abs(last.c - coord.c);

    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      soundManager.playClickTile();
      setPath([...path, coord]);
    } else {
      soundManager.playError();
    }
  };

  // Undo step
  const handleUndo = () => {
    if (path.length > 1) {
      soundManager.playUndoTile();
      setPath(path.slice(0, path.length - 1));
    }
  };

  // Clear path
  const handleClear = () => {
    soundManager.playUndoTile();
    setPath([currentLevel.start]);
  };

  // Transmit command sequence & execute live rover drive
  const handleTransmit = () => {
    if (isExecuting || path.length <= 1) return;

    soundManager.playTransmit();
    setIsExecuting(true);

    let currentStep = 0;
    let liveBattery = currentLevel.maxBattery;
    let liveStars = 0;
    const visitedTiles = new Set<string>();

    const interval = setInterval(() => {
      currentStep += 1;

      if (currentStep >= path.length) {
        // Rover reached end of programmed path!
        clearInterval(interval);
        setIsExecuting(false);

        const lastPos = path[path.length - 1];
        const isAtGoal = lastPos.r === currentLevel.goal.r && lastPos.c === currentLevel.goal.c;

        if (isAtGoal && liveBattery >= 0) {
          setTotalStarsEarned((prev) => prev + liveStars);
          setDebrief({
            show: true,
            status: 'success',
            finalBattery: liveBattery,
            stars: liveStars,
          });
        } else {
          setDebrief({
            show: true,
            status: 'failure',
            failureReason: isAtGoal
              ? 'Rover arrived at the target, but battery died on the final meter!'
              : 'The programmed sequence ended before reaching the target beacon tile.',
            finalBattery: liveBattery,
            stars: liveStars,
          });
        }
        return;
      }

      // Move rover to next waypoint
      const coord = path[currentStep];
      setRoverPos(coord);
      const tile: TileType = currentLevel.grid[coord.r][coord.c];
      const key = `${coord.r},${coord.c}`;

      // Calculate cost
      if (tile === 'regolith') {
        liveBattery -= 2;
        soundManager.playRoverStep();
        setFloatingText({ coord, text: '-2 Sand', color: 'bg-amber-950 text-amber-300 border-amber-600' });
      } else if (tile === 'solar') {
        liveBattery = Math.min(currentLevel.maxBattery, liveBattery - 1 + 2);
        soundManager.playSolarRecharge();
        setFloatingText({ coord, text: '+2 Solar!', color: 'bg-yellow-950 text-yellow-300 border-yellow-500' });
      } else if (tile === 'ice') {
        liveBattery -= 3;
        if (!visitedTiles.has(key)) {
          liveStars += 1;
          visitedTiles.add(key);
        }
        soundManager.playIceScan();
        setFloatingText({ coord, text: '-3 Ice (⭐+1)', color: 'bg-cyan-950 text-cyan-300 border-cyan-400' });
      } else {
        liveBattery -= 1;
        soundManager.playRoverStep();
        setFloatingText({ coord, text: '-1 Basalt', color: 'bg-slate-900 text-slate-300 border-slate-700' });
      }

      // Check for mid-route battery depletion!
      if (liveBattery < 0) {
        clearInterval(interval);
        setIsExecuting(false);
        setDebrief({
          show: true,
          status: 'failure',
          failureReason: `Battery depleted on tile (${coord.r + 1}, ${coord.c + 1}) in ${tile.toUpperCase()}! Wheels stopped with 0 power remaining.`,
          finalBattery: 0,
          stars: liveStars,
        });
      }
    }, 450);
  };

  // Next level handler
  const handleNextLevel = () => {
    setDebrief(null);
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((idx) => idx + 1);
    }
  };

  // Retry level handler
  const handleRetry = () => {
    setDebrief(null);
    setPath([currentLevel.start]);
    setRoverPos(currentLevel.start);
    setIsExecuting(false);
    setFloatingText(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col bg-radar-grid selection:bg-yellow-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentLevelIndex={levelIndex}
        totalLevels={LEVELS.length}
        totalStars={totalStarsEarned}
        onSelectLevel={(idx) => setLevelIndex(idx)}
        onOpenTeachersGuide={() => setShowTeachersGuide(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
      />

      {/* Main Command Console */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Level Mission Briefing Card */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <h2 className="text-base sm:text-lg font-black text-white font-mono flex items-center gap-2">
              <span>{currentLevel.name}</span>
              <span className="text-xs font-normal text-slate-400">({currentLevel.location})</span>
            </h2>
            <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-800 px-3 py-1 rounded-full">
              Battery Limit: {currentLevel.maxBattery} Pts
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentLevel.briefing}
          </p>

          <div className="flex items-center gap-2 text-xs text-cyan-300 pt-1">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono text-slate-400">NASA Science Fact:</span>
            <span className="text-slate-300 truncate">{currentLevel.nasaFact}</span>
          </div>
        </div>

        {/* Top-Down Interactive Rover Grid */}
        <RoverGrid
          level={currentLevel}
          path={path}
          currentRoverPos={roverPos}
          isExecuting={isExecuting}
          onTileClick={handleTileClick}
          floatingText={floatingText}
        />

        {/* Command Panel with Battery Drain Meter & Transmit */}
        <CommandPanel
          maxBattery={currentLevel.maxBattery}
          currentBattery={plannedBattery}
          pathLength={path.length - 1}
          collectedStars={plannedStars}
          targetStars={currentLevel.targetStars}
          isExecuting={isExecuting}
          canTransmit={reachedGoal && plannedBattery >= 0}
          onTransmit={handleTransmit}
          onClear={handleClear}
          onUndo={handleUndo}
        />
      </main>

      {/* Teacher's Guide Modal */}
      {showTeachersGuide && (
        <Suspense fallback={<div />}>
          <TeachersGuideModal onClose={() => setShowTeachersGuide(false)} />
        </Suspense>
      )}

      {/* Mission Debrief Modal (Success or Constructive Failure) */}
      {debrief?.show && (
        <Suspense fallback={<div />}>
          <MissionDebriefModal
            status={debrief.status}
            levelName={currentLevel.name}
            batteryRemaining={debrief.finalBattery}
            maxBattery={currentLevel.maxBattery}
            starsCollected={debrief.stars}
            targetStars={currentLevel.targetStars}
            failureReason={debrief.failureReason}
            isLastLevel={levelIndex === LEVELS.length - 1}
            onNextLevel={handleNextLevel}
            onRetry={handleRetry}
          />
        </Suspense>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Suspense fallback={<div />}>
          <LeaderboardModal
            currentScore={{
              outpostType: 'lunar',
              survivalTime: (levelIndex + 1) * 120,
              crisesResolved: totalStarsEarned,
              stabilityScore: Math.round(((levelIndex + 1) / LEVELS.length) * 100),
            }}
            onClose={() => setShowLeaderboard(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
