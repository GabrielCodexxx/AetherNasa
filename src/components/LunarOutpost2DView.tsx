import React from 'react';
import { Zap, Wind, Shield, Sun, CloudSun, Moon } from 'lucide-react';
import type { TurnResources, SolHazard } from '../types/trainer';

interface LunarOutpost2DViewProps {
  resources: TurnResources;
  hazard: SolHazard;
  solNumber: number;
}

export const LunarOutpost2DView: React.FC<LunarOutpost2DViewProps> = ({
  resources,
  hazard,
  solNumber,
}) => {
  // Astronaut Face Visual Cue based on Oxygen
  const getAstronautStatus = () => {
    if (resources.oxygen > 50) {
      return {
        emoji: '😄',
        text: 'Crew is breathing easily! Air is nominal.',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-950/40 border-emerald-500/40',
      };
    }
    if (resources.oxygen > 30) {
      return {
        emoji: '😐',
        text: 'Air levels acceptable. Keep an eye on life support.',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-950/40 border-cyan-500/40',
      };
    }
    if (resources.oxygen > 10) {
      return {
        emoji: '😟',
        text: 'Warning! Oxygen is low! Crew feels dizzy.',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-950/60 border-amber-500/60 animate-pulse',
      };
    }
    return {
      emoji: '🥵',
      text: 'CRITICAL AIR LOSS! Astronauts gasping for breath!',
      textColor: 'text-red-400',
      bgColor: 'bg-red-950/80 border-red-500 animate-bounce',
    };
  };

  // Shield Bubble Visual Cue
  const getShieldStatus = () => {
    if (resources.shielding > 50) {
      return {
        text: 'Forcefield Active & Strong',
        border: 'border-emerald-500/70',
        glow: 'shadow-emerald-500/20',
        bar: 'bg-emerald-500',
      };
    }
    if (resources.shielding > 25) {
      return {
        text: 'Shield Thinning from Radiation',
        border: 'border-yellow-500/70',
        glow: 'shadow-yellow-500/20',
        bar: 'bg-yellow-500',
      };
    }
    return {
      text: 'CRITICAL: Shield near collapse!',
      border: 'border-red-500 animate-pulse',
      glow: 'shadow-red-500/40',
      bar: 'bg-red-500',
    };
  };

  // Power Battery Status
  const getPowerStatus = () => {
    if (resources.power > 40) {
      return {
        text: 'Battery Well Charged',
        bar: 'bg-yellow-400',
      };
    }
    if (resources.power > 15) {
      return {
        text: 'Battery Low - Ration Usage',
        bar: 'bg-amber-500',
      };
    }
    return {
      text: 'BROWNOUT RISK - Battery Critical',
      bar: 'bg-red-500 animate-pulse',
    };
  };

  const astronaut = getAstronautStatus();
  const shield = getShieldStatus();
  const power = getPowerStatus();

  return (
    <div className="space-y-4">
      {/* Visual Canvas Scene: Lunar Outpost Dome with Shield Bubble and Astronaut Face */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#050914] via-[#091124] to-[#111a2e] border-2 border-slate-800 p-6 overflow-hidden shadow-2xl">
        {/* Sky Background: Earth & Stars */}
        <div className="absolute top-4 right-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-400/80 shadow-lg shadow-blue-500/30 flex items-center justify-center overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-emerald-500/80 blur-[2px]" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">
            EARTH VISIBLE
          </span>
        </div>

        {/* Surface Weather Icon */}
        <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-mono">
          {hazard.type === 'clear_skies' && (
            <span className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full font-bold">
              <Sun className="w-4 h-4 text-yellow-400 animate-spin" /> Clear Sunlight (+{hazard.solarGeneration}% Solar)
            </span>
          )}
          {hazard.type === 'solar_storm' && (
            <span className="flex items-center gap-1.5 bg-red-950/80 border border-red-500 text-red-300 px-3 py-1 rounded-full font-bold animate-pulse">
              ⚡ Solar Flare Proton Storm
            </span>
          )}
          {hazard.type === 'dust_storm' && (
            <span className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500 text-amber-300 px-3 py-1 rounded-full font-bold">
              <CloudSun className="w-4 h-4 text-amber-400" /> Moon Dust on Panels (+{hazard.solarGeneration}% Solar)
            </span>
          )}
          {hazard.type === 'eclipse' && (
            <span className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500 text-indigo-300 px-3 py-1 rounded-full font-bold">
              <Moon className="w-4 h-4 text-indigo-400" /> Total Eclipse (0% Solar)
            </span>
          )}
        </div>

        {/* Center Outpost Graphic with Astronaut Face & Shield Bubble */}
        <div className="py-8 sm:py-12 flex flex-col items-center justify-center relative">
          {/* Protective Shield Dome Forcefield */}
          <div
            className={`relative w-64 h-56 sm:w-80 sm:h-64 rounded-t-full border-4 ${shield.border} ${shield.glow} flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-t from-slate-950 via-slate-900/60 to-emerald-950/20`}
          >
            {/* Astronaut Face Visual Indicator */}
            <div className={`p-4 rounded-3xl border ${astronaut.bgColor} shadow-xl flex flex-col items-center text-center transition-all duration-300`}>
              <div className="text-5xl sm:text-6xl mb-1 select-none animate-bounce">
                {astronaut.emoji}
              </div>
              <span className={`text-xs font-black font-mono uppercase tracking-wider ${astronaut.textColor}`}>
                Crew Mood: {resources.oxygen > 50 ? 'Healthy' : resources.oxygen > 20 ? 'Stressed' : 'Danger'}
              </span>
            </div>

            {/* Habitat Base Floor */}
            <div className="absolute -bottom-3 w-72 sm:w-96 h-6 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
                ARTEMIS OUTPOST &bull; SHACKLETON SECTOR
              </span>
            </div>
          </div>
        </div>

        {/* Status Callout Bar */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">{astronaut.emoji}</span>
            <span className="text-slate-300 font-medium">{astronaut.text}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Sol {solNumber} of 10</span>
            <span>&bull;</span>
            <span className="text-emerald-400">{shield.text}</span>
          </div>
        </div>
      </div>

      {/* The 3 Core Large-Format Color-Coded Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Solar Power (Yellow) */}
        <div className="bg-slate-950/80 border-2 border-yellow-500/40 hover:border-yellow-400 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-yellow-400 tracking-wider">
                  RESOURCE 1 &bull; CURRENCY
                </span>
                <h3 className="text-base font-black text-white">Solar Power</h3>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-yellow-400">
              {resources.power}%
            </span>
          </div>

          {/* Yellow Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 my-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${power.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, resources.power))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>+{hazard.solarGeneration}% this Sol</span>
            <span className="text-slate-300 font-bold">{power.text}</span>
          </div>
        </div>

        {/* 2. Oxygen (Blue) */}
        <div className="bg-slate-950/80 border-2 border-blue-500/40 hover:border-blue-400 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-400 tracking-wider">
                  RESOURCE 2 &bull; LIFE SUPPORT
                </span>
                <h3 className="text-base font-black text-white">Oxygen Air</h3>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-blue-400">
              {resources.oxygen}%
            </span>
          </div>

          {/* Blue Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 my-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, resources.oxygen))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-rose-400">-{hazard.o2Depletion}% natural loss</span>
            <span className="text-slate-300 font-bold">Crew breathing</span>
          </div>
        </div>

        {/* 3. Radiation Shielding (Green) */}
        <div className="bg-slate-950/80 border-2 border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  RESOURCE 3 &bull; BASE INTEGRITY
                </span>
                <h3 className="text-base font-black text-white">Radiation Shield</h3>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {resources.shielding}%
            </span>
          </div>

          {/* Green Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 my-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${shield.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, resources.shielding))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className={hazard.shieldDepletion > 10 ? 'text-red-400 font-bold' : 'text-slate-400'}>
              -{hazard.shieldDepletion}% storm damage
            </span>
            <span className="text-slate-300 font-bold">Deflector grid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
