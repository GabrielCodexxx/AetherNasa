import React, { useState } from 'react';
import { X, BookOpen, AlertTriangle, ShieldCheck, Waves, Compass, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ArtemisScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtemisScienceModal: React.FC<ArtemisScienceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ringing' | 'types' | 'apollo' | 'artemis'>('ringing');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                LUNAR SEISMOLOGY & ARTEMIS SCIENCE BRIEFING
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                NASA Apollo Passive Seismic Experiment (APSE) Reference Manual
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 'ringing', label: 'Why the Moon Rings', icon: Waves },
            { id: 'types', label: '4 Moonquake Classes', icon: AlertTriangle },
            { id: 'apollo', label: 'Apollo Seismic Network', icon: Compass },
            { id: 'artemis', label: 'Artemis Base Camp Risk', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all border-b-2 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {activeTab === 'ringing' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white font-mono text-base">
                    "The Moon was ringing like a bell for over three hours..."
                  </h3>
                  <p className="text-xs text-cyan-200/80 mt-1">
                    — Dr. Maurice Ewing, Apollo Co-Principal Seismologist, November 20, 1969
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-emerald-400 font-mono mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Earth Quakes: Wet & Absorptive
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300 list-disc list-inside">
                    <li>Earth rocks are soaked in water within fractures and deep pores.</li>
                    <li>
                      Interstitial moisture acts like a hydraulic shock absorber, dissipating energy as friction.
                    </li>
                    <li>Earthquake tremors typically decay and extinguish within <strong>30 to 60 seconds</strong>.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-800/50">
                  <h4 className="font-bold text-cyan-400 font-mono mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Moonquakes: Bone Dry & Scattering
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300 list-disc list-inside">
                    <li>The Moon's crust is bone-dry and shattered by billions of years of meteorite impacts.</li>
                    <li>
                      Without water damping, seismic shear and compressive waves bounce endlessly off fractures.
                    </li>
                    <li>Moonquakes build up slowly over minutes and reverberate for <strong>10 to 30+ minutes</strong>!</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <h4 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider mb-2">
                  Seismic Attenuation Quality Factor (Q)
                </h4>
                <p className="text-xs text-slate-400">
                  The seismic quality factor <code className="text-cyan-300">Q</code> measures how many wave cycles occur before amplitude decays. While Earth's crust exhibits <code className="text-slate-300">Q ≈ 100–300</code>, the dry upper lunar regolith has an astonishing <code className="text-cyan-400">Q &gt; 3,000–5,000</code>. This high Q value turns the entire lunar body into an acoustic resonant cavity.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'types' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-400">
                Analysis of 12,000+ seismic triggers from 1969 to 1977 categorized lunar seismicity into four fundamental distinct classes:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-900/60 text-red-300 border border-red-700/50 uppercase">
                      Shallow Moonquakes
                    </span>
                    <span className="text-xs font-mono text-red-400">20–30 km depth</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Tectonic & Global Contraction</h4>
                  <p className="text-xs text-slate-300">
                    The most violent events. Occur at shallow depths along fault scarps as the Moon's interior cools and contracts. Magnitudes up to <strong>M 5.5</strong>, shaking violently for 15+ minutes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50 uppercase">
                      Deep Moonquakes
                    </span>
                    <span className="text-xs font-mono text-purple-400">700–900 km depth</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Tidal Gravity Stresses</h4>
                  <p className="text-xs text-slate-300">
                    Occur nearly halfway to the core at ~300 recurring focal nests. Triggered cyclically by Earth's gravitational tidal pull during perigee and apogee along the monthly elliptical orbit.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 uppercase">
                      Artificial Impacts
                    </span>
                    <span className="text-xs font-mono text-cyan-400">Surface Point</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Saturn V Boosters & LM Crashes</h4>
                  <p className="text-xs text-slate-300">
                    NASA deliberately guided spent Saturn V third stages (S-IVB) and Lunar Modules into the surface. These known kinetic energy collisions calibrated the entire seismometer network.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-yellow-950/20 border border-yellow-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-900/60 text-yellow-300 border border-yellow-700/50 uppercase">
                      Thermal Moonquakes
                    </span>
                    <span className="text-xs font-mono text-yellow-400">Top 1–2 meters</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Diurnal Temperature Shock</h4>
                  <p className="text-xs text-slate-300">
                    Extreme surface swings between -130°C night and +120°C noon cause rocks and regolith to expand and crack sharply every lunar sunrise and sunset.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apollo' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-300">
                Between 1969 and 1972, Apollo astronauts hand-deployed the <strong>Apollo Passive Seismic Experiment Package (APSEP)</strong> powered by SNAP-27 radioisotope thermoelectric generators (RTG):
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-cyan-400">Apollo 12 (Station 12)</span>
                  <span className="text-slate-400">Oceanus Procellarum • Deployed Nov 19, 1969</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Apollo 14 (Station 14)</span>
                  <span className="text-slate-400">Fra Mauro Highlands • Deployed Feb 5, 1971</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-yellow-400">Apollo 15 (Station 15)</span>
                  <span className="text-slate-400">Hadley-Apennine • Deployed July 31, 1971</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-rose-400">Apollo 16 (Station 16)</span>
                  <span className="text-slate-400">Descartes Highlands • Deployed April 21, 1972</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90">
                <strong>Historical Note:</strong> On September 30, 1977, NASA formally deactivated the lunar seismic network to divert budgetary resources to the newly launched Voyager missions, leaving human science with 8 years of priceless continuous planetary seismic telemetry.
              </div>
            </div>
          )}

          {activeTab === 'artemis' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40">
                <h4 className="font-bold text-rose-300 font-mono text-sm mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Engineering Hazards for South Pole Artemis Habitats
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  NASA's Artemis III and Base Camp missions target permanently shadowed regions near Shackleton Crater at the lunar South Pole. Recent analyses by Watters et al. (2024) using Lunar Reconnaissance Orbiter (LRO) Narrow Angle Camera images identified thousands of young, active <strong>lobate scarps</strong> (thrust fault scarps) directly across proposed Artemis candidate landing zones.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-mono font-bold text-cyan-400 block mb-1">Structural Fatigue</span>
                  <p className="text-slate-400">
                    Ground accelerations oscillating for 15+ minutes can fatigue pressurized habitat joints and metal seals.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-mono font-bold text-amber-400 block mb-1">Regolith Landslides</span>
                  <p className="text-slate-400">
                    Steep crater walls (25°–35° slopes) are susceptible to seismic slope failure and regolith avalanches.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-mono font-bold text-emerald-400 block mb-1">Foundation Anchors</span>
                  <p className="text-slate-400">
                    Foundations must use flexible pneumatic isolation dampers rather than rigid rock anchors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            NASA Planetary Data System (PDS) Geosciences Node
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ArtemisScienceModal;
