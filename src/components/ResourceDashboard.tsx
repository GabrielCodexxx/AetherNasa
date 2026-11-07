import React from 'react';
import { Wind, Droplets, Zap, Apple, Shield, Heart, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { OutpostResources, ResourceDeltas } from '../types/trainer';

interface ResourceDashboardProps {
  resources: OutpostResources;
  deltas: ResourceDeltas;
  stabilityScore: number;
}

export const ResourceDashboard: React.FC<ResourceDashboardProps> = ({
  resources,
  deltas,
  stabilityScore,
}) => {
  const getStatusColor = (val: number) => {
    if (val > 60) {
      return {
        bar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        dot: 'bg-cyan-400',
        glow: 'shadow-cyan-500/10',
      };
    }
    if (val > 25) {
      return {
        bar: 'bg-gradient-to-r from-amber-500 to-yellow-500',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
        glow: 'shadow-amber-500/10',
      };
    }
    return {
      bar: 'bg-gradient-to-r from-red-600 to-rose-500',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      dot: 'bg-rose-500 animate-ping',
      glow: 'shadow-rose-500/20',
    };
  };

  const renderDelta = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="flex items-center text-[11px] text-emerald-400 font-mono font-semibold">
          <TrendingUp className="w-3 h-3 mr-0.5" /> +{delta}/s
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="flex items-center text-[11px] text-rose-400 font-mono font-semibold">
          <TrendingDown className="w-3 h-3 mr-0.5" /> {delta}/s
        </span>
      );
    }
    return (
      <span className="flex items-center text-[11px] text-slate-500 font-mono">
        <Minus className="w-3 h-3 mr-0.5" /> 0.0/s
      </span>
    );
  };

  const items = [
    {
      name: 'Oxygen (O₂)',
      icon: Wind,
      val: Math.round(resources.oxygen),
      delta: deltas.oxygen,
      unit: '%',
      sub: 'ECLSS Sabatier Loop',
    },
    {
      name: 'Water (H₂O)',
      icon: Droplets,
      val: Math.round(resources.water),
      delta: deltas.water,
      unit: '%',
      sub: '98% Recycled Graywater',
    },
    {
      name: 'Power Grid',
      icon: Zap,
      val: Math.round(resources.power),
      delta: deltas.power,
      unit: 'kW',
      sub: 'Kilopower & Solar Array',
    },
    {
      name: 'Nutrition Store',
      icon: Apple,
      val: Math.round(resources.food),
      delta: deltas.food,
      unit: '%',
      sub: 'Veggie Hydroponics',
    },
    {
      name: 'Radiation Shield',
      icon: Shield,
      val: Math.round(resources.shielding),
      delta: deltas.shielding,
      unit: '%',
      sub: 'Regolith Sintered Vault',
    },
    {
      name: 'Commander Focus',
      icon: Heart,
      val: Math.round(resources.morale),
      delta: deltas.morale,
      unit: '%',
      sub: 'Crew Morale & Health',
    },
  ];

  const stabilityTone =
    stabilityScore > 75
      ? 'from-cyan-500 to-emerald-400 text-emerald-400 border-emerald-500/30'
      : stabilityScore > 40
      ? 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/30'
      : 'from-rose-600 to-red-500 text-rose-400 border-rose-500/40';

  return (
    <div className="hud-card rounded-2xl p-4 sm:p-5">
      {/* Console Top Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-white font-mono uppercase flex items-center gap-2">
              <span>NASA ECLSS TELEMETRY MATRIX</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400" />
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              REAL-TIME LIFE SUPPORT BALANCING &bull; ZERO LATENCY SUITE
            </p>
          </div>
        </div>

        {/* Tactical Stability Score HUD Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
              BASE STABILITY INDEX
            </div>
            <div className={`text-xl font-black font-mono tracking-tight ${stabilityTone.split(' ')[2]}`}>
              {stabilityScore}%
            </div>
          </div>
          <div className="w-20 h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${stabilityTone} transition-all duration-300`}
              style={{ width: `${stabilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Gauges with Crisp Aerospace Styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const colors = getStatusColor(item.val);
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`bg-slate-950/70 border ${colors.border} rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-cyan-400/50 hover:bg-slate-900/90 shadow-md ${colors.glow}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className="text-xs font-semibold text-slate-300 truncate">{item.name}</span>
                </div>
                <Icon className={`w-3.5 h-3.5 ${colors.text} shrink-0`} />
              </div>

              <div className="flex items-baseline justify-between my-1.5">
                <span className="text-2xl font-black font-mono text-white tracking-tight">
                  {item.val}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">{item.unit}</span>
                </span>
                {renderDelta(item.delta)}
              </div>

              {/* High-def Gauge Progress Line */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-2 border border-slate-800/80">
                <div
                  className={`h-full ${colors.bar} transition-all duration-300 rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 font-mono truncate">{item.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
