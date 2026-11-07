import React from 'react';
import { BatteryCharging, Send, RotateCcw, Undo2, Star } from 'lucide-react';

interface CommandPanelProps {
  maxBattery: number;
  currentBattery: number;
  pathLength: number;
  collectedStars: number;
  targetStars: number;
  isExecuting: boolean;
  canTransmit: boolean;
  onTransmit: () => void;
  onClear: () => void;
  onUndo: () => void;
}

export const CommandPanel: React.FC<CommandPanelProps> = ({
  maxBattery,
  currentBattery,
  pathLength,
  collectedStars,
  targetStars,
  isExecuting,
  canTransmit,
  onTransmit,
  onClear,
  onUndo,
}) => {
  const batteryPct = Math.max(0, Math.min(100, (currentBattery / maxBattery) * 100));

  const getBatteryColor = () => {
    if (batteryPct > 50) return 'from-yellow-400 to-amber-500 text-yellow-400';
    if (batteryPct > 20) return 'from-amber-500 to-orange-500 text-amber-400';
    return 'from-red-600 to-rose-500 text-rose-400 animate-pulse';
  };

  const batteryColor = getBatteryColor();

  return (
    <div className="bg-slate-950/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Battery Header & Large Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <BatteryCharging className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                ROVER POWER RESERVES
              </span>
              <h3 className="text-base font-black text-white">Remaining Battery Budget</h3>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-black font-mono tracking-tight ${batteryColor.split(' ')[2]}`}>
              {currentBattery} <span className="text-sm font-normal text-slate-400">/ {maxBattery} pts</span>
            </span>
          </div>
        </div>

        {/* Dynamic Colorful Battery Bar */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${batteryColor} transition-all duration-300 shadow-lg`}
            style={{ width: `${batteryPct}%` }}
          />
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Planned Steps:</span>
          <span className="text-white font-bold">{pathLength} tiles</span>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/30" /> Ice Scans:
          </span>
          <span className="text-cyan-300 font-bold">
            {collectedStars} / {targetStars} ⭐
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Status:</span>
          <span className={canTransmit ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isExecuting ? 'EXECUTING...' : canTransmit ? 'READY TO TRANSMIT' : 'DRAW PATH'}
          </span>
        </div>
      </div>

      {/* Large Touch Friendly Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {/* Undo Step */}
        <button
          onClick={onUndo}
          disabled={isExecuting || pathLength <= 1}
          className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white font-mono text-xs font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
          title="Remove the last waypoint step"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo Step</span>
        </button>

        {/* Clear Path */}
        <button
          onClick={onClear}
          disabled={isExecuting || pathLength <= 1}
          className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-rose-300 hover:text-rose-200 font-mono text-xs font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
          title="Clear the entire planned path"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Route</span>
        </button>

        {/* Transmit Command Sequence */}
        <button
          onClick={onTransmit}
          disabled={isExecuting || !canTransmit}
          className="flex-1 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-30 disabled:hover:from-yellow-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95"
        >
          <Send className="w-4 h-4 fill-current" />
          <span>Transmit Sequence to Rover</span>
        </button>
      </div>
    </div>
  );
};
