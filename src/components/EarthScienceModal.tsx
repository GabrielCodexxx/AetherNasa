import React, { useState } from 'react';
import { X, BookOpen, Orbit, Layers, Sparkles, ShieldCheck } from 'lucide-react';
import { NASA_FLEET } from '../utils/earthSystemData';
import { soundManager } from '../utils/soundEffects';

interface EarthScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarthScienceModal: React.FC<EarthScienceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'divergence' | 'significance' | 'fleet'>('divergence');

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
                EARTH SYSTEM TREND DETECTIVE MANUAL
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                NASA Earth Science Division Reference & Statistical Methodology
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 'divergence', label: 'Regional Trend Divergence', icon: Layers },
            { id: 'significance', label: 'Statistical Significance (p < 0.001)', icon: ShieldCheck },
            { id: 'fleet', label: 'NASA Earth Observing Fleet', icon: Orbit },
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
          {activeTab === 'divergence' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white font-mono text-base">
                    "A variable can trend one way in one region and the opposite in another..."
                  </h3>
                  <p className="text-xs text-cyan-200/80 mt-1 font-sans">
                    Earth's environmental system is deeply interconnected. A single global forcing (such as greenhouse warming or ocean heat redistribution) creates contrasting regional footprints.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 font-mono text-xs uppercase">
                    Case Study A: Arctic Greening vs. Amazon Drying
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    MODIS NDVI satellite data detects <strong>increased greening in the Arctic tundra</strong> as melting permafrost and longer summers allow shrubs to spread. Meanwhile, the same warming trend accelerates <strong>canopy drying and severe wildfire loss in the Amazon rainforest</strong>. Both regional trends are driven by global atmospheric warming, yet move in completely opposite directions!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 font-mono text-xs uppercase">
                    Case Study B: Sea Level Rise vs. Post-Glacial Rebound
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    While global mean sea level is rising at 4.2 mm/year (submerging islands and coastal plains in the tropical Pacific), some high-latitude coastlines in Alaska and Scandinavia measure <em>falling relative sea levels</em> because land relieved of ancient ice weight is rebounding upwards faster than the water is rising!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'significance' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
                <h3 className="font-bold text-emerald-300 font-mono text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  What Makes a Trend "Statistically Significant"?
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                  In Earth science, weather is noisy. A single cold winter or rainy season does not mean climate has shifted. To prove a trend is scientifically significant, NASA scientists test whether the slope could have occurred purely by random chance.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-1 uppercase">1. The p-value</span>
                  <p className="text-slate-400 font-sans text-xs">
                    If <code className="text-cyan-300">p &lt; 0.05</code>, there is less than a 5% chance the trend is noise. All 5 Earth System Detective trends exceed <code className="text-emerald-400">p &lt; 0.001</code> (99.9% confidence).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1 uppercase">2. Mann-Kendall Test</span>
                  <p className="text-slate-400 font-sans text-xs">
                    A non-parametric statistical test that measures monotonic trends without assuming data is normally distributed.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-purple-400 block mb-1 uppercase">3. Signal-to-Noise (S/N)</span>
                  <p className="text-slate-400 font-sans text-xs">
                    Filters out decadal ocean oscillations like El Niño (ENSO) and Pacific Decadal Oscillation (PDO) to isolate the true anthropogenic signal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-400 font-sans">
                NASA’s Earth Observing System (EOS) operates continuous constellations measuring the atmosphere, oceans, biosphere, and ice sheets:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                {NASA_FLEET.map((sat) => (
                  <div key={sat.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{sat.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {sat.status}
                      </span>
                    </div>
                    <p className="text-cyan-400 text-[11px]">
                      Launched {sat.launchYear} • Orbit {sat.orbitAltitudeKm} km
                    </p>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                      {sat.primaryMission}
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      Sensors: {sat.sensorPayload}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>NASA Earthdata & EOSDIS Certified</span>
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
export default EarthScienceModal;
