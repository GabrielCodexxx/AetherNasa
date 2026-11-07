import React from 'react';
import { Plus, Minus, Wind, Shield, Play, ArrowRight, BatteryCharging } from 'lucide-react';
import type { TurnResources, SolHazard } from '../types/trainer';
import { soundManager } from '../utils/soundEffects';

interface TurnAllocationControlsProps {
  resources: TurnResources;
  hazard: SolHazard;
  solNumber: number;
  o2Boosts: number;
  shieldBoosts: number;
  onAddO2: () => void;
  onRemoveO2: () => void;
  onAddShield: () => void;
  onRemoveShield: () => void;
  onEndDay: () => void;
}

export const TurnAllocationControls: React.FC<TurnAllocationControlsProps> = ({
  resources,
  hazard,
  solNumber,
  o2Boosts,
  shieldBoosts,
  onAddO2,
  onRemoveO2,
  onAddShield,
  onRemoveShield,
  onEndDay,
}) => {
  const o2PowerCost = o2Boosts * 10;
  const shieldPowerCost = shieldBoosts * 15;
  const totalPowerSpent = o2PowerCost + shieldPowerCost;
  const remainingPower = resources.power - totalPowerSpent;

  const canAffordO2 = remainingPower >= 10;
  const canAffordShield = remainingPower >= 15;

  // Forecast calculations
  const projectedO2 = Math.min(100, Math.max(0, resources.oxygen - hazard.o2Depletion + o2Boosts * 15));
  const projectedShield = Math.min(100, Math.max(0, resources.shielding - hazard.shieldDepletion + shieldBoosts * 20));
  const projectedPower = Math.min(100, Math.max(0, remainingPower + hazard.solarGeneration));

  return (
    <div className="bg-slate-950/90 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Allocation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-widest">
            PHASE 2 &bull; POWER GRID ALLOCATION
          </span>
          <h3 className="text-base sm:text-lg font-black text-white">
            Distribute Today's Solar Power
          </h3>
          <p className="text-xs text-slate-400">
            Use the + and - buttons to buy oxygen and shield charges before ending the Sol.
          </p>
        </div>

        {/* Battery Budget Status */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-inner">
          <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <BatteryCharging className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Remaining Battery Budget
            </div>
            <div className="text-xl font-black font-mono text-yellow-400">
              {remainingPower}% <span className="text-xs font-normal text-slate-400">({totalPowerSpent}% Spent)</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Two Control Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Control 1: Oxygen Generator */}
        <div className="bg-slate-900/90 border-2 border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-blue-400/60 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Generate Oxygen Air</h4>
                <p className="text-xs text-blue-300 font-mono">
                  Costs 10% Power &rarr; Gives +15% Oxygen
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
              +{o2Boosts * 15}% Air
            </span>
          </div>

          {/* Plus / Minus Buttons (Large Touch Friendly) */}
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                if (o2Boosts > 0) {
                  soundManager.playMinusBeep();
                  onRemoveO2();
                }
              }}
              disabled={o2Boosts === 0}
              className="w-14 h-14 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-white transition-all text-xl font-bold shadow"
              title="Remove an Oxygen boost"
            >
              <Minus className="w-6 h-6" />
            </button>

            <div className="text-center font-mono">
              <span className="text-2xl font-black text-white">{o2Boosts}</span>
              <span className="text-[11px] text-slate-400 block">Boosts ({o2PowerCost}% Power)</span>
            </div>

            <button
              onClick={() => {
                if (canAffordO2) {
                  soundManager.playPlusBeep();
                  onAddO2();
                } else {
                  soundManager.playErrorBuzz();
                }
              }}
              disabled={!canAffordO2}
              className="w-14 h-14 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 flex items-center justify-center text-white transition-all text-xl font-bold shadow-lg shadow-blue-600/30"
              title="Add 15% Oxygen for 10% Power"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Control 2: Radiation Shield */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-400/60 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Charge Deflector Shield</h4>
                <p className="text-xs text-emerald-300 font-mono">
                  Costs 15% Power &rarr; Gives +20% Shield
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
              +{shieldBoosts * 20}% Shield
            </span>
          </div>

          {/* Plus / Minus Buttons (Large Touch Friendly) */}
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                if (shieldBoosts > 0) {
                  soundManager.playMinusBeep();
                  onRemoveShield();
                }
              }}
              disabled={shieldBoosts === 0}
              className="w-14 h-14 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-white transition-all text-xl font-bold shadow"
              title="Remove a Shield charge"
            >
              <Minus className="w-6 h-6" />
            </button>

            <div className="text-center font-mono">
              <span className="text-2xl font-black text-white">{shieldBoosts}</span>
              <span className="text-[11px] text-slate-400 block">Charges ({shieldPowerCost}% Power)</span>
            </div>

            <button
              onClick={() => {
                if (canAffordShield) {
                  soundManager.playPlusBeep();
                  onAddShield();
                } else {
                  soundManager.playErrorBuzz();
                }
              }}
              disabled={!canAffordShield}
              className="w-14 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 flex items-center justify-center text-white transition-all text-xl font-bold shadow-lg shadow-emerald-600/30"
              title="Add 20% Shield for 15% Power"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* End of Day Forecast Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold">
            Projected End-of-Sol Levels:
          </span>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-yellow-400 font-bold">Power: {projectedPower}%</span>
            <span>&bull;</span>
            <span className={`font-bold ${projectedO2 <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              Oxygen: {projectedO2}%
            </span>
            <span>&bull;</span>
            <span className={`font-bold ${projectedShield <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              Shield: {projectedShield}%
            </span>
          </div>
        </div>

        {/* Phase 3: Execute Sol Big Button */}
        <button
          onClick={() => {
            soundManager.playEndDayChime();
            onEndDay();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute Sol {solNumber} (End Day)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
