import React, { useState } from 'react';
import { X, BookOpen, ShieldAlert, Zap, Trophy } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ScenarioBriefingModalProps {
  onClose: () => void;
}

export const ScenarioBriefingModal: React.FC<ScenarioBriefingModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'concept' | 'resources' | 'dilemma' | 'why_it_wins'>('concept');

  const handleTabChange = (tab: typeof activeTab) => {
    soundManager.playBeep(720, 0.05);
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                NASA SPACE APPS CHALLENGE CONCEPT
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Lunar Resource Manager: Game Scenario & Strategy
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
            { id: 'concept', label: '1. The Concept', icon: BookOpen },
            { id: 'resources', label: '2. The 3 Core Resources', icon: Zap },
            { id: 'dilemma', label: '3. Solar Storm Dilemma', icon: ShieldAlert },
            { id: 'why_it_wins', label: '4. Why It Wins', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {activeTab === 'concept' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-1">
                  Browser-Based Survival Game: "Lunar Resource Manager"
                </h3>
                <p className="text-slate-400 leading-relaxed text-xs">
                  You are the commander of a small lunar outpost on the rim of Shackleton Crater. 
                  Unlike overcomplicated simulators with dozens of menus, your mission is laser-focused on 
                  <strong> three vital survival lifelines</strong>: Solar Power, Oxygen, and Radiation Shielding.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30">
                  <span className="text-amber-400 font-bold block mb-1 font-mono">1. SOLAR POWER</span>
                  <p className="text-slate-400 text-[11px]">
                    Captured by deployable solar wings. Stored in battery cells to survive shadows and power life support.
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30">
                  <span className="text-cyan-400 font-bold block mb-1 font-mono">2. OXYGEN AIR</span>
                  <p className="text-slate-400 text-[11px]">
                    ECLSS generators convert electrical energy into breathable air for the crew.
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30">
                  <span className="text-indigo-400 font-bold block mb-1 font-mono">3. RADIATION SHIELD</span>
                  <p className="text-slate-400 text-[11px]">
                    Electromagnetic deflector field and regolith vaults protecting astronauts from solar storms.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">The Dynamic Survival Triangle</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real NASA mission operations revolve around energy trade-offs:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-amber-300">⚡ Solar Power In = Oxygen Out + Shielding Out</span>
                    <span className="text-slate-400">Total Grid Budget: 32 kW</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-cyan-300">💨 Crew Breathing Rate = -1.2% O₂ / second</span>
                    <span className="text-slate-400">Generator restores +2.4%/s</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-indigo-300">🛡️ Cosmic Decay Rate = -0.8% Shield / second</span>
                    <span className="text-slate-400">Surges to -6.4%/s in Solar Storms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dilemma' && (
            <div className="space-y-4">
              <div className="bg-red-950/20 border border-red-500/40 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  The Core Gameplay Dilemma: Solar Storm vs. Life Support
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a Class M or Class X Solar Flare strikes the Moon, radiation spikes up to <strong>8x normal levels</strong>. 
                  If your shields are down, the habitat collapses. 
                  <br /><br />
                  To boost shielding to survive the storm, <strong>you must divert power away from oxygen generation</strong>. 
                  The crew's oxygen begins to drop! How long can they hold their breath while you deflect the storm?
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-white block mb-1">Tactical Solutions:</span>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li><strong>Preset: Storm Defense (85% Shield / 15% O₂)</strong>: Maximize survival bubble during peak proton flux.</li>
                  <li><strong>Preset: Air Priority (85% O₂ / 15% Shield)</strong>: Re-oxygenate the base once the storm subsides.</li>
                  <li><strong>Preset: Conserve (30% O₂ / 20% Shield)</strong>: Preserve batteries when rotating into lunar shadow.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'why_it_wins' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 p-4 rounded-xl border border-amber-500/40">
                <h4 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Why "Lunar Resource Manager" Wins the Space Apps Challenge
                </h4>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      1
                    </span>
                    <p>
                      <strong>Challenge Guideline Alignment:</strong> The NASA Space Apps challenge explicitly states that 
                      focusing on <em>two or three core resources</em> is significantly more pedagogically effective for 
                      junior astronauts (ages 8–16) than overwhelming them with five or six complex meters.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      2
                    </span>
                    <p>
                      <strong>Direct Consequence Learning:</strong> Every power diversion has an instant visual effect. 
                      Kids see the shield bubble glow or flicker, watch the air meters tick, and learn why space engineers 
                      make calculated trade-offs.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      3
                    </span>
                    <p>
                      <strong>Zero Learning Curve:</strong> Playable in seconds on any Chromebook, tablet, or phone 
                      with simple sliders and tactical presets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            3-Resource Tactical Loop &bull; NASA Space Apps 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
          >
            Take Command
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBriefingModal;
