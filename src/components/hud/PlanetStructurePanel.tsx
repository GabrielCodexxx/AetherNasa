import React from 'react';
import type { PlanetLayer } from '../../types/earthSystem';

interface PlanetStructurePanelProps {
  layers: PlanetLayer[];
}

/** Displays internal cutaway planetary layers when PlanetHUD is in structure mode. */
export const PlanetStructurePanel: React.FC<PlanetStructurePanelProps> = ({ layers }) => (
  <div className="space-y-3.5 max-h-[58vh] overflow-y-auto pr-1">
    <p className="font-space text-xs text-slate-500 leading-relaxed">
      Internal layering determined through gravitational harmonics, spectroscopic missions, and planetary seismology.
    </p>

    <div className="space-y-3">
      {layers.map((layer, idx) => (
        <div
          key={`${layer.name}-${idx}`}
          className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 space-y-1.5 shadow-xs transition-all hover:border-sky-300"
        >
          <div className="flex items-center justify-between">
            <span className="font-orbitron font-black text-slate-900 text-xs tracking-wider flex items-center gap-2">
              <span
                className="w-2 h-2 rotate-45 shrink-0"
                style={{ backgroundColor: layer.color }}
              />
              {layer.name}
            </span>
            <span className="font-orbitron text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {Math.round(layer.thicknessRadius * 100)}% RADIUS
            </span>
          </div>

          <p className="font-orbitron text-[10px] text-[#0369A1] font-bold uppercase tracking-wider">
            {layer.subtitle}
          </p>

          <p className="font-space text-xs text-slate-600 leading-relaxed">
            {layer.description}
          </p>

          <div className="pt-1 font-space text-[10px] text-slate-500">
            <span className="font-semibold text-slate-400">Composition:</span> {layer.composition}
          </div>
        </div>
      ))}
    </div>
  </div>
);
