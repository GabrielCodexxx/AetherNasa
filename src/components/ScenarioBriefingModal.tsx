import React, { useState } from 'react';
import { X, BookOpen, Compass, ShieldAlert, Cpu, Lightbulb } from 'lucide-react';
import type { OutpostLocation } from '../types/trainer';
import { MISSION_CONFIGS } from '../utils/nasaData';
import { soundManager } from '../utils/soundEffects';

interface ScenarioBriefingModalProps {
  location: OutpostLocation;
  onClose: () => void;
}

export const ScenarioBriefingModal: React.FC<ScenarioBriefingModalProps> = ({
  location,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'hazards' | 'eclss' | 'strategy'>('mission');
  const info = MISSION_CONFIGS[location];

  const handleTabChange = (tab: 'mission' | 'hazards' | 'eclss' | 'strategy') => {
    soundManager.playBeep(720, 0.05);
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                FLIGHT DIRECTOR BRIEFING &bull; {location.toUpperCase()} SECTOR
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Mission Scenario & Scientific Architecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 gap-2">
          {[
            { id: 'mission', label: '1. Mission Objective', icon: BookOpen },
            { id: 'hazards', label: '2. Environmental Risks', icon: ShieldAlert },
            { id: 'eclss', label: '3. ECLSS Engineering', icon: Cpu },
            { id: 'strategy', label: '4. Survival Strategy', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {activeTab === 'mission' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-1">
                  Why {info.name} at {info.siteName}?
                </h3>
                <p className="text-slate-400 leading-relaxed text-xs">
                  {location === 'lunar' ? (
                    <>
                      Under NASA's <strong>Artemis Program</strong>, establishing a permanent human presence at the 
                      Lunar South Pole is humanity's stepping stone to Mars. The rim of Shackleton Crater was selected 
                      because of its <em>"Peaks of Eternal Light"</em>—elevated ridges that receive continuous sunlight for 
                      solar arrays, towering above permanently shadowed crater floors that harbor billions of tons of ancient water ice.
                    </>
                  ) : (
                    <>
                      <strong>Jezero Crater</strong> was selected by NASA for the Perseverance rover because it is an ancient 
                      river paleolake. For human pioneers, its clays and mineral sediments offer crucial clues to past life 
                      and potential sub-surface brines for in-situ fuel generation, despite a thin carbon dioxide atmosphere.
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">COORDINATES</span>
                  <span className="text-cyan-300 font-bold">{info.coordinates}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SURFACE GRAVITY</span>
                  <span className="text-cyan-300 font-bold">{info.gravity}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DAY/NIGHT CYCLE</span>
                  <span className="text-cyan-300 font-bold">{info.dayLength}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SOLAR FLUX</span>
                  <span className="text-cyan-300 font-bold">{info.solarFlux}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hazards' && (
            <div className="space-y-3">
              <div className="bg-red-950/20 border border-red-500/40 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Primary Threat: {info.primaryRisk}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Beyond Earth’s protective magnetic shield (magnetosphere), human crews are continuously exposed to 
                  <strong> Galactic Cosmic Rays (GCR)</strong> and acute <strong>Solar Particle Events (SPE)</strong>. 
                  Without microwave-sintered regolith shielding or electromagnetic deflector fields, single solar storms 
                  can cause fatal acute radiation syndrome.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-amber-400 mb-1">Abrasive Dust & Regolith</h5>
                  <p className="text-slate-400">
                    Unlike Earth sand smoothed by wind and water, lunar and martian soil particles are sharp as glass shards. 
                    They destroy suit seals and scratch solar panel glass, degrading power efficiency.
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-amber-400 mb-1">Extreme Thermal Differentials</h5>
                  <p className="text-slate-400">
                    Temperatures plunge from boiling heat (+120°C in direct sunlight) to cryogenic cold (-130°C in shadows). 
                    Thermal radiators and closed-loop coolant loops prevent habitat hull fracturing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eclss' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-cyan-300 mb-2">The Closed-Loop ECLSS Chemistry</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  On Earth, nature recycles our air and water. In deep space, machines must do it with zero waste:
                </p>

                <div className="bg-slate-900 border border-cyan-500/30 p-3 rounded-lg font-mono text-xs text-cyan-200 space-y-1">
                  <div>1. Crew Exhales: CO₂ is scrubbed by amine beds</div>
                  <div>2. Sabatier Reaction: CO₂ + 4 H₂ → CH₄ (methane vented) + 2 H₂O</div>
                  <div>3. Water Electrolysis: 2 H₂O + Electricity → 2 H₂ + 2 O₂ (Breathable Air)</div>
                  <div>4. Urine & Graywater Processor: 98% water recovery back to potable standard</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                <span>Reference: NASA Baseline Values and Assumptions Document (BVAD)</span>
                <span className="text-cyan-400">Crew Baseline: 0.84 kg O₂ / astronaut / day</span>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Flight Director Golden Rules for Winning
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      1
                    </span>
                    <p className="text-slate-300">
                      <strong>Never starve the energy grid:</strong> Kilopower nuclear reactor provides continuous baseline 
                      power (35 kW). Use solar wings for daytime growth bursts, but protect batteries for night cycles.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      2
                    </span>
                    <p className="text-slate-300">
                      <strong>React immediately to DONKI alerts:</strong> When a Solar Flare Class X siren rings, you have 
                      30 seconds to stow solar wings and shelter crew. Failing to respond drains health and life support.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      3
                    </span>
                    <p className="text-slate-300">
                      <strong>Launch EVA Spacewalk Drills:</strong> Exterior hull micro-meteoroid punctures cannot be 
                      fixed from inside. Suit up in the airlock and patch sensors manually to earn STEM badges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>NASA Space Apps 2026 Educational Briefing</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
          >
            Acknowledge & Enter Command Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBriefingModal;
