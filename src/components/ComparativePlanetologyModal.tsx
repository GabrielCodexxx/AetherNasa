import React from 'react';
import {
  Globe,
  Flame,
  Snowflake,
  ShieldAlert,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ComparativePlanetologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet: (planetId: string) => void;
}

export const ComparativePlanetologyModal: React.FC<ComparativePlanetologyModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanet,
}) => {
  if (!isOpen) return null;

  const worlds = [
    {
      id: 'venus',
      name: 'VENUS',
      badge: 'RUNAWAY GREENHOUSE',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: Flame,
      temp: '465°C (Surface Melting)',
      pressure: '92 Bar (Deep Submarine Depth)',
      co2: '96.5% Carbon Dioxide',
      coreState: 'Sluggish Convection • No Dynamo',
      hydrosphere: 'Lost to Space via UV Photolysis',
      lesson: 'Without liquid ocean carbon sinks, volcanic CO₂ built up relentlessly, turning a once-habitable sister world into a 465°C planetary furnace.',
    },
    {
      id: 'earth',
      name: 'EARTH',
      badge: 'STABILIZED BIOSPHERE',
      badgeColor: 'bg-emerald-100 text-[#15803D] border-emerald-300',
      icon: Globe,
      temp: '15°C (Water Triple Point)',
      pressure: '1.01 Bar (Life Support Standard)',
      co2: '427 ppm (0.0427% Gas Fraction)',
      coreState: 'Active Liquid Iron Dynamo • 0.5 Gauss',
      hydrosphere: '1.386 Billion km³ Liquid Reservoir',
      lesson: 'Oceans dissolve CO₂ and deposit it as carbonate limestone via marine organisms, while plate tectonics recycles carbon, preserving climate equilibrium for billions of years.',
    },
    {
      id: 'mars',
      name: 'MARS',
      badge: 'FROZEN THIN RESIDUE',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Snowflake,
      temp: '-60°C (Polar Dry Ice Glaciers)',
      pressure: '0.006 Bar (1% Earth Density)',
      co2: '95.3% Carbon Dioxide (Thin Trace)',
      coreState: 'Solidified Core • Dynamo Collapsed',
      hydrosphere: 'Trapped as Subsurface Regolith Ice',
      lesson: 'Smaller planetary mass allowed its iron core to cool and solidify 4 billion years ago. Without a protective magnetic shield, solar wind stripped its atmosphere into space.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in select-none font-sans">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0369A1]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-orbitron font-black tracking-wide text-slate-900">
                  COMPARATIVE PLANETOLOGY
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-orbitron font-bold bg-sky-100 text-[#0369A1] border border-sky-200 uppercase">
                  NASA CLIMATE LAB
                </span>
              </div>
              <p className="text-xs font-space text-slate-500 font-medium">
                Why Earth Didn’t Become Venus or Mars • Planetary Environmental Divergence
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Insight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-space">
          <p className="font-orbitron font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#0369A1]" />
            NASA Planetary Lesson: The Interconnected System
          </p>
          Earth, Venus, and Mars began 4.5 billion years ago with similar initial inventories of water, carbon, and silicates. Slight differences in solar distance, core dynamics, and ocean chemistry created three radically divergent planetary destinies.
        </div>

        {/* Side-by-Side 3-World Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-3.5 text-xs">
          {worlds.map((w) => {
            const Icon = w.icon;
            return (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0369A1] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-orbitron font-black text-sm tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-[#0369A1]" />
                      {w.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-orbitron font-bold uppercase border ${w.badgeColor}`}>
                      {w.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                        Surface Temperature
                      </span>
                      <span className="font-orbitron font-bold text-xs text-slate-900">
                        {w.temp}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                        Atmospheric Pressure
                      </span>
                      <span className="font-orbitron font-bold text-xs text-slate-900">
                        {w.pressure}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                        CO₂ Atmospheric Fraction
                      </span>
                      <span className="font-orbitron font-bold text-xs text-[#0369A1]">
                        {w.co2}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200/70 text-[11px] text-slate-600 font-space leading-relaxed">
                      <span className="font-orbitron font-bold text-[9px] text-[#0369A1] uppercase block mb-0.5">
                        Core Dynamo & Shield
                      </span>
                      {w.coreState}
                    </div>

                    <p className="text-[11px] text-slate-600 font-space leading-relaxed pt-1">
                      {w.lesson}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPlanet(w.id);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#0369A1] border border-slate-200 hover:border-sky-300 font-orbitron font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Fly to {w.name} in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-space">
          <span>Comparative Data Sources: NASA GISS ModelE, Magellan Radar, MAVEN, Mars Reconnaissance Orbiter.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white font-orbitron font-bold text-xs transition-all shadow-sm"
          >
            Close Mission Lab
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparativePlanetologyModal;
