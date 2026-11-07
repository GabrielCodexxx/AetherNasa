import React from 'react';
import type { Coordinate, LevelConfig } from '../types/trainer';
import { Sun, Star, Bot, Target } from 'lucide-react';

interface RoverGridProps {
  level: LevelConfig;
  path: Coordinate[];
  currentRoverPos: Coordinate;
  isExecuting: boolean;
  onTileClick: (coord: Coordinate) => void;
  floatingText: { coord: Coordinate; text: string; color: string } | null;
}

export const RoverGrid: React.FC<RoverGridProps> = ({
  level,
  path,
  currentRoverPos,
  isExecuting,
  onTileClick,
  floatingText,
}) => {
  // Check if tile is in path and its step index
  const getPathIndex = (r: number, c: number) => {
    return path.findIndex((p) => p.r === r && p.c === c);
  };

  // Determine tile appearance
  const getTileStyle = (r: number, c: number) => {
    const tile = level.grid[r][c];
    const isStart = level.start.r === r && level.start.c === c;
    const isGoal = level.goal.r === r && level.goal.c === c;

    switch (tile) {
      case 'boulder':
        return {
          bg: 'bg-slate-900 border-slate-700/80 cursor-not-allowed',
          content: (
            <div className="flex flex-col items-center justify-center text-slate-500">
              <span className="text-xl select-none">🪨</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Boulder</span>
            </div>
          ),
        };

      case 'solar':
        return {
          bg: 'bg-amber-950/40 border-amber-500/60 shadow-inner shadow-amber-500/20 hover:border-amber-400',
          content: (
            <div className="flex flex-col items-center justify-center text-amber-300">
              <Sun className="w-5 h-5 text-amber-400 animate-spin" />
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase mt-0.5">+2 Solar</span>
            </div>
          ),
        };

      case 'ice':
        return {
          bg: 'bg-cyan-950/40 border-cyan-400/60 shadow-inner shadow-cyan-500/20 hover:border-cyan-300',
          content: (
            <div className="flex flex-col items-center justify-center text-cyan-300">
              <Star className="w-5 h-5 text-cyan-300 fill-cyan-400/30" />
              <span className="text-[9px] font-mono font-bold text-cyan-300 uppercase mt-0.5">Ice (⭐+1)</span>
            </div>
          ),
        };

      case 'regolith':
        return {
          bg: 'bg-[#291e14] border-amber-900/80 hover:border-amber-700',
          content: (
            <div className="flex flex-col items-center justify-center text-amber-600/90">
              <span className="text-lg select-none">🏜️</span>
              <span className="text-[9px] font-mono text-amber-500/80 uppercase font-bold mt-0.5">-2 Sand</span>
            </div>
          ),
        };

      default:
        // Plain basalt
        if (isStart) {
          return {
            bg: 'bg-emerald-950/60 border-emerald-500/80 shadow-md shadow-emerald-500/20',
            content: (
              <div className="flex flex-col items-center justify-center text-emerald-300">
                <span className="text-xl">🚀</span>
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">Landing</span>
              </div>
            ),
          };
        }
        if (isGoal) {
          return {
            bg: 'bg-yellow-950/50 border-yellow-400/80 shadow-md shadow-yellow-500/30 animate-pulse',
            content: (
              <div className="flex flex-col items-center justify-center text-yellow-300">
                <Target className="w-5 h-5 text-yellow-400" />
                <span className="text-[9px] font-mono font-bold text-yellow-400 uppercase">Target</span>
              </div>
            ),
          };
        }
        return {
          bg: 'bg-slate-950/80 border-slate-800/80 hover:border-slate-600',
          content: (
            <div className="flex flex-col items-center justify-center text-slate-600">
              <span className="text-[9px] font-mono text-slate-500">-1 Basalt</span>
            </div>
          ),
        };
    }
  };

  return (
    <div className="relative rounded-3xl bg-slate-950 border-2 border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
      {/* Top Map Location Badge */}
      <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400 uppercase">LRO Topography Grid:</span>
          <span className="text-white font-bold">{level.name}</span>
        </div>
        <div className="text-slate-400 hidden sm:block">
          {level.location}
        </div>
      </div>

      {/* Grid Container */}
      <div
        className="grid gap-1 sm:gap-1.5 p-2 bg-slate-900/90 rounded-2xl border-2 border-slate-800 relative select-none"
        style={{
          gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
          maxWidth: level.width === 10 ? '640px' : '520px',
          width: '100%',
        }}
      >
        {level.grid.map((row, r) =>
          row.map((_, c) => {
            const style = getTileStyle(r, c);
            const pathIdx = getPathIndex(r, c);
            const inPath = pathIdx !== -1;
            const isRover = currentRoverPos.r === r && currentRoverPos.c === c;
            const isFloating = floatingText?.coord.r === r && floatingText?.coord.c === c;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => !isExecuting && onTileClick({ r, c })}
                disabled={isExecuting || level.grid[r][c] === 'boulder'}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-150 active:scale-95 ${style.bg} ${
                  inPath ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 scale-[0.98]' : ''
                }`}
              >
                {/* Tile Content */}
                {style.content}

                {/* Path Step Number Badge */}
                {inPath && (
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-mono font-black flex items-center justify-center shadow">
                    {pathIdx + 1}
                  </div>
                )}

                {/* Animated Rover Figure */}
                {isRover && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center animate-fade-in pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-yellow-400 text-slate-950 border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
                      <Bot className="w-5 h-5" />
                    </div>
                  </div>
                )}

                {/* Dynamic Floating Action Feedback Text (+2 Solar / -2 Sand) */}
                {isFloating && (
                  <div
                    className={`absolute -top-4 z-30 px-2 py-0.5 rounded-full text-[11px] font-mono font-black shadow-lg animate-fade-in border ${floatingText.color}`}
                  >
                    {floatingText.text}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Grid Legend Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-950 border border-slate-700" /> Basalt (-1)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#291e14] border border-amber-900" /> Loose Sand (-2)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-950 border border-amber-500" /> Solar Ridge (+2)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-950 border border-cyan-400" /> Water Ice (-3, ⭐+1)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700" /> Boulders (Blocked)
        </span>
      </div>
    </div>
  );
};
