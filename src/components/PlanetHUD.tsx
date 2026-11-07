import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Orbit,
  Telescope,
  Layers,
  BookOpen,
  Globe,
} from 'lucide-react';
import type { PlanetData, SystemViewMode } from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';

interface PlanetHUDProps {
  planet: PlanetData;
  viewMode: SystemViewMode;
  onChangeViewMode: (mode: SystemViewMode) => void;
  onNextPlanet: () => void;
  onPrevPlanet: () => void;
  onOpenEncyclopedia: () => void;
}

export const PlanetHUD: React.FC<PlanetHUDProps> = ({
  planet,
  viewMode,
  onChangeViewMode,
  onNextPlanet,
  onPrevPlanet,
  onOpenEncyclopedia,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isStructureMode = viewMode === 'structure';

  return (
    <div
      className={`absolute top-20 left-4 sm:left-6 z-30 pointer-events-auto select-none transition-transform duration-300 font-mono ${
        isCollapsed ? '-translate-x-[calc(100%-1.75rem)]' : 'translate-x-0'
      }`}
    >
      <div className="relative flex items-center">
        {/* Sci-Fi HUD Container with Beveled Angles (Solar System Scope Aesthetic) */}
        <div className="w-80 sm:w-96 bg-slate-950/90 backdrop-blur-2xl border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/80 text-slate-100 flex flex-col gap-4">
          {/* Top Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-cyan-950/90">
            {isStructureMode && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onChangeViewMode(planet.id === 'earth' ? 'earth_focus' : 'solar_system');
                }}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-cyan-700/60 text-cyan-300 hover:text-white hover:bg-cyan-950 transition-all flex items-center justify-center shrink-0"
                title="Return to System"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase font-sans">
                {planet.name}
              </h2>
              <p className="text-[11px] tracking-widest text-cyan-400 uppercase font-bold">
                {planet.type === 'star' ? 'STAR' : 'PLANET'}
              </p>
            </div>

            {/* Quick Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPrevPlanet();
                }}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                title="Previous Planet"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNextPlanet();
                }}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                title="Next Planet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Mode 1: STRUCTURE (Internal Cutaway View - matching User's Image 3) */}
          {isStructureMode ? (
            <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
              {planet.id === 'earth' ? (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-900/40 space-y-1">
                    <p className="font-bold text-white text-xs tracking-wider uppercase text-cyan-300">
                      CRUST & LITHOSPHERE
                    </p>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      Earth’s crust, together with the uppermost parts of the mantle forms the lithosphere. The lithosphere is broken into a series of tectonic plates which "float" on a more elastic part of the upper mantle. The motion of these plates gives rise to earthquakes and volcanism.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="text-slate-500">Composition:</span> Solid Silicate Rock, Mostly Basalt
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-900/40 space-y-1">
                    <p className="font-bold text-white text-xs tracking-wider uppercase text-cyan-300">
                      MANTLE
                    </p>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      The Earth’s mantle is a rocky shell which accounts for 84% of the planet's volume. The very uppermost regions of the mantle are the most solid and are relatively rigid.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="text-slate-500">Composition:</span> Solid Silicate Rock (Peridotite / Bridgmanite)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-900/40 space-y-1">
                    <p className="font-bold text-white text-xs tracking-wider uppercase text-cyan-300">
                      OUTER CORE
                    </p>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      The temperature difference within the outer core drives convection currents, with hot liquid metals rising, cooling and then descending back towards the hot inner core. These convection currents power the Earth’s magnetic field.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="text-slate-500">Composition:</span> Liquid Iron and Nickel (4,000°C - 5,000°C)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-900/40 space-y-1">
                    <p className="font-bold text-white text-xs tracking-wider uppercase text-cyan-300">
                      INNER CORE
                    </p>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      Dense solid ball made mostly of iron and nickel under extreme gravitational pressure (over 3 million atmospheres), remaining crystalline despite temperatures exceeding 5,400°C.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="text-slate-500">Composition:</span> Dense Solid Iron and Nickel
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Internal layering determined through gravitational harmonics, spectroscopic data, and planetary seismology.
                  </p>

                  {planet.layers.map((layer, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5 transition-all hover:border-cyan-500/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs tracking-wider flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: layer.color }}
                          ></span>
                          {layer.name}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {Math.round(layer.thicknessRadius * 100)}% RADIUS
                        </span>
                      </div>

                      <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                        {layer.subtitle}
                      </p>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {layer.description}
                      </p>

                      <div className="pt-1 text-[10px] text-slate-500">
                        <span className="text-slate-400">Composition:</span> {layer.composition}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Content Mode 2: Standard Exploration Menu (matching User's Image 2) */
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {planet.description}
              </p>

              {/* Three Angular Sci-Fi Primary Buttons with Arrow Brackets */}
              <div className="space-y-2.5">
                {/* Button 1: Planet System / Surface / Earth Detective */}
                {planet.id === 'earth' ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onChangeViewMode(viewMode === 'earth_focus' ? 'solar_system' : 'earth_focus');
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between border ${
                      viewMode === 'earth_focus'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>EARTH DETECTIVE</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onChangeViewMode(viewMode === 'planet_focus' ? 'solar_system' : 'planet_focus');
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between border ${
                      viewMode === 'planet_focus'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono">
                      <Orbit className="w-4 h-4 text-cyan-400" />
                      <span>PLANET SYSTEM</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Button 2: Encyclopedia */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenEncyclopedia();
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between font-mono"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>ENCYCLOPEDIA</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Button 3: Structure Cutaway */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onChangeViewMode('structure');
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>STRUCTURE</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Planetary Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Mean Surface Temp</span>
                  <span className="text-amber-400 font-bold">{planet.meanTempC}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Surface Gravity</span>
                  <span className="text-white font-bold">{planet.gravity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Day Length</span>
                  <span className="text-cyan-300 font-bold">{planet.dayLength}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Known Moons</span>
                  <span className="text-white font-bold">{planet.moonsCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Three Diamond Action Buttons (exact match to User's Image 2) */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
            {/* 1. Switch Planet */}
            <button
              onClick={() => {
                soundManager.playClick();
                onNextPlanet();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800 transition-all group"
              title="Switch to Next Planet"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 mb-2 group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                <span className="-rotate-45 font-mono font-bold text-xs">&lt;&gt;</span>
              </div>
              <span className="text-[9px] font-bold text-slate-300 group-hover:text-cyan-300 tracking-wider">
                SWITCH PLANET
              </span>
            </button>

            {/* 2. Night Sky */}
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode(viewMode === 'night_sky' ? 'solar_system' : 'night_sky');
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all group ${
                viewMode === 'night_sky'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800 text-slate-300'
              }`}
              title="View Deep Space Night Sky"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 mb-2 group-hover:scale-105 group-hover:border-indigo-400 transition-all">
                <Telescope className="-rotate-45 w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold group-hover:text-cyan-300 tracking-wider">
                NIGHT SKY
              </span>
            </button>

            {/* 3. Solar System Overview */}
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('solar_system');
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all group ${
                viewMode === 'solar_system'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800 text-slate-300'
              }`}
              title="Return to Solar System View"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-105 group-hover:border-amber-400 transition-all">
                <Orbit className="-rotate-45 w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold group-hover:text-cyan-300 tracking-wider">
                SOLAR SYSTEM
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Edge Tab Handle with Arrow (matching User's Image 2 white triangle tab) */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="h-16 w-6 -ml-1 rounded-r-xl bg-slate-950 border-y-2 border-r-2 border-cyan-500/60 text-cyan-300 hover:text-white hover:bg-cyan-950 transition-all flex items-center justify-center shadow-lg shadow-cyan-950"
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PlanetHUD;
