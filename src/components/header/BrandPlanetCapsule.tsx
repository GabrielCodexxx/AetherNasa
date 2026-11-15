import React from 'react';
import { Compass, Search } from 'lucide-react';
import aetherLogo from '../../assets/images/logo/AetherLogo.jpg';
import type { PlanetData } from '../../types/earthSystem';
import { SOLAR_PLANETS } from '../../utils/earthSystemData';
import { soundManager } from '../../utils/soundEffects';
import { CAPSULE_SURFACE_CLASS, getPlanetOptionLabel } from './headerStyles';

interface BrandPlanetCapsuleProps {
  selectedPlanetId: string;
  onSelectPlanet: (planet: PlanetData) => void;
  onOpenScenarios: () => void;
  onOpenPlanetology?: () => void;
}

/** Center header capsule with brand identity, planet switcher dropdown, and exploration modals. */
export const BrandPlanetCapsule: React.FC<BrandPlanetCapsuleProps> = ({
  selectedPlanetId,
  onSelectPlanet,
  onOpenScenarios,
  onOpenPlanetology,
}) => (
  <div className="flex-1 flex justify-center min-w-0">
    <div className={`${CAPSULE_SURFACE_CLASS} gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2`}>
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200/90 overflow-hidden flex items-center justify-center shadow-xs shrink-0 p-1">
        <img
          src={aetherLogo}
          alt="Planet Detective Insignia Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="shrink-0">
        <div className="flex items-center gap-1.5">
          <h1 className="text-xs sm:text-sm font-orbitron font-extrabold tracking-wider text-slate-900 whitespace-nowrap">
            PLANET DETECTIVE
          </h1>
          <span className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-orbitron font-bold bg-emerald-50 text-[#15803D] border border-emerald-200/80 uppercase">
            NASA 2026
          </span>
        </div>
        <p className="text-[10px] font-space text-slate-500 font-medium hidden 2xl:block">
          Planetary System Trend Detective • Eco-Tracker
        </p>
      </div>

      <div className="pl-1.5 sm:pl-2 border-l border-slate-200 shrink-0">
        <select
          aria-label="Select Celestial Body"
          value={selectedPlanetId}
          onChange={(e) => {
            const p = SOLAR_PLANETS.find((item) => item.id === e.target.value);
            if (p) {
              soundManager.playClick();
              onSelectPlanet(p);
            }
          }}
          className="px-2 sm:px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-orbitron font-bold text-[#0369A1] focus:outline-none focus:border-[#0369A1] cursor-pointer hover:bg-sky-50/50 transition-colors"
        >
          {SOLAR_PLANETS.map((planet) => (
            <option key={planet.id} value={planet.id}>
              {getPlanetOptionLabel(planet)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          soundManager.playClick();
          onOpenScenarios();
        }}
        className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border border-slate-200 hover:border-sky-300 transition-all shadow-xs shrink-0"
        title="Investigate Forensic Divergence Scenarios"
      >
        <Search className="w-3.5 h-3.5 text-[#0369A1]" />
        <span>Case Files</span>
      </button>

      {onOpenPlanetology && (
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenPlanetology();
          }}
          className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-all shadow-xs shrink-0"
          title="Compare Earth vs Venus vs Mars"
        >
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Planetology</span>
        </button>
      )}
    </div>
  </div>
);
