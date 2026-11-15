import React from 'react';
import { ShieldAlert, ArrowRight, Compass } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { ModalShell } from './modals/ModalShell';
import { PLANETOLOGY_WORLDS } from './modals/planetologyData';

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
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="bg-slate-950/60 select-none"
      panelClassName="w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-slate-800 max-h-[90vh] overflow-y-auto"
      headerClassName="flex items-center justify-between pb-4 border-b border-slate-200"
      closeButtonClassName="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-xs"
      closeIconClassName="w-4 h-4"
      headerMeta={{
        icon: <Compass className="w-5 h-5" />,
        title: 'COMPARATIVE PLANETOLOGY',
        titleClassName: 'text-lg sm:text-xl font-orbitron font-black tracking-wide text-slate-900',
        badge: (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-orbitron font-bold bg-sky-100 text-[#0369A1] border border-sky-200 uppercase">
            NASA CLIMATE LAB
          </span>
        ),
        subtitle: (
          <p className="text-xs font-space text-slate-500 font-medium">
            Why Earth Didn’t Become Venus or Mars • Planetary Environmental Divergence
          </p>
        ),
      }}
      footerClassName="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-space"
      footer={
        <>
          <span>
            Comparative Data Sources: NASA GISS ModelE, Magellan Radar, MAVEN, Mars Reconnaissance Orbiter.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white font-orbitron font-bold text-xs transition-all shadow-sm"
          >
            Close Mission Lab
          </button>
        </>
      }
    >
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-space">
        <p className="font-orbitron font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#0369A1]" />
          NASA Planetary Lesson: The Interconnected System
        </p>
        Earth, Venus, and Mars began 4.5 billion years ago with similar initial inventories of water, carbon, and silicates. Slight differences in solar distance, core dynamics, and ocean chemistry created three radically divergent planetary destinies.
      </div>

      <div className="grid md:grid-cols-3 gap-3.5 text-xs">
        {PLANETOLOGY_WORLDS.map((w) => {
          const Icon = w.icon;
          const metrics = [
            { label: 'Surface Temperature', value: w.temp, accent: 'text-slate-900' },
            { label: 'Atmospheric Pressure', value: w.pressure, accent: 'text-slate-900' },
            { label: 'CO₂ Atmospheric Fraction', value: w.co2, accent: 'text-[#0369A1]' },
          ];
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
                  {metrics.map((m) => (
                    <div key={m.label} className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] font-space font-bold uppercase text-slate-400 block">
                        {m.label}
                      </span>
                      <span className={`font-orbitron font-bold text-xs ${m.accent}`}>{m.value}</span>
                    </div>
                  ))}

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
    </ModalShell>
  );
};

export default ComparativePlanetologyModal;
