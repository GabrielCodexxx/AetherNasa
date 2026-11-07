import React from 'react';
import { Wind, Droplets, Zap, Apple, Shield, Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
    if (val > 60) return { bar: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    if (val > 25) return { bar: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' };
    return { bar: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/40' };
  };

  const renderDelta = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="flex items-center text-xs text-emerald-400 font-mono">
          <TrendingUp className="w-3 h-3 mr-0.5" /> +{delta}/s
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="flex items-center text-xs text-rose-400 font-mono">
          <TrendingDown className="w-3 h-3 mr-0.5" /> {delta}/s
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs text-slate-400 font-mono">
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
      name: 'Energy Grid',
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
      sub: 'Hydroponic Veggie Lab',
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
      name: 'Crew Focus / Morale',
      icon: Heart,
      val: Math.round(resources.morale),
      delta: deltas.morale,
      unit: '%',
      sub: 'Commander Stress Index',
    },
  ];

  const stabilityTone =
    stabilityScore > 75
      ? 'from-cyan-500 to-emerald-400 text-emerald-400'
      : stabilityScore > 40
      ? 'from-amber-500 to-yellow-400 text-amber-400'
      : 'from-red-600 to-rose-500 text-rose-400';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>NASA ECLSS TELEMETRY CONSOLE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          </h2>
          <p className="text-xs text-slate-400">Environmental Control and Life Support System (Active Balance Loop)</p>
        </div>

        {/* Base Stability Gauge */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Outpost Stability</div>
            <div className={`text-xl font-black font-mono tracking-tight ${stabilityTone.split(' ')[2]}`}>
              {stabilityScore}%
            </div>
          </div>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stabilityTone} transition-all duration-300`}
              style={{ width: `${stabilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const colors = getStatusColor(item.val);
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`bg-slate-950/60 border ${colors.border} rounded-xl p-3 flex flex-col justify-between transition-all hover:bg-slate-900/80`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300 truncate">{item.name}</span>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {item.val}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">{item.unit}</span>
                </span>
                {renderDelta(item.delta)}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full ${colors.bar} transition-all duration-300`}
                  style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 truncate">{item.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
