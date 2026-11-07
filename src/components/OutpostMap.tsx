import React from 'react';
import { Power, CheckCircle2, AlertTriangle, Info, Zap, Wrench } from 'lucide-react';
import type { OutpostModule, OutpostLocation } from '../types/trainer';
import { MISSION_CONFIGS } from '../utils/nasaData';

interface OutpostMapProps {
  location: OutpostLocation;
  modules: OutpostModule[];
  onToggleStatus: (id: string) => void;
  onRepair: (id: string) => void;
  onLaunchEVA: () => void;
}

export const OutpostMap: React.FC<OutpostMapProps> = ({
  location,
  modules,
  onToggleStatus,
  onRepair,
  onLaunchEVA,
}) => {
  const missionInfo = MISSION_CONFIGS[location];

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      {/* Planetary Site Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              PLANETARY ARCHITECTURE &bull; {location.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">{missionInfo.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Site: <span className="text-slate-300 font-medium">{missionInfo.siteName}</span> ({missionInfo.coordinates})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Temp: <span className="text-cyan-300">{missionInfo.temperature}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Gravity: <span className="text-cyan-300">{missionInfo.gravity}</span>
          </div>
          <button
            onClick={onLaunchEVA}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-sans font-semibold rounded-lg shadow-md shadow-cyan-500/20 transition-all border border-cyan-400/30"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Launch EVA Drill</span>
          </button>
        </div>
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const isOp = mod.status === 'operational';
          const isDamaged = mod.status === 'damaged';

          return (
            <div
              key={mod.id}
              className={`rounded-xl p-4 border transition-all ${
                isDamaged
                  ? 'bg-red-950/20 border-red-500/60 shadow-lg shadow-red-950/40'
                  : isOp
                  ? 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/30 border-slate-800/50 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    {mod.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">{mod.name}</h3>
                </div>

                <div className="flex items-center gap-1">
                  {isDamaged ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                      <AlertTriangle className="w-3 h-3" /> FAULT
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                        isOp
                          ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/40'
                          : 'text-slate-400 bg-slate-900 border border-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> {isOp ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{mod.description}</p>

              {/* Specs & Power Draw */}
              <div className="bg-slate-900/80 rounded-lg p-2 mb-3 text-xs font-mono grid grid-cols-2 gap-2 border border-slate-800/60">
                <div className="flex items-center gap-1 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {mod.powerOutput > 0 ? (
                      <span className="text-emerald-400">+{mod.powerOutput} kW</span>
                    ) : (
                      <span className="text-rose-400">-{mod.powerCost} kW</span>
                    )}
                  </span>
                </div>
                <div className="text-right text-slate-400">
                  {mod.o2Output > 0 && <span className="text-cyan-300">+{mod.o2Output} O₂ </span>}
                  {mod.waterOutput > 0 && <span className="text-blue-300">+{mod.waterOutput} H₂O </span>}
                  {mod.foodOutput > 0 && <span className="text-emerald-300">+{mod.foodOutput} Cal </span>}
                  {mod.shieldOutput > 0 && <span className="text-indigo-300">+{mod.shieldOutput} Rad</span>}
                </div>
              </div>

              {/* Actions & NASA Ref */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 max-w-[65%] truncate" title={mod.nasaRef}>
                  <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{mod.nasaRef}</span>
                </div>

                {isDamaged ? (
                  <button
                    onClick={() => onRepair(mod.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow transition-all"
                  >
                    <Wrench className="w-3 h-3" /> Repair
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStatus(mod.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      isOp
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {isOp ? 'Standby' : 'Engage'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutpostMap;
