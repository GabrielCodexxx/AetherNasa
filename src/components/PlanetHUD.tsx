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
      className={`absolute top-20 left-4 sm:left-6 z-30 pointer-events-auto select-none transition-transform duration-300 font-sans ${
        isCollapsed ? '-translate-x-[calc(100%-1.75rem)]' : 'translate-x-0'
      }`}
    >
      <div className="relative flex items-center">
        {/* Glassmorphic Eco-Tracker Card (Light Mode - bg-white/75 backdrop-blur-xl) */}
        <div className="w-80 sm:w-96 bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 text-slate-800 flex flex-col gap-4">
          {/* Top Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
            {isStructureMode && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onChangeViewMode(planet.id === 'earth' ? 'earth_focus' : 'solar_system');
                }}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#0369A1] hover:bg-sky-50 transition-all flex items-center justify-center shrink-0 shadow-sm"
                title="Return to System"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                {planet.name}
              </h2>
              <p className="text-[11px] tracking-wider text-[#0369A1] uppercase font-bold">
                {planet.type === 'star' ? 'STAR' : 'PLANET'}
              </p>
            </div>

            {/* Quick Prev / Next Planet Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPrevPlanet();
                }}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] hover:border-sky-300 transition-all shadow-sm"
                title="Previous Planet"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNextPlanet();
                }}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0369A1] hover:border-sky-300 transition-all shadow-sm"
                title="Next Planet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode 1: STRUCTURE (Internal Cutaway View - matching User's Image 3) */}
          {isStructureMode ? (
            <div className="space-y-3.5 max-h-[58vh] overflow-y-auto pr-1">
              {planet.id === 'earth' ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/90 shadow-sm space-y-1 hover:border-sky-300 transition-all">
                    <p className="font-extrabold text-[#0369A1] text-xs tracking-wider uppercase">
                      CRUST & LITHOSPHERE
                    </p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      Earth’s crust, together with the uppermost parts of the mantle forms the lithosphere. The lithosphere is broken into a series of tectonic plates which "float" on a more elastic part of the upper mantle. The motion of these plates gives rise to earthquakes and volcanism.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="font-semibold text-slate-500">Composition:</span> Solid Silicate Rock, Mostly Basalt
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/90 shadow-sm space-y-1 hover:border-sky-300 transition-all">
                    <p className="font-extrabold text-[#0369A1] text-xs tracking-wider uppercase">
                      MANTLE
                    </p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      The Earth’s mantle is a rocky shell which accounts for 84% of the planet's volume. The very uppermost regions of the mantle are the most solid and are relatively rigid.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="font-semibold text-slate-500">Composition:</span> Solid Silicate Rock (Peridotite / Bridgmanite)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/90 shadow-sm space-y-1 hover:border-sky-300 transition-all">
                    <p className="font-extrabold text-[#0369A1] text-xs tracking-wider uppercase">
                      OUTER CORE
                    </p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      The temperature difference within the outer core drives convection currents, with hot liquid metals rising, cooling and then descending back towards the hot inner core. These convection currents power the Earth’s magnetic field.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="font-semibold text-slate-500">Composition:</span> Liquid Iron and Nickel (4,000°C - 5,000°C)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/90 shadow-sm space-y-1 hover:border-sky-300 transition-all">
                    <p className="font-extrabold text-[#0369A1] text-xs tracking-wider uppercase">
                      INNER CORE
                    </p>
                    <p className="text-slate-600 leading-relaxed font-normal">
                      Dense solid ball made mostly of iron and nickel under extreme gravitational pressure (over 3 million atmospheres), remaining crystalline despite temperatures exceeding 5,400°C.
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      <span className="font-semibold text-slate-500">Composition:</span> Dense Solid Iron and Nickel Crystal
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Internal layering determined through gravitational harmonics, spectroscopic missions, and planetary seismology.
                  </p>

                  {planet.layers.map((layer, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/90 space-y-1.5 shadow-sm transition-all hover:border-sky-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs tracking-wider flex items-center gap-2">
                          <span
                            className="w-1.5 h-3.5 rounded-xs"
                            style={{ backgroundColor: layer.color }}
                          ></span>
                          {layer.name}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {Math.round(layer.thicknessRadius * 100)}% RADIUS
                        </span>
                      </div>

                      <p className="text-[10px] text-[#0369A1] font-bold uppercase tracking-wider">
                        {layer.subtitle}
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {layer.description}
                      </p>

                      <div className="pt-1 text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-400">Composition:</span> {layer.composition}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Standard Exploration Menu (matching User's Image 2) */
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {planet.description}
              </p>

              {/* Three Modern SaaS Buttons */}
              <div className="space-y-2">
                {/* Button 1: Planet System / Surface / Earth Detective */}
                {planet.id === 'earth' ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onChangeViewMode(viewMode === 'earth_focus' ? 'solar_system' : 'earth_focus');
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between border ${
                      viewMode === 'earth_focus'
                        ? 'bg-[#0369A1] text-white border-transparent shadow-md shadow-sky-900/20'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-600" />
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
                        ? 'bg-[#0369A1] text-white border-transparent shadow-md shadow-sky-900/20'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Orbit className="w-4 h-4 text-sky-600" />
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
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#15803D] border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#15803D]" />
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
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>STRUCTURE</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Planetary Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Mean Surface Temp</span>
                  <span className="text-amber-700 font-extrabold">{planet.meanTempC}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Surface Gravity</span>
                  <span className="text-slate-900 font-extrabold">{planet.gravity}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Day Length</span>
                  <span className="text-[#0369A1] font-extrabold">{planet.dayLength}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Known Moons</span>
                  <span className="text-slate-900 font-extrabold">{planet.moonsCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Three Diamond Action Buttons (Eco-Tracker Modern Light styling) */}
          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center">
            {/* 1. Switch Planet */}
            <button
              onClick={() => {
                soundManager.playClick();
                onNextPlanet();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 transition-all group shadow-xs"
              title="Switch to Next Planet"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-sky-100/70 border border-sky-200 flex items-center justify-center text-[#0369A1] mb-2 group-hover:scale-105 transition-all">
                <span className="-rotate-45 font-bold text-xs">&lt;&gt;</span>
              </div>
              <span className="text-[9px] font-bold text-slate-700 group-hover:text-[#0369A1] tracking-wider">
                SWITCH PLANET
              </span>
            </button>

            {/* 2. Night Sky */}
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode(viewMode === 'night_sky' ? 'solar_system' : 'night_sky');
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all group shadow-xs ${
                viewMode === 'night_sky'
                  ? 'bg-sky-100 border-[#0369A1] text-[#0369A1]'
                  : 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 text-slate-700'
              }`}
              title="View Deep Space Night Sky"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-2 group-hover:scale-105 transition-all">
                <Telescope className="-rotate-45 w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold group-hover:text-[#0369A1] tracking-wider">
                NIGHT SKY
              </span>
            </button>

            {/* 3. Solar System Overview */}
            <button
              onClick={() => {
                soundManager.playClick();
                onChangeViewMode('solar_system');
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all group shadow-xs ${
                viewMode === 'solar_system'
                  ? 'bg-emerald-50 border-[#15803D] text-[#15803D]'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-slate-700'
              }`}
              title="Return to Solar System View"
            >
              <div className="w-8 h-8 rotate-45 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D] mb-2 group-hover:scale-105 transition-all">
                <Orbit className="-rotate-45 w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold group-hover:text-[#15803D] tracking-wider">
                SOLAR SYSTEM
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Edge Tab Handle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="h-16 w-6 -ml-1 rounded-r-xl bg-white/90 border-y border-r border-slate-200 text-slate-600 hover:text-[#0369A1] hover:bg-sky-50 transition-all flex items-center justify-center shadow-md shadow-slate-200"
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
